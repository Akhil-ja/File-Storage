"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import api from "@/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/register", { email, password });
      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/dashboard");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center w-full max-w-lg">
        <AuthForm
          type="register"
          onSubmit={handleRegister}
          loading={loading}
          error={error}
        />
        <p className="mt-4 text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
