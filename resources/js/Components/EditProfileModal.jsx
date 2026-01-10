import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { MdClose, MdCameraAlt } from 'react-icons/md';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

const EditProfileModal = ({ show, onClose, user }) => {
    if (!show) return null;

    const { data, setData, post, processing, errors, reset } = useForm({
        _method: 'PATCH',
        name: user.name || '',
        bio: user.bio || '',
        profile_picture: null,
    });

    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (show) {
            setData({
                _method: 'PATCH',
                name: user.name || '',
                bio: user.bio || '',
                profile_picture: null
            });
            setPreview(null);
        }
    }, [show, user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_picture', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            onSuccess: () => onClose(),
            preserveScroll: true,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Edit Profile</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition">
                        <MdClose size={24} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="flex flex-col items-center">
                            <div className="relative group cursor-pointer">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                                    <img
                                        src={preview || (user.profile_picture ? `/storage/${user.profile_picture}` : `https://ui-avatars.com/api/?name=${user.name}&background=random`)}
                                        alt="Profile Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-full cursor-pointer">
                                    <MdCameraAlt className="text-white text-2xl" />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                            <span className="text-xs text-gray-500 mt-2">Click to change photo</span>
                            <InputError message={errors.profile_picture} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="name" value="Display Name" />
                            <TextInput
                                id="name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="bio" value="Bio" />
                            <textarea
                                id="bio"
                                rows="4"
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm"
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                placeholder="Tell us a little about yourself..."
                            />
                            <InputError message={errors.bio} className="mt-2" />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Saving...' : 'Save Changes'}
                            </PrimaryButton>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditProfileModal;
