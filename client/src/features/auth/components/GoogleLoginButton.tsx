import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginSuccess } from '@/redux/slices/authSlice';
import { toast } from 'react-toastify';
import { authApi } from '@/services/api/auth';
import { handleApiError } from '@/lib/utils/handleApiError';
import { walletApi } from '@/services/api/wallet';
import { UserRole, type UserRoleType } from '@/constants/User';

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (options: { client_id: string; callback: (response: CredentialResponse) => void }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              shape: 'pill';
              size?: 'small' | 'medium' | 'large';
              width?: string | number;
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
  interface CredentialResponse {
    credential: string;
    select_by: string;
  }
}

interface TokenPayload {
  userId: string;
  email: string;
  role: UserRoleType;
  exp: number;
  iat: number;
}

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const role = (searchParams.get('role') as UserRoleType) ?? UserRole.USER;

  useEffect(() => {
    if (!window.google) return;
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async response => {
        try {
          const res = await authApi.googleLogin({
            credential: response.credential,
            role,
          });

          if (!res.data) {
            toast.error('Failed to login, please try again!');
            return;
          }

          const decoded = jwtDecode<TokenPayload>(res.data.accessToken);

          dispatch(
            loginSuccess({
              accessToken: res.data.accessToken,
              email: res.data.user.email,
              role: res.data.user.role,
              userId: decoded.userId,
              isSubmittedVerification: res.data.hasSubmittedVerificationForm,
            })
          );

          try {
            await walletApi.create();
          } catch (error) {
            handleApiError(error);
          }

          toast.success(res.message);

          // navigation based on role
          if (decoded.role === UserRole.PSYCHOLOGIST) {
            navigate(res.data.hasSubmittedVerificationForm ? '/psychologist/profile' : '/psychologist/verification');
          } else {
            navigate('/');
          }
        } catch (err) {
          handleApiError(err);
        }
      },
    });

    window.google.accounts.id.renderButton(document.getElementById('google-btn')!, {
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      width: '100%',
    });
  }, [dispatch, navigate, role]);

  return <div id="google-btn" className="my-4\" />;
};

export default GoogleLoginButton;
