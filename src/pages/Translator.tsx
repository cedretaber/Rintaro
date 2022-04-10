import { Box, Grid, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import FileTree from "../components/FileTree";
import { StateContext } from "../context";
import Dispatcher from "../dispatcher";
import { File, isLocalisation, Localisation } from "../domains/mod";
import Dictionary from "../utils/dictionary";

type EditorProps = {
  localisation: Localisation;
  currentValue: string | undefined;
  onChange: (key: string, value: string | undefined) => void;
};

const Editor: React.FC<EditorProps> = ({
  localisation: { key, value: originalValue },
  currentValue,
  onChange,
}) => {
  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      event.stopPropagation();

      onChange(key, event.currentTarget.value);
    },
    [key, onChange]
  );
  const count = Math.max(currentValue?.length || 0, originalValue.length);
  const rows = count > 300 ? 9 : count > 150 ? 6 : 3;
  return (
    <Stack direction="column">
      <Box>
        <Typography variant="caption" component="h3">
          {key}
        </Typography>
      </Box>
      <Grid
        container
        spacing={1}
        sx={{
          width: "100%",
          marginTop: "0.5rem",
          marginBottom: "2rem",
        }}
      >
        <Grid item xs={6}>
          <TextField
            fullWidth
            multiline
            disabled
            label="Original text"
            value={originalValue}
            rows={rows}
            inputProps={{
              style: {
                webkitTextFillColor: "rgba(0, 0, 0, 0.87)",
                fontFamily: [`"Noto Serif JP"`, "Roboto"],
              } as any,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            multiline
            label={
              currentValue === undefined ? "No Translation" : "Translated text"
            }
            value={currentValue || ""}
            onChange={handleChange}
            rows={rows}
            inputProps={{
              style: {
                fontFamily: [`"Noto Serif JP"`, "Roboto"],
              } as any,
            }}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

const WrappedEditor = React.memo(
  Editor,
  (prev: EditorProps, next: EditorProps) =>
    prev.currentValue === next.currentValue &&
    prev.localisation.key === next.localisation.key &&
    prev.onChange === next.onChange
);

const SourceTree: React.FC<{
  file: File;
  edit: Dictionary;
  onChange: (key: string, value: string | undefined) => void;
}> = ({ file, edit, onChange }) => {
  return (
    <Stack
      direction="column"
      sx={{
        width: "100%",
      }}
    >
      <Typography
        variant="subtitle1"
        component="h2"
        sx={{ height: "1.5rem", marginBottom: "0.5rem" }}
      >
        {file.name}
      </Typography>
      <Stack
        direction="column"
        sx={{
          height: "calc(90vh - 2rem)",
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
          const key = `translation-editor-idx-${i}`;
          if (isLocalisation(line)) {
            const { key } = line;
            return (
              <WrappedEditor
                key={key}
                localisation={line}
                currentValue={edit.get(key)}
                onChange={onChange}
              />
            );
          } else {
            return (
              <p key={key} style={{ color: "#346f42" }}>
                <code>{line}</code>
              </p>
            );
          }
        })}
      </Stack>
    </Stack>
  );
};

type Props = {
  dispatcher: Dispatcher;
};

const Translator: React.FC<Props> = ({ dispatcher }) => {
  const { edit } = React.useContext(StateContext);
  const [file, setFile] = React.useState<File | undefined>(undefined);
  const [isFileLoading, setIsFileLoading] = React.useState(false);

  React.useEffect(() => {
    if (isFileLoading && file !== undefined) {
      setIsFileLoading(false);
      dispatcher.disableProcessing();
    }
  }, [dispatcher, file, isFileLoading]);

  const onFileClick = React.useCallback(
    (file: File) => {
      setFile(undefined);
      setIsFileLoading(true);
      dispatcher.enableProcessing("ファイルをロード中");
      setTimeout(() => setFile(file), 10);
    },
    [dispatcher]
  );

  const onChange = React.useCallback(
    (key: string, value: string | undefined) => {
      if (value) {
        dispatcher.patchEdit(key, value);
      } else {
        dispatcher.deleteFromEdit(key);
      }
    },
    [dispatcher]
  );

  return (
    <Grid container spacing={2} sx={{ height: "100%" }}>
      <Grid item xs={3} sx={{ height: "100%" }}>
        <FileTree onItemClick={onFileClick} />
      </Grid>
      <Grid item xs={9} sx={{ height: "100%" }}>
        {file && edit && (
          <SourceTree file={file} edit={edit} onChange={onChange} />
        )}
      </Grid>
    </Grid>
  );
};

export default React.memo(Translator);
