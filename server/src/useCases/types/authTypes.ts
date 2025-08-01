export interface ILoginInput {
  email: string;
  password: string;
}

export interface ILoginOutput {
  user: {
    name: string;
    email: string;
    role: "user" | "psychologist";
    profileImage?: string;
  };
  accessToken: string;
  refreshToken: string;
  hasSubmittedVerificationForm: boolean;
}

export interface IGoogleLoginInput {
  credential: string;
  role: "user" | "psychologist";
}

export interface IGoogleLoginOutput {
  user: {
    name: string;
    email: string;
    role: "user" | "psychologist";
    profileImage?: string;
  };
  accessToken: string;
  refreshToken?: string;
  hasSubmittedVerificationForm: boolean;
}

export interface IVerifyOtpOutput {
  user: {
    name: string;
    email: string;
    role: "user" | "psychologist";
    profileImage?: string;
  };
  accessToken: string;
  refreshToken?: string;
}
