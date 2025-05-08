import React, { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './Resources/ErrorBoundary'
import Inpage404 from './Resources/Inpage404'
import LandingPage from './Pages/HomeRelatedPages/LandingPage'
import Contracts from './Pages/ContractsRelatedPage/Contracts'
import Premiums from './Pages/PremiumsRelatedPage/Premiums'
import Claims from './Pages/ClaimsRelatedPage/Claims'
import Login from './Pages/AuthRelatedPage/Login'
import toast from 'react-hot-toast'

export const backendUrl = `${import.meta.env.VITE_BACKEND_URL}/api`

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      toast.info('Please login to continue')
     navigate('/login') 
    }
  }, [])

  return (
    <div className="">
      <ErrorBoundary>
        <Routes>
          <Route path='*' element={<Inpage404/>}/>
          <Route path='/' element={<LandingPage />} />
          <Route path='/contracts' element={<Contracts />} />
          <Route path='/contracts/:id' element={<Contracts />} />
          <Route path='/premiums' element={<Premiums />} />
          <Route path='/premiums/:id' element={<Premiums />} />
          <Route path='/claims' element={<Claims />} />
          <Route path='/claims/:id' element={<Claims />} />
          <Route path='/login' element={<Login/>} />
        </Routes>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            className: '',
            duration: 3000,
            style: {
              background: '#333',
              color: '#4F391A',
              fontSize: '16px',
              padding: '10px',
              borderRadius: '7px',
              border: '1px solid #AAC624',
            },
            success: {
              style: {
                background: '#fff',
                color: '#4F391A',
              },
            },
            error: {
              style: {
                background: '#fff',
                color: '#4F391A',
              },
            },
          }}
        />
      </ErrorBoundary>
    </div>
  )
}

export default App
