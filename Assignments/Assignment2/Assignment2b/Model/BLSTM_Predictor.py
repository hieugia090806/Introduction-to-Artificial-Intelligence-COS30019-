#--Import crucial libraries. --#
import os
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from tensorflow.keras.models import load_model

class BiLSTMPredictor:
    def __init__(self):
        current_dir = os.path.dirname(__file__)
        root_dir = os.path.dirname(current_dir)
        #-- Resource Paths. --#
        self.data_path = os.path.join(root_dir, 'Data', 'Processed', 'efficiency_stations_cleaned.csv')
        self.model_path = os.path.join(current_dir, '../Model/model_bilstm.keras')
        self.scaler_path = os.path.join(current_dir, '../Model/scaler.pkl')
        self.history_path = os.path.join(root_dir, 'Data', 'Processed', 'prediction_history.json')
        #-- Load Database and AI Models. --#
        self.df_stations = pd.read_csv(self.data_path)
        self.model = load_model(self.model_path)
        self.scaler = joblib.load(self.scaler_path)
        self.cols_needed = self.scaler.n_features_in_
        # Traffic Configs
        self.FREE_FLOW_THRESHOLD = 351
        self.SPEED_LIMIT = 60

    def _haversine(self, lon1, lat1, lon2, lat2):
        #-- Internal distance calculator (km). --#
        R = 6371
        p1, p2 = np.radians(lat1), np.radians(lat2)
        dp, dl = np.radians(lat2-lat1), np.radians(lon2-lon1)
        a = np.sin(dp/2)**2 + np.cos(p1)*np.cos(p2)*np.sin(dl/2)**2
        return 2 * R * np.arctan2(np.sqrt(a), np.sqrt(1-a))
    
    def predict_route(self, start_id, goal_id, traffic_features):
        try:
            # 1. Lookup Station Data
            row1 = self.df_stations[self.df_stations['tfm_id'].astype(str) == str(start_id)]
            row2 = self.df_stations[self.df_stations['tfm_id'].astype(str) == str(goal_id)]
            
            if row1.empty or row2.empty:
                return {"error": "Station IDs not found"}

            distance = self._haversine(row1.iloc[0]['x'], row1.iloc[0]['y'], 
                                       row2.iloc[0]['x'], row2.iloc[0]['y'])

            # 2. Bi-LSTM Inference
            input_array = np.array(traffic_features).reshape(1, -1)
            scaled_data = self.scaler.transform(input_array)
            # Bi-LSTM also uses (batch, timesteps, features)
            bilstm_input = np.tile(scaled_data, (1, 96, 1))
            
            prediction = self.model.predict(bilstm_input, verbose=0)
            
            # 3. Post-processing
            dummy = np.zeros((1, self.cols_needed))
            dummy[0, 0] = prediction[0][0]
            flow_hr = self.scaler.inverse_transform(dummy)[0, 0] * 4
            
            # Speed Estimation
            delta = 93.75**2 - 4 * (-1.46) * (-flow_hr)
            speed = np.clip((-93.75 - np.sqrt(max(0, delta))) / (2 * -1.46), 5, self.SPEED_LIMIT)
            travel_time = (distance / speed) * 60 + 0.5

            # 4. JSON Result
            result = {
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "model_used": "Bi-LSTM",
                "road": str(row1.iloc[0]['road_name']),
                "start_node": str(start_id),
                "goal_node": str(goal_id),
                "distance_km": round(float(distance), 2),
                "predicted_flow": round(float(flow_hr), 1),
                "estimated_speed": round(float(speed), 1),
                "travel_time_min": round(float(travel_time), 1),
                "status": "Congested" if flow_hr > self.FREE_FLOW_THRESHOLD else "Clear"
            }
            
            self._update_history(result)
            return result

        except Exception as e:
            return {"error": str(e)}
    
    def _update_history(self, result):
        history = []
        if os.path.exists(self.history_path):
            try:
                with open(self.history_path, 'r') as f:
                    history = json.load(f)
            except:
                history = []
        
        history.append(result)
        with open(self.history_path, 'w') as f:
            json.dump(history[-20:], f, indent=4)