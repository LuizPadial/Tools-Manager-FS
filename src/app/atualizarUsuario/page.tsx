'use client'

import { Template, InputText, Button, FieldError, useNotification, AuthenticatedPage } from '@/components'
import { useState } from 'react'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { User } from '@/resources/user/users.resources'

export default function AtualizarUsuario() {
    const [loading, setLoading] = useState(false)
    const notification = useNotification()
    const router = useRouter()

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
            const userToUpdate = { ...values, manager: Boolean(values.manager) }

            // Enviar os dados para a API para atualizar o usuário pela matrícula (registration)
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/registration/${values.registration}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userToUpdate),
            })

            if (response.ok) {
                notification.notify('Usuário atualizado com sucesso!', 'success')
                resetForm()
                router.push('/users') // Redirecionar para a página de usuários
            } else {
                const message = await response.text()
                notification.notify(message || 'Erro ao atualizar usuário', 'error')
            }
        } catch (error: any) {
            notification.notify(error?.message || 'Erro ao atualizar usuário', 'error')
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
                            Atualizar Usuário
                        </h2>
                    </div>

                    <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
                        <form onSubmit={handleSubmit} className='space-y-2'>
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
                                    label='Atualizar'
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
