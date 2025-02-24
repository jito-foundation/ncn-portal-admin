"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";

interface Whitelist {
  id: string;
  pubkey: string;
  maxTokens: string;
  outputTokens: string;
  upperTokensLimit: string;
  accessStatus: number;
}

const WhitelistTable = () => {
  const router = useRouter();
  const [whitelists, setWhitelists] = useState<Whitelist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  const getWhitelists = async () => {
    try {
      const url = "/api/whitelist";

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.redirected) {
        window.location.href = response.url;
      } else if (!response.ok) {
        const error = await response.json();
        console.error(error.message);
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

      if (response.redirected) {
        window.location.href = response.url;
      } else if (!response.ok) {
        const error = await response.json();
        console.error(error.message);
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

      <div className="mb-6 flex items-center justify-start gap-4">
        <a
          href="/whitelist/create"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add New User
        </a>
      </div>

      {alertMessage && (
        <div
          className={`mb-4 rounded px-4 py-2 ${
            alertType === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          } shadow-md`}
        >
          {alertMessage}
        </div>
      )}

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
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="border-b border-gray-300 px-4 py-3 text-left text-sm font-bold uppercase text-gray-700 dark:border-gray-600 dark:text-gray-100">
                  Public Key
                </th>
                <th className="border-b border-gray-300 px-4 py-3 text-left text-sm font-bold uppercase text-gray-700 dark:border-gray-600 dark:text-gray-100">
                  Max Tokens
                </th>
                <th className="border-b border-gray-300 px-4 py-3 text-left text-sm font-bold uppercase text-gray-700 dark:border-gray-600 dark:text-gray-100">
                  Output Tokens
                </th>
                <th className="border-b border-gray-300 px-4 py-3 text-left text-sm font-bold uppercase text-gray-700 dark:border-gray-600 dark:text-gray-100">
                  Upper Tokens Limit
                </th>
                <th className="border-b border-gray-300 px-4 py-3 text-left text-sm font-bold uppercase text-gray-700 dark:border-gray-600 dark:text-gray-100">
                  Access Status
                </th>
                <th className="border-b border-gray-300 px-4 py-3 text-left text-sm font-bold uppercase text-gray-700 dark:border-gray-600 dark:text-gray-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {whitelists.map((item, index) => (
                <tr key={index} className="bg-gray-50 dark:bg-gray-700">
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
                    {(() => {
                      switch (item.accessStatus) {
                        case 0:
                          return "Not Whitelisted (Needs to request access)";
                        case 1:
                          return "Pending Approval (Waiting for admin approval)";
                        case 2:
                          return "Approved (Can access the chatbot)";
                        case 3:
                          return "Banned / Revoked (Access is permanently denied)";
                        default:
                          return "Unknown Status";
                      }
                    })()}
                  </td>
                  <td className="flex justify-between px-4 py-2 text-sm text-gray-800 dark:text-gray-300">
                    <button
                      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                      onClick={() => navigateToUpdatePage(item)}
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                      onClick={() => deleteWhitelist(item.pubkey)}
                    >
                      <Trash size={18} />
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
