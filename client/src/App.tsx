import './App.css'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// pages
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import VerificationPage from './pages/VerificationPage'

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
        <Route path='/signup' element={<SignupPage />}/>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/verification' element={< VerificationPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
