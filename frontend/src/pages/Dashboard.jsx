import Header from "../components/Common/Header.jsx";
import LeftPanel from "../components/Dashboard/01_Left Panel/LeftPanel.jsx";
import CenterPanel from "../components/Dashboard/02_Center Panel/CenterPanel.jsx";
import RightPanel from "../components/Dashboard/03_Right panel/RightPanel.jsx";

const Dashboard = () => {
    return (
        <main className="w-screen min-h-screen bg-black">
            <Header/>
            <div className="flex flex-wrap w-full min-h-4xl gap-1 py-1 items-center justify-center">
                <div className="w-full max-w-md min-h-[870px] max-h-[870px] bg-ops-gray border border-ops-border"><LeftPanel/></div>
                <div className="w-full max-w-md min-h-[870px] max-h-[870px] bg-ops-gray border border-ops-border"><CenterPanel/></div>
                <div className="w-full max-w-md min-h-[870px] max-h-[870px] bg-ops-gray border border-ops-border"><RightPanel/></div>
            </div>
        </main>
    )
}

export default Dashboard;
