import './App.css';
import AppRoutes from './routes/AppRoutes';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from './redux/store';
import { connectSocket, disconnectSocket } from './services/api/socket';

function App() {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  useEffect(() => {
    console.log('connection useeffect called');
    if(accessToken) {
      connectSocket(accessToken);
    } else {
      disconnectSocket();
    }
  }, [accessToken]);
  return <AppRoutes/>;
}

export default App;
