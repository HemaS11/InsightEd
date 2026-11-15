import bcrypt
import models
import schemas

from auth import create_access_token, get_current_user, require_roles
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
    "https://insight-ed-rust.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173"
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
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_roles("student"))
):
    sentiment_result = analyze_sentiment(feedback.comment)

    new_feedback = models.Feedback(
        course_name=feedback.course_name,
        instructor_name=feedback.instructor_name,
        rating=feedback.rating,
        comment=feedback.comment,
        sentiment=sentiment_result["sentiment"],
        sentiment_score=sentiment_result["sentiment_score"],
        user_id=current_user.id
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
def get_all_feedback(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    query = db.query(models.Feedback).order_by(models.Feedback.id.desc())

    if current_user.role == "student":
        query = query.filter(models.Feedback.user_id == current_user.id)

    return query.all()


# Get feedback by ID
@app.get(
    "/feedback/{feedback_id}",
    response_model=schemas.FeedbackResponse
)
def get_feedback(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
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

    if current_user.role == "student" and feedback.user_id != current_user.id:
        raise HTTPException(
            status_code=404,
            detail="Feedback not found"
        )

    return feedback

@app.get("/analytics")
def get_analytics(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_roles("admin", "faculty"))
):
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
def get_course_analytics(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_roles("admin", "faculty"))
):
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
def get_sentiment_analytics(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_roles("admin", "faculty"))
):
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
@app.post("/auth/login", response_model=schemas.LoginResponse)
def login(credentials: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.email == credentials.email.lower()
    ).first()

    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    try:
        password_valid = bcrypt.checkpw(
            credentials.password.encode("utf-8"),
            user.hashed_password.encode("utf-8")
        )
    except ValueError:
        password_valid = False

    if not password_valid:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token(user)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


@app.post("/admin/users", response_model=schemas.UserResponse, status_code=201)
def create_user(
    user_data: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_roles("admin"))
):
    email = user_data.email.strip().lower()

    if user_data.role not in ["faculty", "student"]:
        raise HTTPException(
            status_code=400,
            detail="Role must be faculty or student."
        )

    if len(user_data.password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=400,
            detail="Password is too long."
        )

    existing_user = db.query(models.User).filter(
        models.User.email == email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email is already registered."
        )

    hashed_password = bcrypt.hashpw(
        user_data.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    new_user = models.User(
        name=user_data.name.strip(),
        email=email,
        hashed_password=hashed_password,
        role=user_data.role,
        is_active=1
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@app.get("/admin/users", response_model=list[schemas.UserResponse])
def list_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_roles("admin"))
):
    users = db.query(models.User).order_by(models.User.id.asc()).all()
    return users


@app.post("/auth/register", response_model=schemas.UserResponse, status_code=201)
def register_user(
    user_data: schemas.RegisterRequest,
    db: Session = Depends(get_db)
):
    name = user_data.name.strip()
    email = user_data.email.strip().lower()

    if not name or not email:
        raise HTTPException(
            status_code=400,
            detail="Name and email are required."
        )

    if user_data.role not in ["student", "faculty"]:
        raise HTTPException(
            status_code=400,
            detail="Only student and faculty registration is allowed."
        )

    if len(user_data.password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=400,
            detail="Password is too long."
        )

    existing_user = db.query(models.User).filter(
        models.User.email == email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email is already registered."
        )

    hashed_password = bcrypt.hashpw(
        user_data.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    new_user = models.User(
        name=name,
        email=email,
        hashed_password=hashed_password,
        role=user_data.role,
        is_active=1
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
