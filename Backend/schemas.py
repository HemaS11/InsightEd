
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime


# Schema for creating new feedback
class FeedbackCreate(BaseModel):
    course_name: str = Field(min_length=1, max_length=200)
    instructor_name: str = Field(min_length=1, max_length=200)

    rating: float = Field(ge=1, le=5)

    comment: str = Field(min_length=1)


# Schema for returning feedback data
class FeedbackResponse(BaseModel):
    id: int

    course_name: str
    instructor_name: str

    rating: float
    comment: str

    sentiment: Optional[str] = None
    sentiment_score: Optional[float] = None

    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# Schema for sentiment analysis response
class SentimentResponse(BaseModel):
    sentiment: str
    sentiment_score: float
    explanation: Optional[str] = None
