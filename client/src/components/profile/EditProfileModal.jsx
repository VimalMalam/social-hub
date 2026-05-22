import { useState } from "react";
import toast from "react-hot-toast";
import API from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext";

const EditProfileModal = ({ profile, onClose, refreshProfile }) => {

    const auth = useAuth();
    const [bio, setBio] = useState(profile.bio || "");
    const [profilePic, setProfilePic] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const formData = new FormData();

            formData.append("bio", bio);

            if (profilePic) {

                formData.append(
                    "profile_pic",
                    profilePic
                );

            }


            const res = await API.put(
                "/users/update",
                formData
            );


            // REFRESH AUTH USER
            await auth.fetchCurrentUser();


            // REFRESH PROFILE PAGE
            refreshProfile();


            toast.success(
                res.data.message
            );


            onClose();

        }
        catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

        }
        finally {

            setLoading(false);

        }

    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">

            <div className="w-full max-w-lg bg-white border border-gray-200 rounded-[32px] shadow-[0_20px_80px_rgba(0,0,0,0.18)] overflow-hidden">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

                    <h2 className="text-2xl font-bold text-gray-900">
                        Edit Profile
                    </h2>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-2xl hover:bg-gray-100 text-gray-600 hover:text-black transition-all duration-300 text-2xl flex items-center justify-center"
                    >
                        ×
                    </button>

                </div>


                {/* FORM */}
                <form
                    onSubmit={handleUpdate}
                    className="p-6 space-y-6"
                >

                    {/* PROFILE PIC */}
                    <div>

                        <label className="block text-sm font-semibold text-gray-800 mb-3">

                            Profile Picture

                        </label>

                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">

                            <input
                                type="file"
                                onChange={(e) =>
                                    setProfilePic(
                                        e.target.files[0]
                                    )
                                }
                                className="w-full text-sm text-gray-600 file:mr-4 file:px-5 file:py-2.5 file:rounded-2xl file:border-0 file:bg-gray-900 file:text-white file:font-medium hover:file:bg-black transition-all duration-300"
                            />

                        </div>

                    </div>


                    {/* BIO */}
                    <div>

                        <label className="block text-sm font-semibold text-gray-800 mb-3">
                            Bio
                        </label>

                        <textarea
                            rows={4}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none resize-none text-gray-800 placeholder:text-gray-500 focus:border-gray-400 focus:bg-white transition-all duration-300"
                            placeholder="Write your bio..."
                            value={bio}
                            onChange={(e) =>
                                setBio(e.target.value)
                            }
                        />

                    </div>


                    {/* BUTTON */}
                    <button
                        disabled={loading}
                        className="w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-2xl font-semibold transition-all duration-300 disabled:opacity-70"
                    >

                        {
                            loading
                                ? "Updating..."
                                : "Update Profile"
                        }

                    </button>

                </form>

            </div>

        </div>
    )
}

export default EditProfileModal