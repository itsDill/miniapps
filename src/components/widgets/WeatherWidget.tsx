import { useState, useEffect } from "react";

interface WeatherData {
  temp: number;
  feels_like: number;
  description: string;
  icon: string;
  humidity: number;
  wind_speed: number;
}

interface WeatherWidgetProps {
  config: {
    city?: string;
    unit?: "metric" | "imperial";
  };
}

export const WeatherWidget = ({ config }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { city = "London", unit = "metric" } = config;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // Note: For demo purposes, using mock data
        // In production, use: https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=YOUR_API_KEY

        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        setWeather({
          temp: unit === "metric" ? 22 : 72,
          feels_like: unit === "metric" ? 20 : 68,
          description: "Partly cloudy",
          icon: "02d",
          humidity: 65,
          wind_speed: unit === "metric" ? 5.5 : 12.3,
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch weather data");
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, unit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading weather...</div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error || "No data available"}</div>
      </div>
    );
  }

  const tempUnit = unit === "metric" ? "°C" : "°F";
  const speedUnit = unit === "metric" ? "m/s" : "mph";

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="text-xl font-semibold mb-1">{city}</div>
        <div className="text-4xl font-bold mb-2">
          {Math.round(weather.temp)}
          {tempUnit}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
          {weather.description}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mt-4">
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
          <div className="text-gray-600 dark:text-gray-400">Feels like</div>
          <div className="font-semibold">
            {Math.round(weather.feels_like)}
            {tempUnit}
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
          <div className="text-gray-600 dark:text-gray-400">Humidity</div>
          <div className="font-semibold">{weather.humidity}%</div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded col-span-2">
          <div className="text-gray-600 dark:text-gray-400">Wind Speed</div>
          <div className="font-semibold">
            {weather.wind_speed.toFixed(1)} {speedUnit}
          </div>
        </div>
      </div>
    </div>
  );
};

export const WeatherSettings = ({ config, onUpdate }: any) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">City</label>
        <input
          type="text"
          className="input"
          value={config.city || "London"}
          onChange={(e) => onUpdate({ city: e.target.value })}
          placeholder="Enter city name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Units</label>
        <select
          className="input"
          value={config.unit || "metric"}
          onChange={(e) => onUpdate({ unit: e.target.value })}
        >
          <option value="metric">Metric (°C)</option>
          <option value="imperial">Imperial (°F)</option>
        </select>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        Note: This demo uses mock data. Add your OpenWeather API key for real
        data.
      </div>
    </div>
  );
};
