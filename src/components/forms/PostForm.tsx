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
  const { fullName } = useUserData();
  const [postData, setPostData] = useState<PostData>({
    game: {
      name: "",
      picture: null,
      gameFile: null,
    },
    comments: [],
  });
  const authToken = localStorage.getItem("authToken");
  const refreashToken = localStorage.getItem("refreashToken");

  const [selectedPicture, setSelectedPicture] = useState<File | null>(null);
  const [selectedGameFile, setSelectedGameFile] = useState<File | null>(null);

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
            authorization: `JWT ${authToken} ${refreashToken}`,
          },
        }
      );

      console.log("Post uploaded:", response.data);
      // Handle success, e.g., show a success message or redirect
    } catch (error: any) {
      console.error("Error uploading post:", error.message);
      // Handle error, e.g., show an error message
    }
  };

  return (
    <div>
      <h2>Add new post</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Game Name:
          <input
            type="text"
            name="name"
            value={postData.game.name}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Game Picture URL:
          <input
            type="file"
            name="game.picture"
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Game File URL:
          <input
            type="file"
            name="game.gameFile"
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Upload Post</button>
      </form>
    </div>
  );
};

export default PostForm;
