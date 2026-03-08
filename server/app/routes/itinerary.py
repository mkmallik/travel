from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import List, Optional
from ..models import ItineraryCreate, ItineraryUpdate, ItineraryResponse
from ..db.database import get_db
from ..auth import get_current_user

router = APIRouter(prefix="/travels/{travel_id}/itineraries", tags=["itineraries"])


def _verify_travel_access(db, travel_id: int, user_id: int):
    row = db.execute(
        "SELECT travel_id FROM travel WHERE travel_id = ? AND user_id = ?",
        (travel_id, user_id),
    ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Travel not found")


@router.get("", response_model=List[ItineraryResponse])
def list_itineraries(travel_id: int, date: Optional[str] = Query(None), user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        _verify_travel_access(db, travel_id, user["user_id"])

        if date:
            rows = db.execute(
                "SELECT * FROM itinerary WHERE travel_id = ? AND date = ?",
                (travel_id, date),
            ).fetchall()
        else:
            rows = db.execute(
                "SELECT * FROM itinerary WHERE travel_id = ? ORDER BY day_no ASC",
                (travel_id,),
            ).fetchall()
        return [dict(r) for r in rows]
    finally:
        db.close()


@router.get("/{itinerary_id}", response_model=ItineraryResponse)
def get_itinerary(travel_id: int, itinerary_id: int, user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        _verify_travel_access(db, travel_id, user["user_id"])
        row = db.execute(
            "SELECT * FROM itinerary WHERE itinerary_id = ? AND travel_id = ?",
            (itinerary_id, travel_id),
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Itinerary not found")
        return dict(row)
    finally:
        db.close()


@router.post("", response_model=ItineraryResponse, status_code=status.HTTP_201_CREATED)
def create_itinerary(travel_id: int, data: ItineraryCreate, user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        _verify_travel_access(db, travel_id, user["user_id"])
        cursor = db.execute(
            """INSERT INTO itinerary (travel_id, date, day_no, city, city_image_uri,
            flight_detail, transport_mode, transport_cost, hotel_name, hotel_address,
            booking_id, hotel_cost, food_cost, transportation_cost, activities_cost,
            misc_cost, activity_description, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (travel_id, data.date, data.day_no, data.city, data.city_image_uri,
             data.flight_detail, data.transport_mode, data.transport_cost,
             data.hotel_name, data.hotel_address, data.booking_id, data.hotel_cost,
             data.food_cost, data.transportation_cost, data.activities_cost,
             data.misc_cost, data.activity_description, data.notes),
        )
        db.commit()
        row = db.execute("SELECT * FROM itinerary WHERE itinerary_id = ?", (cursor.lastrowid,)).fetchone()
        return dict(row)
    finally:
        db.close()


@router.put("/{itinerary_id}", response_model=ItineraryResponse)
def update_itinerary(travel_id: int, itinerary_id: int, data: ItineraryUpdate, user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        _verify_travel_access(db, travel_id, user["user_id"])
        existing = db.execute(
            "SELECT * FROM itinerary WHERE itinerary_id = ? AND travel_id = ?",
            (itinerary_id, travel_id),
        ).fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Itinerary not found")

        db.execute(
            """UPDATE itinerary SET date = ?, day_no = ?, city = ?, city_image_uri = ?,
            flight_detail = ?, transport_mode = ?, transport_cost = ?,
            hotel_name = ?, hotel_address = ?, booking_id = ?, hotel_cost = ?,
            food_cost = ?, transportation_cost = ?, activities_cost = ?,
            misc_cost = ?, activity_description = ?, notes = ?
            WHERE itinerary_id = ?""",
            (data.date, data.day_no, data.city, data.city_image_uri,
             data.flight_detail, data.transport_mode, data.transport_cost,
             data.hotel_name, data.hotel_address, data.booking_id, data.hotel_cost,
             data.food_cost, data.transportation_cost, data.activities_cost,
             data.misc_cost, data.activity_description, data.notes, itinerary_id),
        )
        db.commit()
        row = db.execute("SELECT * FROM itinerary WHERE itinerary_id = ?", (itinerary_id,)).fetchone()
        return dict(row)
    finally:
        db.close()


@router.delete("/{itinerary_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_itinerary(travel_id: int, itinerary_id: int, user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        _verify_travel_access(db, travel_id, user["user_id"])
        existing = db.execute(
            "SELECT * FROM itinerary WHERE itinerary_id = ? AND travel_id = ?",
            (itinerary_id, travel_id),
        ).fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Itinerary not found")

        db.execute("DELETE FROM itinerary WHERE itinerary_id = ?", (itinerary_id,))
        db.commit()
    finally:
        db.close()
