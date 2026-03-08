import { apiGet, apiPost, apiPut, apiDelete } from "../../api/client";
import type { LinkData } from "../../types/database";

export async function getLinksByTravel(
  travelId: number
): Promise<LinkData[]> {
  return apiGet<LinkData[]>(`/travels/${travelId}/links`);
}

export async function getAllLinks(): Promise<LinkData[]> {
  return apiGet<LinkData[]>("/links");
}

export async function getLinkById(
  linkId: number
): Promise<LinkData | null> {
  try {
    return await apiGet<LinkData>(`/links/${linkId}`);
  } catch {
    return null;
  }
}

export async function insertLink(
  link: Omit<LinkData, "link_id">
): Promise<number> {
  const res = await apiPost<LinkData>("/links", link);
  return res.link_id;
}

export async function updateLink(link: LinkData): Promise<void> {
  const { link_id, ...data } = link;
  await apiPut(`/links/${link_id}`, data);
}

export async function deleteLink(linkId: number): Promise<void> {
  await apiDelete(`/links/${linkId}`);
}
