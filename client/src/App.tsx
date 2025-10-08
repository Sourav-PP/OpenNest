import './App.css';
import AppRoutes from './routes/AppRoutes';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from './redux/store';
import { connectSocket, disconnectSocket } from './services/api/socket';
import { connectNotificationSocket, disconnectNotificationSocket } from './services/api/notificationSocket';

function App() {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  useEffect(() => {
    if(accessToken) {
      // chat socket
      connectSocket(accessToken);

      // notification socket
      connectNotificationSocket(accessToken);
    } else {
      disconnectSocket();
      disconnectNotificationSocket();
    }
  }, [accessToken]);
  return <AppRoutes/>;
}

export default App;
