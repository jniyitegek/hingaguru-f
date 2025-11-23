"use client";

import React, { useMemo, useState } from "react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { api, type Farmland } from "@/lib/api";
import { useLocale } from "@/context/LocaleContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (farmland: Farmland) => void;
};

export default function FarmlandManager({ isOpen, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [crops, setCrops] = useState("");
  const [nextIrrigationDate, setNextIrrigationDate] = useState("");
  const [nextFertilizingDate, setNextFertilizingDate] = useState("");
  const [plannedPlantingDate, setPlannedPlantingDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = useMemo(() => {
    return name.trim().length > 1;
  }, [name]);
  const { t } = useLocale();

  function resetForm() {
    setName("");
    setArea("");
    setCrops("");
    setNextIrrigationDate("");
    setNextFertilizingDate("");
    setPlannedPlantingDate("");
    setError(null);
  }

  async function handleAdd() {
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const created = await api.createFarmland({
        name: name.trim(),
        area: area.trim() || undefined,
        crops: crops,
        nextIrrigationDate: nextIrrigationDate || undefined,
        nextFertilizingDate: nextFertilizingDate || undefined,
        plannedPlantingDate: plannedPlantingDate || undefined,
      });
      // create todos for provided dates
      try {
        if (nextIrrigationDate) {
          await api.createTask({ title: `Irrigate ${created.name}`, dueDate: nextIrrigationDate, farmlandId: created.id });
        }
        if (nextFertilizingDate) {
          await api.createTask({ title: `Fertilize ${created.name}`, dueDate: nextFertilizingDate, farmlandId: created.id });
        }
        if (plannedPlantingDate) {
          await api.createTask({ title: `Plant on ${created.name}`, dueDate: plannedPlantingDate, farmlandId: created.id });
        }
      } catch (e) {
        // ignore task creation errors — do not block farmland creation
        console.error('Failed to create related tasks', e);
      }
      onCreated?.(created);
      resetForm();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create farmland";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{t("farmland.addFarmland")}</h3>
          <button aria-label="Close" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <Input id="farmland-name" label={t("farmland.nameLabel")} value={name} onChange={setName} required placeholder={t("farmland.namePlaceholder")} />
          <Input id="farmland-area" label={t("farmland.areaLabel")} value={area} onChange={setArea} placeholder={t("farmland.areaPlaceholder")} />
          <Input id="farmland-crops" label={t("farmland.cropsLabel")} value={crops} onChange={setCrops} placeholder={t("farmland.cropsPlaceholder")} />
          <Input
            id="farmland-next-irrigation"
            variant="date"
            label={t("farmland.nextIrrigation")}
            value={nextIrrigationDate}
            onChange={setNextIrrigationDate}
          />
          <Input
            id="farmland-next-fertilizing"
            variant="date"
            label={t("farmland.nextFertilizing")}
            value={nextFertilizingDate}
            onChange={setNextFertilizingDate}
          />
          <Input
            id="farmland-planting-date"
            variant="date"
            label={t("farmland.plannedPlanting")}
            value={plannedPlantingDate}
            onChange={setPlannedPlantingDate}
          />
        </div>
        {error && <div className="text-sm text-red-600 mb-4">{error}</div>}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t("buttons.cancel")}
          </Button>
          <Button onClick={handleAdd} disabled={!isValid || submitting}>
            {submitting ? t("farmland.saving") : t("nav.addFarmland")}
          </Button>
        </div>
      </div>
    </div>
  );
}

