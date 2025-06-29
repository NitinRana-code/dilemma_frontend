// hooks/getQuestion.js
export async function getQuestion(id) {
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const res = await fetch(`/api/question?id=${id}`);
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data;
}
