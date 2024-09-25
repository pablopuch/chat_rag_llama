import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './page/admin';
import HomePage from './page/home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
