import fetch from "node-fetch";

export async function getWeather(city){

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_KEY}&units=metric`;

  const res = await fetch(url);
  const data = await res.json();

  return {
    city:data.name,
    temp:data.main?.temp,
    description:data.weather?.[0]?.description
  };

}
