import {Button, styled} from "@mui/material";

const OpsStyledButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText("#16a085"),
    backgroundColor: "#16a085",
    paddingTop: "14px",
    paddingBottom: "14px",
}));

export default OpsStyledButton;
