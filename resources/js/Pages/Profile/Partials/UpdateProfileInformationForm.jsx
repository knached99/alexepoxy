import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        facebook_url: user.facebook_url,
        instagram_url: user.instagram_url,
        twitter_url: user.twitter_url,
        tiktok_url: user.tiktok_url
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information, email address, and social media accounts.
                    Your social media links will appear in the footer on the homepage.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                    <div>
                    <InputLabel htmlFor="facebook_url" value="Facebook" />

                        <TextInput 

                        id="facebook_url"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.facebook_url}
                        onChange={(e) => setData('facebook_url', e.target.value)}                        
                        />
                     <InputError className="mt-2" message={errors.facebook_url} />

                    </div>

                    <div>

                    <InputLabel htmlFor="instagram_url" value="Instagram" />

                        <TextInput 

                        id="instagram_url"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.instagram_url}
                        onChange={(e) => setData('instagram_url', e.target.value)}                        
                        />
                     <InputError className="mt-2" message={errors.instagram_url} />

                    </div>

                    <div>
                    <InputLabel htmlFor="twitter_url" value="Twitter" />

                        <TextInput 

                        id="twitter_url"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.twitter_url}
                        onChange={(e) => setData('twitter_url', e.target.value)}                        
                        />
                     <InputError className="mt-2" message={errors.twitter_url} />

                    </div>

                    <div>
                    <InputLabel htmlFor="tiktok_url" value="TikTok" />

                        <TextInput 

                        id="tiktok_url"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.tiktok_url}
                        onChange={(e) => setData('tiktok_url', e.target.value)}                        
                        />
                     <InputError className="mt-2" message={errors.tiktok_url} />

                    </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
