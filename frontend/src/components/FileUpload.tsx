"use client";

import React, { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { allowedMimeTypes, maxFileSize } from "@/lib/constants";
import { FileUploadProps } from "@/types";

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      if (!allowedMimeTypes.includes(file.type)) {
        toast.error("Invalid file type. Please select a valid file.");
        setSelectedFile(null);
        return;
      }

      if (file.size > maxFileSize) {
        toast.error("File size exceeds 20MB. Please select a smaller file.");
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await api.post("/files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setSelectedFile(null);
        onUploadSuccess();
        onClose();
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "File upload failed.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Upload New File
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="file-upload" className="sr-only">
            Choose file
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        {selectedFile && (
          <p className="text-gray-700 text-sm mb-4">
            Selected file: {selectedFile.name}
          </p>
        )}
        <button
          onClick={handleUpload}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
