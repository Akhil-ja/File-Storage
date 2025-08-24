"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (email: string, password: string) => void;
  loading: boolean;
  error: string | null;
}

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  loading,
  error,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === "") {
      toast.error("Email cannot be empty");
      return;
    }
    if (password.trim() === "") {
      toast.error("Password cannot be empty");
      return;
    }
    onSubmit(email.trim(), password.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {type === "login" ? "Login" : "Register"}
      </h2>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Email:
        </label>
        <input
          type="email"
          id="email"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) => setEmail(e.target.value.trim())}
          required
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Password:
        </label>
        <input
          type="password"
          id="password"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={(e) => setPassword(e.target.value.trim())}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        disabled={loading}
      >
        {loading ? "Loading..." : type === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
};

export default AuthForm;
