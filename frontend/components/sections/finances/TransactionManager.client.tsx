"use client";

import { useEffect, useMemo, useState } from "react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type Employee = { id: string; fullName: string; role: string; phone: string };
type Farmland = { id: string; name: string };

export type FinanceTx = {
  id: string;
  type: "income" | "expense";
  amountRwf: number;
  date: string; // yyyy-mm-dd
  category: string;
  farmlandId?: string;
  employeeId?: string;
  note?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const EMP_STORAGE = "hingaguru_employees";
const FARM_STORAGE = "hingaguru_farmlands";
const TX_STORAGE = "hingaguru_transactions";

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

export default function TransactionManager({ isOpen, onClose }: Props) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [category, setCategory] = useState<string>("general");
  const [note, setNote] = useState<string>("");
  const [target, setTarget] = useState<"none" | "farmland" | "employee">("none");
  const [farmlandId, setFarmlandId] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");

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

  const canSave = useMemo(() => {
    const amt = Number(amount);
    return !Number.isNaN(amt) && amt > 0 && !!date;
  }, [amount, date]);

  function reset() {
    setType("expense");
    setAmount("");
    setDate("");
    setCategory("general");
    setNote("");
    setTarget("none");
    setFarmlandId("");
    setEmployeeId("");
  }

  function save() {
    if (!canSave) return;
    const record: FinanceTx = {
      id: crypto.randomUUID(),
      type,
      amountRwf: Math.round(Number(amount)),
      date,
      category,
      note: note.trim() || undefined,
      farmlandId: target === "farmland" ? farmlandId || undefined : undefined,
      employeeId: target === "employee" ? employeeId || undefined : undefined,
    };
    try {
      const raw = localStorage.getItem(TX_STORAGE);
      const list = raw ? JSON.parse(raw) : [];
      const next = [record, ...list];
      localStorage.setItem(TX_STORAGE, JSON.stringify(next));
      window.dispatchEvent(new Event("transactions:updated"));
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
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Add Transaction</h3>
          <button aria-label="Close" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <Input id="tx-type" label="Type" variant="select" value={type} onChange={(v) => setType(v as "income" | "expense")} options={[{ value: "expense", label: "Expense" }, { value: "income", label: "Income" }]} />
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
          <label className="text-gray-900 font-medium">Assign to</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="tx-target" checked={target === "none"} onChange={() => { setTarget("none"); setFarmlandId(""); setEmployeeId(""); }} />
              <span className="text-gray-700">None</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="tx-target" checked={target === "farmland"} onChange={() => { setTarget("farmland"); setEmployeeId(""); }} />
              <span className="text-gray-700">Farmland</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="tx-target" checked={target === "employee"} onChange={() => { setTarget("employee"); setFarmlandId(""); }} />
              <span className="text-gray-700">Employee</span>
            </label>
          </div>
        </div>

        {target === "farmland" && (
          <div className="max-h-40 overflow-auto pr-2 space-y-2 mb-4">
            {farmlands.length === 0 && <div className="text-gray-500 text-sm">No farmlands.</div>}
            {farmlands.map(f => (
              <label key={f.id} className="flex items-center gap-2">
                <input type="radio" name="tx-farmland" checked={farmlandId === f.id} onChange={() => setFarmlandId(f.id)} />
                <span className="text-gray-700">{f.name}</span>
              </label>
            ))}
          </div>
        )}

        {target === "employee" && (
          <div className="max-h-40 overflow-auto pr-2 space-y-2 mb-4">
            {employees.length === 0 && <div className="text-gray-500 text-sm">No employees.</div>}
            {employees.map(e => (
              <label key={e.id} className="flex items-center gap-2">
                <input type="radio" name="tx-employee" checked={employeeId === e.id} onChange={() => setEmployeeId(e.id)} />
                <span className="text-gray-700">{e.fullName} ({e.role})</span>
              </label>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={!canSave}>Save</Button>
        </div>
      </div>
    </div>
  );
}


