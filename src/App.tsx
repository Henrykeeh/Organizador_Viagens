import Home from './pages/home/Home';
import Viagens from './pages/viagens/Viagens';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/viagens" element={<Viagens />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
export default App;