// import { MapContainer, TileLayer, Marker } from "react-leaflet";
import SpeedGauge from "./SpeedGauge";
import { ScatterChart } from "@mui/x-charts";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from "react";

const dataset = [
    { x: "12:00", y: 37, id: "d1" },
    { x: "12:15", y: 39, id: "d2" },
    { x: "12:30", y: 40, id: "d3" },
    { x: "12:45", y: 35, id: "d4" },
    { x: "13:00", y: 33, id: "d5" },
    { x: "13:15", y: 34, id: "d6" },
    { x: "13:30", y: 31, id: "d7" },
    { x: "13:45", y: 30, id: "d8" },
    { x: "14:00", y: 32, id: "d9" },
    { x: "14:15", y: 37, id: "d10" },
];

const LeftPanel = () => {

    const [selectedDate, setSelectedDate] = useState();

    return (
        <div>
            <div className="grid grid-cols-2">
                <div className="w-[210px] h-[346px] bg-amber-600" />
                <div className="text-center">
                    <div className="font-medium text-[24px]">Recent Speed</div>
                    <div className="w-full h-[190.95px] bg-blue-900">
                        <SpeedGauge speed={37} maxSpeed={69} />
                    </div>
                    <div className="grid grid-cols-2">
                        <div>
                            <div>85%</div>
                            <div className="font-bold">44</div>
                        </div>
                        <div>
                            <div>Max</div>
                            <div className="font-bold">75</div>
                        </div>
                    </div>
                </div>
            </div>
            <ScatterChart
                width={428}
                height={354}
                dataset={dataset}
                series={[
                    {
                        data: dataset.map((v) => ({ x: v.x, y: v.y, id: v.id })),
                        // color: "white",
                    }
                ]}
                xAxis={[
                    {
                        dataKey: "x",  // Data key from dataset,
                        scaleType: 'point',  // Use point scale for categorical data
                        fill: "white",
                        stroke: "white",
                        labelStyle: {
                        }
                        // tick: { fill: "white" },
                        // label: 'Time',  // Label for X-axis
                    }
                ]}
                yAxis={[
                    {
                        dataKey: 'y',  // Data key from dataset
                        fill: "white"
                        // tick: { fill: "white" },
                        // label: "Speed (mph)",  // Label for Y-axis
                    }
                ]}
                grid={{ vertical: true, horizontal: true }}
                sx={{
                    "& .MuiChartsAxis-line":{
                        strokeWidth: 1,
                        stroke: "gray",
                    },
                    "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel":{
                        strokeWidth: 0.5,
                        fill: "white"
                    },
                    "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel":{
                        strokeWidth: 0.5,
                        fill: "white"
                    },
                }}
                tooltip
            />

            <div className="grid grid-cols-2 justify-center items-center px-3">
                <h4 className="font-bold">Percentiles and max for</h4>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Date"
                        slotProps={{
                            textField: {
                                sx: {
                                    "& .MuiInputBase-input": { color: "white" }, // Text color
                                    "& .MuiInputLabel-root": { color: "white" }, // Label color
                                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" }, // Border color
                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" }, // Hover effect
                                    "& .MuiSvgIcon-root": { color: "#097479" },
                                },
                            },
                        }}
                    />
                </LocalizationProvider>
            </div>
            <div className="grid grid-cols-3 text-center py-3">
                <div>
                    <div>50%</div>
                    <div className="font-bold">37 mph</div>
                </div>
                <div>
                    <div>85%</div>
                    <div className="font-bold">41 mph</div>
                </div>
                <div>
                    <div>Max</div>
                    <div className="font-bold">69 mph</div>
                </div>
            </div>
        </div>
    );
};

export default LeftPanel;
