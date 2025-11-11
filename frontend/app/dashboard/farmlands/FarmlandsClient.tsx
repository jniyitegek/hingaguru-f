"use client";

import Nav from "@/components/common/Nav";
import AuthNav from "@/components/common/AuthNav";
import { Button } from "@/components/ui/button";
import FarmlandManager from "@/components/sections/farmlands/FarmlandManager.client";
import FarmlandScheduleModal from "@/components/sections/farmlands/FarmlandScheduleModal.client";
import { Eye, Sprout, Trash2, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Input from "@/components/ui/Input";

type Farmland = {
  id: string;
  name: string;
  area?: string;
  crops: string[];
  nextIrrigationDate?: string; // yyyy-mm-dd
  nextFertilizingDate?: string; // yyyy-mm-dd
  plannedPlantingDate?: string; // yyyy-mm-dd
};

const STORAGE_KEY = "hingaguru_farmlands";

export default function FarmlandsClient() {
  const [isOpen, setIsOpen] = useState(false);
  const [farmlands, setFarmlands] = useState<Farmland[]>([]);
  const [scheduleModalId, setScheduleModalId] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");

  function loadFarmlands() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setFarmlands(raw ? JSON.parse(raw) : []);
    } catch {
      setFarmlands([]);
    }
  }

  useEffect(() => {
    loadFarmlands();
    const handler = () => loadFarmlands();
    window.addEventListener("farmlands:updated", handler as EventListener);
    return () => window.removeEventListener("farmlands:updated", handler as EventListener);
  }, []);

  function persist(next: Farmland[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("farmlands:updated"));
    } catch {
      // ignore
    }
  }

  function handleDelete(id: string) {
    const next = farmlands.filter(f => f.id !== id);
    setFarmlands(next);
    persist(next);
  }

  function openSchedule(id: string) {
    setScheduleModalId(id);
  }

  const totalCrops = useMemo(() => farmlands.reduce((acc, f) => acc + f.crops.length, 0), [farmlands]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return farmlands;
    return farmlands.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.area?.toLowerCase().includes(q) ||
      f.crops.join(", ").toLowerCase().includes(q)
    );
  }, [farmlands, query]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Nav />
      <main className="flex-1 overflow-auto">
        <AuthNav />
        <div className="p-8">
          <div className="flex items-start justify-between mb-8 text-black">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Farmlands</h1>
              <p className="text-gray-500">Track plots, planted crops, and irrigation schedules</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-72">
                <Input id="search-farmlands" placeholder="Search by name, crops, area" value={query} onChange={setQuery} />
              </div>
              <Button onClick={() => setIsOpen(true)}>
                <Plus className="mr-2" /> Add Farmland
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-4xl font-bold text-gray-800 mb-1">{farmlands.length}</div>
              <div className="text-gray-500 text-sm">Total Farmlands</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-4xl font-bold text-gray-800 mb-1">{totalCrops}</div>
              <div className="text-gray-500 text-sm">Crop Types</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-4xl font-bold text-gray-800 mb-1">
                {farmlands.filter(f => !!f.nextIrrigationDate).length}
              </div>
              <div className="text-gray-500 text-sm">Scheduled Irrigations</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="grid grid-cols-12 bg-gray-50 text-gray-600 text-sm font-medium px-6 py-3 rounded-t-xl">
              <div className="col-span-4">Farmland</div>
              <div className="col-span-4">Crops</div>
              <div className="col-span-3">Area</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            {filtered.length === 0 ? (
              <div className="px-6 py-8 text-gray-500 text-sm">{farmlands.length === 0 ? "No farmlands yet." : "No farmlands match your search."}</div>
            ) : (
              filtered.map(f => (
                <div key={f.id} className="grid grid-cols-12 items-center px-6 py-4 border-t gap-y-2">
                  <div className="col-span-4 text-gray-800 font-medium flex items-center gap-2">
                    <Sprout className="text-green-600" /> {f.name}
                  </div>
                  <div className="col-span-4 text-gray-700">{f.crops.join(", ") || "-"}</div>
                  <div className="col-span-3 text-gray-700">{f.area || "-"}</div>
                  <div className="col-span-1 text-right">
                    <button
                      className="inline-flex items-center text-green-700 hover:text-green-800 mr-3"
                      onClick={() => openSchedule(f.id)}
                    >
                      <Eye size={18} /> <span className="sr-only">View</span>
                    </button>
                    <button
                      className="inline-flex items-center text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(f.id)}
                      aria-label={`Delete ${f.name}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <FarmlandManager isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <FarmlandScheduleModal isOpen={!!scheduleModalId} onClose={() => setScheduleModalId(null)} farmlandId={scheduleModalId} />
      </main>
    </div>
  );
}


