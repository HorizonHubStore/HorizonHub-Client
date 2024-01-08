import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";

export interface IComment {
    text: string;
    author: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface IPost {
    name: string;
    pictureUrl: string;
    gameFileUrl: string;
    comments: IComment[];
    creatorName: string;
    creatorUserId: string;
    createdAt: Date;
    updatedAt: Date;
    fileSize: String;
}

const PostDetails: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<IPost | undefined>();

    const authToken = localStorage.getItem("authToken");
    const refreshToken = localStorage.getItem("refreshToken");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postResponse = await api.get<IPost>(
                        import.meta.env.VITE_SERVER_GET_POST_PATH +
                        `/${postId}`,
                    {
                        headers: {
                            authorization: `JWT ${authToken} ${refreshToken}`,
                        },
                    }
                );

                const detailedPost: IPost = {
                    ...postResponse.data,
                    pictureUrl:
                        import.meta.env.VITE_SERVER +
                        "/" +
                        postResponse.data.pictureUrl,
                    gameFileUrl:
                        import.meta.env.VITE_SERVER +
                        "/" +
                        postResponse.data.gameFileUrl,
                    fileSize: await fetchFileSize(
                        import.meta.env.VITE_SERVER +
                            "/" +
                            postResponse.data.gameFileUrl
                    ),
                };

                setPost(detailedPost);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };

        fetchPost();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array ensures this effect runs once on mount

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

    return (
        <div className="m-4 max-w-[360px]">
            <div className="bg-[#222831] text-[#ffffff] rounded-2xl overflow-hidden">
                <img
                    src={post?.pictureUrl}
                    alt="Post"
                    className="object-cover w-full h-48"
                />
                <div className="p-4">
                    <h3 className="text-2xl">{post?.name}</h3>
                    <p className="text-gray-300">
                        Creator: {post?.creatorName}
                    </p>
                    <a
                        href={post?.gameFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        Download Game File
                    </a>{" "}
                    <span className="text-gray-500">
                        ({post?.fileSize || "Unknown"})
                    </span>
                </div>
            </div>

            <div className="mt-4">
                <h4 className="text-xl font-bold mb-2">Comments</h4>
                {post?.comments.map((comment) => (
                    <div key={comment._id} className="mb-2">
                        <p className="text-gray-300">
                            {comment.text} : {comment.author}{" "}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostDetails;
