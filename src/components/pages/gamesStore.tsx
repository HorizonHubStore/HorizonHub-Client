// Assuming you have other necessary imports

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserData } from "../../store/hook/useUserData.ts";

interface PostData {
    _id: string;
    name: string;
    pictureUrl: string;
    gameFileUrl: string;
    creatorUserId: string;
    creatorName: string;
    fileSize: string;
    // other fields...
}

const PostList: React.FC = () => {
    const { userId } = useUserData();
    const [posts, setPosts] = useState<PostData[]>([]);
    const [originalPosts, setOriginalPosts] = useState<PostData[]>([]); // Added state for original posts
    const [editMode, setEditMode] = useState<string | null>(null);
    const [editedName, setEditedName] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const authToken = localStorage.getItem("authToken");
    const refreshToken = localStorage.getItem("refreshToken");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get<PostData[]>(
                    import.meta.env.VITE_SERVER +
                        import.meta.env.VITE_SERVER_GET_ALL_POSTS_PATH,
                    {
                        headers: {
                            authorization: `JWT ${authToken} ${refreshToken}`,
                        },
                    }
                );

                const postsWithFullPath = response.data.map((post) => ({
                    ...post,
                    pictureUrl:
                        import.meta.env.VITE_SERVER + "/" + post.pictureUrl,
                    gameFileUrl:
                        import.meta.env.VITE_SERVER + "/" + post.gameFileUrl,
                }));

                const postsWithFileSizes = await Promise.all(
                    postsWithFullPath.map(fetchFileSize)
                );

                const postsWithSizes = postsWithFullPath.map((post, index) => ({
                    ...post,
                    fileSize: postsWithFileSizes[index],
                }));

                setPosts(postsWithSizes);
                setOriginalPosts(postsWithSizes); // Save the original posts
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, []);

    const fetchFileSize = async (post: PostData): Promise<string> => {
        try {
            const response = await fetch(post.gameFileUrl);
            const sizeInBytes = response.headers.get("content-length");
            if (sizeInBytes) {
                const sizeInKb = Math.ceil(parseInt(sizeInBytes, 10) / 1024);
                return `${sizeInKb} KB`;
            }
        } catch (error) {
            console.error("Error getting file size:", error);
        }
        return "Unknown";
    };

    const handleDelete = async (postId: string) => {
        try {
            await axios.delete(
                import.meta.env.VITE_SERVER +
                    import.meta.env.VITE_SERVER_DELETE_POST_PATH +
                    `/${postId}`,
                {
                    headers: {
                        authorization: `JWT ${authToken} ${refreshToken}`,
                    },
                }
            );

            setPosts((prevPosts) =>
                prevPosts.filter((post) => post._id !== postId)
            );
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handleEdit = (postId: string, initialName: string) => {
        setEditMode(postId);
        setEditedName(initialName);
    };

    const handleUpdate = async (postId: string) => {
        try {

            await axios.put(
                import.meta.env.VITE_SERVER +
                    import.meta.env.VITE_SERVER_UPDATE_POST_PATH +
                    `/${postId}`,
                { name: editedName },
                {
                    headers: {
                        authorization: `JWT ${authToken} ${refreshToken}`,
                    },
                }
            );

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId ? { ...post, name: editedName } : post
                )
            );

            setEditMode(null);
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    const handleSearch = (searchTerm: string) => {
        // If search term is empty, show all posts
        if (!searchTerm.trim()) {
            setPosts(originalPosts);
            return;
        }

        // Perform filtering based on the entered search term
        const filteredPosts = originalPosts.filter((post) =>
            post.creatorName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setPosts(filteredPosts);
    };

    return (
        <div className="box-border">
            <h2 className="mt-0 mx-0 mb-8 p-0 text-white text-center text-4xl">
                Posts
            </h2>
            <div className="flex items-center justify-center mb-4">
                <input
                    type="text"
                    placeholder="Search by creator name"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleSearch(e.target.value);
                    }}
                    className="border-2 border-gray-300 p-2 rounded-md"
                />
            </div>
            <div className="flex flex-wrap justify-center">
                {posts.map((post) => (
                    <div key={post._id} className="m-4 max-w-[360px]">
                        <div className="bg-[#222831] text-[#ffffff] rounded-2xl overflow-hidden">
                            <img
                                src={post.pictureUrl}
                                alt="Post"
                                className="object-cover w-full h-48"
                            />
                            <div className="p-4">
                                {editMode === post._id ? (
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) =>
                                                setEditedName(e.target.value)
                                            }
                                            className="border-2 border-gray-300 p-2 rounded-md"
                                        />
                                        <button
                                            onClick={() => setEditMode(null)}
                                            className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-2xl">
                                            {post.name}
                                        </h3>
                                        <p className="text-gray-300">
                                            Creator: {post.creatorName}
                                        </p>
                                        <a
                                            href={post.gameFileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            Download Game File
                                        </a>{" "}
                                        <span className="text-gray-500">
                                            ({post.fileSize || "Unknown"})
                                        </span>
                                    </>
                                )}

                                {post.creatorUserId === userId && (
                                    <div className="mt-2">
                                        {editMode === post._id ? (
                                            <button
                                                onClick={() =>
                                                    handleUpdate(post._id)
                                                }
                                                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                                            >
                                                Save
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    handleEdit(
                                                        post._id,
                                                        post.name
                                                    )
                                                }
                                                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>
                                        )}

                                        <button
                                            onClick={() =>
                                                handleDelete(post._id)
                                            }
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostList;
