import './App.css'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/auth/PrivateRoute'

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
import ServicePage from './pages/admin/ServicePage'



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
        <Route element={<PrivateRoute allowedRoles={['psychologist']}/>}>
          <Route path='/psychologist/verification' element={< VerificationPage/>} />
        </Route>

        {/* admin routes */}
        <Route path='/admin/login' element={< AdminLoginPage />} />
        <Route element={<PrivateRoute allowedRoles={['admin']}/>}>
          <Route path='/admin/dashboard' element={< AdminDashboard />} />
          <Route path='/admin/services' element={<ServicePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
