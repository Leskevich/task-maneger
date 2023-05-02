import React, { useEffect } from "react";
import "./App.css";
import { useAppSelector } from "./store";
import { appThunk } from "./app-reducer";
import { CircularProgress } from "@mui/material";
import { selectIsInitialized } from "app";
import { useActions } from "../common";
import { AppContainer } from "./container/Container";
import { AppHeaderBar } from "./appBar/AppBar";

type PropsType = {
  demo?: boolean;
};

function App({ demo = false }: PropsType) {
  const isInitialized = useAppSelector(selectIsInitialized);
  const { me } = useActions(appThunk);

  useEffect(() => {
    me({});
  }, []);

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="App">
      <AppHeaderBar />
      <AppContainer demo={demo} />
    </div>
  );
}

export default App;
