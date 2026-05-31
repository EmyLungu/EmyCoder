import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import Navbar from './components/Navbar';
import LangClassifier from './pages/LangClassifier';
import Run from './pages/Run';

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <main className='min-h-screen bg-gray-50'>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/lang-classifier" element={<LangClassifier />} />
                    <Route path="/run" element={<Run />} />
                </Routes>
            </main>
        </BrowserRouter>
    )
}

export default App
