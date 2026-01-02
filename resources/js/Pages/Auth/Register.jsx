import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="text-center mb-8">
                 <Link href="/" className="inline-block">
                     <span className="text-4xl font-bold text-blue-600 tracking-tighter">
                        Artizen
                    </span>
                </Link>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">Create an account</h2>
            </div>

            <form onSubmit={submit} className="space-y-5">

                <div>
                    <InputLabel htmlFor="name" value="Full Name" className="sr-only" />
                    <div className="relative">

                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="block w-full py-3 border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="Full Name"
                        />
                    </div>
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" className="sr-only" />
                    <div className="relative">

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full py-3 border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
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
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            placeholder="Password"
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="sr-only" />
                    <div className="relative">

                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="block w-full py-3 border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                            placeholder="Confirm Password"
                        />
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="pt-2">
                    <PrimaryButton
                         className="w-full justify-center py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-base font-bold shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
                         disabled={processing}
                    >
                        {processing ? 'Creating account...' : 'Create Account'}
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-8 text-center border-t border-gray-100 pt-6">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href={route('login')} className="font-bold text-blue-600 hover:text-blue-500 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
