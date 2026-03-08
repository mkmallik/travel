from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import List, Optional
from ..models import (
    ExpenseCreate, ExpenseUpdate, ExpenseResponse,
    DailyTotalResponse, CategoryTotalResponse,
)
from ..db.database import get_db
from ..auth import get_current_user

router = APIRouter(prefix="/travels/{travel_id}/expenses", tags=["expenses"])


def _verify_travel_access(db, travel_id: int, user_id: int):
    row = db.execute(
        "SELECT travel_id FROM travel WHERE travel_id = ? AND user_id = ?",
        (travel_id, user_id),
    ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Travel not found")


@router.get("", response_model=List[ExpenseResponse])
def list_expenses(travel_id: int, date: Optional[str] = Query(None), user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        _verify_travel_access(db, travel_id, user["user_id"])

        if date:
            rows = db.execute(
                "SELECT * FROM expense WHERE travel_id = ? AND date = ? ORDER BY expense_id ASC",
                (travel_id, date),
            ).fetchall()
        else:
            rows = db.execute(
                "SELECT * FROM expense WHERE travel_id = ? ORDER BY date ASC, expense_id ASC",
                (travel_id,),
            ).fetchall()
        return [dict(r) for r in rows]
    finally:
        db.close()


@router.get("/daily-totals", response_model=List[DailyTotalResponse])
def daily_totals(travel_id: int, user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        _verify_travel_access(db, travel_id, user["user_id"])
        rows = db.execute(
            """SELECT date, SUM(amount_eur) as total_eur, COUNT(*) as count
            FROM expense WHERE travel_id = ?
            GROUP BY date ORDER BY date ASC""",
            (travel_id,),
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        db.close()


@router.get("/category-totals", response_model=List[CategoryTotalResponse])
def category_totals(travel_id: int, user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        _verify_travel_access(db, travel_id, user["user_id"])
        rows = db.execute(
            """SELECT category, SUM(amount_eur) as total_eur, COUNT(*) as count
            FROM expense WHERE travel_id = ?
            GROUP BY category ORDER BY total_eur DESC""",
            (travel_id,),
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        db.close()


@router.get("/total", response_model=dict)
def total_expenses(travel_id: int, user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        _verify_travel_access(db, travel_id, user["user_id"])
        row = db.execute(
            "SELECT COALESCE(SUM(amount_eur), 0) as total FROM expense WHERE travel_id = ?",
            (travel_id,),
        ).fetchone()
        return {"total_eur": row["total"]}
    finally:
        db.close()


@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(travel_id: int, expense_id: int, user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        _verify_travel_access(db, travel_id, user["user_id"])
        row = db.execute(
            "SELECT * FROM expense WHERE expense_id = ? AND travel_id = ?",
            (expense_id, travel_id),
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Expense not found")
        return dict(row)
    finally:
        db.close()


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(travel_id: int, data: ExpenseCreate, user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        _verify_travel_access(db, travel_id, user["user_id"])
        cursor = db.execute(
            """INSERT INTO expense (travel_id, itinerary_id, date, description, category,
            amount_eur, amount_local, local_currency_code, receipt_image_uri, voice_note_uri)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (travel_id, data.itinerary_id, data.date, data.description, data.category,
             data.amount_eur, data.amount_local, data.local_currency_code,
             data.receipt_image_uri, data.voice_note_uri),
        )
        db.commit()
        row = db.execute("SELECT * FROM expense WHERE expense_id = ?", (cursor.lastrowid,)).fetchone()
        return dict(row)
    finally:
        db.close()


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(travel_id: int, expense_id: int, data: ExpenseUpdate, user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        _verify_travel_access(db, travel_id, user["user_id"])
        existing = db.execute(
            "SELECT * FROM expense WHERE expense_id = ? AND travel_id = ?",
            (expense_id, travel_id),
        ).fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Expense not found")

        db.execute(
            """UPDATE expense SET itinerary_id = ?, date = ?, description = ?, category = ?,
            amount_eur = ?, amount_local = ?, local_currency_code = ?,
            receipt_image_uri = ?, voice_note_uri = ?
            WHERE expense_id = ?""",
            (data.itinerary_id, data.date, data.description, data.category,
             data.amount_eur, data.amount_local, data.local_currency_code,
             data.receipt_image_uri, data.voice_note_uri, expense_id),
        )
        db.commit()
        row = db.execute("SELECT * FROM expense WHERE expense_id = ?", (expense_id,)).fetchone()
        return dict(row)
    finally:
        db.close()


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(travel_id: int, expense_id: int, user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        _verify_travel_access(db, travel_id, user["user_id"])
        existing = db.execute(
            "SELECT * FROM expense WHERE expense_id = ? AND travel_id = ?",
            (expense_id, travel_id),
        ).fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Expense not found")

        db.execute("DELETE FROM expense WHERE expense_id = ?", (expense_id,))
        db.commit()
    finally:
        db.close()
