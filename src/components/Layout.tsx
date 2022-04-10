import { Container, Tab, Tabs } from "@mui/material";
import React from "react";
import NowProcessing from "./NowProcessing";
import Alert from "../domains/alert";
import Alerts from "./Alerts";

type Props = {
  current: number;
  setCurrent: (i: number) => void;
  children: React.ReactNode;
  processing: string | undefined;
  alerts: Alert[];
};

const Layout: React.FC<Props> = ({
  current,
  setCurrent,
  children,
  processing,
  alerts,
}) => {
  const handleChange = React.useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      event.preventDefault();
      event.stopPropagation();
      setCurrent(newValue);
    },
    [setCurrent]
  );

  return (
    <>
      <Container>
        <Tabs value={current} onChange={handleChange} aria-label="Menu Bar">
          <Tab label="ファイル" />
          <Tab label="編集" />
          <Tab label="確認" />
        </Tabs>
      </Container>
      {children}
      {processing && <NowProcessing text={processing} />}
      <Alerts alerts={alerts} />
    </>
  );
};

export default React.memo(Layout);
