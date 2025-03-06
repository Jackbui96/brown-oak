import { BarChart } from "@mui/x-charts/BarChart";
import { addLabels, countVsTimeDataSheet, trafficDataSheet } from "./TrafficDataSheet.jsx";

const time = [
    "20:30", "20:45", "21:00", "21:15", "21:30",
    "21:45", "22:00", "22:15", "22:30", "22:45",
    "23:00", "23:15", "23:30"
];

const getMaxValue = (dataset) => Math.max(...dataset.flatMap(d => Object.values(d).slice(1))) + 10;

const CustomBarChart = ({ title, dataset, isPercentage, yMax }) => {
    return (
        <div className="text-center">
            <div className="font-semibold text-white mb-2">{title}</div>
            <BarChart
                dataset={dataset}
                series={addLabels(isPercentage, [
                    { dataKey: "lightBlue", color: "#87CEFA", stack: "s" },
                    { dataKey: "blue", color: "#4682B4", stack: "s" },
                    { dataKey: "orange", color: "#FFA500", stack: "s" },
                    { dataKey: "red", color: "#FF4500", stack: "s" },
                ])}
                height={290}
                xAxis={[{ data: time, scaleType: "band" }]}
                yAxis={[{ min: 0, max: yMax }]}
                sx={{
                    "& .MuiChartsAxis-line": { strokeWidth: 1, stroke: "gray" },
                    "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": { strokeWidth: 0.5, fill: "white", fontSize: "12px" },
                    "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": { strokeWidth: 0.5, fill: "white", fontSize: "12px" },
                    "& .MuiChartsLegend-root": { color: "white", fontSize: "14px" },
                    "& .MuiChartsLegend-label": { color: "white !important" },
                }}
            />
        </div>
    );
};

const PercentageVsTimeBarChart = () => (
    <CustomBarChart
        title="Percentage vs. Time"
        dataset={trafficDataSheet}
        isPercentage={true}
        yMax={100}
    />
);

const CountVsTimeBarChart = () => (
    <CustomBarChart
        title="Count vs. Time"
        dataset={countVsTimeDataSheet}
        isPercentage={false}
        yMax={getMaxValue(countVsTimeDataSheet)}
    />
);

export { PercentageVsTimeBarChart, CountVsTimeBarChart };
