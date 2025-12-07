// src/api/uploadFileApi.js
import axios from "axios";
import { UPLOAD_FILE_ROUTE } from "@/utils/constant";
import { HOST } from "@/utils/constant";

export const uploadFileApi = async (formData, onUploadProgress) => {
    try {
        const response = await axios.post(
            `${HOST}${UPLOAD_FILE_ROUTE}`,
            formData,
            {
                withCredentials: true, // same as credentials: "include"
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress, // ✅ progress callback
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// filePath = "uploads/files/1712345678901/song.mp3"
export const fetchFileApi = (filePath, onDownloadProgress) => {
  return axios.get(`${HOST}/${filePath}`, {
    responseType: "blob",          // 💥 IMPORTANT: binary file ko blob me lo
    onDownloadProgress,            // progress bar ke liye
    withCredentials: true,         // agar cookies use kar rahe ho to safe hai
  });
};
