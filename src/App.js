import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import './App.css';
import AddEditDetails from "./components/AddEditDetails";
import AddEditScheduled from "./components/AddEditScheduled";
import HeadingHome from './components/HeadingHome';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeadingHome/>} />
        <Route path="/scheduled" element={<AddEditScheduled/>} />
        <Route path="/details" element={<AddEditDetails/>}/>
      </Routes>
    </Router>
  );
}

export default App;
