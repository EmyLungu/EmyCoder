// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import Navbar from './components/Navbar';

const LanguagePredictor = () => <div>Language Predictor Page</div>;
const RunProgram = () => <div>Run Program Page</div>;

function App() {
    // const [count, setCount] = useState(0)
    const appVersion = '0.9.0';

    return (
        <BrowserRouter>
            <Navbar />

            <main className='min-h-screen bg-gray-50'>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/lang-predict" element={<LanguagePredictor />} />
                    <Route path="/run" element={<RunProgram />} />
                </Routes>
            </main>
        </BrowserRouter>
    )
}

export default App
