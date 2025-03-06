import Header from "../components/Common/Header.jsx";
import LeftPanel from "../components/Dashboard/01_Left Panel/LeftPanel.jsx";
import CenterPanel from "../components/Dashboard/02_Center Panel/CenterPanel.jsx";
import RightPanel from "../components/Dashboard/03_Right panel/RightPanel.jsx";

const Dashboard = () => {
    return (
        <main className="w-screen h-screen bg-black">
            <Header/>
            <div className="px-[205.5px] pt-[6px] min-h-[882px]">
                <div className="grid grid-cols-3 gap-1">
                    <div className="min-w-[428px] bg-ops-gray border border-ops-border"><LeftPanel/></div>
                    <div className="min-w-[426px] bg-ops-gray border border-ops-border"><CenterPanel/></div>
                    <div className="min-w-[428px] bg-ops-gray border border-ops-border"><RightPanel/></div>
                </div>
            </div>
        </main>
    )
}

export default Dashboard
