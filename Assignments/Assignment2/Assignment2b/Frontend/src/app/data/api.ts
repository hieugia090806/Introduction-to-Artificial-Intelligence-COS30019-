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

export async function predictRoute(payload: RoutePayload) {
  const response = await fetch("http://localhost:8000/route", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Dự đoán thất bại!");
  }
  return await response.json();
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

async function handlePredict() {
  try {
    const result = await predictRoute({
      model: "LSTM",
      start_node: 1,
      goal_node: 10,
      traffic_features: [],
    });
    console.log("Kết quả dự đoán:", result);
  } catch (err) {
    if (err instanceof Error) {
      alert(err.message);
    } else {
      alert("Đã có lỗi xảy ra không xác định");
    }
  }
}