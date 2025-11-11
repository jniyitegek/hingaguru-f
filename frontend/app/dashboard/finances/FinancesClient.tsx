"use client";

import Nav from "@/components/common/Nav";
import AuthNav from "@/components/common/AuthNav";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input";
import TransactionManager, { FinanceTx } from "@/components/sections/finances/TransactionManager.client";
import { ArrowDownCircle, ArrowUpCircle, Eye, Plus, Filter, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Employee = { id: string; fullName: string; role: string };
type Farmland = { id: string; name: string };

const TX_STORAGE = "hingaguru_transactions";
const EMP_STORAGE = "hingaguru_employees";
const FARM_STORAGE = "hingaguru_farmlands";

export default function FinancesClient() {
  const [showAdd, setShowAdd] = useState(false);
  const [transactions, setTransactions] = useState<FinanceTx[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [farmlands, setFarmlands] = useState<Farmland[]>([]);

  // Filters
  const [showOnlyExpenses, setShowOnlyExpenses] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [farmlandFilter, setFarmlandFilter] = useState<string>("all");
  const [employeeFilter, setEmployeeFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  function loadAll() {
    try {
      const raw = localStorage.getItem(TX_STORAGE);
      setTransactions(raw ? JSON.parse(raw) : []);
    } catch { setTransactions([]); }
    try {
      const rawE = localStorage.getItem(EMP_STORAGE);
      setEmployees(rawE ? JSON.parse(rawE) : []);
    } catch { setEmployees([]); }
    try {
      const rawF = localStorage.getItem(FARM_STORAGE);
      const parsed = rawF ? JSON.parse(rawF) : [];
      setFarmlands(parsed.map((f: any) => ({ id: f.id, name: f.name })));
    } catch { setFarmlands([]); }
  }

  useEffect(() => {
    loadAll();
    const handler = () => loadAll();
    window.addEventListener("transactions:updated", handler as EventListener);
    return () => window.removeEventListener("transactions:updated", handler as EventListener);
  }, []);

  const income = useMemo(() => transactions.filter(t => t.type === "income").reduce((a, b) => a + b.amountRwf, 0), [transactions]);
  const expenses = useMemo(() => transactions.filter(t => t.type === "expense").reduce((a, b) => a + b.amountRwf, 0), [transactions]);
  const balance = useMemo(() => income - expenses, [income, expenses]);

  const categories = useMemo(() => {
    const set = new Set<string>(["all"]);
    transactions.forEach(t => set.add(t.category));
    return Array.from(set);
  }, [transactions]);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (showOnlyExpenses) list = list.filter(t => t.type === "expense");
    if (typeFilter !== "all") list = list.filter(t => t.type === typeFilter);
    if (categoryFilter !== "all") list = list.filter(t => t.category === categoryFilter);
    if (farmlandFilter !== "all") list = list.filter(t => t.farmlandId === farmlandFilter);
    if (employeeFilter !== "all") list = list.filter(t => t.employeeId === employeeFilter);
    if (fromDate) list = list.filter(t => t.date >= fromDate);
    if (toDate) list = list.filter(t => t.date <= toDate);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(t => {
        const employee = employees.find(e => e.id === t.employeeId);
        const farmland = farmlands.find(f => f.id === t.farmlandId);
        return (
          t.category.toLowerCase().includes(q) ||
          (t.note?.toLowerCase().includes(q) ?? false) ||
          (employee ? `${employee.fullName} ${employee.role}`.toLowerCase().includes(q) : false) ||
          (farmland ? farmland.name.toLowerCase().includes(q) : false)
        );
      });
    }
    // sort by date desc
    list.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    return list;
  }, [transactions, showOnlyExpenses, typeFilter, categoryFilter, farmlandFilter, employeeFilter, fromDate, toDate, search, employees, farmlands]);

  function deleteTx(id: string) {
    const next = transactions.filter(t => t.id !== id);
    setTransactions(next);
    try {
      localStorage.setItem(TX_STORAGE, JSON.stringify(next));
      window.dispatchEvent(new Event("transactions:updated"));
    } catch {}
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Nav />
      <main className="flex-1 overflow-auto">
        <AuthNav />
        <div className="p-8">
          <div className="flex items-start justify-between mb-8 text-black">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Finances</h1>
              <p className="text-gray-500">Track income and expenses</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowOnlyExpenses(s => !s)} variant="outline">
                <Filter className="mr-2" /> {showOnlyExpenses ? "Show All" : "View Expenses"}
              </Button>
              <Button onClick={() => setShowAdd(true)}>
                <Plus className="mr-2" /> Add Transaction
              </Button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 flex items-center gap-3">
              <ArrowUpCircle className="text-green-600" />
              <div>
                <div className="text-sm text-gray-500">Total Income</div>
                <div className="text-2xl font-semibold text-gray-800">{income.toLocaleString()} RWF</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 flex items-center gap-3">
              <ArrowDownCircle className="text-red-500" />
              <div>
                <div className="text-sm text-gray-500">Total Expenses</div>
                <div className="text-2xl font-semibold text-gray-800">{expenses.toLocaleString()} RWF</div>
              </div>
            </div>
            <div className={`bg-white rounded-xl p-6 border border-gray-200 flex items-center gap-3`}>
              <Eye className="text-gray-700" />
              <div>
                <div className="text-sm text-gray-500">Balance</div>
                <div className={`text-2xl font-semibold ${balance >= 0 ? "text-green-700" : "text-red-600"}`}>{balance.toLocaleString()} RWF</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-end">
              <Input id="f-type" label="Type" variant="select" value={typeFilter} onChange={setTypeFilter} options={[
                { value: "all", label: "All" },
                { value: "income", label: "Income" },
                { value: "expense", label: "Expenses" },
              ]} />
              <Input id="f-category" label="Category" variant="select" value={categoryFilter} onChange={setCategoryFilter} options={[
                { value: "all", label: "All" },
                ...categories.filter(c => c !== "all").map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) })),
              ]} />
              <Input id="f-farmland" label="Farmland" variant="select" value={farmlandFilter} onChange={setFarmlandFilter} options={[
                { value: "all", label: "All" },
                ...farmlands.map(f => ({ value: f.id, label: f.name })),
              ]} />
              <Input id="f-employee" label="Employee" variant="select" value={employeeFilter} onChange={setEmployeeFilter} options={[
                { value: "all", label: "All" },
                ...employees.map(e => ({ value: e.id, label: `${e.fullName} (${e.role})` })),
              ]} />
              <Input id="f-from" label="From" variant="date" value={fromDate} onChange={setFromDate} />
              <Input id="f-to" label="To" variant="date" value={toDate} onChange={setToDate} />
              <Input id="search-finances" label="Search" value={search} onChange={setSearch} placeholder="Category, note, assignee..." />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="grid grid-cols-12 bg-gray-50 text-gray-600 text-sm font-medium px-6 py-3 rounded-t-xl">
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-3">Assigned</div>
              <div className="col-span-2 text-right">Amount (RWF)</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            {filtered.length === 0 ? (
              <div className="px-6 py-8 text-gray-500 text-sm">{transactions.length === 0 ? "No transactions yet." : "No transactions match your filters/search."}</div>
            ) : (
              filtered.map(tx => {
                const employee = employees.find(e => e.id === tx.employeeId);
                const farmland = farmlands.find(f => f.id === tx.farmlandId);
                return (
                  <div key={tx.id} className="grid grid-cols-12 items-center px-6 py-4 border-t">
                    <div className="col-span-2 text-gray-700">{tx.date}</div>
                    <div className="col-span-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${tx.type === "income" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                        {tx.type === "income" ? "Income" : "Expense"}
                      </span>
                    </div>
                    <div className="col-span-2 text-gray-700 capitalize">{tx.category}</div>
                    <div className="col-span-3 text-gray-700">
                      {farmland ? `Farmland: ${farmland.name}` : employee ? `Employee: ${employee.fullName}` : "-"}
                    </div>
                    <div className="col-span-2 text-right font-medium text-gray-800">{tx.amountRwf.toLocaleString()}</div>
                    <div className="col-span-1 text-right">
                      <button className="text-red-600 hover:text-red-700" onClick={() => deleteTx(tx.id)}>Delete</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <TransactionManager isOpen={showAdd} onClose={() => setShowAdd(false)} />
      </main>
    </div>
  );
}


