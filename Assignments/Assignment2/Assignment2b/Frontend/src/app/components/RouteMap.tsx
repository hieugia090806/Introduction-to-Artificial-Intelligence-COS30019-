import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

type Station = {
  tfm_id: number;
  road_name: string;
  x: number; // longitude
  y: number; // latitude
};

interface RouteMapProps {
  stations: Station[];
  origin?: string;
  destination?: string;
  routePath?: number[];
}

const defaultCenter: [number, number] = [-37.8136, 144.9631]; // Melbourne

const stationIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function RouteMap({
  stations,
  origin,
  destination,
  routePath = [],
}: RouteMapProps) {
  const getStation = (id?: string | number) =>
    stations.find(
      (s) => s.tfm_id.toString() === id?.toString()
    );

  const originStation = getStation(origin);
  const destStation = getStation(destination);

  const polylineCoords =
    routePath?.map((id) => {
      const s = getStation(id);
      return s ? ([s.y, s.x] as [number, number]) : null;
    }).filter((item): item is [number, number] => item !== null);

  // routeCoords: either derived from polylineCoords (ML path) or from
  // a routing engine (OSRM) when only origin/destination are provided.
  const [routeCoords, setRouteCoords] = useState<[number, number][]>(
    polylineCoords
  );

  useEffect(() => {
    // If origin/destination available, request OSRM road-following geometry.
    if (originStation && destStation) {
      const start: [number, number] = [originStation.y, originStation.x];
      const end: [number, number] = [destStation.y, destStation.x];
      // Use the ML-provided station sequence if available; otherwise use origin->dest
      const waypoints: [number, number][] = 
      polylineCoords.length >= 2
      ? polylineCoords
      : [[originStation.y, originStation.x], [destStation.y, destStation.x]];

      // OSRM expects lon,lat ordering
      const coordStr = waypoints.map(([lat, lon]) => `${lon},${lat}`).join(";");
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson&alternatives=false`;

      fetch(osrmUrl)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.routes && data.routes.length > 0) {
            const coords = data.routes[0].geometry.coordinates.map(
              (c: [number, number]) => [c[1], c[0]] as [number, number]
            );
            setRouteCoords(coords);
          } else {
            // fallback to straight-line station coordinates
            setRouteCoords(waypoints);
          }
        })
        .catch((err) => {
          console.error("OSRM routing error:", err);
          setRouteCoords(waypoints);
        });
    } else {
      // no valid stations, use whatever polyline data we have
      setRouteCoords(polylineCoords);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin, destination, routePath, stations]);

  const center: [number, number] = originStation
    ? [originStation.y, originStation.x]
    : defaultCenter;

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {originStation && (
        <Marker
          position={[originStation.y, originStation.x]}
          icon={stationIcon}
        >
          <Popup>
            <strong>{originStation.road_name}</strong>
            <br />
            Origin
          </Popup>
        </Marker>
      )}

      {destStation && (
        <Marker
          position={[destStation.y, destStation.x]}
          icon={stationIcon}
        >
          <Popup>
            <strong>{destStation.road_name}</strong>
            <br />
            Destination
          </Popup>
        </Marker>
      )}

      {routeCoords.length > 1 && (
        <Polyline
          positions={routeCoords}
          pathOptions={{ color: "#2563eb", weight: 4 }}
        />
      )}
    </MapContainer>
  );
}