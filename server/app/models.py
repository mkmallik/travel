from pydantic import BaseModel, EmailStr
from typing import Optional


# --- Auth ---
class LoginRequest(BaseModel):
    email: str
    password: str


class SignupRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str
    name: Optional[str] = None


# --- Travel ---
class TravelCreate(BaseModel):
    description: str
    start_date: str
    end_date: str
    countries: str = ""
    cover_image_uri: Optional[str] = None


class TravelUpdate(BaseModel):
    description: str
    start_date: str
    end_date: str
    countries: str = ""
    cover_image_uri: Optional[str] = None


class TravelResponse(BaseModel):
    travel_id: int
    user_id: int
    description: str
    start_date: str
    end_date: str
    countries: str
    cover_image_uri: Optional[str] = None


# --- Itinerary ---
class ItineraryCreate(BaseModel):
    date: str
    day_no: int
    city: str
    city_image_uri: Optional[str] = None
    flight_detail: Optional[str] = None
    transport_mode: Optional[str] = None
    transport_cost: Optional[float] = None
    hotel_name: Optional[str] = None
    hotel_address: Optional[str] = None
    booking_id: Optional[str] = None
    hotel_cost: Optional[float] = None
    food_cost: Optional[float] = None
    transportation_cost: Optional[float] = None
    activities_cost: Optional[float] = None
    misc_cost: Optional[float] = None
    activity_description: Optional[str] = None
    notes: Optional[str] = None


class ItineraryUpdate(ItineraryCreate):
    pass


class ItineraryResponse(ItineraryCreate):
    itinerary_id: int
    travel_id: int


# --- Expense ---
class ExpenseCreate(BaseModel):
    itinerary_id: Optional[int] = None
    date: str
    description: str
    category: str
    amount_eur: float
    amount_local: Optional[float] = None
    local_currency_code: Optional[str] = None
    receipt_image_uri: Optional[str] = None
    voice_note_uri: Optional[str] = None


class ExpenseUpdate(ExpenseCreate):
    pass


class ExpenseResponse(ExpenseCreate):
    expense_id: int
    travel_id: int


class DailyTotalResponse(BaseModel):
    date: str
    total_eur: float
    count: int


class CategoryTotalResponse(BaseModel):
    category: str
    total_eur: float
    count: int


# --- Links ---
class LinkCreate(BaseModel):
    travel_id: Optional[int] = None
    type: str = "other"
    title: str
    url: str
    icon_url: Optional[str] = None


class LinkUpdate(LinkCreate):
    pass


class LinkResponse(LinkCreate):
    link_id: int
