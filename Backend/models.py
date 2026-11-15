
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
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

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    owner = relationship("User")
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)
    is_active = Column(Integer, default=1, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
