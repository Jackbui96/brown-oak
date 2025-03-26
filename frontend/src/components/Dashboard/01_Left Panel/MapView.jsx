import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapView() {
    return (
        <MapContainer
            center={[48.06880315804841, -123.09377272745633]} // London by default
            zoom={15}
            scrollWheelZoom={true}
            className="w-[210px] h-[346px]"
        >
            <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[48.06880315804841, -123.09377272745633]} />
        </MapContainer>
    );
}
