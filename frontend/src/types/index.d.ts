export interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (email: string, password: string) => void;
  loading: boolean;
  error: string | null;
}

export interface FileItem {
  _id: string;
  fileName: string;
  originalName: string;
  fileType: string;
  size: number;
  createdAt: string;
}

export interface FileListProps {
  files: FileItem[];
  onFileAction: () => void;
  totalFiles: number;
  onPageChange: (page: number) => void;
  onSearchQueryChange: (query: string) => void;
  onFilter: (fileType: string) => void;
  currentPage: number;
  searchQuery: string;
  fileTypeFilter: string;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export interface FileUploadProps {
  onUploadSuccess: () => void;
  onClose: () => void;
}
