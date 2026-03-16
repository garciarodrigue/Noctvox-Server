import fetch from "node-fetch";

export async function getWeather(city){

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.WEATHER_KEY}&units=metric&lang=es`;

  const res = await fetch(url);
  const data = await res.json();

  if(!data.main){
    return {error:"No se pudo obtener clima"};
  }

  return {
    city:data.name,
    temperature:data.main.temp,
    description:data.weather[0].description
  };

}
