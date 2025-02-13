// import { MapContainer, TileLayer, Marker } from "react-leaflet";
import SpeedGauge from "./SpeedGauge";

const LeftPanel = () => {
    return (
        <div>
            {/*<MapContainer center={[48.083, -123.1]} zoom={14} style={{ height: "200px", width: "100%" }}>*/}
            {/*    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />*/}
            {/*    <Marker position={[48.083, -123.1]} />*/}
            {/*</MapContainer>*/}

            <div className="speed-container">
                <h3>Recent Speed</h3>
                <SpeedGauge speed={37} maxSpeed={69} />
            </div>

            <div className="speed-data">
                <h4>Percentiles</h4>
                <p>50%: 37 mph</p>
                <p>85%: 41 mph</p>
                <p>Max: 69 mph</p>
            </div>
        </div>
    );
};

export default LeftPanel;
