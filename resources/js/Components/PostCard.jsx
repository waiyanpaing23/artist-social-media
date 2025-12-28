import React from 'react'
import { FaHandsClapping, FaRegComment, FaRegStar } from 'react-icons/fa6';
import { MdOutlineStar, MdOutlineStars } from 'react-icons/md';
import { RiMedalFill, RiMedalLine } from "react-icons/ri";
import { PiHandsClapping } from "react-icons/pi";

const PostCard = ({ post }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 my-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100">
                <img
                    className="w-full h-full object-cover"
                    src={`https://ui-avatars.com/api/?name=${post.author}&background=random`}
                    alt={post.author}
                />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-sm text-gray-900">Wai Yan</span>
                <span className="text-xs text-gray-400">2 hrs ago</span>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">•••</button>
      </div>

      {/* Large Artwork Image */}
      {/* {post.image ? ( */}
        <div className="relative group rounded-xl overflow-hidden shadow-sm mb-4 border border-gray-100">

            <img
                src="/images/starrynight.png"
                alt="Post content"
                className="w-full h-auto object-cover"
            />

            {post.dimensions && (
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-md backdrop-blur-sm">
                    {post.dimensions}
                </div>
            )}

        </div>

        <div>
            <p className='mt-1 font-bold text-gray-400'>Oil On Canvas</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Starry Night</h2>
            <p className="text-gray-700">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Praesentium tempore commodi repellat magnam.</p>
        </div>
      {/* ) : (
        <div className="p-8 bg-gray-50 rounded-xl mb-4 text-center text-gray-500">
            {post.content}
        </div>
      )} */}

      {/* Minimal Actions */}
      <div className="flex items-cente mt-5 gap-6">
        <button className="group flex items-center gap-2">
            <span className="text-xl group-hover:scale-110 transition">
                <PiHandsClapping size={26} />
            </span>
        </button>
        <button className="group flex items-center gap-2">
            <span className="text-xl group-hover:scale-110 transition">
                <FaRegComment size={24} />
            </span>
        </button>
      </div>
      <div className="mt-3 text-sm font-semibold text-gray-600">10 Appreciations</div>
    </div>
  );
};

export default PostCard
