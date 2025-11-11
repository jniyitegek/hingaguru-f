"use client";

import React, { useMemo, useState } from "react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type Farmland = {
  id: string;
  name: string;
  area?: string;
  crops: string[];
  nextIrrigationDate?: string; // ISO yyyy-mm-dd
  nextFertilizingDate?: string; // ISO yyyy-mm-dd
  plannedPlantingDate?: string; // ISO yyyy-mm-dd
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const STORAGE_KEY = "hingaguru_farmlands";

export default function FarmlandManager({ isOpen, onClose }: Props) {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [crops, setCrops] = useState("");
  const [nextIrrigationDate, setNextIrrigationDate] = useState("");
  const [nextFertilizingDate, setNextFertilizingDate] = useState("");
  const [plannedPlantingDate, setPlannedPlantingDate] = useState("");

  const isValid = useMemo(() => {
    return name.trim().length > 1;
  }, [name]);

  function resetForm() {
    setName("");
    setArea("");
    setCrops("");
    setNextIrrigationDate("");
    setNextFertilizingDate("");
    setPlannedPlantingDate("");
  }

  function handleAdd() {
    if (!isValid) return;
    const newFarmland: Farmland = {
      id: crypto.randomUUID(),
      name: name.trim(),
      area: area.trim() || undefined,
      crops: crops.split(",").map(c => c.trim()).filter(Boolean),
      nextIrrigationDate: nextIrrigationDate || undefined,
      nextFertilizingDate: nextFertilizingDate || undefined,
      plannedPlantingDate: plannedPlantingDate || undefined,
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const current: Farmland[] = raw ? JSON.parse(raw) : [];
      const next = [newFarmland, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("farmlands:updated"));
    } catch {
      // ignore
    }
    resetForm();
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Add Farmland</h3>
          <button aria-label="Close" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <Input id="farmland-name" label="Farmland name" value={name} onChange={setName} required placeholder="North Plot" />
          <Input id="farmland-area" label="Area (e.g., 2.5 ha)" value={area} onChange={setArea} placeholder="2 ha" />
          <Input id="farmland-crops" label="Crops (comma-separated)" value={crops} onChange={setCrops} placeholder="Maize, Beans" />
          <Input id="farmland-next-irrigation" variant="date" label="Next irrigation date" value={nextIrrigationDate} onChange={setNextIrrigationDate} />
          <Input id="farmland-next-fertilizing" variant="date" label="Next fertilizing date" value={nextFertilizingDate} onChange={setNextFertilizingDate} />
          <Input id="farmland-planting-date" variant="date" label="Planned planting date" value={plannedPlantingDate} onChange={setPlannedPlantingDate} />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleAdd} disabled={!isValid}>Add Farmland</Button>
        </div>
      </div>
    </div>
  );
}


