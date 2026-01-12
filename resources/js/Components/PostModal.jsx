import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { MdClose } from 'react-icons/md';
import ImageUploadGrid from './ImageUploadGrid';

const PostModal = ({ show, onClose, postToEdit = null, onPostSuccess }) => {
    if (!show) return null;

    const initialType = postToEdit ? postToEdit.type : 'artwork';
    const [activeTab, setActiveTab] = useState(initialType);

    const { data, setData, post: submitPost, processing, errors, reset } = useForm({
        _method: postToEdit ? 'PATCH' : 'POST',
        type: initialType,
        content: postToEdit?.content || '',
        title: postToEdit?.title || '',
        medium: postToEdit?.medium || '',
        dimensions: postToEdit?.dimensions || '',

        main_artwork: [],
        media_files: [],

        existing_media: postToEdit?.media || [],
        deleted_media_ids: [],
    });

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setData('type', tab);
    };

    const removeArtworkFile = (indexToRemove) => {
        setData('main_artwork', data.main_artwork.filter((_, index) => index !== indexToRemove));
    };

    const removeMediaFile = (indexToRemove) => {
        setData('media_files', Array.from(data.media_files).filter((_, index) => index !== indexToRemove));
    }

    const markForDeletion = (mediaId) => {
        setData(prev => ({
            ...prev,
            existing_media: prev.existing_media.filter(m => m.id !== mediaId),
            deleted_media_ids: [...prev.deleted_media_ids, mediaId]
        }));
    };

    const submit = (e) => {
        e.preventDefault();
        const url = postToEdit ? `/posts/${postToEdit.id}` : '/posts';

        submitPost(url, {
            preserveScroll: true,
            onSuccess: (page) => {
                reset();
                onClose();
                if (onPostSuccess) onPostSuccess();
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">

                <div className='flex justify-between items-center p-3 border-b border-gray-100'>
                    <h3 className="font-bold text-gray-700 px-3">
                        {postToEdit ? 'Edit Post' : 'Create New Post'}
                    </h3>
                    <button onClick={onClose}><MdClose size={24} className="text-gray-500" /></button>
                </div>

                {!postToEdit && (
                    <div className="border-b border-gray-100">
                        <div className="flex">
                            <button
                                onClick={() => handleTabChange('artwork')}
                                className={`flex-1 py-4 text-center font-bold text-sm transition-colors
                        ${activeTab === 'artwork' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                🎨 Upload Artwork
                            </button>
                            <button
                                onClick={() => handleTabChange('status')}
                                className={`flex-1 py-4 text-center font-bold text-sm transition-colors
                        ${activeTab === 'status' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                📝 Quick Status
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={submit} className="p-6 max-h-[80vh] overflow-y-auto">

                    {activeTab === 'artwork' && (
                        <div className="space-y-6">

                            <ImageUploadGrid
                                label="Artwork Images or Videos"
                                existingMedia={data.existing_media}
                                newMedia={data.main_artwork}
                                onRemoveExisting={markForDeletion}
                                onAdd={(files) => setData('main_artwork', [...data.main_artwork, ...files])}
                                onRemoveNew={(index) => setData('main_artwork', data.main_artwork.filter((_, i) => i !== index))}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700">Artwork Title</label>
                                    <input
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full mt-1 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g. The Starry Night"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Medium</label>
                                    <input
                                        type="text"
                                        value={data.medium}
                                        onChange={e => setData('medium', e.target.value)}
                                        className="w-full mt-1 border-gray-300 rounded-lg"
                                        placeholder="e.g. Oil on Canvas"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Dimensions</label>
                                    <input
                                        type="text"
                                        value={data.dimensions}
                                        onChange={e => setData('dimensions', e.target.value)}
                                        className="w-full mt-1 border-gray-300 rounded-lg"
                                        placeholder="e.g. 1920x1080 or 24x36in"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'status' && (
                        <div className="space-y-4 animate-fadeIn">
                            <textarea
                                value={data.content}
                                onChange={e => setData('content', e.target.value)}
                                placeholder="What's on your mind? Share a sketch, a thought, or a tip..."
                                className="w-full h-32 border-none resize-none text-lg focus:ring-0 p-0"
                            ></textarea>

                            <ImageUploadGrid
                                label="Attachments"
                                existingMedia={data.existing_media}
                                newMedia={data.media_files}
                                onRemoveExisting={markForDeletion}
                                onAdd={(files) => setData('media_files', [...data.media_files, ...files])}
                                onRemoveNew={(index) => setData('media_files', data.media_files.filter((_, i) => i !== index))}
                            />
                        </div>
                    )}

                    {activeTab === 'artwork' && (
                        <div className="mt-4">
                            <label className="block text-sm font-bold text-gray-700">Description / Story</label>
                            <textarea
                                value={data.content}
                                onChange={e => setData('content', e.target.value)}
                                className="w-full mt-1 border-gray-300 rounded-lg h-24"
                                placeholder="Tell the story behind this piece..."
                            ></textarea>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                        >
                            {postToEdit ? 'Save Changes' : 'Publish Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostModal;
