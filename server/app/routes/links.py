from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from ..models import LinkCreate, LinkUpdate, LinkResponse
from ..db.database import get_db
from ..auth import get_current_user

router = APIRouter(tags=["links"])


def _verify_travel_access(db, travel_id: int, user_id: int):
    row = db.execute(
        "SELECT travel_id FROM travel WHERE travel_id = ? AND user_id = ?",
        (travel_id, user_id),
    ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Travel not found")


@router.get("/travels/{travel_id}/links", response_model=List[LinkResponse])
def list_links_by_travel(travel_id: int, user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        _verify_travel_access(db, travel_id, user["user_id"])
        rows = db.execute(
            "SELECT * FROM important_links WHERE travel_id = ? ORDER BY type ASC, title ASC",
            (travel_id,),
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        db.close()


@router.get("/links", response_model=List[LinkResponse])
def list_all_links(user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        # Only return links belonging to the user's travels (or global links)
        rows = db.execute(
            """SELECT l.* FROM important_links l
            LEFT JOIN travel t ON l.travel_id = t.travel_id
            WHERE t.user_id = ? OR l.travel_id IS NULL
            ORDER BY l.type ASC, l.title ASC""",
            (user["user_id"],),
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        db.close()


@router.get("/links/{link_id}", response_model=LinkResponse)
def get_link(link_id: int, user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        row = db.execute(
            """SELECT l.* FROM important_links l
            LEFT JOIN travel t ON l.travel_id = t.travel_id
            WHERE l.link_id = ? AND (t.user_id = ? OR l.travel_id IS NULL)""",
            (link_id, user["user_id"]),
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Link not found")
        return dict(row)
    finally:
        db.close()


@router.post("/links", response_model=LinkResponse, status_code=status.HTTP_201_CREATED)
def create_link(data: LinkCreate, user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        if data.travel_id:
            _verify_travel_access(db, data.travel_id, user["user_id"])

        cursor = db.execute(
            "INSERT INTO important_links (travel_id, type, title, url, icon_url) VALUES (?, ?, ?, ?, ?)",
            (data.travel_id, data.type, data.title, data.url, data.icon_url),
        )
        db.commit()
        row = db.execute("SELECT * FROM important_links WHERE link_id = ?", (cursor.lastrowid,)).fetchone()
        return dict(row)
    finally:
        db.close()


@router.put("/links/{link_id}", response_model=LinkResponse)
def update_link(link_id: int, data: LinkUpdate, user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        existing = db.execute(
            """SELECT l.* FROM important_links l
            LEFT JOIN travel t ON l.travel_id = t.travel_id
            WHERE l.link_id = ? AND (t.user_id = ? OR l.travel_id IS NULL)""",
            (link_id, user["user_id"]),
        ).fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Link not found")

        if data.travel_id:
            _verify_travel_access(db, data.travel_id, user["user_id"])

        db.execute(
            "UPDATE important_links SET travel_id = ?, type = ?, title = ?, url = ?, icon_url = ? WHERE link_id = ?",
            (data.travel_id, data.type, data.title, data.url, data.icon_url, link_id),
        )
        db.commit()
        row = db.execute("SELECT * FROM important_links WHERE link_id = ?", (link_id,)).fetchone()
        return dict(row)
    finally:
        db.close()


@router.delete("/links/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_link(link_id: int, user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        existing = db.execute(
            """SELECT l.* FROM important_links l
            LEFT JOIN travel t ON l.travel_id = t.travel_id
            WHERE l.link_id = ? AND (t.user_id = ? OR l.travel_id IS NULL)""",
            (link_id, user["user_id"]),
        ).fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Link not found")

        db.execute("DELETE FROM important_links WHERE link_id = ?", (link_id,))
        db.commit()
    finally:
        db.close()
