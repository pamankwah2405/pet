import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv
from pprint import pprint

# The dataset to be inserted into the database
pets_data = [
    {"name": "Buddy", "type": "Dog", "age": 3, "description": "Playful Golden Retriever"},
    {"name": "Milo", "type": "Cat", "age": 2, "description": "Lazy but cuddly tabby"},
    {"name": "Luna", "type": "Dog", "age": 1, "description": "Energetic Husky puppy"},
    {"name": "Coco", "type": "Parrot", "age": 4, "description": "Talkative African Grey"},
    {"name": "Daisy", "type": "Rabbit", "age": 2, "description": "White rabbit with floppy ears"},
    {"name": "Rocky", "type": "Dog", "age": 5, "description": "Protective German Shepherd"},
    {"name": "Simba", "type": "Cat", "age": 3, "description": "Curious orange tabby"},
    {"name": "Peanut", "type": "Hamster", "age": 1, "description": "Tiny Syrian hamster"},
    {"name": "Nemo", "type": "Fish", "age": 1, "description": "Clownfish with bright colors"},
    {"name": "Bella", "type": "Dog", "age": 6, "description": "Calm and gentle Labrador"},
    {"name": "Whiskers", "type": "Cat", "age": 5, "description": "Independent Siamese"},
    {"name": "Poppy", "type": "Rabbit", "age": 3, "description": "Brown rabbit that loves carrots"},
    {"name": "Kiwi", "type": "Parrot", "age": 2, "description": "Green parakeet with a loud chirp"},
    {"name": "Tank", "type": "Turtle", "age": 7, "description": "Slow but steady red-eared slider"},
    {"name": "Max", "type": "Dog", "age": 4, "description": "Smart Border Collie"},
    {"name": "Shadow", "type": "Cat", "age": 6, "description": "Quiet black cat"},
    {"name": "Oreo", "type": "Hamster", "age": 1, "description": "Black and white dwarf hamster"},
    {"name": "Bubbles", "type": "Fish", "age": 2, "description": "Colorful betta fish"},
    {"name": "Chirpy", "type": "Bird", "age": 3, "description": "Yellow canary with a sweet song"},
    {"name": "Hazel", "type": "Rabbit", "age": 4, "description": "Gentle rabbit with soft fur"}
]

def main():
    """
    Connects to MongoDB, resets the 'pets' collection,
    and populates it with sample data.
    """
    # Load environment variables from .env file
    load_dotenv()
    MONGO_URI = os.getenv("MONGO_URI")
    DB_NAME = os.getenv("DB_NAME")

    if not MONGO_URI or not DB_NAME:
        print("Error: MONGO_URI and DB_NAME must be set in the .env file.")
        return

    client = None
    try:
        # Connect to MongoDB
        client = MongoClient(MONGO_URI)
        # The ismaster command is cheap and does not require auth.
        client.admin.command('ismaster')
        print("MongoDB connection successful.")

        db = client[DB_NAME]
        collection = db.pets

        # Clear the collection
        delete_result = collection.delete_many({})
        print(f"Collection 'pets' reset. {delete_result.deleted_count} documents deleted.")

        # Insert the new data
        insert_result = collection.insert_many(pets_data)
        print(f"Successfully inserted {len(insert_result.inserted_ids)} documents.")
        print("Inserted IDs:", insert_result.inserted_ids)

        # Fetch and print all pets
        print("\n--- Current Pets in Database ---")
        all_pets = list(collection.find({}))
        pprint(all_pets)
        print("--------------------------------")

    except ConnectionFailure as e:
        print(f"MongoDB connection failed: {e}")
    finally:
        if client:
            client.close()
            print("\nMongoDB connection closed.")

if __name__ == "__main__":
    main()