export type RoutePayload = {
  model: "LSTM" | "GRU" | "BLSTM"
  start_node: number
  goal_node: number
  traffic_features: number[]
}

export async function fetchRoutePrediction(payload: RoutePayload) {
    console.log("➡️ Sending payload to backend:", payload);
    const res = await fetch("http://127.0.0.1:8000/route", {
    method: "POST",
    headers: {"Content-Type": "application/json",}, 
    body: JSON.stringify(payload),
  })

  
  if (!res.ok) {
    throw new Error(`Backend error: ${res.status}`)
  }

  const data = await res.json()
  console.log("✅ Backend response:", data)
    return data
}


export async function fetchStations() {
  const res = await fetch("http://127.0.0.1:8000/stations");

  if (!res.ok) {
    throw new Error("Failed to fetch stations");
  }

  const data = await res.json();
  console.log("✅ fetchStations response:", data);
  return data;
}