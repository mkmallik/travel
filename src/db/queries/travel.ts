import { apiGet, apiPost, apiPut, apiDelete } from "../../api/client";
import type { TravelData } from "../../types/database";

export async function getAllTravels(): Promise<TravelData[]> {
  return apiGet<TravelData[]>("/travels");
}

export async function getTravelById(
  travelId: number
): Promise<TravelData | null> {
  try {
    return await apiGet<TravelData>(`/travels/${travelId}`);
  } catch {
    return null;
  }
}

export async function insertTravel(
  travel: Omit<TravelData, "travel_id">
): Promise<number> {
  const res = await apiPost<TravelData>("/travels", {
    description: travel.description,
    start_date: travel.start_date,
    end_date: travel.end_date,
    countries: travel.countries,
    cover_image_uri: travel.cover_image_uri,
  });
  return res.travel_id;
}

export async function updateTravel(travel: TravelData): Promise<void> {
  await apiPut(`/travels/${travel.travel_id}`, {
    description: travel.description,
    start_date: travel.start_date,
    end_date: travel.end_date,
    countries: travel.countries,
    cover_image_uri: travel.cover_image_uri,
  });
}

export async function deleteTravel(travelId: number): Promise<void> {
  await apiDelete(`/travels/${travelId}`);
}
