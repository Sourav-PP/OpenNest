import './App.css'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/auth/PrivateRoute'
import PublicRoute from './components/auth/PublicRoute'


// =============== PAGES =================

// ------------ user -------------
import SignupPage from './pages/user/SignupPage'
import LoginPage from './pages/user/LoginPage'
import LandingPage from './pages/user/LandingPage'
import TherapistPage from './pages/user/TherapistPage'
import UserProfilePage from './pages/user/UserProfilePage'
import PsychologistDetailPage from './pages/user/PsychologistDetailPage'
import UserServicePage from './pages/user/UserServicePage'
import Success from './components/user/Success'
import Cancel from './components/user/Cancel'
import MySessionsPage from './pages/user/MySessionsPage'

// ------------ psychologist ---------------
import VerificationPage from './pages/psychologist/VerificationPage'
import ProfilePage from './pages/psychologist/ProfilePage'
import EditProfilePage from './pages/psychologist/EditProfilePage'
import CreateSlotPage from './pages/psychologist/CreateSlotPage'
import MyKycDetailsPage from './pages/psychologist/MyKycDetailsPage'

//------------- admin ---------------
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboard from './pages/admin/Dashboard'
import UserManagement from './pages/admin/UserManagement'
import PsychologistManagement from './pages/admin/PsychologistManagement'
import ServicePage from './pages/admin/ServicePage'
import KycManagement from './pages/admin/KycManagement'
import KycVerificationPage from './pages/admin/KycVerificationPage'




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
        {/* user auth routes */}
        <Route path='/signup' element={<PublicRoute><SignupPage /></PublicRoute >}/>
        <Route path='/login' element={<PublicRoute><LoginPage /></PublicRoute>} />
 
        {/* user public pages */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/user/therapist' element={< TherapistPage/>} />
        <Route path='/user/psychologists/:id' element={< PsychologistDetailPage/>} />
        <Route path='/user/success' element={<Success/>}/>
        <Route path='/user/cancel' element={<Cancel/>}/>
        <Route path='/user/services' element={<UserServicePage/>} />
        <Route path='/user/profile' element={<PrivateRoute allowedRoles={['user']}><UserProfilePage/></PrivateRoute>} />
        <Route path='/user/consultations' element={<PrivateRoute allowedRoles={['user']}><MySessionsPage/></PrivateRoute>} />

        {/* <Route element={<PrivateRoute allowedRoles={['user']}/>}>
        </Route> */}

        {/* psychologist protected routes */}
        <Route path='/psychologist/verification' element={<PrivateRoute allowedRoles={['psychologist']}>< VerificationPage/></PrivateRoute>} />
        <Route path='/psychologist/profile' element={<PrivateRoute allowedRoles={['psychologist']}>< ProfilePage /></PrivateRoute>} />
        <Route path='/psychologist/edit-profile' element={<PrivateRoute allowedRoles={['psychologist']}>< EditProfilePage /></PrivateRoute>} />
        <Route path='/psychologist/kyc' element={<PrivateRoute allowedRoles={['psychologist']}>< MyKycDetailsPage /></PrivateRoute>} />
        <Route path='/psychologist/slot' element={<PrivateRoute allowedRoles={['psychologist']}><CreateSlotPage/></PrivateRoute>} />


        {/* admin routes */}
        <Route path='/admin/login' element={<PublicRoute>< AdminLoginPage /></PublicRoute>} />

        <Route path='/admin/dashboard' element={<PrivateRoute allowedRoles={['admin']}>< AdminDashboard /></PrivateRoute>} />
        <Route path='/admin/users' element={<PrivateRoute allowedRoles={['admin']}><UserManagement /></PrivateRoute>}/>
        <Route path='/admin/psychologists' element={<PrivateRoute allowedRoles={['admin']}><PsychologistManagement /></PrivateRoute>}/>
        <Route path='/admin/kyc' element={<PrivateRoute allowedRoles={['admin']}><KycManagement /></PrivateRoute>}/>
        <Route path='/admin/kyc/:psychologistId' element={<PrivateRoute allowedRoles={['admin']}><KycVerificationPage /></PrivateRoute>}/>
        <Route path='/admin/services' element={<PrivateRoute allowedRoles={['admin']}><ServicePage /></PrivateRoute>} />
  
      </Routes>
    </BrowserRouter>
  )
}

export default App
