#-- Import crucial libraries. --#
import os
import json
import joblib
import numpy as np
import pandas as pd
import tensorflow as tf
from datetime import datetime
from tensorflow.keras.models import load_model

#-- Class LSTMPredictor. --#
class LSTMPredictor:
    def __init__(self): 
        current_dir = os.path.dirname(__file__)
        root_dir = os.path.dirname(current_dir)
        #-- Use processed dataset. --#
        self.data_path = os.path.join(root_dir, 'Data', 'Processed', 'efficiency_stations_cleaned.csv')
        self.model_path = os.path.join(current_dir, '../Model/model_lstm.keras')
        self.scaler_path = os.path.join(current_dir, '../Model/scaler.pkl')
        self.history_path = os.path.join(root_dir, 'Data', 'Processed', 'prediction_history.json')
        #-- Load the efficiency dataset as the primary coordinate source. --#
        self.df_stations = pd.read_csv(self.data_path)
        self.model = load_model(self.model_path)
        self.scaler = joblib.load(self.scaler_path)
        self.cols_needed = self.scaler.n_features_in_
        #-- Traffic constants. --#
        self.FREE_FLOW_THRESHOLD = 351
        self.SPEED_LIMIT = 60

    def _haversine(self, lon1, lat1, lon2, lat2):
        #-- Calculate geographical distance (km) between two points. --#
        R = 6371
        p1, p2 = np.radians(lat1), np.radians(lat2)
        dp, dl = np.radians(lat2-lat1), np.radians(lon2-lon1)
        a = np.sin(dp/2)**2 + np.cos(p1)*np.cos(p2)*np.sin(dl/2)**2
        return 2 * R * np.arctan2(np.sqrt(a), np.sqrt(1-a))
    
    def predict_route(self, start_id, goal_id, traffic_features):
        #-- API Endpoint logic to receive user selection and return traffic prediction. --#
        try:
            # 1. Dynamic Coordinate Lookup from the Efficiency dataset
            row1 = self.df_stations[self.df_stations['tfm_id'].astype(str) == str(start_id)]
            row2 = self.df_stations[self.df_stations['tfm_id'].astype(str) == str(goal_id)]
            
            if row1.empty or row2.empty:
                return {"error": "Station ID not found in database"}

            # Get coordinates and names
            lon1, lat1 = row1.iloc[0]['x'], row1.iloc[0]['y']
            lon2, lat2 = row2.iloc[0]['x'], row2.iloc[0]['y']
            road_name = row1.iloc[0]['road_name']

            distance = self._haversine(lon1, lat1, lon2, lat2)

            # 2. LSTM Inference
            input_array = np.array(traffic_features).reshape(1, -1)
            scaled_data = self.scaler.transform(input_array)
            lstm_input = np.tile(scaled_data, (1, 96, 1))
            
            prediction = self.model.predict(lstm_input, verbose=0)
            
            # 3. Calculations (Flow -> Speed -> Time)
            dummy = np.zeros((1, self.cols_needed))
            dummy[0, 0] = prediction[0][0]
            flow_hr = self.scaler.inverse_transform(dummy)[0, 0] * 4
            
            # Quadratic speed model
            delta = 93.75**2 - 4 * (-1.46) * (-flow_hr)
            speed = np.clip((-93.75 - np.sqrt(max(0, delta))) / (2 * -1.46), 5, self.SPEED_LIMIT)
            travel_time = (distance / speed) * 60 + 0.5

            route_nodes = [start_id, middle_node, goal_id]
            middle_node = self.find_best_next_station(start_id, traffic_features)
            # 4. JSON Package for Frontend
            result = {
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "road": str(road_name),
                "start_node": str(start_id),
                "goal_node": str(goal_id),
                "route_nodes": route_nodes,
                "distance_km": round(float(distance), 2),
                "predicted_flow": round(float(flow_hr), 1),
                "estimated_speed": round(float(speed), 1),
                "travel_time_min": round(float(travel_time), 1),
                "status": "Congested" if flow_hr > self.FREE_FLOW_THRESHOLD else "Clear"
            }
            
            self._save_history(result)
            return result

        except Exception as e:
            return {"error": str(e)}
        
    def _save_history(self, result):
        #-- Persistent storage for the frontend dashboard table. --#
        history = []
        if os.path.exists(self.history_path):
            with open(self.history_path, 'r') as f:
                try: history = json.load(f)
                except: history = []
        
        history.append(result)
        with open(self.history_path, 'w') as f:
            json.dump(history[-20:], f, indent=4)
    
