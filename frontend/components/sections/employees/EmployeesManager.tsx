"use client";

import React, { useEffect, useMemo, useState } from \"react\";
import Input from \"@/components/ui/Input\";
import { Button } from \"@/components/ui/button\";
import { Trash2, X } from \"lucide-react\";

type Employee = {
\tid: string;
\tfullName: string;
\trole: string;
\tphone: string;
};

type EmployeesManagerProps = {
\tisOpen: boolean;
\tonClose: () => void;
};

const STORAGE_KEY = \"hingaguru_employees\";

export default function EmployeesManager({ isOpen, onClose }: EmployeesManagerProps) {
\tconst [employees, setEmployees] = useState<Employee[]>([]);
\tconst [fullName, setFullName] = useState(\"\");
\tconst [role, setRole] = useState(\"\");
\tconst [phone, setPhone] = useState(\"\");

\tuseEffect(() => {
\t\ttry {
\t\t\tconst raw = localStorage.getItem(STORAGE_KEY);
\t\t\tif (raw) {
\t\t\t\tsetEmployees(JSON.parse(raw));
\t\t\t}
\t\t} catch {
\t\t\t// ignore
\t\t}
\t}, []);

\tuseEffect(() => {
\t\ttry {
\t\t\tlocalStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
\t\t} catch {
\t\t\t// ignore
\t\t}
\t}, [employees]);

\tconst isValid = useMemo(() => {
\t\treturn fullName.trim().length > 1 && role.trim().length > 1 && phone.trim().length >= 7;
\t}, [fullName, role, phone]);

\tfunction resetForm() {
\t\tsetFullName(\"\");
\t\tsetRole(\"\");
\t\tsetPhone(\"\");
\t}

\tfunction handleAdd() {
\t\tif (!isValid) return;
\t\tconst newEmployee: Employee = {
\t\t\tid: crypto.randomUUID(),
\t\t\tfullName: fullName.trim(),
\t\t\trole: role.trim(),
\t\t\tphone: phone.trim(),
\t\t};
\t\tsetEmployees(prev => [newEmployee, ...prev]);
\t\tresetForm();
\t}

\tfunction handleDelete(id: string) {
\t\tsetEmployees(prev => prev.filter(e => e.id !== id));
\t}

\tif (!isOpen) return null;

\treturn (
\t\t<div className=\"fixed inset-0 z-50 flex items-center justify-center\">
\t\t\t<div className=\"absolute inset-0 bg-black/40\" onClick={onClose} />
\t\t\t<div className=\"relative z-10 w-full max-w-2xl bg-white rounded-xl border border-gray-200 p-6 shadow-lg\">
\t\t\t\t<div className=\"flex items-center justify-between mb-4\">
\t\t\t\t\t<h3 className=\"text-lg font-semibold text-gray-800\">Manage Employees</h3>
\t\t\t\t\t<button aria-label=\"Close\" onClick={onClose} className=\"text-gray-500 hover:text-gray-700\">
\t\t\t\t\t\t<X />
\t\t\t\t\t</button>
\t\t\t\t</div>
\t\t\t\t<div className=\"grid grid-cols-1 md:grid-cols-3 gap-3 mb-4\">
\t\t\t\t\t<Input id=\"employee-fullname\" label=\"Full name\" value={fullName} onChange={setFullName} placeholder=\"Jane Doe\" />
\t\t\t\t\t<Input id=\"employee-role\" label=\"Role\" value={role} onChange={setRole} placeholder=\"Field Supervisor\" />
\t\t\t\t\t<Input id=\"employee-phone\" label=\"Phone\" value={phone} onChange={setPhone} placeholder=\"+250 7xx xxx xxx\" />
\t\t\t\t</div>
\t\t\t\t<div className=\"flex justify-end mb-6\">
\t\t\t\t\t<Button onClick={handleAdd} disabled={!isValid}>Add Employee</Button>
\t\t\t\t</div>
\t\t\t\t<div className=\"border rounded-lg overflow-hidden\">
\t\t\t\t\t<div className=\"grid grid-cols-12 bg-gray-50 text-gray-600 text-sm font-medium px-4 py-2\">
\t\t\t\t\t\t<div className=\"col-span-5\">Full name</div>
\t\t\t\t\t\t<div className=\"col-span-4\">Role</div>
\t\t\t\t\t\t<div className=\"col-span-2\">Phone</div>
\t\t\t\t\t\t<div className=\"col-span-1 text-right\">Actions</div>
\t\t\t\t\t</div>
\t\t\t\t\t{employees.length === 0 && (
\t\t\t\t\t\t<div className=\"px-4 py-6 text-gray-500 text-sm\">No employees yet. Add your first one above.</div>
\t\t\t\t\t)}
\t\t\t\t\t{employees.map(emp => (
\t\t\t\t\t\t<div key={emp.id} className=\"grid grid-cols-12 items-center px-4 py-3 border-t\">
\t\t\t\t\t\t\t<div className=\"col-span-5 text-gray-800\">{emp.fullName}</div>
\t\t\t\t\t\t\t<div className=\"col-span-4 text-gray-700\">{emp.role}</div>
\t\t\t\t\t\t\t<div className=\"col-span-2 text-gray-700\">{emp.phone}</div>
\t\t\t\t\t\t\t<div className=\"col-span-1 text-right\">
\t\t\t\t\t\t\t\t<button
\t\t\t\t\t\t\t\t\tclassName=\"inline-flex items-center text-red-600 hover:text-red-700\"
\t\t\t\t\t\t\t\t\tonClick={() => handleDelete(emp.id)}
\t\t\t\t\t\t\t\t\taria-label={`Delete ${emp.fullName}`}
\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t<Trash2 size={18} />
\t\t\t\t\t\t\t\t</button>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t))}
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t);
}


