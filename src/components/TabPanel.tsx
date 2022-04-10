import { Box, Typography } from "@mui/material";

type Props = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

const TabPanel: React.FC<Props> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    {...other}
  >
    <Box sx={{ p: 3 }}>
      <Typography>{children}</Typography>
    </Box>
  </div>
);

export default TabPanel;
