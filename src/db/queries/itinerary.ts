import { apiGet, apiPost, apiPut, apiDelete } from "../../api/client";
import type { ItineraryData } from "../../types/database";

export async function getItinerariesByTravel(
  travelId: number
): Promise<ItineraryData[]> {
  return apiGet<ItineraryData[]>(`/travels/${travelId}/itineraries`);
}

export async function getItineraryByIdWithTravel(
  travelId: number,
  itineraryId: number
): Promise<ItineraryData | null> {
  try {
    return await apiGet<ItineraryData>(
      `/travels/${travelId}/itineraries/${itineraryId}`
    );
  } catch {
    return null;
  }
}

export async function getItineraryByDate(
  travelId: number,
  date: string
): Promise<ItineraryData | null> {
  const list = await apiGet<ItineraryData[]>(
    `/travels/${travelId}/itineraries?date=${date}`
  );
  return list.length > 0 ? list[0] : null;
}

export async function insertItinerary(
  travelId: number,
  itinerary: Omit<ItineraryData, "itinerary_id" | "travel_id">
): Promise<number> {
  const res = await apiPost<ItineraryData>(
    `/travels/${travelId}/itineraries`,
    itinerary
  );
  return res.itinerary_id;
}

export async function updateItinerary(
  travelId: number,
  itinerary: ItineraryData
): Promise<void> {
  const { itinerary_id, travel_id, ...data } = itinerary;
  await apiPut(
    `/travels/${travelId}/itineraries/${itinerary_id}`,
    data
  );
}

export async function deleteItinerary(
  travelId: number,
  itineraryId: number
): Promise<void> {
  await apiDelete(`/travels/${travelId}/itineraries/${itineraryId}`);
}
