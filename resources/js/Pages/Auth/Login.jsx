import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="text-center mb-8">
                <Link href="/" className="inline-block">
                     <span className="text-4xl font-bold text-blue-600 tracking-tighter">
                        Artizen
                    </span>
                </Link>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">Welcome back</h2>
                <p className="mt-2 text-sm text-gray-500">
                    Please sign in to your account
                </p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">

                <div>
                    <InputLabel htmlFor="email" value="Email Address" className="sr-only" /> {/* Hidden Label for accessibility */}
                    <div className="relative">

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full py-3 border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Email address"
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" className="sr-only" />
                    <div className="relative">

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full py-3 border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                        />
                        <span className="ms-2 text-sm text-gray-600 select-none">Remember me</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <div>
                    <PrimaryButton
                        className="w-full justify-center py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-base font-bold shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
                        disabled={processing}
                    >
                        {processing ? 'Signing in...' : 'Sign in'}
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-8 text-center border-t border-gray-100 pt-6">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href={route('register')} className="font-bold text-blue-600 hover:text-blue-500 hover:underline">
                        Create an account
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
