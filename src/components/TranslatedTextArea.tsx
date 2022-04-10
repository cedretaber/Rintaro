import TextField from "@mui/material/TextField";
import React from "react";

type Props = {
  text: string;
  updateText: (updatedText: string) => void;
  changed: boolean;
};

const TranslatedTextArea: React.FC<Props> = ({ text, updateText, changed }) => {
  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      event.stopPropagation();
      updateText(event.currentTarget.value);
    },
    [updateText]
  );

  const changedAlert = changed
    ? {
        error: true,
        helperText: "変更は保存されていません！",
      }
    : {};

  return (
    <TextField
      fullWidth
      multiline
      label="Translated text"
      value={text}
      onChange={handleChange}
      rows={6}
      {...changedAlert}
    />
  );
};

export default TranslatedTextArea;
