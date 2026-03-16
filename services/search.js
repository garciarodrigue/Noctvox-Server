import fetch from "node-fetch";

export async function webSearch(query){

  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${process.env.SERP_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  return data.organic_results?.slice(0,5).map(r=>({
    title:r.title,
    snippet:r.snippet
  })) || [];

}
