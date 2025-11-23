"use client";

import { useEffect, useMemo, useState } from "react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { api, type Employee, type Farmland, type FinanceTransaction } from "@/lib/api";
import { useLocale } from "@/context/LocaleContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (transaction: FinanceTransaction) => void;
};

const CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "seeds", label: "Seeds" },
  { value: "pesticides", label: "Pesticides" },
  { value: "fertilizer", label: "Fertilizer" },
  { value: "equipment", label: "Equipment" },
  { value: "labor", label: "Labor" },
  { value: "transport", label: "Transport" },
  { value: "sales", label: "Sales" },
];

export default function TransactionManager({ isOpen, onClose, onSaved }: Props) {
  const { t } = useLocale();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("general");
  const [note, setNote] = useState("");
  const [target, setTarget] = useState<"none" | "farmland" | "employee">("none");
  const [farmlandId, setFarmlandId] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [farmlands, setFarmlands] = useState<Farmland[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    async function load() {
      try {
        setLoadingLists(true);
        const [employeeList, farmlandList] = await Promise.all([api.getEmployees(), api.getFarmlands()]);
        setEmployees(employeeList);
        setFarmlands(farmlandList);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load related data";
        setError(message);
      } finally {
        setLoadingLists(false);
      }
    }
    load();
  }, [isOpen]);

  const canSave = useMemo(() => {
    const amt = Number(amount);
    return !Number.isNaN(amt) && amt > 0 && !!date && category.length > 0;
  }, [amount, date, category]);

  function reset() {
    setType("expense");
    setAmount("");
    setDate("");
    setCategory("general");
    setNote("");
    setTarget("none");
    setFarmlandId("");
    setEmployeeId("");
    setError(null);
  }

  async function save() {
    if (!canSave || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const created = await api.createTransaction({
        type,
        amountRwf: Math.round(Number(amount)),
        date,
        category,
        note: note.trim() || undefined,
        farmlandId: target === "farmland" ? farmlandId || undefined : undefined,
        employeeId: target === "employee" ? employeeId || undefined : undefined,
      });
      onSaved?.(created);
      reset();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save transaction";
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
          <h3 className="text-lg font-semibold text-gray-800">{t("transactions.addTitle")}</h3>
          <button aria-label="Close" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <Input
            id="tx-type"
            label={t("transactions.typeLabel")}
            variant="select"
            value={type}
            onChange={(v) => setType(v as "income" | "expense")}
            options={[
              { value: "expense", label: t("transactions.typeExpense") },
              { value: "income", label: t("transactions.typeIncome") },
            ]}
          />
          <Input id="tx-amount" label="Amount (RWF)" variant="number" value={amount} onChange={setAmount} placeholder="10000" />
          <Input id="tx-date" label="Date" variant="date" value={date} onChange={setDate} />
          <div className="md:col-span-3">
            <Input id="tx-category" label="Category" variant="select" value={category} onChange={setCategory} options={CATEGORY_OPTIONS} />
          </div>
          <div className="md:col-span-3">
            <Input id="tx-note" label="Note" value={note} onChange={setNote} placeholder="Details (optional)" />
          </div>
        </div>

          <div className="flex flex-col gap-2 mb-3">
          <label className="text-gray-900 font-medium">{t("transactions.assignTo")}</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tx-target"
                checked={target === "none"}
                onChange={() => {
                  setTarget("none");
                  setFarmlandId("");
                  setEmployeeId("");
                }}
              />
              <span className="text-gray-700">{t("transactions.assign.none")}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tx-target"
                checked={target === "farmland"}
                onChange={() => {
                  setTarget("farmland");
                  setEmployeeId("");
                }}
              />
                <span className="text-gray-700">{t("transactions.assign.farmland")}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tx-target"
                checked={target === "employee"}
                onChange={() => {
                  setTarget("employee");
                  setFarmlandId("");
                }}
              />
                <span className="text-gray-700">{t("transactions.assign.employee")}</span>
            </label>
          </div>
        </div>

        {target === "farmland" && (
          <div className="max-h-40 overflow-auto pr-2 space-y-2 mb-4">
            {loadingLists ? (
              <div className="text-gray-500 text-sm">{t("farmlands.loading")}</div>
            ) : farmlands.length === 0 ? (
              <div className="text-gray-500 text-sm">{t("farmlands.noFarmlands")}</div>
            ) : (
              farmlands.map((f) => (
                <label key={f.id} className="flex items-center gap-2">
                  <input type="radio" name="tx-farmland" checked={farmlandId === f.id} onChange={() => setFarmlandId(f.id)} />
                  <span className="text-gray-700">{f.name}</span>
                </label>
              ))
            )}
          </div>
        )}

        {target === "employee" && (
          <div className="max-h-40 overflow-auto pr-2 space-y-2 mb-4">
            {loadingLists ? (
              <div className="text-gray-500 text-sm">{t("employees.loading")}</div>
            ) : employees.length === 0 ? (
              <div className="text-gray-500 text-sm">{t("employees.noEmployees")}</div>
            ) : (
              employees.map((e) => (
                <label key={e.id} className="flex items-center gap-2">
                  <input type="radio" name="tx-employee" checked={employeeId === e.id} onChange={() => setEmployeeId(e.id)} />
                  <span className="text-gray-700">
                    {e.fullName} ({e.role})
                  </span>
                </label>
              ))
            )}
          </div>
        )}

        {error && <div className="text-sm text-red-600 mb-4">{error}</div>}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t("buttons.cancel")}
          </Button>
          <Button onClick={save} disabled={!canSave || submitting}>
            {submitting ? t("buttons.saving") : t("buttons.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}

