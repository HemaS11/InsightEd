import getpass
import bcrypt

import models
from database import Base, engine, SessionLocal


def create_admin():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        existing_admin = db.query(models.User).filter(
            models.User.role == "admin"
        ).first()

        if existing_admin:
            print("An administrator account already exists.")
            return

        name = input("Enter administrator name: ").strip()
        email = input("Enter administrator email: ").strip().lower()

        if not name or not email:
            print("Name and email cannot be empty.")
            return

        existing_user = db.query(models.User).filter(
            models.User.email == email
        ).first()

        if existing_user:
            print("This email is already registered.")
            return

        password = getpass.getpass("Create administrator password: ")
        confirm_password = getpass.getpass("Confirm password: ")

        if password != confirm_password:
            print("Passwords do not match.")
            return

        if len(password.encode("utf-8")) > 72:
            print("Password must be no longer than 72 bytes.")
            return

        if len(password) < 12:
            print("Password must be at least 12 characters.")
            return

        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        admin = models.User(
            name=name,
            email=email,
            hashed_password=hashed_password,
            role="admin",
            is_active=1
        )

        db.add(admin)
        db.commit()

        print("Administrator account created successfully!")

    finally:
        db.close()


if __name__ == "__main__":
    create_admin()
