import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
  Tooltip,
  Box,
  Button,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import React from "react";
import { StateContext } from "../context";
import Dispatcher from "../dispatcher";
import ReadModUsecase from "../usecases/readModUsecase";
import ReadTranslationUsecase from "../usecases/readTranslationUsecase";
import PatchTranslationModUsecase from "../usecases/patchTranslationModUsecase";
import Translation from "../domains/translation";
import WriteTranslationUsecase from "../usecases/writeTranslationUsecase";
import SaveDataUsecase from "../usecases/saveDataUsecase";
import LoadDataUsecase from "../usecases/loadDataUsecase";
import RemoteApi from "../remoteApi";
import { blueGrey, teal } from "@mui/material/colors";

const TranslationButtonList: React.FC<{
  translation: Translation;
  onPatchTranslation: (translation: Translation) => void;
  onRemoveTranslation: (translation: Translation) => void;
}> = ({ translation, onPatchTranslation, onRemoveTranslation }) => {
  const handlePatchTranslation = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      onPatchTranslation(translation);
    },
    [translation, onPatchTranslation]
  );
  const handleRemoveTranslation = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      onRemoveTranslation(translation);
    },
    [translation, onRemoveTranslation]
  );
  return (
    <Stack direction="row" spacing={2}>
      <Tooltip title="翻訳を上書きする">
        <IconButton
          edge="end"
          aria-label="override"
          color="error"
          onClick={handlePatchTranslation}
        >
          <DownloadIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="取り除く">
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={handleRemoveTranslation}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

const WrappedTranslationButtonList = React.memo(TranslationButtonList);

type Props = {
  dispatcher: Dispatcher;
  remoteApi: RemoteApi;
};

const ModSelector: React.FC<Props> = ({ dispatcher, remoteApi }) => {
  const { mod, translations, edit } = React.useContext(StateContext);

  const handleReadMod = React.useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const mod = await new ReadModUsecase(remoteApi).execute();
      if (mod.isOk) {
        dispatcher.changeMod(mod.value);
      } else if (mod.error.includes("キャンセル")) {
        dispatcher.addAlert("info", mod.error);
      } else {
        dispatcher.addAlert("error", mod.error);
      }
    },
    [remoteApi, dispatcher]
  );

  const handleAddTranslation = React.useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const translation = await new ReadTranslationUsecase(remoteApi).execute();
      if (translation.isOk) {
        dispatcher.addTranslation(translation.value);
      } else if (translation.error.includes("キャンセル")) {
        dispatcher.addAlert("info", translation.error);
      } else {
        dispatcher.addAlert("error", translation.error);
      }
    },
    [remoteApi, dispatcher]
  );

  const onRemoveTranslation = React.useCallback(
    (translation: Translation) => dispatcher.removeTranslation(translation),
    [dispatcher]
  );

  const onPatchTranslation = React.useCallback(
    (translation: Translation) => {
      if (mod) {
        const newEdit = new PatchTranslationModUsecase().execute(
          mod,
          translation
        );
        dispatcher.changeEdit(newEdit);
      }
    },
    [dispatcher, mod]
  );

  const handleSaveData = React.useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (mod !== undefined && edit !== undefined) {
        await new SaveDataUsecase(remoteApi).execute(mod, edit);
      }
    },
    [mod, edit, remoteApi]
  );

  const handleLoadData = React.useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const saveData = await new LoadDataUsecase(remoteApi).execute();
      if (saveData.isOk) {
        const [mod, edit] = saveData.value;
        dispatcher.changeMod(mod);
        dispatcher.changeEdit(edit);
      } else if (saveData.error.includes("キャンセル")) {
        dispatcher.addAlert("info", saveData.error);
      } else {
        dispatcher.addAlert("error", saveData.error);
      }
    },
    [remoteApi, dispatcher]
  );

  const handleWriteTranslation = React.useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (mod) {
        await new WriteTranslationUsecase(remoteApi).execute(mod, edit);
      }
    },
    [mod, edit, remoteApi]
  );

  return (
    <>
      <Box
        sx={{
          backgroundColor: blueGrey[800],
          color: teal[50],
          marginBottom: "2rem",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" sx={{ fontWeight: "bold" }}>
            Rintaro
          </Typography>
        </Container>
      </Box>
      <Container maxWidth="md">
        <Grid container spacing={2} sx={{ marginLeft: "0" }}>
          <Grid item xs={3}>
            <Stack spacing={4}>
              <Box>
                <Typography variant="subtitle1">Mod</Typography>
                <Typography variant="caption">
                  外部の Mod ファイルを読み込みます
                </Typography>
              </Box>
              <Button
                onClick={handleReadMod}
                variant="outlined"
                sx={{ width: "10rem" }}
              >
                ベース Mod
              </Button>
              <Button
                onClick={handleAddTranslation}
                variant="outlined"
                sx={{ width: "10rem" }}
              >
                翻訳 Mod 追加
              </Button>
              <Divider />
              <Box>
                <Typography variant="subtitle1">JSON 形式</Typography>
                <Typography variant="caption">
                  Rintaro 独自の形式です
                </Typography>
              </Box>
              <Button
                onClick={handleSaveData}
                variant="outlined"
                sx={{ width: "10rem" }}
              >
                保存
              </Button>
              <Button
                onClick={handleLoadData}
                variant="outlined"
                sx={{ width: "10rem" }}
              >
                読み込み
              </Button>
              <Divider />
              <Button
                onClick={handleWriteTranslation}
                variant="contained"
                sx={{ width: "10rem" }}
              >
                書き出す
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={9}>
            <Stack spacing={2}>
              <Box>
                <List subheader={<ListSubheader>Mod 名</ListSubheader>}>
                  {mod && (
                    <ListItem>
                      <ListItemText primary={mod.name} />
                    </ListItem>
                  )}
                </List>
              </Box>
              <Box>
                <List
                  subheader={<ListSubheader>翻訳ファイル一覧</ListSubheader>}
                >
                  {translations.map((translation, i) => (
                    <ListItem
                      key={`translation-${i}`}
                      sx={{
                        borderBottom: "solid 1px rgba(0,0,0,0)",
                        transition: "0.5s",
                        "&:hover": {
                          borderBottom: "solid 1px rgba(0,0,0,0.38)",
                          width: "100%",
                        },
                      }}
                    >
                      <ListItemText primary={translation.name} />
                      <WrappedTranslationButtonList
                        translation={translation}
                        onPatchTranslation={onPatchTranslation}
                        onRemoveTranslation={onRemoveTranslation}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default React.memo(ModSelector);
