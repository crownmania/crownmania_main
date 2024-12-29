import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import Header from './components/Header';
import Landing from './components/Landing';
import Gallery from './components/Gallery';
import Shop from './components/Shop';
import About from './components/About';
import Vault from './components/Vault';
import Footer from './components/Footer';
import ForumPage from './pages/ForumPage';
import ContactPage from './pages/ContactPage';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px;
`;

const HomePage = () => (
  <>
    <Landing />
    <Gallery />
    <Shop />
    <About />
    <Vault />
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <GlobalStyles />
      <AppContainer>
        <Header />
        <MainContent>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;
