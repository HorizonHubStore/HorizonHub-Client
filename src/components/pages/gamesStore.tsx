import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserData } from "../../store/hook/useUserData.ts";

interface PostData {
  _id: string;
  name: string;
  pictureUrl: string;
  gameFileUrl: string;
  creatorUserId: string; // Assuming there's a userId associated with each post
  creatorName: string; // Add the creatorName field
  fileSize: string;
  // other fields...
}

const PostList: React.FC = () => {
  const { userId } = useUserData(); // Assuming you have a hook to get user data
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<PostData[]>(
          import.meta.env.VITE_SERVER +
            import.meta.env.VITE_SERVER_GET_ALL_POSTS_PATH
        );

        // Prepend VITE_PUBLIC_FOLDER_PATH to pictureUrl and gameFileUrl
        const postsWithFullPath = response.data.map((post) => ({
          ...post,
          pictureUrl: import.meta.env.VITE_SERVER + "/" + post.pictureUrl,
          gameFileUrl: import.meta.env.VITE_SERVER + "/" + post.gameFileUrl,
        }));

        // Fetch file sizes concurrently
        const postsWithFileSizes = await Promise.all(
          postsWithFullPath.map(fetchFileSize)
        );

        // Update posts with file sizes
        const postsWithSizes = postsWithFullPath.map((post, index) => ({
          ...post,
          fileSize: postsWithFileSizes[index],
        }));

        setPosts(postsWithSizes);
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
    const authToken = localStorage.getItem("authToken");
    const refreshToken = localStorage.getItem("refreshToken");

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

      // Remove the deleted post from the state
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="box-border">
      <h2 className="mt-0 mx-0 mb-8 p-0 text-white text-center text-4xl">
        Posts
      </h2>
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
                <h3 className="text-2xl">{post.name}</h3>
                <p className="text-gray-300">Creator: {post.creatorName}</p>
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

                {post.creatorUserId === userId && ( // Check if the current user is the creator
                  <div className="mt-2">
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
