# File Storage Application

A full-stack web application for secure file storage, allowing users to upload, view, download, and delete files. It includes user authentication, file management, and cloud storage integration.

## Features

- User Authentication (Register, Login, Logout)
- File Upload (with validation for type and size)
- File Viewing (in-browser for supported types)
- File Download
- File Deletion (with confirmation modal)
- File Search (by name, with debouncing)
- File Filtering (by type)
- File Pagination (10 files per page)
- Secure Token-based Authentication (Access and Refresh Tokens)
- Cloud Storage (AWS S3)

## Technologies Used

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB (Mongoose)
- JWT (JSON Web Tokens)
- Multer (for file uploads)
- AWS SDK (for S3 integration)

### Frontend

- React.js
- Next.js
- TypeScript
- Tailwind CSS
- Axios (for API communication)

## Setup Steps

### Prerequisites

- Node.js (LTS version recommended)
- MongoDB (running locally or a cloud instance like MongoDB Atlas)
- AWS Account (with S3 bucket configured)

### 1. Clone the repository:

```bash
git clone <repository_url>
cd file-storage
```

### 2. Backend Setup:

- Navigate to the `backend` directory: `cd backend`
- Install dependencies: `npm install`
- Create a `.env` file in the `backend` directory and add the following environment variables (refer to `.env.example` for details):

  ```
  PORT=5000
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  JWT_ACCESS_TOKEN_EXPIRATION=1h
  JWT_REFRESH_TOKEN_EXPIRATION=7d
  AWS_BUCKET_NAME=your_s3_bucket_name
  AWS_BUCKET_REGION=your_aws_region
  AWS_ACCESS_KEY_ID=your_aws_access_key_id
  AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
  CLIENT_ORIGIN=http://localhost:3000
  ```

- Start the backend server: `npm run dev` (or `npm start` for production)

### 3. Frontend Setup:

- Navigate to the `frontend` directory: `cd frontend`
- Install dependencies: `npm install`
- Create a `.env.local` file in the `frontend` directory and add the following environment variable (refer to `.env.example` for details):

  ```
  NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
  ```

- Start the frontend development server: `npm run dev`

## Usage

- Once both backend and frontend servers are running, open your browser and navigate to `http://localhost:3000` (or your `CLIENT_ORIGIN`).
- Register a new user or log in with existing credentials.
- Upload, view, download, search, filter, and delete your files.
