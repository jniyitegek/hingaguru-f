"use client";

import React, { useEffect, useMemo, useState } from "react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type Employee = {
	id: string;
	fullName: string;
	role: string;
	phone: string;
};

type EmployeesManagerProps = {
	isOpen: boolean;
	onClose: () => void;
};

const STORAGE_KEY = "hingaguru_employees";

export default function EmployeesManager({ isOpen, onClose }: EmployeesManagerProps) {
	const [fullName, setFullName] = useState("");
	const [role, setRole] = useState("");
	const [phone, setPhone] = useState("");

	const isValid = useMemo(() => {
		return fullName.trim().length > 1 && role.trim().length > 1 && phone.trim().length >= 7;
	}, [fullName, role, phone]);

	function resetForm() {
		setFullName("");
		setRole("");
		setPhone("");
	}

	function handleAdd() {
		if (!isValid) return;
		const newEmployee: Employee = {
			id: crypto.randomUUID(),
			fullName: fullName.trim(),
			role: role.trim(),
			phone: phone.trim(),
		};
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			const current: Employee[] = raw ? JSON.parse(raw) : [];
			const next = [newEmployee, ...current];
			localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
			// notify listeners (Employees page) to reload
			window.dispatchEvent(new Event("employees:updated"));
		} catch {
			// ignore
		}
		resetForm();
		onClose();
	}

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/40" onClick={onClose} />
			<div className="relative z-10 w-full max-w-2xl bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold text-gray-800">Manage Employees</h3>
					<button aria-label="Close" onClick={onClose} className="text-gray-500 hover:text-gray-700">
						<X />
					</button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
					<Input id="employee-fullname" label="Full name" value={fullName} onChange={setFullName} placeholder="Jane Doe" />
					<Input id="employee-role" label="Role" value={role} onChange={setRole} placeholder="Field Supervisor" />
					<Input id="employee-phone" label="Phone" value={phone} onChange={setPhone} placeholder="+250 7xx xxx xxx" />
				</div>
				<div className="flex justify-end">
					<Button onClick={handleAdd} disabled={!isValid}>Add Employee</Button>
				</div>
			</div>
		</div>
	);
}


