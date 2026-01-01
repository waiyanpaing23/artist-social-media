import CreateModal from '@/Components/PostModal';
import Navbar from '@/Components/Navbar';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function AuthenticatedLayout({ header, children }) {

    const [showCreateModal, setShowCreateModal] = useState(false);
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const {flash} = usePage().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar onOpenCreate={() => setShowCreateModal(true)} />

            <Toaster position='top-center' />

            <main>{children}</main>

            <CreateModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </div>
    );
}
