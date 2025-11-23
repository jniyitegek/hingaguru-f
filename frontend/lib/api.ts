const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

type JsonBody = Record<string, unknown> | Array<unknown> | null;

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);

  if (init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // attach Authorization header from localStorage token when present
  try {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
  } catch {
    // ignore localStorage access errors
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const data = await response.json();
      if (typeof data?.message === "string") {
        message = data.message;
      }
    } catch {
      // ignore json parse errors
    }
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  getFarmlands: () => apiFetch<Farmland[]>("/api/farmlands"),
  searchFarmlands: (query: string) => apiFetch<Farmland[]>(`/api/farmlands?search=${encodeURIComponent(query)}`),
  createFarmland: (body: JsonBody) =>
    apiFetch<Farmland>("/api/farmlands", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getFarmland: (id: string) => apiFetch<Farmland>(`/api/farmlands/${id}`),
  updateFarmland: (id: string, body: JsonBody) =>
    apiFetch<Farmland>(`/api/farmlands/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteFarmland: (id: string) =>
    apiFetch<{ id: string; message: string }>(`/api/farmlands/${id}`, {
      method: "DELETE",
    }),

  getEmployees: () => apiFetch<Employee[]>("/api/employees"),
  createEmployee: (body: JsonBody) =>
    apiFetch<Employee>("/api/employees", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateEmployee: (id: string, body: JsonBody) =>
    apiFetch<Employee>(`/api/employees/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteEmployee: (id: string) =>
    apiFetch<{ id: string; message: string }>(`/api/employees/${id}`, {
      method: "DELETE",
    }),

  getTransactions: () => apiFetch<FinanceTransaction[]>("/api/transactions"),
  createTransaction: (body: JsonBody) =>
    apiFetch<FinanceTransaction>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  deleteTransaction: (id: string) =>
    apiFetch<{ id: string; message: string }>(`/api/transactions/${id}`, {
      method: "DELETE",
    }),

  getDashboardSummary: () => apiFetch<DashboardSummary>("/api/dashboard/summary"),
  getCrops: () => apiFetch<CropInfo[]>("/api/crops"),
  getCrop: (id: string) => apiFetch<CropInfo>(`/api/crops/${id}`),
  createCrop: (body: JsonBody) =>
    apiFetch<CropInfo>("/api/crops", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  // Tasks
  getTasks: async () => {
    const raw = await apiFetch<any[]>("/api/tasks");
    return raw.map((r: any) => ({ ...r, id: r.id ?? r._id }));
  },
  createTask: async (body: JsonBody) => {
    const raw = await apiFetch<any>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return { ...raw, id: raw.id ?? raw._id };
  },
  updateTask: async (id: string, body: JsonBody) => {
    const raw = await apiFetch<any>(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    return { ...raw, id: raw.id ?? raw._id };
  },
  deleteTask: (id: string) =>
    apiFetch<{ id: string; message: string }>(`/api/tasks/${id}`, {
      method: "DELETE",
    }),
};

export type EmployeeStatus = "active" | "on_leave" | "inactive";

export type Employee = {
  id: string;
  fullName: string;
  role: string;
  phone: string;
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
};

export type Farmland = {
  id: string;
  name: string;
  area?: string;
  crops: string[];
  nextIrrigationDate?: string;
  nextFertilizingDate?: string;
  plannedPlantingDate?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
};

export type FinanceTransaction = {
  id: string;
  type: "income" | "expense";
  amountRwf: number;
  date: string;
  category: string;
  note?: string;
  farmlandId?: string;
  employeeId?: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
};

export type CropDisease = {
  name: string;
  symptoms: string;
  treatment: string;
};

export type CropInfo = {
  id: string;
  name: string;
  scientificName?: string;
  description?: string;
  optimalTemp?: string;
  soil?: string;
  water?: string;
  optimalSoilPH?: number[];
  commonPests?: string[];
  diseases: CropDisease[];
  tips: string[];
  market: {
    pricePerKgUsd: number;
    trend: "up" | "down" | "flat";
    note: string;
  };
};

export type DashboardSummary = {
  employees: {
    total: number;
    active: number;
    onLeave: number;
  };
  farmlands: {
    total: number;
    scheduledIrrigations: number;
    overdueIrrigation: number;
    upcomingSchedules: Array<{
      id: string;
      name: string;
      nextIrrigationDate?: string;
      nextFertilizingDate?: string;
      plannedPlantingDate?: string;
    }>;
  };
  farmlandHealth: {
    score: number;
    status: "optimal" | "watch" | "critical";
  };
  finances: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    recent: FinanceTransaction[];
  };
};

export type Task = {
  id: string;
  title: string;
  note?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed";
  farmlandId?: string | null;
  createdAt: string;
  updatedAt: string;
};


