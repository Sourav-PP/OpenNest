import './App.css'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// =============== PAGES =================

// ------------ user -------------
import SignupPage from './pages/user/SignupPage'
import LoginPage from './pages/user/LoginPage'
import LandingPage from './pages/user/LandingPage'

// ------------ psychologist ---------------
import VerificationPage from './pages/psychologist/VerificationPage'

//------------- admin ---------------
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboard from './pages/admin/Dashboard'



function App() {

  return (
    <BrowserRouter>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        {/* user routes */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/signup' element={<SignupPage />}/>
        <Route path='/login' element={<LoginPage />} />

        {/* psychologist routes */}
        <Route path='/verification' element={< VerificationPage/>} />

        {/* admin routes */}
        <Route path='/admin/login' element={< AdminLoginPage />} />
        <Route path='/admin/dashboard' element={< AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
