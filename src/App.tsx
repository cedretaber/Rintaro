import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { StateContext } from "./context";
import Translation from "./domains/translation";
import Mod from "./domains/mod";
import ModSelector from "./pages/ModSelector";
import { remoteApi } from "./remoteApi";
import Layout from "./components/Layout";
import Translator from "./pages/Translator";
import Error from "./pages/Error";
import Preview from "./pages/Preview";
import Dispatcher from "./dispatcher";
import Dictionary, { empty as emptyDictionary } from "./utils/dictionary";
import { lightBlue, teal } from "@mui/material/colors";
import Alert from "./domains/alert";

const theme = createTheme({
  palette: {
    primary: {
      main: teal[600],
    },
    secondary: {
      main: lightBlue[600],
    },
  },
  typography: {
    fontFamily: ["Roboto", '"Noto Sans JP"', "sans-serif"].join(","),
    fontSize: 14,
  },
});

function App() {
  const [mod, setMod] = React.useState<Mod | undefined>(undefined);
  const [translations, setTranslations] = React.useState<Translation[]>([]);
  const [edit, setEdit] = React.useState<Dictionary>(emptyDictionary());
  const [processing, setProcessing] = React.useState<string | undefined>(
    undefined
  );
  const [alerts, setAlerts] = React.useState<Alert[]>([]);

  const [currentPage, setCurrentPage] = React.useState(0);

  const dispatcher = React.useMemo(
    () =>
      new Dispatcher(
        setMod,
        setTranslations,
        setEdit,
        setProcessing,
        setAlerts
      ),
    [setMod, setTranslations, setEdit]
  );
  const stateContext = React.useMemo(
    () => ({ mod, translations, edit }),
    [mod, translations, edit]
  );

  return (
    <ThemeProvider theme={theme}>
      <StateContext.Provider value={stateContext}>
        <div
          className="App"
          style={{
            boxSizing: "border-box",
            height: "98vh",
            overflow: "hidden",
          }}
        >
          <Layout
            current={currentPage}
            setCurrent={setCurrentPage}
            processing={processing}
            alerts={alerts}
          >
            {(() => {
              switch (currentPage) {
                case 0:
                  return (
                    <ModSelector
                      dispatcher={dispatcher}
                      remoteApi={remoteApi}
                    />
                  );
                case 1:
                  return <Translator dispatcher={dispatcher} />;
                case 2:
                  return <Preview />;
                default:
                  return <Error />;
              }
            })()}
          </Layout>
        </div>
      </StateContext.Provider>
    </ThemeProvider>
  );
}

export default App;
