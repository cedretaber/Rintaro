import { Button, Grid, Stack } from "@mui/material";
import React from "react";
import FileTree from "../components/FileTree";
import KeyList from "../components/KeyList";
import OriginalTextArea from "../components/OriginaiTextArea";
import TranslatedTextArea from "../components/TranslatedTextArea";
import { StateContext } from "../context";
import Dispatcher from "../dispatcher";
import { File, Localisation, localisationsAsArray } from "../domains/mod";

type Props = {
  dispatcher: Dispatcher;
};

const Translator: React.FC<Props> = ({ dispatcher }) => {
  const { mod, edit } = React.useContext(StateContext);
  const [file, setFile] = React.useState<File | undefined>(undefined);
  const [localisation, setLocalisation] = React.useState<
    Localisation | undefined
  >(undefined);
  const [text, setText] = React.useState(
    localisation ? edit.get(localisation.key) || "" : ""
  );
  const [changed, setChanged] = React.useState(false);

  const onFileClick = React.useCallback((file: File) => {
    setFile(file);
    setLocalisation(undefined);
    setText("");
    setChanged(false);
  }, []);

  const onLocalisationClick = React.useCallback(
    (localisation: Localisation) => {
      setLocalisation(localisation);
      setText(localisation ? edit.get(localisation.key) || "" : "");
      setChanged(false);
    },
    [edit]
  );

  const handleTextChange = React.useCallback(
    (newText: string) => {
      if (localisation) {
        setText(newText);
        setChanged(true);
      }
    },
    [localisation]
  );

  const handleSaveText = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (localisation) {
        dispatcher.patchEdit(localisation.key, text);
        setChanged(false);
      }
    },
    [dispatcher, localisation, text]
  );

  const handleDeleteText = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (localisation) {
        setText("");
        dispatcher.deleteFromEdit(localisation.key);
        setChanged(true);
      }
    },
    [dispatcher, localisation]
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        {mod && <FileTree onItemClick={onFileClick} />}
      </Grid>
      <Grid item xs={2}>
        {file && (
          <KeyList
            localisations={localisationsAsArray(file)}
            onItemClick={onLocalisationClick}
            current={localisation}
          />
        )}
      </Grid>
      <Grid item xs={8}>
        <Stack spacing={2}>
          <OriginalTextArea text={localisation?.value} />
          <TranslatedTextArea
            text={text}
            updateText={handleTextChange}
            changed={changed}
          />
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            sx={{ paddingRight: "2rem" }}
          >
            <Button
              variant="contained"
              onClick={handleSaveText}
              disabled={localisation === undefined}
            >
              保存
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteText}
              disabled={localisation === undefined}
            >
              削除
            </Button>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Translator;
