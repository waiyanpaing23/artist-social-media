import React, { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import FollowButton from '@/Components/FollowButton';
import { Link, usePage } from '@inertiajs/react';

const UserListModal = ({ show, onClose, title, userId, type }) => {
    if (!show) return null;

    const { auth } = usePage().props;

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (show && userId) {
            setLoading(true);
            axios.get(route('user.connections', { id: userId, type: type}))
                .then(res => {
                    setUsers(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load users", err);
                    setLoading(false);
                });
        }
    }, [show, userId, type]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-2xl w-full max-w-md h-[500px] flex flex-col shadow-2xl overflow-hidden animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="bg-white rounded-2xl w-full max-w-md h-[500px] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>

                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="font-bold text-lg capitalize">{title}</h2>
                        <button onClick={onClose}><MdClose size={24} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {loading ? (<p className="text-center text-gray-400 mt-10">Loading...</p>) :
                        users.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <p>No {type} found.</p>
                            </div>
                        ) : (
                            users.map(user => (
                                <div key={user.id} className="flex items-center justify-between gap-3">
                                    <Link href={`/profile/${user.id}`} onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100">
                                        <img
                                            src={user.profile_picture ? `/storage/${user.profile_picture}` : `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.username}</p>
                                        </div>
                                    </Link>
                                    <FollowButton user={user} className="px-3 py-1 text-xs" />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserListModal;
