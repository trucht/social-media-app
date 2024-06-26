import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css'
import './App.css';

import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SinglePost from './pages/SinglePost';

import MenuBar from './components/MenuBar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact element={<AuthRoute />}>
              <Route exact path="/register" element={<Register />} />
            </Route>
            <Route exact element={<AuthRoute />}>
              <Route exact path="/login" element={<Login />} />
            </Route>
            <Route exact path='/posts/:postId' element={<SinglePost />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
