import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import React from "react";
import { LinearProgress, Typography } from "@mui/material";

type Props = {
  text: string;
};

const NowProcessng: React.FC<Props> = ({ text }) => {
  return (
    <Box
      sx={{
        zIndex: 2000,
        position: "absolute",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Stack
        spacing={5}
        sx={{
          padding: "2rem",
          backgroundColor: "white",
          width: "50vw",
        }}
      >
        <Typography sx={{ textAlign: "center" }}>{text}</Typography>
        <LinearProgress />
      </Stack>
    </Box>
  );
};

export default React.memo(NowProcessng);
