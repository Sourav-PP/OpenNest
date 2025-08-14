import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginSuccess } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';
import { authApi } from '../../server/api/auth';

declare global { 
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (options: {
                        client_id: string;
                        callback: (response: CredentialResponse) => void
                    }) => void
                    renderButton: (
                        parent: HTMLElement,
                        options: {
                        theme?: 'outline' | 'filled_blue' | 'filled_black';
                        shape: 'pill'
                        size?: 'small' | 'medium' | 'large';
                        width?: string | number;
                        }
                    ) => void;
                    prompt: () => void;
                }
            }
        }
    }
    interface CredentialResponse {
        credential: string;
        select_by: string;
    }
}

interface TokenPayload {
    userId: string;
    email: string;
    role: 'user' | 'psychologist';
    exp: number;
    iat: number;
}

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const role = (searchParams.get('role') as 'user' | 'psychologist') ?? 'user'; 

  useEffect(() => {
    if(!window.google) return;
    console.log('client id: ', );
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async(response) => {
        try {
          const result = await authApi.googleLogin({
            credential: response.credential,
            role
          });

          console.log('result in frontend: ', result);

          const { accessToken, hasSubmittedVerificationForm } = result;
          const decoded = jwtDecode<TokenPayload>(accessToken);

          dispatch(loginSuccess({
            accessToken: accessToken,
            email: decoded.email,
            role: decoded.role,
            userId: decoded.userId,
            isSubmittedVerification: true,
          }));

          toast.success('Login successful');

          // navigation based on role
          if(decoded.role === 'psychologist') {
            if(hasSubmittedVerificationForm) {
              console.log('Navigating to profile');
              navigate('/psychologist/profile');
            }else{
              console.log('Navigating to verification');
              navigate('/psychologist/verification');
            }
          } else {
            navigate('/');
          }
        } catch(err) {
          const error = err as AxiosError<{ error: string }>;
          console.log('error is: ', error);
          toast.error(
            'Google Login failed: ' + error?.response?.data?.error || 'Unknown error'
          );
        }
      }
    });

    window.google.accounts.id.renderButton(
            document.getElementById('google-btn')!,
            {
              theme: 'outline',
              size: 'large',
              shape: 'pill',
              width: '100%'
            }
    );
  },[]);

  return <div id="google-btn" className="my-4\" />;
};

export default GoogleLoginButton;
