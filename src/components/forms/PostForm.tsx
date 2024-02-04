import React, {ChangeEvent, FormEvent, useState} from "react";
import {useUserData} from "../../store/hook/useUserData.ts";
import api from "../../api/api.tsx";

interface PostData {
    game: {
        name: string;
        picture: string | null;
        gameFile: string | null;
    };
    comments: [];
}

const PostForm: React.FC = () => {
    const {fullName, userId} = useUserData();
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
        const {name, type} = e.target;

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
            formData.append("creatorUserId", userId);

            if (selectedPicture) {
                formData.append("picture", selectedPicture);
            }

            if (selectedGameFile) {
                formData.append("gameFile", selectedGameFile);
            }

            const response = await api.post(
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
        } catch (error) {
            console.error("Error uploading post:", (error as Error).message);
            setUploadStatus("Error uploading post. Please try again.");
            // Handle error, e.g., show an error message
        }
    };

    return (
        <div className="flex flex-col gap-12 p-6 bg-black rounded-lg shadow-md text-center" dir='rtl'>
            <h2 className="text-4xl font-semibold mb-6">העלה משחק חדש</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <label className="flex flex-row mb-4 gap-2">
                    <span className="text-gray-700">שם המשחק:</span>
                    <input
                        className="form-input text-center mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        type="text"
                        name="name"
                        value={postData.game.name}
                        onChange={handleChange}
                    />
                </label>
                <label className="block mb-4">
                    <span className="text-gray-50">הוסף תמונה:</span>
                    <input
                        className="form-input block w-full"
                        type="file"
                        name="game.picture"
                        onChange={handleChange}
                    />
                    {selectedPicture && (
                        <p className="text-gray-50">שם נבחר: {selectedPicture.name}</p>
                    )}
                </label>

                <label className="block mb-4">
                    <span className="text-gray-50">קובץ משחק:</span>
                    <input
                        className="form-input block w-full"
                        type="file"
                        name="game.gameFile"
                        onChange={handleChange}
                    />
                    {selectedGameFile && (
                        <p className="text-gray-50">קובץ משחק נבחר: {selectedGameFile.name}</p>
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
                    העלה משחק
                </button>
            </form>
        </div>
    );
};

export default PostForm;
