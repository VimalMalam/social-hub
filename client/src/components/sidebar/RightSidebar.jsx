import 'react'

const RightSidebar = () => {

    const suggestions = [
        {
            id: 1,
            name: "John Doe"
        },
        {
            id: 2,
            name: "Sarah Smith"
        },
        {
            id: 3,
            name: "Alex Johnson"
        }
    ];

    return (
        <div className="sticky top-24">

            <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">

                <h2 className="text-lg font-semibold text-gray-900 mb-5">
                    Suggested Users
                </h2>

                <div className="space-y-5">

                    {
                        suggestions.map((user) => (

                            <div
                                key={user.id}
                                className="flex items-center justify-between"
                            >

                                <div className="flex items-center gap-3">

                                    <img
                                        src={`https://i.pravatar.cc/150?img=${user.id + 10}`}
                                        alt=""
                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                                    />

                                    <div>

                                        <h3 className="font-medium text-gray-900 text-[15px]">
                                            {user.name}
                                        </h3>

                                    </div>

                                </div>

                                <button
                                    className="px-4 py-1.5 rounded-xl bg-gray-900 hover:bg-black text-white text-sm font-medium transition-all duration-300"
                                >
                                    Follow
                                </button>

                            </div>

                        ))
                    }

                </div>

            </div>

        </div>
    )
}

export default RightSidebar