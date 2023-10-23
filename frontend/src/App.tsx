import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Questions from './pages/Questions.tsx'
import Users from './pages/Users.tsx'
import Login from './pages/Login.tsx'
import { Route, Routes, useLocation } from 'react-router-dom'
import Signup from './pages/Signup.tsx'
import { AnimatePresence } from 'framer-motion'

const queryClient = new QueryClient()
const App: React.FC = () => {
    const location = useLocation()
    return (
        <QueryClientProvider client={queryClient}>
            <AnimatePresence mode='wait'>
                <Routes location={location} key={location.pathname}>
                    <Route key='Login' path='/' element={<Login />} />
                    <Route key='Signup' path='/signup' element={<Signup />} />
                    <Route key='Questions' path='/questions' element={<Questions />} />
                    <Route key='Users' path='/users' element={<Users />} />
                </Routes>
            </AnimatePresence>
        </QueryClientProvider>
    )
}

export default App
