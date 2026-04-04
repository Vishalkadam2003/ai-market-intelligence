from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional
import jwt
from datetime import datetime
import secrets

router = APIRouter(prefix="/api/profile", tags=["Profile"])

fake_users_db = {
    "user@example.com": {
        "email": "user@example.com",
        "full_name": "Alex Chen",
        "phone": "+91 98765 43210",
        "member_since": "2024-06-15",
        "tier": "Institutional Pro",
        "api_key": None,
        "two_factor_enabled": True,
        "login_alerts": True,
        "session_timeout": "30 minutes",
        "password_changed_at": "2025-04-05",
        "verified": True,
        "role": "Professional Trader"
    }
}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, "your-secret-key-here", algorithms=["HS256"])
        email: str = payload.get("sub")
        if not email or email not in fake_users_db:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

class UserProfile(BaseModel):
    email: str
    full_name: str
    phone: str
    member_since: str
    tier: str
    verified: bool
    role: Optional[str] = None

class AccountStats(BaseModel):
    tier: str
    api_rate_limit: str
    data_retention: str

class SecuritySettings(BaseModel):
    two_factor_enabled: bool
    login_alerts: bool
    session_timeout: str
    password_changed_at: str

class APIKeyResponse(BaseModel):
    api_key: str
    created_at: str = datetime.utcnow().isoformat() + "Z"

@router.get("/me", response_model=UserProfile)
async def get_profile(user_email: str = Depends(get_current_user)):
    return fake_users_db[user_email]

@router.get("/stats", response_model=AccountStats)
async def get_stats(user_email: str = Depends(get_current_user)):
    tier = fake_users_db[user_email]["tier"]
    limits = {
        "Institutional Pro": {"api_rate_limit": "10,000 req/min", "data_retention": "24 months"},
        "Professional": {"api_rate_limit": "5,000 req/min", "data_retention": "12 months"},
        "Free": {"api_rate_limit": "100 req/min", "data_retention": "30 days"}
    }
    return {"tier": tier, **limits.get(tier, limits["Free"])}

@router.get("/security", response_model=SecuritySettings)
async def get_security(user_email: str = Depends(get_current_user)):
    user = fake_users_db[user_email]
    return {
        "two_factor_enabled": user["two_factor_enabled"],
        "login_alerts": user["login_alerts"],
        "session_timeout": user["session_timeout"],
        "password_changed_at": user["password_changed_at"]
    }

@router.get("/api-key", response_model=APIKeyResponse)
async def get_api_key(user_email: str = Depends(get_current_user)):
    return {"api_key": fake_users_db[user_email]["api_key"]}

@router.post("/api-key/generate")
async def generate_key(user_email: str = Depends(get_current_user)):
    new_key = "sk_live_" + secrets.token_hex(24)
    fake_users_db[user_email]["api_key"] = new_key
    return {"api_key": new_key}

@router.post("/api-key/revoke")
async def revoke_key(user_email: str = Depends(get_current_user)):
    fake_users_db[user_email]["api_key"] = None
    return {"message": "API key revoked"}

class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None

@router.patch("/me")
async def update_profile(req: UpdateProfileRequest, user_email: str = Depends(get_current_user)):
    user = fake_users_db[user_email]
    if req.full_name:
        user["full_name"] = req.full_name
    if req.phone:
        user["phone"] = req.phone
    return {"message": "Profile updated"}
