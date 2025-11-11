"use client";

import { useEffect, useMemo, useState } from "react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type Farmland = {
  id: string;
  name: string;
  area?: string;
  crops: string[];
  nextIrrigationDate?: string;
  nextFertilizingDate?: string;
  plannedPlantingDate?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  farmlandId?: string | null;
};

const STORAGE_KEY = "hingaguru_farmlands";

export default function FarmlandScheduleModal({ isOpen, onClose, farmlandId }: Props) {
  const [farmland, setFarmland] = useState<Farmland | null>(null);
  const [irrigation, setIrrigation] = useState("");
  const [fertilizing, setFertilizing] = useState("");
  const [planting, setPlanting] = useState("");

  useEffect(() => {
    if (!isOpen || !farmlandId) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: Farmland[] = raw ? JSON.parse(raw) : [];
      const f = list.find(x => x.id === farmlandId) || null;
      setFarmland(f || null);
      setIrrigation(f?.nextIrrigationDate || "");
      setFertilizing(f?.nextFertilizingDate || "");
      setPlanting(f?.plannedPlantingDate || "");
    } catch {
      setFarmland(null);
    }
  }, [isOpen, farmlandId]);

  function persist(updated: Farmland) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: Farmland[] = raw ? JSON.parse(raw) : [];
      const next = list.map(f => (f.id === updated.id ? updated : f));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("farmlands:updated"));
    } catch {
      // ignore
    }
  }

  function saveAll() {
    if (!farmland) return;
    const updated: Farmland = {
      ...farmland,
      nextIrrigationDate: irrigation || undefined,
      nextFertilizingDate: fertilizing || undefined,
      plannedPlantingDate: planting || undefined,
    };
    setFarmland(updated);
    persist(updated);
    onClose();
  }

  if (!isOpen || !farmland) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Schedule for {farmland.name}</h3>
          <button aria-label="Close" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <Input id="schedule-irrigation" variant="date" label="Next irrigation date" value={irrigation} onChange={setIrrigation} />
          <Input id="schedule-fertilizing" variant="date" label="Next fertilizing date" value={fertilizing} onChange={setFertilizing} />
          <Input id="schedule-planting" variant="date" label="Planned planting date" value={planting} onChange={setPlanting} />
        </div>
        <div className="flex justify-end mt-6 gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={saveAll}>Save</Button>
        </div>
      </div>
    </div>
  );
}


