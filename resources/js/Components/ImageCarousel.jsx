import React, { useState } from 'react'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const ImageCarousel = ({media, dimensions}) => {
    if (!media || media.length === 0) return null;

    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = (e) => {
        e.preventDefault();
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? media.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }

    const nextSlide = (e) => {
        e.preventDefault();
        const isLastSlide = currentIndex === media.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }

    const goToSlide = (e, index) => {
        e.preventDefault();
        setCurrentIndex(index);
    }

    return (
        <div className="relative group rounded-xl overflow-hidden shadow-sm mb-4 border border-gray-100 bg-gray-100">

            <div className="w-full h-auto aspect-[4/3] sm:aspect-auto relative">
                 <img
                    src={`/storage/${media[currentIndex].file_path}`}
                    alt={`Slide ${currentIndex}`}
                    className="w-full h-full object-cover transition-all duration-500"
                />
            </div>

            {media.length > 1 && (
                <>
                    {/* Left Arrow */}
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                        <MdChevronLeft size={24} />
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                        <MdChevronRight size={24} />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {media.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => goToSlide(e, index)}
                                className={`w-2 h-2 rounded-full transition-all shadow-sm ${
                                    currentIndex === index ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}

            {dimensions && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none">
                    {dimensions}
                </div>
            )}
        </div>
    )
}

export default ImageCarousel
