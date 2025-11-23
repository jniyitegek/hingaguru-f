"use client";

import { useEffect, useState } from "react";
import { Calendar, Droplet, Check, Trash } from "lucide-react";
import { api, type Task } from "@/lib/api";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/context/LocaleContext";

export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTitle, setNewTitle] = useState("");
    const [creating, setCreating] = useState(false);
    const { t } = useLocale();

        async function load() {
            try {
                setLoading(true);
                const list = await api.getTasks();
                setTasks(list);
            } catch {
                toast.error("Failed to load tasks");
            } finally {
                setLoading(false);
            }
        }

    useEffect(() => {
        load();
    }, []);

        async function handleCreate() {
            if (!newTitle.trim()) return;
            setCreating(true);
            try {
                await api.createTask({ title: newTitle.trim() });
                setNewTitle("");
                toast.success("Task created");
                await load();
            } catch (err) {
                console.log(err)
                toast.error("Failed to create task");
            } finally {
                setCreating(false);
            }
        }

    async function toggleComplete(t: Task) {
        try {
            const newStatus = t.status === "pending" ? "completed" : "pending";
            await api.updateTask(t.id, { status: newStatus });
            setTasks((prev) => prev.map((p) => (p.id === t.id ? { ...p, status: newStatus } : p)));
        } catch (err) {
            console.log(err)
            toast.error("Failed to update task");
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this task?")) return;
        try {
            await api.deleteTask(id);
            setTasks((prev) => prev.filter((t) => t.id !== id));
            toast.success("Task deleted");
        } catch {
            toast.error("Failed to delete task");
        }
    }

    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">{t("nav.upcomingTasks")}</h3>
                <Calendar className="text-gray-400" size={20} />
            </div>

                    <div className="mb-4 flex gap-2">
                        <Input id="new-task-title" placeholder={t("nav.add")} value={newTitle} onChange={setNewTitle} />
                <Button onClick={handleCreate} disabled={creating || !newTitle.trim()}>
                    {t("nav.add")}
                </Button>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-sm text-gray-500">{t("tasks.loading")}</div>
                ) : tasks.length === 0 ? (
                    <div className="text-sm text-gray-500">{t("tasks.noTasks")}</div>
                ) : (
                    tasks.map((task) => (
                        <div key={task.id} className="flex items-start gap-3 pb-4 border-b border-gray-100">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                {task.status === "completed" ? <Check className="text-green-500" size={16} /> : <Droplet className="text-gray-500" size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <div className={`font-medium text-gray-800 text-sm ${task.status === "completed" ? "line-through text-gray-400" : ""}`}>{task.title}</div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => toggleComplete(task)} className="text-sm text-green-600">{task.status === "pending" ? <Check className="w-4 h-4 hover:scale-105 cursor-pointer" /> : t("tasks.undo")}</button>
                                        <button onClick={() => handleDelete(task.id)} className="text-sm text-red-600">{t("tasks.delete")} <Trash className="w-4 h-4 hover:scale-105 cursor-pointer" /></button>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}