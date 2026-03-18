import { useState } from "react";

export default function App() {
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("man");
  const [result, setResult] = useState(null);
  const [feedback, setFeedback] = useState(3);
  const [bias, setBias] = useState(0);

  async function getWeather() {
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1`
      );
      const geoData = await geoRes.json();

      const place = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m`
      );

      const weatherData = await weatherRes.json();
      const weather = weatherData.current;

      const feelsLike =
        weather.temperature_2m +
        bias -
        weather.wind_speed_10m * 0.1 +
        weather.relative_humidity_2m * 0.05;

      let outfit = "";

      if (feelsLike < 10) outfit = "Jumper + trousers + coat";
      else if (feelsLike < 18) outfit = "Jumper or light jacket";
      else if (feelsLike < 25)
        outfit = gender === "woman"
          ? "T-shirt + dress"
          : "T-shirt + trousers";
      else outfit = "T-shirt + shorts";

      setResult({
        temp: weather.temperature_2m,
        wind: weather.wind_speed_10m,
        humidity: weather.relative_humidity_2m,
        outfit,
        feelsLike: Math.round(feelsLike),
      });
    } catch (err) {
      alert("Error getting weather");
    }
  }

  function saveFeedback() {
    let change = 0;

    if (feedback === 1) change = +2;
    if (feedback === 2) change = +1;
    if (feedback === 4) change = -1;
    if (feedback === 5) change = -2;

    setBias(bias + change);
    alert("Feedback saved 👍");
  }

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>What Clothes</h1>

      <input
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <br /><br />

      <select onChange={(e) => setGender(e.target.value)}>
        <option value="man">Man</option>
        <option value="woman">Woman</option>
      </select>

      <br /><br />

      <button onClick={getWeather}>Get Outfit</button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Temperature: {result.temp}°C</h3>
          <p>Feels like: {result.feelsLike}°C</p>
          <p>Wind: {result.wind} km/h</p>
          <p>Humidity: {result.humidity}%</p>

          <h2>Suggested outfit:</h2>
          <p>{result.outfit}</p>

          <hr />

          <h3>How did it feel?</h3>
          <p>1 = too cold, 3 = perfect, 5 = too hot</p>

          <input
            type="range"
            min="1"
            max="5"
            value={feedback}
            onChange={(e) => setFeedback(Number(e.target.value))}
          />

          <p>Selected: {feedback}</p>

          <button onClick={saveFeedback}>Save feedback</button>
        </div>
      )}
    </div>
  );
}
