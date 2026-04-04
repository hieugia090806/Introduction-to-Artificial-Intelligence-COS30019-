import os
import csv
from fastapi.responses import JSONResponse
# ===== Health Check =====
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
# ===== Test Case Data API =====
@app.get("/api/testcase/{model}")
def get_testcase_data(model: str):
    """
    Đọc file test case CSV theo model (lstm, gru, blstm) và trả về dữ liệu JSON.
    """
    model = model.lower()
    testcase_dir = os.path.join(os.path.dirname(__file__), "ai", "TestCase")
    # Map model to file pattern
    file_map = {
        "lstm": ["LSTM_DeepTest_01.csv", "LSTM_DeepTest_02.csv", "LSTM_DeepTest_03.csv"],
        "gru": ["GRUTest04.csv", "GRUTest05.csv", "GRUTest06.csv"],
        "blstm": ["BLSTTest07.csv", "BLSTTest08.csv", "BLSTTest09.csv", "BLSTTest10.csv"],
    }
    if model not in file_map:
        raise HTTPException(status_code=400, detail="Model must be one of: lstm, gru, blstm")

    result = []
    for fname in file_map[model]:
        fpath = os.path.join(testcase_dir, fname)
        if not os.path.exists(fpath):
            continue
        with open(fpath, encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Chuyển đổi các giá trị số về float/int nếu có thể
                for k, v in row.items():
                    if v is not None:
                        try:
                            if "." in v:
                                row[k] = float(v)
                            else:
                                row[k] = int(v)
                        except:
                            pass
                row["_source_file"] = fname
                result.append(row)
    if not result:
        raise HTTPException(status_code=404, detail="No test case data found for this model")
    return JSONResponse(content=result)

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