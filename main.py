import os
import random
import asyncio
from typing import List, Optional

import httpx
from bson import ObjectId
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict

# --- Environment Setup ---
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

if not MONGO_URI or not DB_NAME:
    raise RuntimeError("MONGO_URI and DB_NAME must be set in the environment or a .env file")

app = FastAPI(
    title="Pet Gallery & Personality Game API",
    description="An API for fetching pets, saving favorites, and playing a personality game.",
    version="1.0.0",
)

# --- CORS Middleware ---
# This allows your frontend (running on a different port) to make requests to this backend.
origins = [
    "http://localhost:5173",  # Default Vite/React dev server
    "http://127.0.0.1:5173", # Also a valid address for the Vite/React dev server
    "http://localhost:3000",  # Common alternative dev server port
    "http://localhost:5174",  # Your current frontend origin
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API URLs ---
DOG_API_URL = "https://dog.ceo/api/breeds/image/random"
CAT_API_URL = "https://api.thecatapi.com/v1/images/search"

# --- Database Connection ---
client: Optional[AsyncIOMotorClient] = None
db = None

@app.on_event("startup")
async def startup_db_client():
    global client, db
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]

@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()

# --- Pydantic Models (Pydantic v2 compliant) ---
class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        from pydantic_core import core_schema
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(lambda x: str(x)),
        )
    
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

class PetBase(BaseModel):
    image_url: str
    animal_type: str

class PetCreate(PetBase):
    user_comment: Optional[str] = None

class PetInDB(PetBase):
    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str},
    )
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_comment: Optional[str] = None
    votes: int = 0

class VoteUpdate(BaseModel):
    direction: str # "up" or "down"

class GameAnalysisRequest(BaseModel):
    pet_ids: List[PyObjectId]

    model_config = ConfigDict(
        json_encoders={ObjectId: str},
    )

# --- Helper Functions ---
async def fetch_pet(session: httpx.AsyncClient, url: str, animal_type: str):
    try:
        response = await session.get(url)
        response.raise_for_status()
        data = response.json()
        if animal_type == "dog":
            return {"image_url": data["message"], "animal_type": "dog"}
        elif animal_type == "cat":
            return {"image_url": data[0]["url"], "animal_type": "cat"}
    except (httpx.RequestError, httpx.HTTPStatusError, KeyError, IndexError):
        return None

# --- API Endpoints ---
@app.get("/pets/random", response_model=List[PetBase], summary="Get 10 Random Pets")
async def get_random_pets():
    """
    Fetches a list of 10 random pets, mixing dogs and cats from external APIs.
    """
    async with httpx.AsyncClient() as session:
        tasks = []
        for _ in range(10):
            tasks.append(fetch_pet(session, DOG_API_URL, "dog"))
            tasks.append(fetch_pet(session, CAT_API_URL, "cat"))
        
        results = await asyncio.gather(*tasks)
        pets = [pet for pet in results if pet is not None]

        if not pets:
            raise HTTPException(status_code=503, detail={"error": "Could not fetch pets from external APIs"})
        
        random.shuffle(pets)
        return pets

@app.post("/pets/favorites", response_model=PetInDB, status_code=201, summary="Save a Favorite Pet")
async def save_favorite_pet(pet: PetCreate):
    """
    Saves a new pet to the 'favorites' list in the database if it doesn't already exist.
    Initializes votes to 0.
    """
    # Check if a pet with the same image_url already exists
    existing_pet = await db["pets"].find_one({"image_url": pet.image_url})
    if existing_pet:
        raise HTTPException(status_code=409, detail="This pet has already been favorited.")

    pet_doc = pet.dict()
    pet_doc["votes"] = 0
    result = await db["pets"].insert_one(pet_doc)
    created_pet = await db["pets"].find_one({"_id": result.inserted_id})
    
    return created_pet

@app.get("/pets/favorites", response_model=List[PetInDB], summary="List All Favorite Pets")
async def list_favorite_pets():
    """
    Retrieves all favorite pets from the database.
    """
    pets = await db["pets"].find().to_list(100)
    return pets

@app.post("/pets/vote/{id}", response_model=PetInDB, summary="Upvote or Downvote a Pet")
async def vote_for_pet(id: str, vote: VoteUpdate):
    """
    Increments or decrements the vote count for a specific pet by its ID.
    """
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid pet ID format.")

    increment = 1 if vote.direction == "up" else -1
    
    updated_pet = await db["pets"].find_one_and_update(
        {"_id": ObjectId(id)},
        {"$inc": {"votes": increment}},
        return_document=True
    )

    if updated_pet is None:
        raise HTTPException(status_code=404, detail=f"Pet with id {id} not found")
    
    return updated_pet

@app.post("/game/analyze", summary="Analyze Pet Selection for Personality")
async def analyze_personality(request: GameAnalysisRequest):
    """
    Analyzes a user's selection of three favorite pets and returns a fun
    personality description based on the animal types.
    """
    if len(request.pet_ids) != 3:
        raise HTTPException(status_code=400, detail="Please provide exactly 3 pet IDs.")

    pets_cursor = db["pets"].find({"_id": {"$in": request.pet_ids}})
    pets = await pets_cursor.to_list(3)

    if len(pets) != 3:
        raise HTTPException(status_code=404, detail="One or more selected pets not found.")

    animal_types = [pet["animal_type"] for pet in pets]
    dog_count = animal_types.count("dog")
    cat_count = animal_types.count("cat")

    if dog_count == 3:
        personality = "You're an outgoing and energetic soul, always ready for an adventure!"
    elif cat_count == 3:
        personality = "You're a calm and introverted soul, who enjoys quiet moments and deep thoughts."
    else:
        personality = "You have a balanced personality, enjoying both social activities and peaceful solitude."

    return {"personality_description": personality}
