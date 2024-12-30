'use client'

import { Template, InputText, Button, FieldError, useNotification } from '@/components'
import { useState } from 'react'
import { LoginForm, formScheme, validationScheme } from './formScheme'
import { useFormik } from 'formik'
import { useAuth } from '@/resources'
import { useRouter } from 'next/navigation'
import { Credentials } from '@/resources/user/users.resources'

export default function Login() {

    const [loading, setLoading] = useState<boolean>(false);

    const auth = useAuth();
    const notification = useNotification();
    const router = useRouter();

    const { values, handleChange, handleSubmit, errors } = useFormik<LoginForm>({
        initialValues: formScheme,
        validationSchema: validationScheme,
        onSubmit: onSubmit
    });

    async function onSubmit(values: LoginForm) {
        const credentials: Credentials = { username: values.username, password: values.password }
        try {
            const accessToken = await auth.authenticate(credentials);
            auth.initSession(accessToken);
            router.push("/users");
        } catch (error: any) {
            const message = error?.message;
            notification.notify(message, "error");
        }
    }

    return (
        <Template loading={loading}>
            <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>

                <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                    <h2 className='mt-10 text-center text-1xl font-bold leading-9 tracking-tight text-gray-900'>
                        Login to Your Account
                    </h2>
                </div>

                <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
                    <form onSubmit={handleSubmit} className='space-y-2'>
                        <div>
                            <label className='block text-sm font-medium leading-6 text-gray-900'>Username:</label>
                        </div>
                        <div className='mt-2'>
                            <InputText style='w-full'
                                id='username'
                                value={values.username}
                                onChange={handleChange} />
                            <FieldError error={errors.username} />
                        </div>

                        <div>
                            <label className='block text-sm font-medium leading-6 text-gray-900'>Password:</label>
                        </div>
                        <div className='mt-2'>
                            <InputText style='w-full'
                                type="password"
                                id='password'
                                value={values.password}
                                onChange={handleChange} />
                            <FieldError error={errors.password} />
                        </div>

                        <div>
                            <Button type='submit'
                                style='bg-indigo-700 hover:bg-indigo-500'
                                label='Login' />
                        </div>
                    </form>
                </div>

            </div>
        </Template>
    )
}
