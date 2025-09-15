import os
from typing import List
from pymongo import MongoClient
from dotenv import load_dotenv
from models import PetFavorite

# Load environment variables from .env file
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

# Validate that environment variables are loaded
if not MONGO_URI or not DB_NAME:
    raise ValueError("Missing required environment variables. Please ensure MONGO_URI and DB_NAME are set in your .env file.")

# Initialize MongoDB client
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db.pets

def save_favorite(pet: PetFavorite) -> dict:
    """Saves a pet favorite to the database."""
    inserted_item = collection.insert_one(pet.model_dump())
    return {"status": "success", "inserted_id": str(inserted_item.inserted_id)}

def get_all_favorites() -> List[dict]:
    """Retrieves all pet favorites from the database, excluding the _id field."""
    favorites = list(collection.find({}, {"_id": 0}))
    return favorites

def get_all_pets() -> List[dict]:
    """Retrieves all pets from the database."""
    pets = []
    for pet in collection.find({}):
        # Convert ObjectId to string for JSON serialization
        pet["_id"] = str(pet["_id"])
        pets.append(pet)
    return pets
