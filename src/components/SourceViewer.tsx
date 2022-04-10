import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { StateContext } from "../context";
import { File, isLocalisation } from "../domains/mod";
import { transformLocalisationYmlStyle } from "../utils/texts";

type Props = {
  file: File;
};

const SourceViewer: React.FC<Props> = ({ file }) => {
  const { edit } = React.useContext(StateContext);
  return (
    <Box sx={{ heigth: "100%", width: "100%" }}>
      <Typography variant="h5" component="h2">
        {file.name}
      </Typography>
      <Box
        sx={{
          height: "calc(90vh - 2rem)",
          padding: "0.5rem",
          bgcolor: "#091421",
          overflowY: "scroll",
          paddingRight: "0.7rem",
          "&::-webkit-scrollbar": {
            display: "none",
            height: "0.7rem",
            width: "0.7rem",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "primary.main",
            borderRadius: "0.5rem",
          },
          "&:hover": { paddingRight: "0" },
          "&:hover::-webkit-scrollbar": { display: "inline" },
        }}
      >
        {file.lines.map((line, i) => {
          if (isLocalisation(line)) {
            return (
              <p key={`source-viewer-line-idx-${i}`}>
                <span style={{ color: "#ccccee" }}>{line.key}</span>
                <span> </span>
                <span style={{ color: "#eeccdd" }}>
                  {transformLocalisationYmlStyle(
                    edit.get(line.key) || line.value
                  )}
                </span>
                {line.comment.length > 0 ? (
                  <>
                    <span> </span>
                    <span style={{ color: "#7a997a" }}>{line.comment}</span>
                  </>
                ) : null}
              </p>
            );
          } else {
            return (
              <p
                key={`source-viewer-line-idx-${i}`}
                style={{ color: "#7a997a" }}
              >
                {line}
              </p>
            );
          }
        })}
      </Box>
    </Box>
  );
};

export default SourceViewer;
