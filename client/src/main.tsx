import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store.ts';
import { PersistGate } from 'redux-persist/integration/react';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="h-screen w-full flex items-center justify-center bg-black text-white">
            <div className="w-8 h-8 border-4 border-t-white border-white/20 rounded-full animate-spin" />
          </div>
        }
        persistor={persistor}
      >
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
