import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import React from "react";
import FileTree from "../components/FileTree";
import SourceViewer from "../components/SourceViewer";
import { File } from "../domains/mod";

const Preview: React.FC = () => {
  const [file, setFile] = React.useState<File | undefined>(undefined);

  const onFileClick = React.useCallback(
    (file: File) => {
      setFile(file);
    },
    [setFile]
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <FileTree onItemClick={onFileClick} />
      </Grid>
      <Grid item xs={9}>
        <Box sx={{ maxHeight: "90vh" }}>
          {file && <SourceViewer file={file} />}
        </Box>
      </Grid>
    </Grid>
  );
};

export default React.memo(Preview);
