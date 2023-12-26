import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css'
import './App.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import MenuBar from './components/MenuBar';

function App() {
  return (
    <Router>
      <Container>
        <MenuBar />
        <Routes>
          <Route exact path='/' Component={Home} />
          <Route exact path='/register' Component={Register} />
          <Route exact path='/login' Component={Login} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
