import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";

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
    }).filter(Boolean) as [number, number][];

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

      {polylineCoords.length > 1 && (
        <Polyline
          positions={polylineCoords}
          pathOptions={{ color: "#2563eb", weight: 4 }}
        />
      )}
    </MapContainer>
  );
}