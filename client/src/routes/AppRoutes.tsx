import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setNavigator } from '@/lib/utils/navigation';

import { userRoutes } from './UserRoutes';
import { psychologistRoutes } from './PsychologistRoutes';
import { adminRoutes } from './AdminRoutes';
import { publicRoutes } from './PublicRoutes';

const AppRoutesInner = () => {
  const navigate = useNavigate();
  setNavigator(navigate);

  return (
    <>
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
        {/* public */}
        {publicRoutes.map(route => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* user */}
        {userRoutes.map(route => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* psychologist */}
        {psychologistRoutes.map(route => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* admin */}
        {adminRoutes.map(route => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </>
  );
};

const AppRoutes = () => (
  <BrowserRouter>
    <AppRoutesInner />
  </BrowserRouter>
);

export default AppRoutes;
