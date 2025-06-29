// hooks/appendVote.js
export async function appendVote({ id, whichVote, value }) {
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const res = await fetch(`/api/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, whichVote, value }),
    });
  
    if (!res.ok) throw new Error("Failed to vote");
    return await res.json();
  }
  