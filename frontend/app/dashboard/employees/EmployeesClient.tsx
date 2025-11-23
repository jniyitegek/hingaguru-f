"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2, UserPlus } from "lucide-react";
import Nav from "@/components/common/Nav";
import AuthNav from "@/components/common/AuthNav";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import EmployeesManager from "@/components/sections/employees/EmployeesManager.client";
import { api, type Employee } from "@/lib/api";

export default function EmployeesClient() {
  const [isOpen, setIsOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((employee) => {
      return (
        employee.fullName.toLowerCase().includes(q) ||
        employee.role.toLowerCase().includes(q) ||
        employee.phone.toLowerCase().includes(q) ||
        employee.status.replace("_", " ").toLowerCase().includes(q)
      );
    });
  }, [employees, query]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const list = await api.getEmployees();
        setEmployees(list);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load employees";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleDelete(id: string) {
    try {
      await api.deleteEmployee(id);
      setEmployees((prev) => prev.filter((employee) => employee.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete employee";
      setError(message);
    }
  }

  function handleCreated(employee: Employee) {
    setEmployees((prev) => [employee, ...prev]);
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Nav />
      <main className="flex-1 overflow-auto">
        <AuthNav />
        <div className="p-8">
          <div className="flex items-start justify-between mb-8 text-black">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Employees</h1>
              <p className="text-gray-500">Manage your workforce</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-72">
                <Input id="search-employees" placeholder="Search by name, role, phone, status" value={query} onChange={setQuery} />
              </div>
              <Button onClick={() => setIsOpen(true)}>
                <UserPlus className="mr-2" /> Add Employee
              </Button>
            </div>
          </div>

          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="grid grid-cols-12 bg-gray-50 text-gray-600 text-sm font-medium px-6 py-3 rounded-t-xl">
              <div className="col-span-4">Full name</div>
              <div className="col-span-3">Role</div>
              <div className="col-span-2">Phone</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            {loading ? (
              <div className="px-6 py-8 text-gray-500 text-sm">Loading employees…</div>
            ) : filtered.length === 0 ? (
              <div className="px-6 py-8 text-gray-500 text-sm">
                {employees.length === 0 ? "No employees yet." : "No employees match your search."}
              </div>
            ) : (
              filtered.map((emp) => (
                <div key={emp.id} className="grid grid-cols-12 items-center px-6 py-4 border-t">
                  <div className="col-span-4 text-gray-800">{emp.fullName}</div>
                  <div className="col-span-3 text-gray-700">{emp.role}</div>
                  <div className="col-span-2 text-gray-700">{emp.phone}</div>
                  <div className="col-span-2 capitalize text-gray-700">
                    {emp.status.replace("_", " ")}
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      className="inline-flex items-center text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(emp.id)}
                      aria-label={`Delete ${emp.fullName}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <EmployeesManager isOpen={isOpen} onClose={() => setIsOpen(false)} onCreated={handleCreated} />
      </main>
    </div>
  );
}

