import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { TravelData } from "../types/database";
import { getAllTravels, getTravelById } from "../db/queries/travel";
import { useAuth } from "./useAuth";

interface TravelContextValue {
  currentTravel: TravelData | null;
  travels: TravelData[];
  setCurrentTravelId: (id: number) => void;
  refreshTravels: () => Promise<void>;
}

const TravelContext = createContext<TravelContextValue>({
  currentTravel: null,
  travels: [],
  setCurrentTravelId: () => {},
  refreshTravels: async () => {},
});

export function ActiveTravelProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [travels, setTravels] = useState<TravelData[]>([]);
  const [currentTravel, setCurrentTravel] = useState<TravelData | null>(null);

  const refreshTravels = useCallback(async () => {
    if (!user) return;
    const list = await getAllTravels();
    setTravels(list);
    if (currentTravel) {
      const updated = await getTravelById(currentTravel.travel_id);
      setCurrentTravel(updated);
    } else if (list.length > 0 && !currentTravel) {
      setCurrentTravel(list[0]);
    }
  }, [currentTravel, user]);

  const setCurrentTravelId = useCallback(
    async (id: number) => {
      const travel = await getTravelById(id);
      setCurrentTravel(travel);
    },
    []
  );

  useEffect(() => {
    refreshTravels();
  }, [user]);

  return (
    <TravelContext.Provider
      value={{ currentTravel, travels, setCurrentTravelId, refreshTravels }}
    >
      {children}
    </TravelContext.Provider>
  );
}

export function useCurrentTravel() {
  return useContext(TravelContext);
}
