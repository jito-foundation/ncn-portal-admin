"use client";

// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Whitelist {
  id: string;
  pubkey: string;
  maxTokens: string;
  outputTokens: string;
  upperTokensLimit: string;
}

const WhitelistTable = () => {
  const router = useRouter();
  const [whitelists, setWhitelists] = useState<Whitelist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getWhitelists = async () => {
    try {
      const url = "/api/whitelist";

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch whitelist data");
      }

      const json = await response.json();
      setWhitelists(json.data);
    } catch (error) {
      console.error("Error fetching whitelist: ", error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToUpdatePage = (item: Whitelist) => {
    const params = new URLSearchParams({
      id: item.id,
      pubkey: item.pubkey,
      maxTokens: item.maxTokens,
      outputTokens: item.outputTokens,
      upperTokensLimit: item.upperTokensLimit,
    });
    router.push(`/whitelist/update?${params.toString()}`);
  };

  const deleteWhitelist = async (pubkey: string) => {
    try {
      const url = `/api/whitelist?pubkey=${pubkey}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete whitelist entry");
      }

      // Update the UI after successful deletion
      setWhitelists((prev) => prev.filter((item) => item.pubkey !== pubkey));
    } catch (error) {
      console.error("Error deleting whitelist entry: ", error);
    }
  };

  useEffect(() => {
    getWhitelists();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Whitelist Table
      </h4>

      {loading ? (
        <div className="flex h-20 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-300">Loading...</p>
        </div>
      ) : whitelists.length === 0 ? (
        <div className="flex h-20 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-300">No data available</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  Public Key
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  Max Tokens
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  Output Tokens
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  Upper Tokens Limit
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {whitelists.map((item, index) => (
                <tr
                  key={item.id}
                  className={`${
                    index % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-700"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-300">
                    {item.id}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-300">
                    {item.pubkey}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-300">
                    {item.maxTokens}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-300">
                    {item.outputTokens}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-300">
                    {item.upperTokensLimit}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-300">
                    <button
                      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                      onClick={() => navigateToUpdatePage(item)}
                    >
                      Update
                    </button>
                    <button
                      className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                      onClick={() => deleteWhitelist(item.pubkey)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WhitelistTable;
