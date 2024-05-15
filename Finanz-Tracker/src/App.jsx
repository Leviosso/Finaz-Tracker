import Tracker from "./components/Tracker";

import "./App.css";

//Die App-Komponente wird in eine eigene Datei ausgelagert
//und die Tracker-Komponente wird in die App-Komponente importiert
const App = () => {

  return (
    <div>
      <Tracker />
    </div>
  );
}

export default App;
