import React from 'react'
import { MdClose } from 'react-icons/md';

const ImageUploadGrid = ({
    existingMedia = [],
    newMedia = [],
    onAdd,
    onRemoveNew,
    onRemoveExisting,
    label = "Images"
}) => {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">{label}</label>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">

                <label className="relative flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition group">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files.length > 0) {
                                onAdd(Array.from(e.target.files));
                            }
                        }}
                    />
                    <div className="text-gray-400 group-hover:text-blue-500 transition text-center">
                        <span className="text-3xl block mb-1">+</span>
                        <span className="text-xs font-bold">Add</span>
                    </div>
                </label>

                {/* Current Images */}
                {existingMedia.map((media) => (
                    <div key={media.id} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-100">
                        <img
                            src={`/storage/${media.file_path}`}
                            className="w-full h-full object-cover"
                            alt="Existing"
                        />
                        <button
                            type="button"
                            onClick={() => onRemoveExisting(media.id)}
                            className="absolute top-1 right-1 bg-white/90 text-red-500 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                        >
                            <MdClose size={16} />
                        </button>

                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-0.5 text-center opacity-0 group-hover:opacity-100 transition">
                            Saved
                        </div>
                    </div>
                ))}

                {/* New Images */}
                {newMedia.map((file, index) => (
                    <div key={`new-${index}`} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm border border-green-200">
                        <img
                            src={URL.createObjectURL(file)}
                            className="w-full h-full object-cover"
                            alt="New Preview"
                        />
                        <button
                            type="button"
                            onClick={() => onRemoveNew(index)}
                            className="absolute top-1 right-1 bg-white/90 text-gray-600 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                        >
                            <MdClose size={16} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-green-500/80 text-white text-[10px] px-2 py-0.5 text-center">
                            New
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default ImageUploadGrid
