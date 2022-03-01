
import BasicGrid from './components/GridComponent';
import './App.css';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend'

function App() {

  return (
    <DndProvider backend={HTML5Backend}>
      <BasicGrid />
    </DndProvider>

  );
}

export default App;

