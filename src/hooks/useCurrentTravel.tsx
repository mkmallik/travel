import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useSQLiteContext } from "expo-sqlite";
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
  const db = useSQLiteContext();
  const { user } = useAuth();
  const [travels, setTravels] = useState<TravelData[]>([]);
  const [currentTravel, setCurrentTravel] = useState<TravelData | null>(null);

  const refreshTravels = useCallback(async () => {
    if (!user) return;
    const list = await getAllTravels(db, user.user_id);
    setTravels(list);
    if (currentTravel) {
      const updated = await getTravelById(db, currentTravel.travel_id);
      setCurrentTravel(updated);
    } else if (list.length > 0 && !currentTravel) {
      setCurrentTravel(list[0]);
    }
  }, [db, currentTravel, user]);

  const setCurrentTravelId = useCallback(
    async (id: number) => {
      const travel = await getTravelById(db, id);
      setCurrentTravel(travel);
    },
    [db]
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
