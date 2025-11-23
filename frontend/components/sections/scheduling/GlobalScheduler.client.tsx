"use client";

import { useEffect, useMemo, useState } from "react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

type Employee = { id: string; fullName: string; role: string; phone: string };
type Farmland = { id: string; name: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const EMP_STORAGE = "hingaguru_employees";
const FARM_STORAGE = "hingaguru_farmlands";
const EVENTS_STORAGE = "hingaguru_events";

export default function GlobalScheduler({ isOpen, onClose }: Props) {
  const { t } = useLocale();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("general");
  const [target, setTarget] = useState<"none" | "farmland" | "employee">("none");
  const [farmlandId, setFarmlandId] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [farmlands, setFarmlands] = useState<Farmland[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    try {
      const rawE = localStorage.getItem(EMP_STORAGE);
      setEmployees(rawE ? JSON.parse(rawE) : []);
    } catch { setEmployees([]); }
    try {
      const rawF = localStorage.getItem(FARM_STORAGE);
      const parsed = rawF ? JSON.parse(rawF) : [];
      setFarmlands(parsed.map((f: any) => ({ id: f.id, name: f.name })));
    } catch { setFarmlands([]); }
  }, [isOpen]);

  const typeOptions = useMemo(() => ([
    { value: "general", label: t("scheduler.types.general") },
    { value: "irrigation", label: t("scheduler.types.irrigation") },
    { value: "fertilizing", label: t("scheduler.types.fertilizing") },
    { value: "planting", label: t("scheduler.types.planting") },
    { value: "payment", label: t("scheduler.types.payment") },
  ]), [t]);

  const canSave = title.trim().length > 1 && !!date;

  function reset() {
    setTitle("");
    setDate("");
    setType("general");
    setTarget("none");
    setFarmlandId("");
    setEmployeeId("");
  }

  function saveEvent() {
    if (!canSave) return;
    const newEvent = {
      id: crypto.randomUUID(),
      title: title.trim(),
      date,
      type,
      farmlandId: farmlandId || undefined,
      employeeId: employeeId || undefined,
      createdAt: new Date().toISOString(),
    };
    try {
      const raw = localStorage.getItem(EVENTS_STORAGE);
      const current = raw ? JSON.parse(raw) : [];
      const next = [newEvent, ...current];
      localStorage.setItem(EVENTS_STORAGE, JSON.stringify(next));
      window.dispatchEvent(new Event("events:updated"));
    } catch {
      // ignore
    }
    reset();
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{t("scheduler.title")}</h3>
          <button aria-label="Close" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 mb-4">
          <Input id="event-title" label={t("scheduler.titleLabel")} value={title} onChange={setTitle} placeholder={t("scheduler.titlePlaceholder")} required />
          <Input id="event-type" label={t("scheduler.typeLabel")} variant="select" value={type} onChange={setType} options={typeOptions} />
          <Input id="event-date" label={t("scheduler.dateLabel")} variant="date" value={date} onChange={setDate} required />

          <div className="flex flex-col gap-2">
            <label className="text-gray-900 font-medium">Who/Where is this for?</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="target"
                  checked={target === "none"}
                  onChange={() => { setTarget("none"); setFarmlandId(""); setEmployeeId(""); }}
                />
                <span className="text-gray-700">{t("scheduler.target.none")}</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="target"
                  checked={target === "farmland"}
                  onChange={() => { setTarget("farmland"); setEmployeeId(""); }}
                />
                <span className="text-gray-700">{t("scheduler.target.farmland")}</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="target"
                  checked={target === "employee"}
                  onChange={() => { setTarget("employee"); setFarmlandId(""); }}
                />
                <span className="text-gray-700">{t("scheduler.target.employee")}</span>
              </label>
            </div>
          </div>

          {target === "farmland" && (
            <div className="flex flex-col gap-2">
              <label className="text-gray-900 font-medium">{t("scheduler.farmlandLabel")}</label>
              <div className="max-h-40 overflow-auto pr-2 space-y-2">
                {farmlands.length === 0 && <div className="text-gray-500 text-sm">No farmlands yet.</div>}
                {farmlands.map(f => (
                  <label key={f.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="farmland"
                      checked={farmlandId === f.id}
                      onChange={() => setFarmlandId(f.id)}
                    />
                    <span className="text-gray-700">{f.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {target === "employee" && (
            <div className="flex flex-col gap-2">
              <label className="text-gray-900 font-medium">{t("scheduler.employeeLabel")}</label>
              <div className="max-h-40 overflow-auto pr-2 space-y-2">
                {employees.length === 0 && <div className="text-gray-500 text-sm">No employees yet.</div>}
                {employees.map(e => (
                  <label key={e.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="employee"
                      checked={employeeId === e.id}
                      onChange={() => setEmployeeId(e.id)}
                    />
                    <span className="text-gray-700">{e.fullName} ({e.role})</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>{t("buttons.cancel")}</Button>
          <Button onClick={saveEvent} disabled={!canSave}>{t("buttons.save")}</Button>
        </div>
      </div>
    </div>
  );
}


