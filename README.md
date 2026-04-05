#---WELCOME TO THE INTRODUCTION TO ARTIFICIAL INTELLIGENCE (COS30019) COURSE--#
# README CAREFULLY
--------------------------------------------------------------------
## A. Introduction

This project is developed for the course:
COS30019 – Introduction to Artificial Intelligence

The course focuses on applying machine learning techniques to real‑world problems, including data processing, model development, and system integration.

### Assignment Overview
This assignment aims to design and implement a traffic prediction and route planning system that utilises machine learning models to analyse historical traffic data and support route decision‑making.
The system:

Predicts traffic conditions using LSTM, GRU, and BLSTM models
Visualises traffic‑aware routing on an interactive map
Provides dashboards and analytics for performance observation
Separates offline model training from online inference and visualisation


### Team Members

|    Name of Student    |    ID     |   Role   |
|:----------------------|:---------:|---------:|
| Truong Ngoc Gia Hieu  | 105565520 | AI train |
| Huynh Trong Hieu      | 105551833 | AI + BE  |
| Duong Nguyen Dang     | 105508444 | FE + BE  |
| Pham Nguyen Minh Hoang| 105543500 | AI train |

## B. Folder Structure
The project is organised as follows:
```text
Assignment2b/
├── backend/
│   ├── ai/
│   │   ├── Model/
│   │   │   ├── LSTM_Predictor.py
│   │   │   ├── GRU_Predictor.py
│   │   │   └── BLSTM_Predictor.py
│   │   ├── Data/
│   │   ├── Document/
│   │   └── TestCase/
│   └── main.py
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/
│   │   │   │   ├── RoutePlanner.tsx
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Analytics.tsx
│   │   │   │   └── ModelTraining.tsx
│   │   │   ├── components/
│   │   │   │   ├── ui/
│   │   │   │   └── RouteMap.tsx
│   │   │   ├── data/
│   │   │   │   └── api.ts
│   │   │   └── App.tsx
│   │   ├── main.tsx
│   │   └── index.html
│   └── package.json
│
└── README.md
```
### Folder Description

backend/
FastAPI backend that provides inference APIs and station data.

backend/ai/Model/
Contains pre‑trained machine learning models used for traffic prediction.

frontend/
React frontend that implements the user interface, routing visualisation, dashboard, analytics, and training overview.


## C. Instructions to Run the Project Locally
### 1️⃣ Prerequisites
Make sure the following are installed on your local machine:

Python 3.9+
Node.js 18+
npm or yarn


### 2️⃣ Backend Setup
Navigate to the backend folder:

*cd backend*

Install Python dependencies:

*pip install*

Start the FastAPI server:

*uvicorn main:app --reload*

The backend will run at:

http://127.0.0.1:8000

Available endpoints:
POST /route – traffic prediction
GET /stations – station list


### 3️⃣ Frontend Setup
Navigate to the frontend folder:

*cd frontend*

Install dependencies:

*npm install*

Start the development server:

*npm run dev*

The frontend will run at:

http://localhost:5173

### 4️⃣ Application Usage
1. Open the frontend URL in your browser
2. Navigate to Route Planner
3. Select:
- Origin station
- Destination station
- ML model
- Departure time
4. View:
- Predicted traffic conditions
- Route visualisation on the map
5. Use:
- Dashboard for system overview
- Analytics to analyse prediction results
- Model Training to review offline training information

**⚠️ Notes**
+ Model training is performed offline due to computational cost.
+ The frontend displays training and evaluation results for transparency and demonstration purposes.
+ Routing geometry is generated via a routing engine for visualisation only; traffic intelligence is provided by machine learning models.


*✅ Final Notes*
This system demonstrates the integration of machine learning, backend services, and interactive visualisation to support intelligent traffic‑aware route planning.

Illustration:
![FE](/Assignments/Assignment2/Assignment2b/Frontend/FE_UI_DashboardScreenshot.png 'FE screenshot')