from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import bcrypt, jwt
from app.db import SessionLocal
from app.models.user import User

router = APIRouter(prefix="/api/auth", tags=["Auth"])

SECRET = "vishal"
ALGO = "HS256"

# -------------------------
# SIGNUP
# -------------------------
class SignupRequest(BaseModel):
    username: str
    email: str
    password: str

@router.post("/signup")
async def signup(data: SignupRequest):
    db = SessionLocal()

    # Check existing email
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed_pw = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()

    new_user = User(
        username=data.username,
        email=data.email,
        password_hash=hashed_pw
    )

    db.add(new_user)
    db.commit()

    return {"message": "Signup successful"}


# -------------------------
# LOGIN
# -------------------------
class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
async def login(data: LoginRequest):
    db = SessionLocal()

    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid login")

    if not bcrypt.checkpw(data.password.encode(), user.password_hash.encode()):
        raise HTTPException(status_code=400, detail="Invalid login")

    token = jwt.encode({"sub": user.email}, SECRET, algorithm=ALGO)

    return {
        "access_token": token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }
