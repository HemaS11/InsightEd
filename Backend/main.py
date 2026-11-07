
import models
import schemas

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import create_tables, get_db
from sentiment import analyze_sentiment


app = FastAPI(
    title="FeedbackIQ API",
    description="AI-Powered Course Feedback Analyzer",
    version="1.0.0"
)


@app.on_event("startup")
def startup():
    create_tables()


# React frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Home endpoint
@app.get("/")
def home():
    return {
        "message": "Welcome to FeedbackIQ!",
        "status": "Backend is running"
    }


# Health endpoint
@app.get("/health")
def health():
    return {
        "status": "healthy",
        "project": "FeedbackIQ"
    }


# Submit feedback
@app.post(
    "/feedback",
    response_model=schemas.FeedbackResponse,
    status_code=201
)
def create_feedback(
    feedback: schemas.FeedbackCreate,
    db: Session = Depends(get_db)
):
    sentiment_result = analyze_sentiment(feedback.comment)

    new_feedback = models.Feedback(
        course_name=feedback.course_name,
        instructor_name=feedback.instructor_name,
        rating=feedback.rating,
        comment=feedback.comment,
        sentiment=sentiment_result["sentiment"],
        sentiment_score=sentiment_result["sentiment_score"]
    )

    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)

    return new_feedback


# Get all feedback
@app.get(
    "/feedback",
    response_model=list[schemas.FeedbackResponse]
)
def get_all_feedback(db: Session = Depends(get_db)):
    return (
        db.query(models.Feedback)
        .order_by(models.Feedback.id.desc())
        .all()
    )


# Get feedback by ID
@app.get(
    "/feedback/{feedback_id}",
    response_model=schemas.FeedbackResponse
)
def get_feedback(
    feedback_id: int,
    db: Session = Depends(get_db)
):
    feedback = (
        db.query(models.Feedback)
        .filter(models.Feedback.id == feedback_id)
        .first()
    )

    if feedback is None:
        raise HTTPException(
            status_code=404,
            detail="Feedback not found"
        )

    return feedback

@app.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    total = db.query(models.Feedback).count()

    average_rating = (
        db.query(func.avg(models.Feedback.rating)).scalar()
        or 0
    )

    positive = db.query(models.Feedback).filter(
        models.Feedback.sentiment == "Positive"
    ).count()

    negative = db.query(models.Feedback).filter(
        models.Feedback.sentiment == "Negative"
    ).count()

    neutral = db.query(models.Feedback).filter(
        models.Feedback.sentiment == "Neutral"
    ).count()

    return {
        "total_feedback": total,
        "average_rating": round(average_rating, 2),
        "positive_feedback": positive,
        "negative_feedback": negative,
        "neutral_feedback": neutral
    }
    
@app.get("/analytics/courses")
def get_course_analytics(db: Session = Depends(get_db)):
    results = (
        db.query(
            models.Feedback.course_name,
            models.Feedback.instructor_name,
            func.count(models.Feedback.id).label("total_feedback"),
            func.avg(models.Feedback.rating).label("average_rating")
        )
        .group_by(
            models.Feedback.course_name,
            models.Feedback.instructor_name
        )
        .all()
    )

    return [
        {
            "course_name": row.course_name,
            "instructor_name": row.instructor_name,
            "total_feedback": row.total_feedback,
            "average_rating": round(row.average_rating, 2)
        }
        for row in results
    ]    

@app.get("/analytics/sentiment")
def get_sentiment_analytics(db: Session = Depends(get_db)):
    results = (
        db.query(
            models.Feedback.course_name,
            models.Feedback.instructor_name,
            models.Feedback.sentiment,
            func.count(models.Feedback.id).label("count")
        )
        .group_by(
            models.Feedback.course_name,
            models.Feedback.instructor_name,
            models.Feedback.sentiment
        )
        .all()
    )

    analytics = {}

    for row in results:
        key = f"{row.course_name} - {row.instructor_name}"

        if key not in analytics:
            analytics[key] = {
                "course_name": row.course_name,
                "instructor_name": row.instructor_name,
                "positive": 0,
                "negative": 0,
                "neutral": 0
            }

        if row.sentiment:
            analytics[key][row.sentiment.lower()] = row.count

    return list(analytics.values())    