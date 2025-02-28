import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Stack, ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import { useState } from "react";
import { BarChart } from '@mui/x-charts/BarChart';

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
            <h3>Historical Data</h3>
            <div className="buttons">
                <button>3 HR</button>
                <button>24 HR</button>
                <button>7 DAY</button>
                <button>30 DAY</button>
            </div>
            <FormControl component="fieldset">
                <Typography sx={{ color: "white", marginBottom: 1 }}>Direction</Typography>
                <ToggleButtonGroup
                    value={direction}
                    exclusive
                    onChange={handleDirectionChange}
                    sx={{
                        backgroundColor: "transparent",
                        border: "1px solid teal",
                        borderRadius: "8px",
                        overflow: "hidden",
                        "& .MuiToggleButton-root": {
                            color: "white",
                            border: "none",
                            padding: "6px 16px",
                            transition: "all 0.3s ease",
                        },
                        "& .Mui-selected": {
                            backgroundColor: "teal !important",
                            color: "white !important",
                            borderRadius: "8px",
                        },
                    }}
                >
                    <ToggleButton value="both">Both</ToggleButton>
                    <ToggleButton value="westbound">Westbound</ToggleButton>
                    <ToggleButton value="eastbound">Eastbound</ToggleButton>
                </ToggleButtonGroup>
            </FormControl>
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
