import React, { useEffect, useState } from "react";
import {
    useUserData,
    useUserDataDispatch,
} from "../../store/hook/useUserData.ts";
import axios from "axios";

const UserProfile: React.FC = () => {
    const authToken = localStorage.getItem("authToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const { fullName, imagePath, userId } = useUserData();

    // State for tracking whether the user is in edit mode
    const [editMode, setEditMode] = useState(false);

    const userDataDispatch = useUserDataDispatch();
    const urlImage = import.meta.env.VITE_SERVER + "/" + imagePath;
    const [profileImage, setProfileImage] = useState(urlImage);

    // State for storing the selected image file
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    // Function to handle the update of the user image
    const handleUpdateImage = async () => {
        try {
            if (!selectedImage) {
                console.error("Please select an image file.");
                return;
            }

            const formData = new FormData();
            formData.append("file", selectedImage);
            formData.append("userId", userId);

            // Send a request to update the user's image
            const response = await axios.put(
                import.meta.env.VITE_SERVER +
                    import.meta.env.VITE_SERVER_USER_UPDATE_PIC_PATH,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        authorization: `JWT ${authToken} ${refreshToken}`,
                    },
                }
            );

            setProfileImage(
                import.meta.env.VITE_SERVER + "/" + response.data.filePath
            );

            userDataDispatch({
                type: "set-userData",
                payload: {
                    userId: userId,
                    fullName: fullName,
                    imagePath: import.meta.env.VITE_SERVER + "/"+response.data.filePath,
                },
            });
            
            

            // Set the new image URL in the local state
            setEditMode(false);
        } catch (error) {
            console.error("Error updating image:", error);
        }
    };
    useEffect(() => {
        setProfileImage(imagePath)
        
      }, [imagePath]);
    
    

   


    // Function to handle the selection of an image file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setSelectedImage(file);
        }
    };
    
    return (
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <h2 className="text-4xl font-semibold mb-4">Dashboard</h2>
            <div className="flex flex-col items-center space-y-4">
                <h3 className="text-2xl font-semibold">{fullName}</h3>
                {editMode ? (
                    <div className="flex flex-col items-center space-y-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="border-2 border-gray-300 p-2 rounded-md"
                        />
                        <input type="hidden" name="userId" value={userId} />
                        <button
                            onClick={handleUpdateImage}
                            className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600"
                        >
                            Update Image
                        </button>
                        <button
                            onClick={() => setEditMode(false)}
                            className="bg-gray-500 text-white px-3 py-2 rounded-md hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-2">
                        <img
                            src={profileImage}
                            alt="User"
                            className="rounded-full h-32 w-32 object-cover"
                        />
                        <button
                            onClick={() => setEditMode(true)}
                            className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600"
                        >
                            Edit Image
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
