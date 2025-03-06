import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const OpsOvalToggleButtonGroup = () => {
    const [direction, setDirection] = useState("Both");

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
                // margin: "4px",
                display: "flex",  // Ensure buttons take equal space
                width: "100%", // Ensure full width if needed
                maxHeight: "28px",
                "& .MuiToggleButton-root": {
                    color: "white",
                    border: "none",
                    // padding: "6px 0px",
                    transition: "all 0.3s ease",
                    borderRadius: "999px",
                },
                "& .Mui-selected": {
                    backgroundColor: "teal !important",
                    color: "white !important",
                },
            }}
        >
            {["Both", "Westbound", "Eastbound"].map((value) => (
                <ToggleButton
                    key={value}
                    value={value}
                    sx={{
                        flex: 1, // Ensures equal width for all buttons
                        maxWidth: "180px",
                        color: "white",
                        border: "none",
                        margin: "2px",
                        // padding: "10px 2px",
                        transition: "all 0.3s ease",
                        borderRadius: "999px",
                        textTransform: "none",
                        "&.Mui-selected": {
                            backgroundColor: "teal !important",
                            color: "white !important",
                        },
                    }}
                >
                    {value}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
};

export default OpsOvalToggleButtonGroup;
