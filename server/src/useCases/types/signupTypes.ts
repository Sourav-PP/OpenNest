export interface ISignupInput {
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string,
    file: Express.Multer.File,
    role: 'user' | 'psychologist'
}

// export interface ISignupOutput {
//     user: {
//         name: string,
//         email: string,
//         role: "user" | "psychologist",
//         profileImage: string
//     }
//     accessToken: string,
//     refreshToken: string
// }

export type ISignupOutput = string;