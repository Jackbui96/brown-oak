import { LineChart } from "@mui/x-charts";

const dataSet = [
    { y1: 36, y2: 33 },
    { y1: 42, y2: 35 },
    { y1: 48, y2: 36 },
    { y1: 51, y2: 35 },
    { y1: 52, y2: 35 },
    { y1: 46, y2: 36 },
    { y1: 53, y2: 37 },
    { y1: 50, y2: 38 },
    { y1: 48, y2: 38 },
    { y1: 39, y2: 34 },
    { y1: 39, y2: 34 },
    { y1: 53, y2: 37 },
    { y1: 42, y2: 36 },
];

const time = [
    "20:30", "20:45", "21:00", "21:15", "21:30",
    "21:45", "22:00", "22:15", "22:30", "22:45",
    "23:00", "23:15", "23:30"
];

const series = [
    {
        type: "line",
        label: "Max Speed",
        color: "red",
        data: dataSet.map(item => item.y1),
        highlightScope: { highlight: 'item' },
        showMark: true, // Show points on the line
    },
    {
        type: "line",
        label: "Avg Speed",
        color: "lightblue",
        data: dataSet.map(item => item.y2),
        highlightScope: { highlight: 'item' },
        showMark: true,
    }
];

const SpeedLineChart = () => {
    return (
        <LineChart
            series={series}
            height={290}
            xAxis={[
                {
                    data: time,
                    scaleType: "point",
                }
            ]}
            sx={{
                "& .MuiChartsAxis-line": {
                    strokeWidth: 1,
                    stroke: "gray",
                },
                "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                    strokeWidth: 0.5,
                    fill: "white",
                    fontSize: "12px",
                },
                "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                    strokeWidth: 0.5,
                    fill: "white",
                    fontSize: "12px",
                },
                "& .MuiChartsLegend-root": {
                    color: "white",
                    fontSize: "14px",
                },
                "& .MuiChartsLegend-label": {
                    color: "white !important",
                },
            }}
        />
    );
};

export default SpeedLineChart;
