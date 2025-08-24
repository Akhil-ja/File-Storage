"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { FileItem } from "@/types";

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [filesLoading, setFilesLoading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchFiles = useCallback(async () => {
    setFilesLoading(true);
    console.log("Filtering by:", fileTypeFilter);
    try {
      const response = await api.get("/files", {
        params: {
          page: currentPage,
          search: debouncedSearchQuery,
          fileType: fileTypeFilter,
        },
      });
      if (response.data.success) {
        setFiles(response.data.data.files);
        setTotalFiles(response.data.data.total);
      }
    } catch (error: any) {
      console.error("Failed to fetch files:", error);
      if (error.response && error.response.status === 401) {
        router.push("/login");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to load dashboard. Please try again."
        );
      }
    } finally {
      setFilesLoading(false);
    }
  }, [router, currentPage, debouncedSearchQuery, fileTypeFilter]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/files");
        setMessage("Dashboard");
      } catch (error: any) {
        console.error("Authentication check failed:", error);
        if (error.response && error.response.status === 401) {
          router.push("/login");
        } else {
          toast.error(
            error.response?.data?.message ||
              "Failed to load dashboard. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4 flex flex-col items-center flex-grow">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">{message}</h1>

        {filesLoading ? (
          <p>Loading files...</p>
        ) : (
          <FileList
            files={files}
            onFileAction={fetchFiles}
            totalFiles={totalFiles}
            onPageChange={setCurrentPage}
            onSearchQueryChange={setSearchQuery}
            onFilter={setFileTypeFilter}
            currentPage={currentPage}
            searchQuery={searchQuery}
            fileTypeFilter={fileTypeFilter}
          />
        )}
      </div>

      <button
        onClick={() => setIsUploadModalOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        title="Upload File"
      >
        +
      </button>

      {isUploadModalOpen && (
        <FileUpload
          onUploadSuccess={() => {
            fetchFiles();
            setIsUploadModalOpen(false);
          }}
          onClose={() => setIsUploadModalOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
