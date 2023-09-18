import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import Home from './Home.jsx';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Pessoa from './Pessoa';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="pessoas/:id" element={<Pessoa />} />
    </Routes>
  </BrowserRouter>
);
