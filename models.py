from pydantic import BaseModel, HttpUrl

class PetFavorite(BaseModel):
    """Pydantic model for a user's favorite pet."""
    image_url: HttpUrl
    animal_type: str
    user_comment: str
