
from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from sqlalchemy.sql import func
from database import Base


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)

    course_name = Column(String(200), nullable=False)
    instructor_name = Column(String(200), nullable=False)

    rating = Column(Float, nullable=False)

    comment = Column(Text, nullable=False)

    sentiment = Column(String(50), nullable=True)

    sentiment_score = Column(Float, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
