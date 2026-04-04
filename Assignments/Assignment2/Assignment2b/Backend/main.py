from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# ===== Import AI Predictor Classes =====
from ai.Model.LSTM_Predictor import LSTMPredictor
from ai.Model.GRU_Predictor import GRUPredictor
from ai.Model.BLSTM_Predictor import BLSTMPredictor

# ===== FastAPI App =====
app = FastAPI(title="Traffic AI Backend")

# ===== CORS for React =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",  # Nếu dùng Vite
        "http://127.0.0.1:3000",],
    allow_credentials=True,
    allow_methods=["*"],    
    allow_headers=["*"],
)

# ===== Load models ONCE (important) =====
lstm_model = LSTMPredictor()
gru_model = GRUPredictor()
blstm_model = BLSTMPredictor()

# ===== Request Schema =====
class RouteRequest(BaseModel):
    model: str                    # "LSTM" | "GRU" | "BLSTM"
    start_node: int
    goal_node: int
    traffic_features: List[float] # input features for scaler

# ===== API Endpoint =====
@app.post("/route")
def predict_route(req: RouteRequest):
    
    print("✅ Backend received request")
    print("➡️ Payload:", req.dict())

    model_name = req.model.upper()

    try:
        if model_name == "LSTM":
            result = lstm_model.predict_route(
                req.start_node,
                req.goal_node,
                req.traffic_features
            )

        elif model_name == "GRU":
            result = gru_model.predict_route(
                req.start_node,
                req.goal_node,
                req.traffic_features
            )

        elif model_name == "BLSTM":
            result = blstm_model.predict_route(
                req.start_node,
                req.goal_node,
                req.traffic_features
            )

        else:
            raise HTTPException(status_code=400, detail="Unsupported model type")
        print("✅ Backend result:", result)
        return result

    except Exception as e:
        print("❌ Backend error:", e)
        raise HTTPException(status_code=500, detail=str(e))


# ===== Health Check =====
@app.get("/")
def root():
    return {"status": "AI Backend is running"}


@app.get("/stations")
def get_valid_stations():
    df = lstm_model.df_stations   # dataframe load từ efficiency_stations_cleaned.csv

    return df[["tfm_id", "road_name", "x", "y"]].drop_duplicates().to_dict("records")