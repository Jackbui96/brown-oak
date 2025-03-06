import { BarChart } from "@mui/x-charts/BarChart";

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

const TrafficBarChart = () => {
    return (
        <BarChart
            series={ series }
            height={ 290 }
            xAxis={[{
                data: time,
                scaleType: "band",
            }]}
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
        />
    )
}

export default TrafficBarChart;
