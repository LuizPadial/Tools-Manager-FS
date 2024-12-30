import * as Yup from 'yup'

export interface LoginForm {
    name?: string;
    username: string;
    password: string;
    passwordMatch?: string;
}

export const validationScheme  = Yup.object().shape({
    username: Yup.string().trim().required('Username is required!'),
    password: Yup.string().required('Password is required').min(6, 'Password must have at least 6 characters!'),
    passwordMatch: Yup.string().oneOf( [Yup.ref('password')], 'Password must match!' )
})

export const formScheme: LoginForm = { username: '', name: '', password: '', passwordMatch: '' }