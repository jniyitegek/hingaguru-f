"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Sprout, Trash2, Plus } from "lucide-react";
import Nav from "@/components/common/Nav";
import AuthNav from "@/components/common/AuthNav";
import { useLocale } from "@/context/LocaleContext";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input";
import FarmlandManager from "@/components/sections/farmlands/FarmlandManager.client";
import FarmlandScheduleModal from "@/components/sections/farmlands/FarmlandScheduleModal.client";
import { api, type Farmland } from "@/lib/api";

export default function FarmlandsClient() {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [farmlands, setFarmlands] = useState<Farmland[]>([]);
  const [scheduleModalId, setScheduleModalId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFarmlands = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await api.getFarmlands();
      setFarmlands(list);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load farmlands";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFarmlands();
  }, [loadFarmlands]);

  const totalCrops = useMemo(() => farmlands.reduce((acc, f) => acc + f.crops.length, 0), [farmlands]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return farmlands;
    return farmlands.filter((f) => {
      return (
        f.name.toLowerCase().includes(q) ||
        (f.area?.toLowerCase().includes(q) ?? false) ||
        f.crops.join(", ").toLowerCase().includes(q)
      );
    });
  }, [farmlands, query]);

  async function handleDelete(id: string) {
    try {
      await api.deleteFarmland(id);
      setFarmlands((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete farmland";
      setError(message);
    }
  }

  function handleCreated(farmland: Farmland) {
    setFarmlands((prev) => [farmland, ...prev]);
  }

  function handleUpdated(farmland: Farmland) {
    setFarmlands((prev) => prev.map((f) => (f.id === farmland.id ? farmland : f)));
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Nav />
      <main className="flex-1 overflow-auto">
        <AuthNav />
        <div className="p-8">
          <div className="flex items-start justify-between mb-8 text-black">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{t("farmlands.title")}</h1>
              <p className="text-gray-500">{t("farmlands.subtitle")}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-72">
                <Input id="search-farmlands" placeholder={t("farmlands.searchPlaceholder")} value={query} onChange={setQuery} />
              </div>
              <Button onClick={() => setIsOpen(true)}>
                <Plus className="mr-2" /> {t("nav.addFarmland")}
              </Button>
            </div>
          </div>

          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-4xl font-bold text-gray-800 mb-1">{farmlands.length}</div>
              <div className="text-gray-500 text-sm">{t("farmlands.totalFarmlands")}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-4xl font-bold text-gray-800 mb-1">{totalCrops}</div>
              <div className="text-gray-500 text-sm">{t("farmlands.cropTypes")}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-4xl font-bold text-gray-800 mb-1">
                {farmlands.filter((f) => !!f.nextIrrigationDate).length}
              </div>
              <div className="text-gray-500 text-sm">{t("farmlands.scheduledIrrigations")}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="grid grid-cols-12 bg-gray-50 text-gray-600 text-sm font-medium px-6 py-3 rounded-t-xl">
              <div className="col-span-4">Farmland</div>
              <div className="col-span-4">Crops</div>
              <div className="col-span-3">Area</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            {loading ? (
              <div className="px-6 py-8 text-gray-500 text-sm">{t("farmlands.loading")}</div>
            ) : filtered.length === 0 ? (
              <div className="px-6 py-8 text-gray-500 text-sm">
                {farmlands.length === 0 ? t("farmlands.noFarmlands") : t("farmlands.noMatch")}
              </div>
            ) : (
              filtered.map((f) => (
                <div key={f.id} className="grid grid-cols-12 items-center px-6 py-4 border-t gap-y-2">
                  <div className="col-span-4 text-gray-800 font-medium flex items-center gap-2">
                    <Sprout className="text-green-600" /> {f.name}
                  </div>
                  <div className="col-span-4 text-gray-700">{f.crops.join(", ") || "-"}</div>
                  <div className="col-span-3 text-gray-700">{f.area || "-"}</div>
                  <div className="col-span-1 text-right">
                    <button
                      className="inline-flex items-center text-green-700 hover:text-green-800 mr-3"
                      onClick={() => setScheduleModalId(f.id)}
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

        <FarmlandManager
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onCreated={handleCreated}
        />
        <FarmlandScheduleModal
          isOpen={!!scheduleModalId}
          onClose={() => setScheduleModalId(null)}
          farmlandId={scheduleModalId}
          onUpdated={handleUpdated}
        />
      </main>
    </div>
  );
}

