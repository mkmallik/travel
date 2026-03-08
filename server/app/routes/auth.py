from fastapi import APIRouter, HTTPException, status
from ..models import LoginRequest, SignupRequest, TokenResponse
from ..db.database import get_db, hash_password
from ..auth import create_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    db = get_db()
    try:
        pw_hash = hash_password(req.password, req.email)
        user = db.execute(
            "SELECT * FROM users WHERE email = ? AND password_hash = ?",
            (req.email.lower(), pw_hash),
        ).fetchone()

        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

        token = create_token(user["user_id"], user["email"])
        return TokenResponse(
            access_token=token,
            user_id=user["user_id"],
            email=user["email"],
            name=user["name"],
        )
    finally:
        db.close()


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(req: SignupRequest):
    db = get_db()
    try:
        existing = db.execute("SELECT user_id FROM users WHERE email = ?", (req.email.lower(),)).fetchone()
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

        pw_hash = hash_password(req.password, req.email)
        cursor = db.execute(
            "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
            (req.email.lower(), pw_hash, req.name),
        )
        db.commit()
        user_id = cursor.lastrowid

        token = create_token(user_id, req.email.lower())
        return TokenResponse(
            access_token=token,
            user_id=user_id,
            email=req.email.lower(),
            name=req.name,
        )
    finally:
        db.close()
