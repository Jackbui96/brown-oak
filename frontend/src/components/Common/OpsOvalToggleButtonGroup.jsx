import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const OpsOvalToggleButtonGroup = () => {
    const [direction, setDirection] = useState("both");

    const handleDirectionChange = (event, newDirection) => {
        if (newDirection !== null) {
            setDirection(newDirection);
        }
    };

    return (
        <ToggleButtonGroup
            value={direction}
            exclusive
            onChange={handleDirectionChange}
            sx={{
                backgroundColor: "transparent",
                border: "1px solid teal",
                borderRadius: "999px",
                overflow: "hidden",
                "& .MuiToggleButton-root": {
                    color: "white",
                    border: "none",
                    padding: "6px 16px",
                    transition: "all 0.3s ease",
                    borderRadius: "999px",
                },
                "& .Mui-selected": {
                    backgroundColor: "teal !important",
                    color: "white !important",
                },
            }}
        >
            <ToggleButton
                value="both"
                sx={{
                    color: "white",
                    border: "none",
                    padding: "10px 24px",
                    margin: "4px",
                    transition: "all 0.3s ease",
                    borderRadius: "999px",
                    textTransform: "none",
                    "&.Mui-selected": {
                        backgroundColor: "teal !important",
                        color: "white !important",
                    },
                }}
            >
                Both
            </ToggleButton>
            <ToggleButton
                value="westbound"
                sx={{
                    color: "white",
                    border: "none",
                    padding: "10px 24px",
                    margin: "4px",
                    transition: "all 0.3s ease",
                    borderRadius: "999px",
                    textTransform: "none",
                    "&.Mui-selected": {
                        backgroundColor: "teal !important",
                        color: "white !important",
                    },
                }}
            >
                Westbound
            </ToggleButton>
            <ToggleButton
                value="eastbound"
                sx={{
                    color: "white",
                    border: "none",
                    padding: "10px 24px",
                    margin: "4px",
                    transition: "all 0.3s ease",
                    borderRadius: "999px",
                    textTransform: "none",
                    "&.Mui-selected": {
                        backgroundColor: "teal !important",
                        color: "white !important",
                    },
                }}
            >
                Eastbound
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default OpsOvalToggleButtonGroup;
