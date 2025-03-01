import { useState } from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import OpsStyledButton from "../Common/OpsStyledButton.jsx";
import OpsOvalToggleButtonGroup from "../Common/OpsOvalToggleButtonGroup.jsx";

const CenterPanel = () => {
    const [direction, setDirection] = useState("both");

    const handleDirectionChange = (event, newDirection) => {
        if (newDirection !== null) {
            setDirection(newDirection);
        }
    };

    const series = [
        {
            type: "bar",
            label: "Westbound:",
            color: "red",
            data: [1, 2, 1, 3, 4, 1, 1, 1],
            highlightScope: { highlight: 'item' },
        },
        {
            type: "bar",
            label: "Eastbound:",
            color: "lightblue",
            data: [0, 1, 0, 0, 0, 1, 0, 0],
            highlightScope: { highlight: 'item' },
        }
    ]

    const time = ["20:30", "20:45", "21:00", "21:15", "21:30", "21:45", "22:15", "22:30", "22:45"]

    return (
        <div>
            <h3 className="font-bold text-center py-6">Historical Data</h3>
            <div className="grid grid-cols-4 gap-4 px-2 py-4 bg-amber-50">
                <OpsStyledButton variant="contained">3 HR</OpsStyledButton>
                <OpsStyledButton variant="contained">24 HR</OpsStyledButton>
                <OpsStyledButton variant="contained">7 DAY</OpsStyledButton>
                <OpsStyledButton variant="contained">30 DAY</OpsStyledButton>
            </div>
            <div className="flex items-center justify-center bg-amber-600 px-3">
                <div className="display: flex bg-red-500">Direction</div>
                <OpsOvalToggleButtonGroup />
            </div>
            <BarChart
                series={series}
                height={290}
                xAxis={[{
                    data: time,
                    scaleType: "band"
                }]}
            />
        </div>
    )
}

export default CenterPanel
