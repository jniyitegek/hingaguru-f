"use client";

import React, { useMemo, useState } from "react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { api, type Employee, type EmployeeStatus } from "@/lib/api";

type EmployeesManagerProps = {
	isOpen: boolean;
	onClose: () => void;
	onCreated?: (employee: Employee) => void;
};

const STATUS_OPTIONS: Array<{ value: EmployeeStatus; label: string }> = [
	{ value: "active", label: "Active" },
	{ value: "on_leave", label: "On Leave" },
	{ value: "inactive", label: "Inactive" },
];

export default function EmployeesManager({ isOpen, onClose, onCreated }: EmployeesManagerProps) {
	const [fullName, setFullName] = useState("");
	const [role, setRole] = useState("");
	const [phone, setPhone] = useState("");
	const [status, setStatus] = useState<EmployeeStatus>("active");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isValid = useMemo(() => {
		return fullName.trim().length > 1 && role.trim().length > 1 && phone.trim().length >= 7;
	}, [fullName, role, phone]);

	function resetForm() {
		setFullName("");
		setRole("");
		setPhone("");
		setStatus("active");
		setError(null);
	}

	async function handleAdd() {
		if (!isValid || submitting) return;
		setSubmitting(true);
		setError(null);

		try {
			const created = await api.createEmployee({
				fullName: fullName.trim(),
				role: role.trim(),
				phone: phone.trim(),
				status,
			});
			onCreated?.(created);
			resetForm();
			onClose();
		} catch (err) {
			const message = err instanceof Error ? err.message : "Failed to create employee";
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
					<h3 className="text-lg font-semibold text-gray-800">Manage Employees</h3>
					<button aria-label="Close" onClick={onClose} className="text-gray-500 hover:text-gray-700">
						<X />
					</button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
					<Input id="employee-fullname" label="Full name" value={fullName} onChange={setFullName} placeholder="Jane Doe" />
					<Input id="employee-role" label="Role" value={role} onChange={setRole} placeholder="Field Supervisor" />
					<Input id="employee-phone" label="Phone" value={phone} onChange={setPhone} placeholder="+250 7xx xxx xxx" />
					<Input
						id="employee-status"
						label="Status"
						variant="select"
						value={status}
						onChange={(value) => setStatus(value as EmployeeStatus)}
						options={STATUS_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
					/>
				</div>
				{error && <div className="text-sm text-red-600 mb-4">{error}</div>}
				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={onClose}>Cancel</Button>
					<Button onClick={handleAdd} disabled={!isValid || submitting}>
						{submitting ? "Saving..." : "Add Employee"}
					</Button>
				</div>
			</div>
		</div>
	);
}

