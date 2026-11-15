import getpass
import bcrypt
import models
from database import SessionLocal


def reset_password():
    db = SessionLocal()

    try:
        email = input("Enter admin email: ").strip().lower()

        admin = db.query(models.User).filter(
            models.User.email == email,
            models.User.role == "admin"
        ).first()

        if not admin:
            print("Admin account not found.")
            return

        password = getpass.getpass("Enter new password: ")
        confirm = getpass.getpass("Confirm new password: ")

        if password != confirm:
            print("Passwords do not match.")
            return

        if len(password) < 12 or len(password.encode("utf-8")) > 72:
            print("Password must be at least 12 characters and no more than 72 bytes.")
            return

        admin.hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        db.commit()
        print("Admin password updated successfully!")

    finally:
        db.close()


if __name__ == "__main__":
    reset_password()
