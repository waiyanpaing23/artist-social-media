import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { MdClose, MdDelete } from 'react-icons/md';

const CreateModal = ({ show, onClose }) => {
  if (!show) return null;

  const [activeTab, setActiveTab] = useState('artwork');

  const { data, setData, post, processing, errors, reset } = useForm({
    type: 'artwork',
    content: '',
    title: '',
    medium: '',
    dimensions: '',

    // Files
    media_files: [],
    main_artwork: []
  });

  // Handle Tab Switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setData('type', tab);
  };

  const removeFile = (indexToRemove) => {
    setData('main_artwork', data.main_artwork.filter((_, index) => index !== indexToRemove));
  };

  const submit = (e) => {
    e.preventDefault();
    post('/posts', {
      onSuccess: () => {
        reset();
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className='flex justify-end p-3'>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <MdClose size={24} />
            </button>
        </div>

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

        <form onSubmit={submit} className="p-6 max-h-[80vh] overflow-y-auto">

          {activeTab === 'artwork' && (
            <div className="space-y-6 animate-fadeIn">

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Main Artwork File *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer relative">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={ e => {
                            if (e.target.files && e.target.files.length > 0) {
                                setData('main_artwork', Array.from(e.target.files));
                            }
                        }}
                    />
                    <div className="text-gray-400">
                        <span>Click or Drag to upload multiple images</span>
                    </div>
                </div>
                {data.main_artwork.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        {data.main_artwork.map((file, index) => (
                            <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm aspect-square">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                                {/* Delete Overlay */}
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                >
                                    <MdDelete size={24} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {errors.main_artwork && <p className="text-red-500 text-xs">{errors.main_artwork}</p>}
              </div>

              {/* Time-lapse Upload (Optional but Encouraged) */}
              {/* <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <label className="block text-sm font-bold text-purple-700 mb-1">
                   🎥 Add Process/Time-lapse Video
                </label>
                <input
                    type="file"
                    accept="video/*"
                    className="block w-full text-sm text-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                    onChange={e => setData('timelapse_video', e.target.files[0])}
                />
                <p className="text-xs text-purple-400 mt-1">Show your fans how you made this.</p>
              </div> */}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700">Artwork Title</label>
                    <input
                        type="text"
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

               <div>
                 <label className="block text-sm font-bold text-gray-500 mb-2">Attachments</label>
                 <input
                    type="file"
                    multiple
                    onChange={e => setData('media_files', e.target.files)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                 />
               </div>
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
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
                {activeTab === 'artwork' ? 'Publish Artwork' : 'Post Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
