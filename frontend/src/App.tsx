import { createTheme, ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Questions from './pages/Questions.tsx'
import Room from './pages/Room.tsx'
import Signup from './pages/Signup.tsx'
import Users from './pages/Users.tsx'
import VideoChat from './components/VideoChat.tsx'

const queryClient = new QueryClient()

const theme = createTheme({
    typography: {
        fontFamily: ['Segoe UI', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    },
})

const App: React.FC = () => {
    const location = useLocation()
    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <AnimatePresence mode='wait'>
                    <Routes location={location} key={location.pathname}>
                        <Route key='Login' path='/' element={<Login />} />
                        <Route key='Signup' path='/signup' element={<Signup />} />
                        <Route key='Questions' path='/questions' element={<Questions />} />
                        <Route key='Users' path='/users' element={<Users />} />
                        <Route key='Room' path='/room/:roomId' element={<Room />} />
                        <Route key='Video' path='video' element={<VideoChat/>} />
                    </Routes>
                </AnimatePresence>
            </QueryClientProvider>
        </ThemeProvider>
    )
}

export default App
