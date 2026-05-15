import { Heart, MessageCircle, Send } from "lucide-react";

import 'react'

const PostCard = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.04)]">

            {/* TOP */}
            <div className="flex items-center justify-between px-5 py-4">

                <div className="flex items-center gap-3">

                    <img
                        src="https://i.pravatar.cc/150?img=3"
                        alt=""
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                    />

                    <div>

                        <h3 className="font-semibold text-gray-900 text-[15px]">
                            Vimal Malam
                        </h3>

                        <p className="text-sm text-gray-500">
                            2 hours ago
                        </p>

                    </div>

                </div>

            </div>

            {/* IMAGE */}
            <div className="overflow-hidden">

                <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                    alt=""
                    className="w-full h-[500px] object-cover hover:scale-[1.01] transition duration-500"
                />

            </div>

            {/* ACTIONS */}
            <div className="px-5 py-4">

                <div className="flex items-center gap-5 mb-4">

                    <button className="text-gray-700 hover:text-red-500 transition-all duration-300">
                        <Heart size={22} />
                    </button>

                    <button className="text-gray-700 hover:text-blue-500 transition-all duration-300">
                        <MessageCircle size={22} />
                    </button>

                    <button className="text-gray-700 hover:text-green-500 transition-all duration-300">
                        <Send size={22} />
                    </button>

                </div>

                <p className="font-semibold text-gray-900 text-sm mb-2">
                    245 likes
                </p>

                <p className="text-gray-700 leading-relaxed text-[15px]">

                    <span className="font-semibold text-black mr-2">
                        VimalMalam
                    </span>

                    Beautiful nature view 🌿

                </p>

            </div>

        </div>
    )
}

export default PostCard