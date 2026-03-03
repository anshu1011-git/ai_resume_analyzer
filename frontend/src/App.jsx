import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AnimatePresence } from 'framer-motion'
import 'react-toastify/dist/ReactToastify.css'

// Pages (to be created)
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ResumeDetail from './pages/ResumeDetail'
import ResumeCompare from './pages/ResumeCompare'
import Layout from './components/Layout'

function AppContent({ isDarkMode, toggleDarkMode }) {
    const location = useLocation();

    return (
        <div className="min-h-screen transition-colors duration-200">
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<Layout toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/resume/:id" element={<ResumeDetail />} />
                        <Route path="/compare" element={<ResumeCompare />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AnimatePresence>
            <ToastContainer position="bottom-right" theme={isDarkMode ? 'dark' : 'toast'} />
        </div>
    )
}

function App() {
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    )

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [isDarkMode])

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

    return (
        <Router>
            <AppContent isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </Router>
    )
}

export default App
