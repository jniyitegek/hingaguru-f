"use client";

import { useEffect, useMemo, useState } from "react";
import { Sprout, ThermometerSun, CloudRain, ShieldAlert, TrendingUp, BookOpen, MapPin } from "lucide-react";
import Nav from "@/components/common/Nav";
import AuthNav from "@/components/common/AuthNav";
import { useLocale } from "@/context/LocaleContext";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { api, type CropInfo } from "@/lib/api";

export default function CropsClient() {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [districtId, setDistrictId] = useState<string>("0");
  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");

  const [crops, setCrops] = useState<CropInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [weatherNote, setWeatherNote] = useState<string>("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newScientificName, setNewScientificName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newOptimalTemp, setNewOptimalTemp] = useState("");
  const [newSoil, setNewSoil] = useState("");
  const [newWater, setNewWater] = useState("");
  const [newTips, setNewTips] = useState("");
  const [submittingNew, setSubmittingNew] = useState(false);

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

  const districtOptions = [
    { value: "0", label: "Select a district" },
    ...RWANDA_DISTRICTS.map((d) => ({ value: d.id, label: d.name })),
  ];

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

  async function handleCreateCrop() {
    if (!newName.trim()) return setError("Name is required");
    setSubmittingNew(true);
    setError(null);
    try {
      const created = await api.createCrop({
        name: newName.trim(),
        scientificName: newScientificName.trim() || undefined,
        description: newDescription.trim() || undefined,
        optimalTemp: newOptimalTemp.trim() || undefined,
        soil: newSoil.trim() || undefined,
        water: newWater.trim() || undefined,
        tips: newTips
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0),
        diseases: [],
        market: { pricePerKgUsd: 0, trend: "flat", note: "" },
      });
      const list = await api.getCrops();
      setCrops(list);
      setIsAddOpen(false);
      setNewName("");
      setNewScientificName("");
      setNewDescription("");
      setNewOptimalTemp("");
      setNewSoil("");
      setNewWater("");
      setNewTips("");
      setSelectedId(created.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create crop";
      setError(message);
    } finally {
      setSubmittingNew(false);
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{t("crops.title")}</h1>
              <p className="text-gray-500">{t("crops.subtitle")}</p>
            </div>
              <div className="w-80">
              <Input id="search-crops" variant="text" placeholder={t("crops.searchPlaceholder")} value={query} onChange={setQuery} />
            </div>
            {/* <div className="ml-4">
              <Button onClick={() => setIsAddOpen(true)}>Add crop</Button>
            </div> */}
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
                    : "-"} {" "}
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
                    <div className="px-6 py-8 text-sm text-gray-500">{t("crops.loading")}</div>
                  ) : filtered.length === 0 ? (
                    <div className="px-6 py-8 text-sm text-gray-500">{t("crops.noMatches")}</div>
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
                      ${" "}
                      {(selected?.market?.pricePerKgUsd ?? 0).toFixed(2)}
                    </span>{" "}
                    / kg
                  </div>
                  <div className="text-sm text-gray-600">{selected?.market?.note ?? "No market insights available."}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Crop modal */}
          {isAddOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => setIsAddOpen(false)} />
              <div className="relative z-10 w-full max-w-2xl bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Add Crop</h3>
                  <button aria-label="Close" onClick={() => setIsAddOpen(false)} className="text-gray-500 hover:text-gray-700">
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <Input id="crop-name" label="Name" value={newName} onChange={setNewName} required />
                  <Input id="crop-scientific" label="Scientific name" value={newScientificName} onChange={setNewScientificName} />
                  <Input id="crop-optimal-temp" label="Optimal temp (e.g. 18-25)" value={newOptimalTemp} onChange={setNewOptimalTemp} />
                  <Input id="crop-soil" label="Soil" value={newSoil} onChange={setNewSoil} />
                  <Input id="crop-water" label="Water requirement" value={newWater} onChange={setNewWater} />
                  <Input id="crop-tips" label="Tips (comma-separated)" value={newTips} onChange={setNewTips} />
                  <div className="md:col-span-2">
                    <Input id="crop-description" label="Description" value={newDescription} onChange={setNewDescription} />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                    {t("nav.cancel")}
                  </Button>
                  <Button onClick={handleCreateCrop} disabled={submittingNew || !newName.trim()}>
                    {submittingNew ? t("buttons.saving") : t("crops.addCrop")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}