import TextField from "@mui/material/TextField";

type Props = {
  text?: string;
};

const OriginalTextArea: React.FC<Props> = ({ text }) => {
  return (
    <TextField
      fullWidth
      multiline
      disabled
      label="Original text"
      value={text || ""}
      rows={6}
      sx={{
        marginTop: "2rem",
      }}
      inputProps={{
        style: { WebkitTextFillColor: "rgba(0, 0, 0, 0.87)" } as any,
      }}
    />
  );
};

export default OriginalTextArea;
