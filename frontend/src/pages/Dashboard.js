import Header from "../components/Common/Header";
import "./Dashboard.css"
import LeftPanel from "../components/Dashboard/LeftPanel";
import CenterPanel from "../components/Dashboard/CenterPanel";
import RightPanel from "../components/Dashboard/RightPanel";

const Dashboard = () => {
    return (
        <div>
            <Header/>
            <main className="dashboard-container">
                <div className="panel panel-left"><LeftPanel/></div>
                <div className="panel panel-center"><CenterPanel/></div>
                <div className="panel panel-right"><RightPanel/></div>
            </main>
        </div>
    )
}

export default Dashboard