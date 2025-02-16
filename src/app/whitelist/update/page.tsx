"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import DefaultLayout from "@/components/Layouts/DefaultLayout";

const UpdateWhitelistUserPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    id: "",
    pubkey: "",
    maxTokens: 0,
    outputTokens: 0,
    upperTokensLimit: 0,
    accessStatus: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/whitelist?action=updateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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

  useEffect(() => {
    if (searchParams) {
      setFormData({
        id: searchParams.get("id") || "",
        pubkey: searchParams.get("pubkey") || "",
        maxTokens: parseInt(searchParams.get("maxTokens") || "0", 10),
        outputTokens: parseInt(searchParams.get("outputTokens") || "0", 10),
        upperTokensLimit: parseInt(
          searchParams.get("upperTokensLimit") || "0",
          10,
        ),
        accessStatus: parseInt(searchParams.get("accessStatus") || "0", 10)
      });
    }
  }, [searchParams]);

  return (
    <DefaultLayout>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
            Update User
          </h2>
          {error && (
            <div className="mb-4 rounded bg-red-100 p-3 text-red-700 dark:bg-red-800 dark:text-red-300">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                ID
              </label>
              <input
                type="text"
                name="pubkey"
                value={formData.id}
                onChange={handleInputChange}
                className="mt-1 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Public Key
              </label>
              <input
                type="text"
                name="pubkey"
                value={formData.pubkey}
                onChange={handleInputChange}
                className="mt-1 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Max Tokens
              </label>
              <input
                type="text"
                name="maxTokens"
                value={formData.maxTokens}
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
                value={formData.outputTokens}
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
                value={formData.upperTokensLimit}
                onChange={handleInputChange}
                className="mt-1 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <select
              name="accessStatus"
              value={formData.accessStatus}
              onChange={handleInputChange}
              className="mt-1 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="0">Not Whitelisted (Needs to request access)</option>
              <option value="1">Pending Approval (Waiting for admin approval)</option>
              <option value="2">Approved (Can access the chatbot)</option>
              <option value="3">Banned / Revoked (Access is permanently denied)</option>
            </select>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Update
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

export default UpdateWhitelistUserPage;
