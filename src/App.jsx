import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Video from './Pages/Video/Video.jsx';
import Home from './Pages/Home/Home.jsx';

function App() {
  const [sidebar, setSidebar] = useState(true);

  return (
    <div>
      <Navbar setSidebar={setSidebar} />
      <Routes>
        <Route path="/" element={<Home sidebar={sidebar} />} />
        <Route path="/video/:categoryid/:videoid" element={<Video />} />
      </Routes>
    </div>
  );
}

export default App;