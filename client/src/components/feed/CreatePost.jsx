import { useState } from "react";
import toast from "react-hot-toast";
import API from "../../api/axios.js";

const CreatePost = () => {

    const [caption, setCaption] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("caption", caption);
            formData.append("image", image);

            const res = await API.post("/posts/create", formData);

            toast.success(res.data.message);

            setCaption("");
            setImage(null);
        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                {/* TEXTAREA */}
                <div>

                    <textarea
                        placeholder="What's on your mind?"
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none resize-none text-gray-800 placeholder:text-gray-500 focus:border-gray-400 focus:bg-white transition-all duration-300"
                        rows={3}
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />

                </div>

                {/* FILE INPUT */}
                <div>

                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="w-full text-sm text-gray-600 file:mr-4 file:px-5 file:py-2.5 file:rounded-2xl file:border-0 file:bg-gray-900 file:text-white file:font-medium hover:file:bg-black transition-all duration-300"
                    />

                </div>

                {/* BUTTON */}
                <div className="flex justify-end">

                    <button
                        disabled={loading}
                        className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 disabled:opacity-70"
                    >

                        {
                            loading
                                ? "Posting..."
                                : "Create Post"
                        }

                    </button>

                </div>

            </form>

        </div>
    )
}

export default CreatePost