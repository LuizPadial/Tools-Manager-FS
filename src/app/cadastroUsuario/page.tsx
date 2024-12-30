'use client'

import { Template, InputText, Button, FieldError, useNotification, AuthenticatedPage } from '@/components'
import { useState } from 'react'
import { useFormik } from 'formik'
import { useAuth } from '@/resources'
import { useRouter } from 'next/navigation'
import { User } from '@/resources/user/users.resources'

export default function CadastroUsuario() {
    const [loading, setLoading] = useState<boolean>(false)
    const notification = useNotification()
    const router = useRouter()
    const auth = useAuth()

    const { values, handleChange, handleSubmit, errors, resetForm } = useFormik<User>({
        initialValues: {
            name: '',
            registration: '',
            username: '',
            password: '',
            manager: false,
            biometricData: '',
        },
        onSubmit: onSubmit,
    })

    async function onSubmit(values: User) {
        setLoading(true)
        try {
            const userToSave = { ...values, manager: Boolean(values.manager) }

            // Enviar os dados para a API para cadastrar o usuário
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.getUserSession()?.accessToken}`,
                },
                body: JSON.stringify(userToSave),
            })

            if (response.ok) {
                notification.notify('Usuário cadastrado com sucesso!', 'success')
                resetForm()
                router.push('/users') // Redirecionar para a página de usuários
            } else {
                const message = await response.text()
                notification.notify(message || 'Erro ao cadastrar usuário', 'error')
            }
        } catch (error: any) {
            notification.notify(error?.message || 'Erro ao cadastrar usuário', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthenticatedPage>
        <Template loading={loading}>
            <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
                <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                    <h2 className='mt-10 text-center text-1xl font-bold leading-9 tracking-tight text-gray-900'>
                        Cadastro de Usuário
                    </h2>
                </div>

                <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
                    <form onSubmit={handleSubmit} className='space-y-2'>
                        <div>
                            <label className='block text-sm font-medium leading-6 text-gray-900'>Nome: </label>
                        </div>
                        <div className='mt-2'>
                            <InputText
                                style='w-full'
                                id='name'
                                value={values.name}
                                onChange={handleChange}
                            />
                            <FieldError error={errors.name} />
                        </div>

                        <div>
                            <label className='block text-sm font-medium leading-6 text-gray-900'>Matrícula: </label>
                        </div>
                        <div className='mt-2'>
                            <InputText
                                style='w-full'
                                id='registration'
                                value={values.registration}
                                onChange={handleChange}
                            />
                            <FieldError error={errors.registration} />
                        </div>

                        <div>
                            <label className='block text-sm font-medium leading-6 text-gray-900'>Nome de Usuário: </label>
                        </div>
                        <div className='mt-2'>
                            <InputText
                                style='w-full'
                                id='username'
                                value={values.username}
                                onChange={handleChange}
                            />
                            <FieldError error={errors.username} />
                        </div>

                        <div>
                            <label className='block text-sm font-medium leading-6 text-gray-900'>Senha: </label>
                        </div>
                        <div className='mt-2'>
                            <InputText
                                style='w-full'
                                type="password"
                                id='password'
                                value={values.password}
                                onChange={handleChange}
                            />
                            <FieldError error={errors.password} />
                        </div>

                        {/* <div>
                            <label className='block text-sm font-medium leading-6 text-gray-900'>
                                Gestor:
                            </label>
                            <div className='mt-2'>
                                <input
                                    type="checkbox"
                                    id="manager"
                                    checked={values.manager}
                                    onChange={(e) => handleChange({ target: { name: 'manager', value: e.target.checked } })}
                                />
                                <span className='ml-2'>Sim</span>
                            </div>
                        </div> */}

                        <div>
                            <label className='block text-sm font-medium leading-6 text-gray-900'>Dados Biométricos: </label>
                        </div>
                        <div className='mt-2'>
                            <InputText
                                style='w-full'
                                id='biometricData'
                                value={values.biometricData}
                                onChange={handleChange}
                            />
                            <FieldError error={errors.biometricData} />
                        </div>

                        <div>
                            <Button
                                type='submit'
                                style='bg-indigo-700 hover:bg-indigo-500'
                                label='Cadastrar'
                            />
                            <Button
                                type='button'
                                style='bg-red-700 hover:bg-red-500 mx-2'
                                label='Cancelar'
                                onClick={() => router.push('/users')}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </Template>
        </AuthenticatedPage>
    )
}
