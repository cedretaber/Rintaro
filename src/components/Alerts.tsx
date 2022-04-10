import { Alert, Box } from "@mui/material";
import React from "react";
import AlertData from "../domains/alert";

type Props = {
  alerts: AlertData[];
};

const Alerts: React.FC<Props> = ({ alerts }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        height: 0,
        width: 0,
        zIndex: 1800,
      }}
    >
      {alerts.map(({ type, body }, idx) => (
        <Alert
          key={`alert-idx-${idx}`}
          severity={type}
          sx={{
            position: "absolute",
            height: "2rem",
            width: "50vw",
            top: `calc(97vh - 3rem * ${idx + 1})`,
            left: "25vw",
          }}
        >
          {body}
        </Alert>
      ))}
    </Box>
  );
};

export default Alerts;
