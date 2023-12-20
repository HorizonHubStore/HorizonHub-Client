import React, { useState } from "react";
import {
    useUserData,
    useUserDataDispatch,
} from "../../store/hook/useUserData.ts";
import axios from "axios";

const UserProfile: React.FC = () => {
    const { fullName, imagePath, userId } = useUserData();
    console.log(fullName, imagePath, userId );
    

    // State for tracking whether the user is in edit mode
    const [editMode, setEditMode] = useState(false);
    const userDataDispatch = useUserDataDispatch();
    const urlImage = import.meta.env.VITE_SERVER + "/" + imagePath;
    const [profileImage, setProfileImage] = useState(urlImage);
    console.log(profileImage);
    
    // State for storing the selected image file
    const [selectedImage, setSelectedImage] = useState<string | undefined>(
        undefined
    );

    // Function to handle the update of the user image
    const handleUpdateImage = async () => {
        try {
            if (!selectedImage) {
                console.error("Please select an image file.");
                return;
            }

            // Send a request to update the user's image
            const response = await axios.put(
                import.meta.env.VITE_SERVER +
                    import.meta.env.VITE_SERVER_USER_UPDATE_PIC_PATH,
                { file: selectedImage, userId: userId },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            userDataDispatch({
                type: "set-userData",
                payload: {
                    userId: userId,
                    fullName: fullName,
                    imagePath: response.data.filePath,
                },
            });

            setProfileImage(import.meta.env.VITE_SERVER + "/" + response.data.filePath)
            // Set the new image URL in the local state
            setEditMode(false);
        } catch (error) {
            console.error("Error updating image:", error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            // Convert the file to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Data = reader.result?.toString().split(",")[1];
                setSelectedImage(base64Data);
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <div>
            <div>
                <h2 className="mt-0 mx-0 mb-[30px] p-0 text-white text-center text-4xl">
                    Welcome to {fullName} Dashboard
                </h2>
            </div>
            <h2>User Profile</h2>
            {editMode ? (
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <button onClick={handleUpdateImage}>Update Image</button>
                    <button onClick={() => setEditMode(false)}>Cancel</button>
                </div>
            ) : (
                <div>
                    <img src={profileImage} alt="User" width="150" height="150" />
                    <button onClick={() => setEditMode(true)}>
                        Edit Image
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
