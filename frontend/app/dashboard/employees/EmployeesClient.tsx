"use client";

import Nav from "@/components/common/Nav";
import AuthNav from "@/components/common/AuthNav";
import { Button } from "@/components/ui/button";
import EmployeesManager from "@/components/sections/employees/EmployeesManager.client";
import { useEffect, useState } from "react";
import { Trash2, UserPlus } from "lucide-react";
import Input from "@/components/ui/Input";

type Employee = {
  id: string;
  fullName: string;
  role: string;
  phone: string;
};

const STORAGE_KEY = "hingaguru_employees";

export default function EmployeesClient() {
  const [isOpen, setIsOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [query, setQuery] = useState<string>("");

  function loadEmployees() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setEmployees(raw ? JSON.parse(raw) : []);
    } catch {
      setEmployees([]);
    }
  }

  useEffect(() => {
    loadEmployees();
    const handler = () => loadEmployees();
    window.addEventListener("employees:updated", handler as EventListener);
    return () => window.removeEventListener("employees:updated", handler as EventListener);
  }, []);

  function saveEmployees(next: Employee[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("employees:updated"));
    } catch {
      // ignore
    }
  }

  function handleDelete(id: string) {
    const next = employees.filter(e => e.id !== id);
    setEmployees(next);
    saveEmployees(next);
  }

  const filtered = employees.filter(e => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      e.fullName.toLowerCase().includes(q) ||
      e.role.toLowerCase().includes(q) ||
      e.phone.toLowerCase().includes(q)
    );
  });

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
                <Input id="search-employees" placeholder="Search by name, role, phone" value={query} onChange={setQuery} />
              </div>
              <Button onClick={() => setIsOpen(true)}>
                <UserPlus className="mr-2" /> Add Employee
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="grid grid-cols-12 bg-gray-50 text-gray-600 text-sm font-medium px-6 py-3 rounded-t-xl">
              <div className="col-span-5">Full name</div>
              <div className="col-span-4">Role</div>
              <div className="col-span-2">Phone</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            {filtered.length === 0 ? (
              <div className="px-6 py-8 text-gray-500 text-sm">{employees.length === 0 ? "No employees yet." : "No employees match your search."}</div>
            ) : (
              filtered.map(emp => (
                <div key={emp.id} className="grid grid-cols-12 items-center px-6 py-4 border-t">
                  <div className="col-span-5 text-gray-800">{emp.fullName}</div>
                  <div className="col-span-4 text-gray-700">{emp.role}</div>
                  <div className="col-span-2 text-gray-700">{emp.phone}</div>
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
        <EmployeesManager isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </main>
    </div>
  );
}


