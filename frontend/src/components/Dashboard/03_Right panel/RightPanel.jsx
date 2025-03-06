import { CountVsTimeBarChart, PercentageVsTimeBarChart } from "./CustomBarChart.jsx";


const RightPanel = () => {
    return (
        <div>
            <h3 className="font-bold text-center py-6">Historical Traffic Speed Range Data</h3>
            <PercentageVsTimeBarChart />
            <CountVsTimeBarChart />
        </div>
    )
}

export default RightPanel
