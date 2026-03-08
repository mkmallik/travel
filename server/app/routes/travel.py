from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from ..models import TravelCreate, TravelUpdate, TravelResponse
from ..db.database import get_db
from ..auth import get_current_user

router = APIRouter(prefix="/travels", tags=["travels"])


@router.get("", response_model=List[TravelResponse])
def list_travels(user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        rows = db.execute(
            "SELECT * FROM travel WHERE user_id = ? ORDER BY start_date DESC",
            (user["user_id"],),
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        db.close()


@router.get("/{travel_id}", response_model=TravelResponse)
def get_travel(travel_id: int, user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        row = db.execute(
            "SELECT * FROM travel WHERE travel_id = ? AND user_id = ?",
            (travel_id, user["user_id"]),
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Travel not found")
        return dict(row)
    finally:
        db.close()


@router.post("", response_model=TravelResponse, status_code=status.HTTP_201_CREATED)
def create_travel(data: TravelCreate, user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        cursor = db.execute(
            "INSERT INTO travel (user_id, description, start_date, end_date, countries, cover_image_uri) VALUES (?, ?, ?, ?, ?, ?)",
            (user["user_id"], data.description, data.start_date, data.end_date, data.countries, data.cover_image_uri),
        )
        db.commit()
        row = db.execute("SELECT * FROM travel WHERE travel_id = ?", (cursor.lastrowid,)).fetchone()
        return dict(row)
    finally:
        db.close()


@router.put("/{travel_id}", response_model=TravelResponse)
def update_travel(travel_id: int, data: TravelUpdate, user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        existing = db.execute(
            "SELECT * FROM travel WHERE travel_id = ? AND user_id = ?",
            (travel_id, user["user_id"]),
        ).fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Travel not found")

        db.execute(
            "UPDATE travel SET description = ?, start_date = ?, end_date = ?, countries = ?, cover_image_uri = ? WHERE travel_id = ?",
            (data.description, data.start_date, data.end_date, data.countries, data.cover_image_uri, travel_id),
        )
        db.commit()
        row = db.execute("SELECT * FROM travel WHERE travel_id = ?", (travel_id,)).fetchone()
        return dict(row)
    finally:
        db.close()


@router.delete("/{travel_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_travel(travel_id: int, user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        existing = db.execute(
            "SELECT * FROM travel WHERE travel_id = ? AND user_id = ?",
            (travel_id, user["user_id"]),
        ).fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Travel not found")

        db.execute("DELETE FROM travel WHERE travel_id = ?", (travel_id,))
        db.commit()
    finally:
        db.close()
