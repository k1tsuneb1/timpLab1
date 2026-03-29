import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import IncidentList from './components/IncidentList';
import EditIncident from './components/EditIncident';
import IncidentDetails from './components/IncidentDetails';

function App() {
  return (
    <Router>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
        
        {/* Шапка приложения */}
        <header style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', paddingBottom: '10px', borderBottom: '2px solid #007bff' }}>
          <h1 style={{ margin: 0, color: '#007bff' }}>Логистика.Безопасность</h1>
          <Link to="/" style={{ marginLeft: 'auto', textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
            На главную
          </Link>
        </header>

        <Routes>
          <Route path="/" element={<IncidentList />} />
          <Route path="/edit/:id" element={<EditIncident />} />
          <Route path="/incident/:id" element={<IncidentDetails />} />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
