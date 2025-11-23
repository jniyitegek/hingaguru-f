"use client";

import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { api, type Farmland } from "@/lib/api";
import { useLocale } from "@/context/LocaleContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  farmlandId?: string | null;
  onUpdated?: (farmland: Farmland) => void;
};

export default function FarmlandScheduleModal({ isOpen, onClose, farmlandId, onUpdated }: Props) {
  const [farmland, setFarmland] = useState<Farmland | null>(null);
  const [irrigation, setIrrigation] = useState("");
  const [fertilizing, setFertilizing] = useState("");
  const [planting, setPlanting] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    if (!isOpen || !farmlandId) return;
    async function load() {
      try {
        setLoading(true);
        setError(null);
  const data = await api.getFarmland(farmlandId!);
        setFarmland(data);
        setIrrigation(data.nextIrrigationDate ? data.nextIrrigationDate.slice(0, 10) : "");
        setFertilizing(data.nextFertilizingDate ? data.nextFertilizingDate.slice(0, 10) : "");
        setPlanting(data.plannedPlantingDate ? data.plannedPlantingDate.slice(0, 10) : "");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load farmland";
        setError(message);
        setFarmland(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isOpen, farmlandId]);

  async function saveAll() {
    if (!farmland || saving) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await api.updateFarmland(farmland.id, {
        nextIrrigationDate: irrigation || null,
        nextFertilizingDate: fertilizing || null,
        plannedPlantingDate: planting || null,
      });
      setFarmland(updated);
      onUpdated?.(updated);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update schedule";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative z-10 w-full max-w-xl bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
          <div className="text-gray-600 text-sm">{t("farmland.loading")}</div>
        </div>
      </div>
    );
  }
  if (!farmland) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{t("farmland.scheduleFor", { name: farmland.name })}</h3>
          <button aria-label="Close" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X />
          </button>
        </div>
        {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
        <div className="grid grid-cols-1 gap-4">
          <Input id="schedule-irrigation" variant="date" label={t("farmland.nextIrrigation")} value={irrigation} onChange={setIrrigation} />
          <Input id="schedule-fertilizing" variant="date" label={t("farmland.nextFertilizing")} value={fertilizing} onChange={setFertilizing} />
          <Input id="schedule-planting" variant="date" label={t("farmland.plannedPlanting")} value={planting} onChange={setPlanting} />
        </div>
        <div className="flex justify-end mt-6 gap-2">
          <Button variant="outline" onClick={onClose}>
            {t("buttons.cancel")}
          </Button>
          <Button onClick={saveAll} disabled={saving}>
            {saving ? t("buttons.saving") : t("buttons.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}

