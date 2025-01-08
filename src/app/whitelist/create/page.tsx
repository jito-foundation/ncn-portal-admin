"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import DefaultLayout from "@/components/Layouts/DefaultLayout";

const AddWhitelistUserPage = () => {
  const router = useRouter();
  const [newUser, setNewUser] = useState({
    pubkey: "",
    maxTokens: 1024,
    outputTokens: 0,
    upperTokensLimit: 5000,
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/whitelist?action=addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.redirected) {
        window.location.href = response.url;
      } else if (!response.ok) {
        const error = await response.json();
        setError(error.message);
      }

      // Redirect back to the whitelist page after successful creation
      router.push("/whitelist");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <DefaultLayout>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
            Add New User to Whitelist
          </h2>
          {error && (
            <div className="mb-4 rounded bg-red-100 p-3 text-red-700 dark:bg-red-800 dark:text-red-300">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Public Key
              </label>
              <input
                type="text"
                name="pubkey"
                value={newUser.pubkey}
                onChange={handleInputChange}
                className="mt-1 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Max Tokens
              </label>
              <input
                type="text"
                name="maxTokens"
                value={newUser.maxTokens}
                onChange={handleInputChange}
                className="mt-1 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Output Tokens
              </label>
              <input
                type="text"
                name="outputTokens"
                value={newUser.outputTokens}
                onChange={handleInputChange}
                className="mt-1 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Upper Tokens Limit
              </label>
              <input
                type="text"
                name="upperTokensLimit"
                value={newUser.upperTokensLimit}
                onChange={handleInputChange}
                className="mt-1 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Create User
              </button>
              <button
                type="button"
                onClick={() => router.push("/whitelist")}
                className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddWhitelistUserPage;
