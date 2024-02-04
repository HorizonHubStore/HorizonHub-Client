import React, {useEffect, useState} from "react";
import {useUserData} from "../../store/hook/useUserData.ts";
import {Link} from "react-router-dom";
import api from "../../api/api.tsx";
import {Button, TextField} from "@mui/material";

interface CommentData {
    _id: string;
    postId: string;
    text: string;
}

interface PostData {
    _id: string;
    name: string;
    pictureUrl: string;
    gameFileUrl: string;
    creatorUserId: string;
    creatorName: string;
    fileSize: string;
    comments: [];
    commentsCount: number;
}

const PostList: React.FC = () => {
    const {userId} = useUserData();
    const [posts, setPosts] = useState<PostData[]>([]);
    const [originalPosts, setOriginalPosts] = useState<PostData[]>([]);
    const [editMode, setEditMode] = useState<string | null>(null);
    const [editedName, setEditedName] = useState<string>("");
    const [commentTexts, setCommentTexts] = useState<{
        [postId: string]: string;
    }>({});
    const [searchTerm, setSearchTerm] = useState<string>("");
    const authToken = localStorage.getItem("authToken");
    const refreshToken = localStorage.getItem("refreshToken");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsResponse = await api.get<PostData[]>(
                    import.meta.env.VITE_SERVER_GET_ALL_POSTS_PATH,
                    {
                        headers: {
                            authorization: `JWT ${authToken} ${refreshToken}`,
                        },
                    }
                );

                const postsWithFullPath: PostData[] = await Promise.all(
                    postsResponse.data.map(async (post) => {
                        const pictureUrl =
                            import.meta.env.VITE_SERVER + "/" + post.pictureUrl;
                        const gameFileUrl =
                            import.meta.env.VITE_SERVER +
                            "/" +
                            post.gameFileUrl;
                        const commentsCount = post.comments.length;
                        const fileSize = await fetchFileSize(gameFileUrl);

                        return {
                            ...post,
                            pictureUrl,
                            gameFileUrl,
                            commentsCount,
                            fileSize,
                        };
                    })
                );
                setPosts(postsWithFullPath);
                setOriginalPosts(postsWithFullPath);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        const fetchComments = async () => {
            // Fetch all comments separately if needed
            // ...
        };

        fetchPosts();
        fetchComments();
    }, []);

    const fetchFileSize = async (gameFileUrl: string): Promise<string> => {
        try {
            const response = await fetch(gameFileUrl);
            const sizeInBytes = response.headers.get("content-length");
            if (sizeInBytes) {
                const sizeInKb = parseInt(sizeInBytes, 10) / 1024;
                const sizeInMb = sizeInKb / 1024;
                return `${sizeInMb.toFixed(2)} MB`;
            }
        } catch (error) {
            console.error("Error getting file size:", error);
        }
        return "Unknown";
    };

    const handleDelete = async (postId: string) => {
        try {
            await api.delete(
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
            setOriginalPosts((prevOriginalPosts) =>
                prevOriginalPosts.filter((post) => post._id !== postId)
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
            await api.put(
                import.meta.env.VITE_SERVER_UPDATE_POST_PATH +
                `/${postId}`,
                {name: editedName},
                {
                    headers: {
                        authorization: `JWT ${authToken} ${refreshToken}`,
                    },
                }
            );

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId ? {...post, name: editedName} : post
                )
            );

            setEditMode(null);
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    const handleAddComment = async (postId: string) => {
        try {
            await api.post<CommentData>(
                import.meta.env.VITE_SERVER_ADD_COMMENT_PATH,
                {postId, text: commentTexts[postId] || "", userId},
                {
                    headers: {
                        authorization: `JWT ${authToken} ${refreshToken}`,
                    },
                }
            );

            setCommentTexts((prevCommentTexts) => ({
                ...prevCommentTexts,
                [postId]: "", // Clear the comment text for this post
            }));

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId
                        ? {...post, commentsCount: post.commentsCount + 1}
                        : post
                )
            );
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleSearch = (searchTerm: string) => {
        if (!searchTerm.trim()) {
            setPosts(originalPosts);
            return;
        }

        const filteredPosts = originalPosts.filter((post) =>
            post.creatorName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setPosts(filteredPosts);
    };

    return (
        <div className="box-border">
            <h2 className="mt-5 mx-0 mb-[20px] p-0 text-white text-center text-4xl">
                חנות משחקים
            </h2>
            <div className="flex items-center justify-center mb-4">
                <TextField
                    className="w-[400px]"
                    label="חיפוש לפי שם יוצר המשחק"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleSearch(e.target.value);
                    }}
                />
            </div>
            <div className="flex flex-wrap justify-center">
                {posts.map((post) => {
                    return (
                        <div key={post._id} className="m-4 max-w-[360px] text-center" dir="rtl">
                            <div className="bg-[#222831] text-[#ffffff] rounded-2xl overflow-hidden">
                                <Link to={`/gamesStore/${post._id}`}>
                                    <img
                                        src={post.pictureUrl}
                                        alt="לא הועלתה תמונה"
                                        className="object-cover w-full h-48"
                                    />
                                </Link>

                                <div className="p-4">
                                    {editMode === post._id ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={editedName}
                                                onChange={(e) =>
                                                    setEditedName(
                                                        e.target.value
                                                    )
                                                }
                                                className="border-2 border-gray-300 p-2 rounded-md"
                                            />
                                            <button
                                                onClick={() =>
                                                    setEditMode(null)
                                                }
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
                                                יוצר המשחק: {post.creatorName}
                                            </p>
                                            <Button href={post.gameFileUrl} target="_blank" variant={"outlined"} size={"small"}
                                                    rel="noopener noreferrer">הורדה</Button>
                                            {" "}
                                            <span className="text-gray-500">
                                                ({post.fileSize || "Unknown"})
                                            </span>
                                            <p className="text-gray-500">
                                                {post.commentsCount} תגובות
                                            </p>
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

                                    <div className="flex mt-2 gap-2">
                                        <TextField dir='ltr'
                                            label="הוסף תגובה"
                                            type="text"
                                            value={commentTexts[post._id] || ""}
                                            onChange={(e) =>
                                                setCommentTexts(
                                                    (prevCommentTexts) => ({
                                                        ...prevCommentTexts,
                                                        [post._id]:
                                                        e.target.value,
                                                    })
                                                )
                                            }
                                        />
                                        <Button variant="contained"
                                                onClick={() =>
                                                    handleAddComment(post._id)
                                                }
                                        ><label className="text-3xl">✓</label></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PostList;
