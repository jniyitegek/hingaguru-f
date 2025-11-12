import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

console.log(process.env.MONGO_URL);

const app = express();
app.use(cors());
const server = http.createServer(app);

app.use(express.json());
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL as string)
    .then(() => {
        console.log("Connected to MongoDB");
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err: unknown) => {
        console.error(err)
    });


app.get('/', (req, res) => {
  res.status(200).send('OK');
});

app.get('/api/weather', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    // TODO: Replace with actual weather API call
    const mockWeather = {
      current: {
        temp: 25,
        description: 'Sunny',
      },
      forecast: [
        { day: 'Mon', temp: 26, description: 'Sunny' },
        { day: 'Tue', temp: 27, description: 'Partly cloudy' },
        { day: 'Wed', temp: 24, description: 'Showers' },
      ],
    };

    res.json(mockWeather);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

export {
    app,
    server,
};
