'use client'

import { Template, InputText, Button, FieldError, useNotification, AuthenticatedPage } from '@/components';
import { useState } from 'react';
import { useFormik } from 'formik';
import { useAuth } from '@/resources';
import { useRouter } from 'next/navigation';
import { Tool } from '@/resources/ferramenta/ferramenta';

export default function CadastroFerramenta() {
    const [loading, setLoading] = useState<boolean>(false);
    const notification = useNotification();
    const router = useRouter();
    const auth = useAuth();

    const { values, handleChange, handleSubmit, errors, resetForm } = useFormik<Tool>({
        initialValues: {
            name: '',
            description: '',
            available: true,
        },
        onSubmit: onSubmit,
    });

    async function onSubmit(values: Tool) {
        setLoading(true);
        try {
            const toolToSave = { ...values, available: Boolean(values.available) };

            // Enviar os dados para a API para cadastrar a ferramenta
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ferramentas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.getUserSession()?.accessToken}`,
                },
                body: JSON.stringify(toolToSave),
            });

            if (response.ok) {
                notification.notify('Ferramenta cadastrada com sucesso!', 'success');
                resetForm();
                router.push('/ferramentas'); // Redirecionar para a página de ferramentas
            } else {
                const message = await response.text();
                notification.notify(message || 'Erro ao cadastrar ferramenta', 'error');
            }
        } catch (error: any) {
            notification.notify(error?.message || 'Erro ao cadastrar ferramenta', 'error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthenticatedPage>
            <Template loading={loading}>
                <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
                    <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                        <h2 className='mt-10 text-center text-1xl font-bold leading-9 tracking-tight text-gray-900'>
                            Cadastro de Ferramenta
                        </h2>
                    </div>

                    <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
                        <form onSubmit={handleSubmit} className='space-y-2'>
                            <div>
                                <label className='block text-sm font-medium leading-6 text-gray-900'>Nome:</label>
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
                                <label className='block text-sm font-medium leading-6 text-gray-900'>Descrição:</label>
                            </div>
                            <div className='mt-2'>
                                <InputText
                                    style='w-full'
                                    id='description'
                                    value={values.description}
                                    onChange={handleChange}
                                />
                                <FieldError error={errors.description} />
                            </div>

                            <div>
                                <label className='block text-sm font-medium leading-6 text-gray-900'>Disponível:</label>
                                <div className='mt-2'>
                                    <input
                                        type="checkbox"
                                        id="available"
                                        checked={values.available}
                                        onChange={(e) => handleChange({ target: { name: 'available', value: e.target.checked } })}
                                    />
                                    <span className='ml-2'>Sim</span>
                                </div>
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
                                    onClick={() => router.push('/ferramentas')}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </Template>
        </AuthenticatedPage>
    );
}
