import Tracker from "./components/Tracker";
import React, { useState, useEffect } from "react";

import "./App.css";

//Die App-Komponente wird in eine eigene Datei ausgelagert
const App = () => {

  return (
    <div>
      <Tracker />
    </div>
  );
}

export default App;
