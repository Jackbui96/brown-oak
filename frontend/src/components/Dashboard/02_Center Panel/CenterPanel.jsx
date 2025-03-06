import { useState } from "react";
import OpsStyledButton from "../../Common/OpsStyledButton.jsx";
import OpsOvalToggleButtonGroup from "../../Common/OpsOvalToggleButtonGroup.jsx";
import TrafficBarChart from "./TrafficBarChart.jsx";
import SpeedLineChart from "./SpeedLineChart.jsx";

const CenterPanel = () => {
    const [direction, setDirection] = useState("both");

    const handleDirectionChange = (event, newDirection) => {
        if (newDirection !== null) {
            setDirection(newDirection);
        }
    };

    return (
        <div>
            <h3 className="font-bold text-center py-6">Historical Data</h3>
            <div className="grid grid-cols-4 gap-4 px-2 py-4">
                <OpsStyledButton variant="contained">3 HR</OpsStyledButton>
                <OpsStyledButton variant="contained">24 HR</OpsStyledButton>
                <OpsStyledButton variant="contained">7 DAY</OpsStyledButton>
                <OpsStyledButton variant="contained">30 DAY</OpsStyledButton>
            </div>
            <div className="flex items-center justify-center px-3">
                <div className="display: flex">Direction</div>
                <OpsOvalToggleButtonGroup />
            </div>
            <TrafficBarChart />
            <SpeedLineChart />
            <div className="grid grid-cols-2 items-center text-center">
                <div>
                    <div>Daily Average</div>
                    <div className="font-bold">610</div>
                </div>
                <div>
                    <div>Monthly Average</div>
                    <div className="font-bold">18,309</div>
                </div>
            </div>
        </div>
    )
}

export default CenterPanel
