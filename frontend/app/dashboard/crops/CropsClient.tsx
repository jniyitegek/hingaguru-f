"use client";

import { useEffect, useMemo, useState } from "react";
import { Sprout, ThermometerSun, CloudRain, ShieldAlert, TrendingUp, BookOpen, MapPin } from "lucide-react";
import Nav from "@/components/common/Nav";
import AuthNav from "@/components/common/AuthNav";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { api, type CropInfo } from "@/lib/api";

export default function CropsClient() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [districtId, setDistrictId] = useState<string>("");
  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [weatherNote, setWeatherNote] = useState<string>("");

  const [crops, setCrops] = useState<CropInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const list = await api.getCrops();
        setCrops(list);
        setSelectedId(list[0]?.id ?? null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load crop library";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return crops;
    return crops.filter((crop) => {
      const diseaseMatch = crop.diseases.some((d) => d.name.toLowerCase().includes(q));
      const tipMatch = crop.tips.some((tip) => tip.toLowerCase().includes(q));
      const soilMatch = crop.soil?.toLowerCase().includes(q) ?? false;
      return (
        crop.name.toLowerCase().includes(q) ||
        (crop.description?.toLowerCase().includes(q) ?? false) ||
        diseaseMatch ||
        tipMatch ||
        soilMatch
      );
    });
  }, [crops, query]);

  const selected = useMemo(
    () => filtered.find((crop) => crop.id === selectedId) ?? filtered[0] ?? null,
    [filtered, selectedId],
  );

  useEffect(() => {
    if (!selectedId && filtered.length > 0) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const RWF_PER_USD = 1300;

  const RWANDA_DISTRICTS: { id: string; name: string; lat: number; lon: number }[] = [
    { id: "kigali-gasabo", name: "Gasabo (Kigali)", lat: -1.9, lon: 30.12 },
    { id: "kigali-kicukiro", name: "Kicukiro (Kigali)", lat: -1.99, lon: 30.14 },
    { id: "kigali-nyarugenge", name: "Nyarugenge (Kigali)", lat: -1.94, lon: 30.06 },
    { id: "north-musanze", name: "Musanze (Northern)", lat: -1.5, lon: 29.63 },
    { id: "north-gicumbi", name: "Gicumbi (Northern)", lat: -1.68, lon: 30.07 },
    { id: "south-huye", name: "Huye (Southern)", lat: -2.61, lon: 29.74 },
    { id: "south-nyanza", name: "Nyanza (Southern)", lat: -2.35, lon: 29.75 },
    { id: "east-rwamagana", name: "Rwamagana (Eastern)", lat: -1.95, lon: 30.44 },
    { id: "east-nyagatare", name: "Nyagatare (Eastern)", lat: -1.3, lon: 30.32 },
    { id: "east-kayonza", name: "Kayonza (Eastern)", lat: -1.85, lon: 30.67 },
    { id: "west-rubavu", name: "Rubavu (Western)", lat: -1.68, lon: 29.26 },
    { id: "west-karongi", name: "Karongi (Western)", lat: -2.18, lon: 29.36 },
    { id: "west-rusizi", name: "Rusizi (Western)", lat: -2.48, lon: 28.9 },
  ];

  const districtOptions = useMemo(
    () => [
      { value: "", label: "Select a district" },
      ...RWANDA_DISTRICTS.map((d) => ({ value: d.id, label: d.name })),
    ],
    [],
  );

  function onSelectDistrict(id: string) {
    setDistrictId(id);
    const d = RWANDA_DISTRICTS.find((x) => x.id === id);
    if (d) {
      setLat(String(d.lat));
      setLon(String(d.lon));
    } else {
      setLat("");
      setLon("");
    }
  }

  function parseTempRange(range?: string): { min: number | null; max: number | null } {
    if (!range) return { min: null, max: null };
    const match = range.match(/(\d+)\s*[-–]\s*(\d+)/);
    if (match) {
      return { min: Number(match[1]), max: Number(match[2]) };
    }
    return { min: null, max: null };
  }

  async function fetchWeather() {
    setWeatherNote("");
    setCurrentTemp(null);
    const latNum = Number(lat);
    const lonNum = Number(lon);
    if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
      setWeatherNote("Enter valid latitude and longitude.");
      return;
    }
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latNum}&longitude=${lonNum}&current=temperature_2m`;
      const res = await fetch(url);
      const data = await res.json();
      const temp = data?.current?.temperature_2m;
      if (typeof temp === "number") {
        setCurrentTemp(temp);
        const { min, max } = parseTempRange(selected?.optimalTemp);
        if (min !== null && max !== null) {
          if (temp < min) {
            setWeatherNote(
              `Current temperature ${temp}°C is below optimal (${min}-${max}°C). Consider mulching, low tunnels, or delaying transplanting.`,
            );
          } else if (temp > max) {
            setWeatherNote(
              `Current temperature ${temp}°C is above optimal (${min}-${max}°C). Increase irrigation frequency, provide shade netting if possible.`,
            );
          } else {
            setWeatherNote(
              `Current temperature ${temp}°C is within optimal range for ${selected?.name}. Proceed with planned operations.`,
            );
          }
        } else {
          setWeatherNote(`Current temperature is ${temp}°C.`);
        }
      } else {
        setWeatherNote("Could not read temperature for this location.");
      }
    } catch {
      setWeatherNote("Failed to fetch weather. Check connection and try again.");
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Nav />
      <main className="flex-1 overflow-auto">
        <AuthNav />
        <div className="p-8">
          <div className="flex items-start justify-between mb-8 text-black">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Crops Intelligence</h1>
              <p className="text-gray-500">Diseases, optimal conditions, and market insights</p>
            </div>
            <div className="w-80">
              <Input id="search-crops" variant="text" placeholder="Search crops, diseases, tips..." value={query} onChange={setQuery} />
            </div>
          </div>

          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 flex items-center gap-3">
              <ThermometerSun className="text-orange-500" />
              <div>
                <div className="text-sm text-gray-500">Optimal temperature (selected)</div>
                <div className="text-xl font-semibold text-gray-800">{selected?.optimalTemp ?? "-"}</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 flex items-center gap-3">
              <CloudRain className="text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">Water requirement</div>
                <div className="text-xl font-semibold text-gray-800">{selected?.water ?? "-"}</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 flex items-center gap-3">
              <TrendingUp className="text-green-600" />
              <div>
                <div className="text-sm text-gray-500">Market price (per kg) — RWF</div>
                <div className="text-xl font-semibold text-gray-800">
                  {selected
                    ? Math.round((selected.market?.pricePerKgUsd ?? 0) * RWF_PER_USD).toLocaleString()
                    : "-"}{" "}
                  ({selected?.market?.trend ?? "-"})
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-4">
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="px-6 py-3 border-b text-gray-700 font-medium">Crop Library</div>
                <div className="max-h-[520px] overflow-auto">
                  {loading ? (
                    <div className="px-6 py-8 text-sm text-gray-500">Loading crops…</div>
                  ) : filtered.length === 0 ? (
                    <div className="px-6 py-8 text-sm text-gray-500">No matches.</div>
                  ) : (
                    filtered.map((crop) => (
                      <button
                        key={crop.id}
                        onClick={() => setSelectedId(crop.id)}
                        className={`w-full text-left px-6 py-4 border-b hover:bg-gray-50 transition-colors ${
                          selected?.id === crop.id ? "bg-green-50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Sprout className="text-green-600" />
                          <div className="font-medium text-gray-800">{crop.name}</div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Soil: {crop.soil ?? "-"}</div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-8 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-semibold text-gray-800">Disease &amp; Pest Guide</div>
                  <div className="text-sm text-gray-500">{selected?.name ?? "Select a crop"}</div>
                </div>
                {selected ? (
                  <div className="space-y-4">
                    {selected.diseases.map((d) => (
                      <div key={d.name} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-800 font-medium mb-1">
                          <ShieldAlert className="text-red-500" /> {d.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-gray-700">Symptoms:</span> {d.symptoms}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-gray-700">Management:</span> {d.treatment}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Select a crop to view guidance.</div>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-semibold text-gray-800">Weather-based recommendations</div>
                  <MapPin className="text-gray-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
                  <div className="md:col-span-3">
                    <Input id="rw-district" label="Rwandan District" variant="select" value={districtId} onChange={onSelectDistrict} options={districtOptions} />
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <Button onClick={fetchWeather} disabled={!districtId}>
                      Get
                    </Button>
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    {currentTemp !== null && <div className="text-gray-700">Now: {currentTemp}°C</div>}
                  </div>
                </div>
                <div className="text-sm text-gray-700">{weatherNote}</div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-semibold text-gray-800">Best Practices</div>
                  <BookOpen className="text-gray-500" />
                </div>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {selected?.tips.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  )) ?? <li>No tips available.</li>}
                </ul>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-semibold text-gray-800">Market Insights</div>
                  <TrendingUp
                    className={
                      selected?.market?.trend === "up"
                        ? "text-green-600"
                        : selected?.market?.trend === "down"
                          ? "text-red-500"
                          : "text-gray-500"
                    }
                  />
                </div>
                <div className="text-gray-700">
                  <div className="mb-1">
                    Current price:{" "}
                    <span className="font-semibold">
                      $
                      {(selected?.market?.pricePerKgUsd ?? 0).toFixed(2)}
                    </span>{" "}
                    / kg
                  </div>
                  <div className="text-sm text-gray-600">{selected?.market?.note ?? "No market insights available."}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
"use client";

import Nav from "@/components/common/Nav";
import AuthNav from "@/components/common/AuthNav";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Sprout, ThermometerSun, CloudRain, ShieldAlert, TrendingUp, BookOpen, MapPin } from "lucide-react";
import { useMemo, useState } from "react";

type CropInfo = {
  id: string;
  name: string;
  optimalTemp: string;
  soil: string;
  water: string;
  diseases: { name: string; symptoms: string; treatment: string }[];
  tips: string[];
  market: { pricePerKgUsd: number; trend: "up" | "down" | "flat"; note: string };
};

const CROP_LIBRARY: CropInfo[] = [
  {
    id: "maize",
    name: "Maize (Corn)",
    optimalTemp: "18 - 27°C",
    soil: "Well-drained loam, pH 5.8 - 7.0",
    water: "Moderate; avoid waterlogging",
    diseases: [
      { name: "Maize Streak Virus", symptoms: "Chlorotic streaks, stunted growth", treatment: "Control vector (leafhoppers), plant resistant varieties" },
      { name: "Northern Leaf Blight", symptoms: "Cigar-shaped lesions on leaves", treatment: "Use resistant hybrids, rotate crops, apply fungicide if severe" },
    ],
    tips: [
      "Plant at onset of rains for strong establishment.",
      "Apply nitrogen at knee-high stage and at tasseling.",
      "Mulch to conserve moisture and suppress weeds.",
    ],
    market: { pricePerKgUsd: 0.28, trend: "up", note: "Prices rising on regional demand" },
  },
  {
    id: "beans",
    name: "Beans",
    optimalTemp: "16 - 24°C",
    soil: "Fertile, well-drained, pH 6.0 - 7.5",
    water: "Consistent moisture; sensitive to drought during flowering",
    diseases: [
      { name: "Angular Leaf Spot", symptoms: "Angular brown lesions on leaves", treatment: "Use clean seed, resistant varieties; apply copper fungicides" },
      { name: "Anthracnose", symptoms: "Dark lesions on stems and pods", treatment: "Certified seed, crop rotation, remove infected debris" },
    ],
    tips: [
      "Inoculate seed with Rhizobium for better nodulation.",
      "Avoid overhead irrigation to reduce foliar diseases.",
      "Harvest promptly to prevent shattering and rot.",
    ],
    market: { pricePerKgUsd: 1.1, trend: "flat", note: "Stable demand; quality fetches premium" },
  },
  {
    id: "tomato",
    name: "Tomato",
    optimalTemp: "20 - 28°C (fruit set best at 21-24°C)",
    soil: "Loamy, rich in organic matter, pH 6.0 - 6.8",
    water: "Regular deep watering; keep foliage dry",
    diseases: [
      { name: "Early Blight", symptoms: "Target-like spots on older leaves", treatment: "Mulch, stake plants, rotate; apply fungicides preventively" },
      { name: "Bacterial Wilt", symptoms: "Sudden wilting without yellowing", treatment: "Use resistant rootstocks, solarize soil, sanitize tools" },
    ],
    tips: [
      "Stake and prune to improve airflow and reduce disease.",
      "Feed with balanced NPK and calcium to prevent blossom end rot.",
      "Harvest at breaker stage for better shelf life.",
    ],
    market: { pricePerKgUsd: 0.9, trend: "down", note: "Short-term oversupply; focus on quality grading" },
  },
  {
    id: "potato",
    name: "Potato",
    optimalTemp: "15 - 20°C",
    soil: "Loose, well-drained sandy loam, pH 5.5 - 6.5",
    water: "Even moisture; avoid wet feet, especially at tuber initiation",
    diseases: [
      { name: "Late Blight", symptoms: "Water-soaked lesions on leaves, brown rot on tubers", treatment: "Certified seed, preventive fungicides, remove infected foliage" },
      { name: "Blackleg/Soft Rot", symptoms: "Blackened stems, soft rotting tubers", treatment: "Sanitation, avoid injuries, store cool and dry" },
    ],
    tips: [
      "Plant disease-free certified seed tubers.",
      "Hill soil around plants to prevent greening and improve yields.",
      "Cure harvested tubers before storage to toughen skins.",
    ],
    market: { pricePerKgUsd: 0.5, trend: "flat", note: "Stable household demand; storage extends selling window" },
  },
  {
    id: "rice",
    name: "Rice (Paddy)",
    optimalTemp: "20 - 35°C (optimum around 25-30°C)",
    soil: "Clay loam can hold water; pH 5.5 - 7.0",
    water: "High; requires flooded or saturated conditions depending on system",
    diseases: [
      { name: "Rice Blast", symptoms: "Diamond-shaped lesions on leaves; neck blast", treatment: "Resistant varieties, balanced N, fungicides if needed" },
      { name: "Bacterial Leaf Blight", symptoms: "Yellowing and wilting of leaves", treatment: "Clean seed, avoid excess N, resistant varieties" },
    ],
    tips: [
      "Maintain shallow water during tillering; deeper at later stages.",
      "Use balanced fertilization and avoid lodging.",
      "Dry and store grain at safe moisture (<14%) to avoid mold.",
    ],
    market: { pricePerKgUsd: 0.6, trend: "up", note: "Uptrend on import constraints; quality milling adds value" },
  },
];

export default function CropsClient() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(CROP_LIBRARY[0].id);
  const [districtId, setDistrictId] = useState<string>("");
  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [weatherNote, setWeatherNote] = useState<string>("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CROP_LIBRARY;
    return CROP_LIBRARY.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.diseases.some(d => d.name.toLowerCase().includes(q)) ||
      c.tips.some(t => t.toLowerCase().includes(q))
    );
  }, [query]);

  const selected = useMemo(
    () => filtered.find(c => c.id === selectedId) || filtered[0] || null,
    [filtered, selectedId]
  );

  // Simple static conversion for display; can be replaced by live FX rates
  const RWF_PER_USD = 1300;

  const RWANDA_DISTRICTS: { id: string; name: string; lat: number; lon: number }[] = [
    { id: "kigali-gasabo", name: "Gasabo (Kigali)", lat: -1.90, lon: 30.12 },
    { id: "kigali-kicukiro", name: "Kicukiro (Kigali)", lat: -1.99, lon: 30.14 },
    { id: "kigali-nyarugenge", name: "Nyarugenge (Kigali)", lat: -1.94, lon: 30.06 },
    { id: "north-musanze", name: "Musanze (Northern)", lat: -1.50, lon: 29.63 },
    { id: "north-gicumbi", name: "Gicumbi (Northern)", lat: -1.68, lon: 30.07 },
    { id: "south-huye", name: "Huye (Southern)", lat: -2.61, lon: 29.74 },
    { id: "south-nyanza", name: "Nyanza (Southern)", lat: -2.35, lon: 29.75 },
    { id: "east-rwamagana", name: "Rwamagana (Eastern)", lat: -1.95, lon: 30.44 },
    { id: "east-nyagatare", name: "Nyagatare (Eastern)", lat: -1.30, lon: 30.32 },
    { id: "east-kayonza", name: "Kayonza (Eastern)", lat: -1.85, lon: 30.67 },
    { id: "west-rubavu", name: "Rubavu (Western)", lat: -1.68, lon: 29.26 },
    { id: "west-karongi", name: "Karongi (Western)", lat: -2.18, lon: 29.36 },
    { id: "west-rusizi", name: "Rusizi (Western)", lat: -2.48, lon: 28.90 },
  ];

  const districtOptions = useMemo(() => [
    { value: "", label: "Select a district" },
    ...RWANDA_DISTRICTS.map(d => ({ value: d.id, label: d.name })),
  ], []);

  function onSelectDistrict(id: string) {
    setDistrictId(id);
    const d = RWANDA_DISTRICTS.find(x => x.id === id);
    if (d) {
      setLat(String(d.lat));
      setLon(String(d.lon));
    } else {
      setLat("");
      setLon("");
    }
  }

  function parseTempRange(range?: string): { min: number | null; max: number | null } {
    if (!range) return { min: null, max: null };
    const match = range.match(/(\d+)\s*[-–]\s*(\d+)/);
    if (match) {
      return { min: Number(match[1]), max: Number(match[2]) };
    }
    return { min: null, max: null };
  }

  async function fetchWeather() {
    setWeatherNote("");
    setCurrentTemp(null);
    const latNum = Number(lat);
    const lonNum = Number(lon);
    if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
      setWeatherNote("Enter valid latitude and longitude.");
      return;
    }
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latNum}&longitude=${lonNum}&current=temperature_2m`;
      const res = await fetch(url);
      const data = await res.json();
      const temp = data?.current?.temperature_2m;
      if (typeof temp === "number") {
        setCurrentTemp(temp);
        const { min, max } = parseTempRange(selected?.optimalTemp);
        if (min !== null && max !== null) {
          if (temp < min) {
            setWeatherNote(`Current temperature ${temp}°C is below optimal (${min}-${max}°C). Consider mulching, low tunnels, or delaying transplanting.`);
          } else if (temp > max) {
            setWeatherNote(`Current temperature ${temp}°C is above optimal (${min}-${max}°C). Increase irrigation frequency, provide shade netting if possible.`);
          } else {
            setWeatherNote(`Current temperature ${temp}°C is within optimal range for ${selected?.name}. Proceed with planned operations.`);
          }
        } else {
          setWeatherNote(`Current temperature is ${temp}°C.`);
        }
      } else {
        setWeatherNote("Could not read temperature for this location.");
      }
    } catch {
      setWeatherNote("Failed to fetch weather. Check connection and try again.");
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Nav />
      <main className="flex-1 overflow-auto">
        <AuthNav />
        <div className="p-8">
          <div className="flex items-start justify-between mb-8 text-black">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Crops Intelligence</h1>
              <p className="text-gray-500">Diseases, optimal conditions, and market insights</p>
            </div>
            <div className="w-80">
              <Input id="search-crops" variant="text" placeholder="Search crops, diseases, tips..." value={query} onChange={setQuery} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 flex items-center gap-3">
              <ThermometerSun className="text-orange-500" />
              <div>
                <div className="text-sm text-gray-500">Optimal temperature (selected)</div>
                <div className="text-xl font-semibold text-gray-800">{selected?.optimalTemp || "-"}</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 flex items-center gap-3">
              <CloudRain className="text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">Water requirement</div>
                <div className="text-xl font-semibold text-gray-800">{selected?.water || "-"}</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 flex items-center gap-3">
              <TrendingUp className="text-green-600" />
              <div>
                <div className="text-sm text-gray-500">Market price (per kg) — RWF</div>
                <div className="text-xl font-semibold text-gray-800">
                  {selected ? Math.round(selected.market.pricePerKgUsd * RWF_PER_USD).toLocaleString() : "-"} ({selected?.market.trend ?? "-"})
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-4">
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="px-6 py-3 border-b text-gray-700 font-medium">Crop Library</div>
                <div className="max-h-[520px] overflow-auto">
                  {filtered.map(crop => (
                    <button
                      key={crop.id}
                      onClick={() => setSelectedId(crop.id)}
                      className={`w-full text-left px-6 py-4 border-b hover:bg-gray-50 transition-colors ${
                        selected?.id === crop.id ? "bg-green-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Sprout className="text-green-600" />
                        <div className="font-medium text-gray-800">{crop.name}</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Soil: {crop.soil}</div>
                    </button>
                  ))}
                  {filtered.length === 0 && <div className="px-6 py-8 text-sm text-gray-500">No matches.</div>}
                </div>
              </div>
            </div>

            <div className="col-span-8 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-semibold text-gray-800">Disease & Pest Guide</div>
                  <div className="text-sm text-gray-500">{selected?.name}</div>
                </div>
                <div className="space-y-4">
                  {selected?.diseases.map(d => (
                    <div key={d.name} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-800 font-medium mb-1">
                        <ShieldAlert className="text-red-500" /> {d.name}
                      </div>
                      <div className="text-sm text-gray-600"><span className="font-medium text-gray-700">Symptoms:</span> {d.symptoms}</div>
                      <div className="text-sm text-gray-600"><span className="font-medium text-gray-700">Management:</span> {d.treatment}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-semibold text-gray-800">Weather-based recommendations</div>
                  <MapPin className="text-gray-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
                  <div className="md:col-span-3">
                    <Input id="rw-district" label="Rwandan District" variant="select" value={districtId} onChange={onSelectDistrict} options={districtOptions} />
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <Button onClick={fetchWeather} disabled={!districtId}>Get</Button>
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    {currentTemp !== null && <div className="text-gray-700">Now: {currentTemp}°C</div>}
                  </div>
                </div>
                <div className="text-sm text-gray-700">{weatherNote}</div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-semibold text-gray-800">Best Practices</div>
                  <BookOpen className="text-gray-500" />
                </div>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {selected?.tips.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-semibold text-gray-800">Market Insights</div>
                  <TrendingUp className={selected?.market.trend === "up" ? "text-green-600" : selected?.market.trend === "down" ? "text-red-500" : "text-gray-500"} />
                </div>
                <div className="text-gray-700">
                  <div className="mb-1">Current price: <span className="font-semibold">${selected?.market.pricePerKgUsd.toFixed(2)}</span> / kg</div>
                  <div className="text-sm text-gray-600">{selected?.market.note}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


