import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { MapPin, Navigation } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { RouteMap } from "../components/RouteMap";
import { fetchRoutePrediction, fetchStations } from "../data/api";

type Station = {
  tfm_id: number;
  road_name: string;
  x: number; // longitude
  y: number; // latitude
};

export function RoutePlanner() {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("LSTM");
  const [selectedTime, setSelectedTime] = useState<string>("08:00");
  const [showResults, setShowResults] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [routePath, setRoutePath] = useState<number[]>([]);
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    fetchStations()
      .then((data) => {
        console.log("🧪 DEBUG stations[0]:", data[0]);
        console.log("🧪 DEBUG keys:", Object.keys(data[0] || {}));
        setStations(data);
      })
      .catch((err) => {
        console.error("Failed to fetch stations", err);
      });
  }, []);

  const getStationById = (id: string) =>
    stations.find((s) => s.tfm_id.toString() === id);

  const originStation = getStationById(origin);
  const destinationStation = getStationById(destination);

  function buildTrafficFeatures(time: string): number[] {
    const [hour] = time.split(":").map(Number);
    return [100, 50, 20, 5, hour, 0];
  }

  const handleFindRoutes = async () => {
    if (!origin || !destination) return;

    const payload = {
      model: selectedModel as "LSTM" | "GRU" | "BLSTM",
      start_node: Number(origin),
      goal_node: Number(destination),
      traffic_features: buildTrafficFeatures(selectedTime),
    };

    try {
      const result = await fetchRoutePrediction(payload);
      setPredictionResult(result);
      setRoutePath(result.route_nodes);
      setShowResults(true);
    } catch (err) {
      console.error("Failed to fetch route", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Route Planner</h1>
        <p className="text-muted-foreground">
          ML‑driven station‑to‑station routing
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Route Configuration</CardTitle>
          <CardDescription>
            Select start, destination and ML model
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Origin */}
            <div className="space-y-2">
              <Label>Origin</Label>
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger>
                  <SelectValue>
                    {originStation
                      ? originStation.road_name
                      : "Select origin..."}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {stations.map((s) => (
                    <SelectItem
                      key={s.tfm_id}
                      value={s.tfm_id.toString()}
                    >
                      {s.road_name}
                      <span className="ml-2 text-xs text-muted-foreground">
                        (SCATS {s.tfm_id})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <Label>Destination</Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger>
                  <SelectValue>
                    {destinationStation
                      ? destinationStation.road_name
                      : "Select destination..."}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {stations.map((s) => (
                    <SelectItem
                      key={s.tfm_id}
                      value={s.tfm_id.toString()}
                    >
                      {s.road_name}
                      <span className="ml-2 text-xs text-muted-foreground">
                        (SCATS {s.tfm_id})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ML Model */}
            <div className="space-y-2">
              <Label>ML Prediction Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LSTM">LSTM</SelectItem>
                  <SelectItem value="GRU">GRU</SelectItem>
                  <SelectItem value="BLSTM">BLSTM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label>Departure Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const h = i.toString().padStart(2, "0");
                    return (
                      <SelectItem key={h} value={`${h}:00`}>
                        {h}:00
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleFindRoutes}
              disabled={!origin || !destination}
            >
              <Navigation className="mr-2 h-4 w-4" />
              Find Route
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setOrigin("");
                setDestination("");
                setShowResults(false);
              }}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {origin && destination && (
        <>
          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertTitle>Route Selected</AlertTitle>
            <AlertDescription>
              <strong>From:</strong> {originStation?.road_name}
              <br />
              <strong>To:</strong> {destinationStation?.road_name}
              <br />
              <strong>Model:</strong> {selectedModel} — {selectedTime}
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Route Visualization</CardTitle>
              <CardDescription>
                Stations connected in ML‑selected order
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[500px]">
                <RouteMap
                  stations={stations}
                  origin={origin}
                  destination={destination}
                  routePath={routePath}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {showResults && predictionResult && (
        <Card>
          <CardHeader>
            <CardTitle>Prediction Result</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Road</p>
              <p>{predictionResult.road}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Distance</p>
              <p>{predictionResult.distance_km} km</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Flow</p>
              <p>{predictionResult.predicted_flow}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Speed</p>
              <p>{predictionResult.estimated_speed} km/h</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Travel Time</p>
              <p>{predictionResult.travel_time_min} min</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge>{predictionResult.status}</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}