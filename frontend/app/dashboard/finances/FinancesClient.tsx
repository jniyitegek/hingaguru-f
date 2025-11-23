"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Eye, Filter, Plus } from "lucide-react";
import Nav from "@/components/common/Nav";
import AuthNav from "@/components/common/AuthNav";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input";
import TransactionManager from "@/components/sections/finances/TransactionManager.client";
import { api, type Employee, type Farmland, type FinanceTransaction } from "@/lib/api";

const currency = new Intl.NumberFormat("en-UG", {
  style: "currency",
  currency: "RWF",
  maximumFractionDigits: 0,
});

export default function FinancesClient() {
  const [showAdd, setShowAdd] = useState(false);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [farmlands, setFarmlands] = useState<Farmland[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showOnlyExpenses, setShowOnlyExpenses] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [farmlandFilter, setFarmlandFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [txList, employeeList, farmlandList] = await Promise.all([
        api.getTransactions(),
        api.getEmployees(),
        api.getFarmlands(),
      ]);
      setTransactions(txList);
      setEmployees(employeeList);
      setFarmlands(farmlandList);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load finances data";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const income = useMemo(
    () => transactions.filter((t) => t.type === "income").reduce((sum, tx) => sum + tx.amountRwf, 0),
    [transactions],
  );
  const expenses = useMemo(
    () => transactions.filter((t) => t.type === "expense").reduce((sum, tx) => sum + tx.amountRwf, 0),
    [transactions],
  );
  const balance = useMemo(() => income - expenses, [income, expenses]);

  const categories = useMemo(() => {
    const set = new Set<string>(["all"]);
    transactions.forEach((t) => set.add(t.category));
    return Array.from(set);
  }, [transactions]);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (showOnlyExpenses) list = list.filter((t) => t.type === "expense");
    if (typeFilter !== "all") list = list.filter((t) => t.type === typeFilter);
    if (categoryFilter !== "all") list = list.filter((t) => t.category === categoryFilter);
    if (farmlandFilter !== "all") list = list.filter((t) => t.farmlandId === farmlandFilter);
    if (employeeFilter !== "all") list = list.filter((t) => t.employeeId === employeeFilter);
    if (fromDate) list = list.filter((t) => t.date.slice(0, 10) >= fromDate);
    if (toDate) list = list.filter((t) => t.date.slice(0, 10) <= toDate);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((t) => {
        const employee = employees.find((e) => e.id === t.employeeId);
        const farmland = farmlands.find((f) => f.id === t.farmlandId);
        return (
          t.category.toLowerCase().includes(q) ||
          (t.note?.toLowerCase().includes(q) ?? false) ||
          (employee ? `${employee.fullName} ${employee.role}`.toLowerCase().includes(q) : false) ||
          (farmland ? farmland.name.toLowerCase().includes(q) : false)
        );
      });
    }
    list.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    return list;
  }, [
    transactions,
    showOnlyExpenses,
    typeFilter,
    categoryFilter,
    farmlandFilter,
    employeeFilter,
    fromDate,
    toDate,
    search,
    employees,
    farmlands,
  ]);

  async function deleteTx(id: string) {
    try {
      await api.deleteTransaction(id);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete transaction";
      setError(message);
    }
  }

  function handleSaved(tx: FinanceTransaction) {
    setTransactions((prev) => [tx, ...prev]);
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
              <Button onClick={() => setShowOnlyExpenses((s) => !s)} variant="outline">
                <Filter className="mr-2" /> {showOnlyExpenses ? "Show All" : "View Expenses"}
              </Button>
              <Button onClick={() => setShowAdd(true)}>
                <Plus className="mr-2" /> Add Transaction
              </Button>
            </div>
          </div>

          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 flex items-center gap-3">
              <ArrowUpCircle className="text-green-600" />
              <div>
                <div className="text-sm text-gray-500">Total Income</div>
                <div className="text-2xl font-semibold text-gray-800">{currency.format(income)}</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 flex items-center gap-3">
              <ArrowDownCircle className="text-red-500" />
              <div>
                <div className="text-sm text-gray-500">Total Expenses</div>
                <div className="text-2xl font-semibold text-gray-800">{currency.format(expenses)}</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 flex items-center gap-3">
              <Eye className="text-gray-700" />
              <div>
                <div className="text-sm text-gray-500">Balance</div>
                <div className={`text-2xl font-semibold ${balance >= 0 ? "text-green-700" : "text-red-600"}`}>
                  {currency.format(balance)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-end">
              <Input
                id="f-type"
                label="Type"
                variant="select"
                value={typeFilter}
                onChange={setTypeFilter}
                options={[
                  { value: "all", label: "All" },
                  { value: "income", label: "Income" },
                  { value: "expense", label: "Expenses" },
                ]}
              />
              <Input
                id="f-category"
                label="Category"
                variant="select"
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={[
                  { value: "all", label: "All" },
                  ...categories
                    .filter((c) => c !== "all")
                    .map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) })),
                ]}
              />
              <Input
                id="f-farmland"
                label="Farmland"
                variant="select"
                value={farmlandFilter}
                onChange={setFarmlandFilter}
                options={[
                  { value: "all", label: "All" },
                  ...farmlands.map((f) => ({ value: f.id, label: f.name })),
                ]}
              />
              <Input
                id="f-employee"
                label="Employee"
                variant="select"
                value={employeeFilter}
                onChange={setEmployeeFilter}
                options={[
                  { value: "all", label: "All" },
                  ...employees.map((e) => ({ value: e.id, label: `${e.fullName} (${e.role})` })),
                ]}
              />
              <Input id="f-from" label="From" variant="date" value={fromDate} onChange={setFromDate} />
              <Input id="f-to" label="To" variant="date" value={toDate} onChange={setToDate} />
              <Input
                id="search-finances"
                label="Search"
                value={search}
                onChange={setSearch}
                placeholder="Category, note, assignee..."
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="grid grid-cols-12 bg-gray-50 text-gray-600 text-sm font-medium px-6 py-3 rounded-t-xl">
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-3">Assigned</div>
              <div className="col-span-2 text-right">Amount (RWF)</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            {loading ? (
              <div className="px-6 py-8 text-gray-500 text-sm">Loading transactions…</div>
            ) : filtered.length === 0 ? (
              <div className="px-6 py-8 text-gray-500 text-sm">
                {transactions.length === 0 ? "No transactions yet." : "No transactions match your filters/search."}
              </div>
            ) : (
              filtered.map((tx) => {
                const employee = employees.find((e) => e.id === tx.employeeId);
                const farmland = farmlands.find((f) => f.id === tx.farmlandId);
                return (
                  <div key={tx.id} className="grid grid-cols-12 items-center px-6 py-4 border-t">
                    <div className="col-span-2 text-gray-700">{tx.date.slice(0, 10)}</div>
                    <div className="col-span-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          tx.type === "income" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}
                      >
                        {tx.type === "income" ? "Income" : "Expense"}
                      </span>
                    </div>
                    <div className="col-span-2 text-gray-700 capitalize">{tx.category}</div>
                    <div className="col-span-3 text-gray-700">
                      {farmland ? `Farmland: ${farmland.name}` : employee ? `Employee: ${employee.fullName}` : "-"}
                    </div>
                    <div className="col-span-2 text-right font-medium text-gray-800">
                      {tx.amountRwf.toLocaleString()}
                    </div>
                    <div className="col-span-1 text-right">
                      <button className="text-red-600 hover:text-red-700" onClick={() => deleteTx(tx.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <TransactionManager
          isOpen={showAdd}
          onClose={() => setShowAdd(false)}
          onSaved={(tx) => {
            handleSaved(tx);
            setShowAdd(false);
          }}
        />
      </main>
    </div>
  );
}

