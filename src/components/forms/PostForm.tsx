import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useUserData } from "../../store/hook/useUserData.ts";

interface PostData {
  game: {
    name: string;
    picture: string | null;
    gameFile: string | null;
  };
  comments: [];
}

const PostForm: React.FC = () => {
  const { fullName , userId} = useUserData();
  const [postData, setPostData] = useState<PostData>({
    game: {
      name: "",
      picture: null,
      gameFile: null,
    },
    comments: [],
  });
  const authToken = localStorage.getItem("authToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const [selectedPicture, setSelectedPicture] = useState<File | null>(null);
  const [selectedGameFile, setSelectedGameFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | File>
  ) => {
    const { name, type } = e.target;

    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;

      if (file) {
        if (name === "game.picture") {
          setSelectedPicture(file);
        } else if (name === "game.gameFile") {
          setSelectedGameFile(file);
        }
      }
    } else {
      setPostData((prevData) => ({
        ...prevData,
        game: {
          ...prevData.game,
          [name]: (e.target as HTMLInputElement).value,
        },
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", postData.game.name);
      formData.append("creatorName", fullName);
      formData.append("creatorUserId",userId)

      if (selectedPicture) {
        formData.append("picture", selectedPicture);
      }

      if (selectedGameFile) {
        formData.append("gameFile", selectedGameFile);
      }

      const response = await axios.post(
        import.meta.env.VITE_SERVER +
          import.meta.env.VITE_SERVER_CREATE_POST_PATH,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `JWT ${authToken} ${refreshToken}`,
          },
        }
      );

      console.log("Post uploaded:", response.data);
      setUploadStatus("Post uploaded successfully");
      // Handle success, e.g., show a success message or redirect
    } catch (error: any) {
      console.error("Error uploading post:", error.message);
      setUploadStatus("Error uploading post. Please try again.");
      // Handle error, e.g., show an error message
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Add new post</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          <span className="text-gray-700">Game Name:</span>
          <input
            className="form-input mt-1 block w-full"
            type="text"
            name="name"
            value={postData.game.name}
            onChange={handleChange}
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Game Picture URL:</span>
          <input
            className="form-input mt-1 block w-full"
            type="file"
            name="game.picture"
            onChange={handleChange}
          />
          {selectedPicture && (
            <p className="text-gray-600 mt-2">Selected Picture: {selectedPicture.name}</p>
          )}
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Game File URL:</span>
          <input
            className="form-input mt-1 block w-full"
            type="file"
            name="game.gameFile"
            onChange={handleChange}
          />
          {selectedGameFile && (
            <p className="text-gray-600 mt-2">Selected Game File: {selectedGameFile.name}</p>
          )}
        </label>

        {uploadStatus && (
          <p className={uploadStatus.includes("successfully") ? "text-green-600" : "text-red-600"}>
            {uploadStatus}
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload Post
        </button>
      </form>
    </div>
  );
};

export default PostForm;