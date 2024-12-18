import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header'; // import your Header component
import Home from './pages/Home';
import Footer from './components/Fotter';
import Aboutus from './pages/Aboutus';
import Contactus from './pages/Contactus';
import Gallarysection from './pages/Gallarysection';
import Login from './pages/Login';
import Page404 from './pages/Page404';
function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
         <Route path='/' element={<Home />} />
         <Route path='/About' element={<Aboutus />} />
         <Route path='/contact' element={<Contactus/>} />
         <Route path='/gallery' element={<Gallarysection/>} />
         <Route path='/login' element={<Login/>} />
         <Route path='/404' element={<Page404/>} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

// Dummy components for each route

export default App;
