import { CropModel } from "../models/Crop.js";
import { getDummyUserId } from "./dummyUser.js";

const seedData = [
  {
    name: "Maize (Corn)",
    scientificName: "Zea mays",
    description: "Staple cereal crop suited to warm climates.",
    optimalTemp: "18 - 27°C",
    soil: "Well-drained loam, pH 5.8 - 7.0",
    water: "Moderate; avoid waterlogging",
    optimalSoilPH: [5.8, 7.0],
    commonPests: ["Stem borer", "Armyworm"],
    diseases: [
      {
        name: "Maize Streak Virus",
        symptoms: "Chlorotic streaks, stunted growth",
        treatment: "Control leafhoppers, plant resistant varieties",
      },
      {
        name: "Northern Leaf Blight",
        symptoms: "Cigar-shaped lesions on leaves",
        treatment: "Use resistant hybrids, rotate crops, apply fungicide if severe",
      },
    ],
    tips: [
      "Plant at onset of rains for strong establishment.",
      "Apply nitrogen at knee-high stage and at tasseling.",
      "Mulch to conserve moisture and suppress weeds.",
    ],
    market: {
      pricePerKgUsd: 0.28,
      trend: "up",
      note: "Prices rising on regional demand",
    },
    ownerId: null,
  },
  {
    name: "Beans",
    scientificName: "Phaseolus vulgaris",
    description: "Protein-rich legume commonly intercropped.",
    optimalTemp: "16 - 24°C",
    soil: "Fertile, well-drained, pH 6.0 - 7.5",
    water: "Consistent moisture; sensitive to drought during flowering",
    optimalSoilPH: [6.0, 7.5],
    commonPests: ["Bean fly", "Pod borer"],
    diseases: [
      {
        name: "Angular Leaf Spot",
        symptoms: "Angular brown lesions on leaves",
        treatment: "Use clean seed, resistant varieties; apply copper fungicides",
      },
      {
        name: "Anthracnose",
        symptoms: "Dark lesions on stems and pods",
        treatment: "Certified seed, crop rotation, remove infected debris",
      },
    ],
    tips: [
      "Inoculate seed with Rhizobium for better nodulation.",
      "Avoid overhead irrigation to reduce foliar diseases.",
      "Harvest promptly to prevent shattering and rot.",
    ],
    market: {
      pricePerKgUsd: 1.1,
      trend: "flat",
      note: "Stable demand; quality fetches premium",
    },
    ownerId: null,
  },
  {
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    description: "High value horticultural crop with precise management needs.",
    optimalTemp: "20 - 28°C",
    soil: "Loamy, rich in organic matter, pH 6.0 - 6.8",
    water: "Regular deep watering; keep foliage dry",
    optimalSoilPH: [6.0, 6.8],
    commonPests: ["Whitefly", "Tomato hornworm"],
    diseases: [
      {
        name: "Early Blight",
        symptoms: "Target-like spots on older leaves",
        treatment: "Mulch, stake plants, rotate; apply fungicides preventively",
      },
      {
        name: "Bacterial Wilt",
        symptoms: "Sudden wilting without yellowing",
        treatment: "Use resistant rootstocks, solarize soil, sanitize tools",
      },
    ],
    tips: [
      "Stake and prune to improve airflow and reduce disease.",
      "Feed with balanced NPK and calcium to prevent blossom end rot.",
      "Harvest at breaker stage for better shelf life.",
    ],
    market: {
      pricePerKgUsd: 0.9,
      trend: "down",
      note: "Short-term oversupply; focus on quality grading",
    },
    ownerId: null,
  },
  {
    name: "Potato",
    scientificName: "Solanum tuberosum",
    description: "Cool season tuber crop requiring hilling.",
    optimalTemp: "15 - 20°C",
    soil: "Loose, well-drained sandy loam, pH 5.5 - 6.5",
    water: "Even moisture; avoid wet feet, especially at tuber initiation",
    optimalSoilPH: [5.5, 6.5],
    commonPests: ["Cutworms", "Colorado potato beetle"],
    diseases: [
      {
        name: "Late Blight",
        symptoms: "Water-soaked lesions on leaves, brown rot on tubers",
        treatment: "Certified seed, preventive fungicides, remove infected foliage",
      },
      {
        name: "Blackleg/Soft Rot",
        symptoms: "Blackened stems, soft rotting tubers",
        treatment: "Sanitation, avoid injuries, store cool and dry",
      },
    ],
    tips: [
      "Plant disease-free certified seed tubers.",
      "Hill soil around plants to prevent greening and improve yields.",
      "Cure harvested tubers before storage to toughen skins.",
    ],
    market: {
      pricePerKgUsd: 0.5,
      trend: "flat",
      note: "Stable household demand; storage extends selling window",
    },
    ownerId: null,
  },
  {
    name: "Rice (Paddy)",
    scientificName: "Oryza sativa",
    description: "Water-loving staple requiring consistent irrigation.",
    optimalTemp: "20 - 35°C",
    soil: "Clay loam that can hold water; pH 5.5 - 7.0",
    water: "High; requires flooded or saturated conditions depending on system",
    optimalSoilPH: [5.5, 7.0],
    commonPests: ["Rice stem borer", "Leaf folder"],
    diseases: [
      {
        name: "Rice Blast",
        symptoms: "Diamond-shaped lesions on leaves; neck blast",
        treatment: "Resistant varieties, balanced nitrogen, fungicides if needed",
      },
      {
        name: "Bacterial Leaf Blight",
        symptoms: "Yellowing and wilting of leaves",
        treatment: "Clean seed, avoid excess nitrogen, resistant varieties",
      },
    ],
    tips: [
      "Maintain shallow water during tillering; deeper at later stages.",
      "Use balanced fertilisation and avoid lodging.",
      "Dry and store grain below 14% moisture to avoid mould.",
    ],
    market: {
      pricePerKgUsd: 0.6,
      trend: "up",
      note: "Uptrend on import constraints; quality milling adds value",
    },
    ownerId: null,
  },
];

export async function seedCropsIfEmpty() {
  const count = await CropModel.estimatedDocumentCount();
  if (count > 0) {
    return;
  }

  const dummyOwnerId = getDummyUserId();

  await CropModel.insertMany(
    seedData.map((item) => ({
      ...item,
      ownerId: dummyOwnerId,
    })),
  );
}


