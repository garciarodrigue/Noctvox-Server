import fetch from "node-fetch";

export async function getNews(topic){

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&language=es&sortBy=publishedAt&apiKey=${process.env.NEWS_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if(!data.articles){
    return [];
  }

  return data.articles.slice(0,5).map(a=>({
    title:a.title,
    source:a.source.name,
    description:a.description
  }));

}
