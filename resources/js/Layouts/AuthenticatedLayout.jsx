import CreateModal from '@/Components/CreateModal';
import Navbar from '@/Components/Navbar';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {

    const [showCreateModal, setShowCreateModal] = useState(false);
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar onOpenCreate={() => setShowCreateModal(true)} />

            <main>{children}</main>

            <CreateModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </div>
    );
}
