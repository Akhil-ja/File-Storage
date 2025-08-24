"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import ConfirmationModal from "./ConfirmationModal";
import { FileListProps } from "@/types";

const FileList: React.FC<FileListProps> = ({
  files,
  onFileAction,
  totalFiles,
  onPageChange,
  onSearchQueryChange,
  onFilter,
  currentPage,
  searchQuery,
  fileTypeFilter,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const totalPages = Math.ceil(totalFiles / 10);

  const handleDownload = async (fileId: string, originalName: string) => {
    try {
      const response = await api.get(`/files/${fileId}`);
      if (response.data.success && response.data.data.url) {
        const link = document.createElement("a");
        link.href = response.data.data.url;
        link.setAttribute("download", originalName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("File download initiated.");
      }
    } catch (error: any) {
      console.error("Download failed:", error);
      toast.error(error.response?.data?.message || "Failed to download file.");
    }
  };

  const handleDelete = (fileId: string) => {
    setFileToDelete(fileId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (fileToDelete) {
      try {
        const response = await api.delete(`/files/${fileToDelete}`);
        if (response.data.success) {
          toast.success(response.data.message);
          onFileAction();
        }
      } catch (error: any) {
        console.error("Delete failed:", error);
        toast.error(error.response?.data?.message || "Failed to delete file.");
      } finally {
        setIsDeleteModalOpen(false);
        setFileToDelete(null);
      }
    }
  };

  const handleView = async (fileId: string, fileType: string) => {
    try {
      const response = await api.get(`/files/${fileId}?action=view`);
      if (response.data.success && response.data.data.url) {
        window.open(response.data.data.url, "_blank");
        toast.success("File opened for viewing.");
      }
    } catch (error: any) {
      console.error("View failed:", error);
      toast.error(error.response?.data?.message || "Failed to view file.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-7xl">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Your Files</h2>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <select
          value={fileTypeFilter}
          onChange={(e) => onFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">All file types</option>
          <option value="image/jpeg">JPEG</option>
          <option value="image/png">PNG</option>
          <option value="application/pdf">PDF</option>
          <option value="text/plain">Text</option>
        </select>
      </div>
      {files.length === 0 ? (
        <p className="text-gray-600">No files uploaded yet.</p>
      ) : (
        <>
          <div className="h-200">
            <ul className="divide-y divide-gray-200">
              {files.map((file) => (
                <li
                  key={file._id}
                  className="py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {file.originalName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Type: {file.fileType} | Size:{" "}
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                    <p className="text-sm text-gray-500">
                      Uploaded: {new Date(file.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(file._id, file.fileType)}
                      className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        handleDownload(file._id, file.originalName)
                      }
                      className="bg-green-500 hover:bg-green-700 text-white text-sm py-1 px-3 rounded"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="bg-red-500 hover:bg-red-700 text-white text-sm py-1 px-3 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
            >
              Next
            </button>
          </div>
        </>
      )}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this file? This action cannot be undone."
      />
    </div>
  );
};

export default FileList;
