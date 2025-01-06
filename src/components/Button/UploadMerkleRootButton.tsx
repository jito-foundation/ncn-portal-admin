"use client";

interface Props {
  onSuccess: () => void;
  onError: (errorMessage: string) => void;
}

const UploadMerkleRootButton = ({ onSuccess, onError }: Props) => {
  const handleUploadMerkleRoot = async () => {
    try {
      const response = await fetch("/api/whitelist?action=updateMerkleRoot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload merkle root");
      }

      onSuccess(); // Call the success callback
    } catch (error: any) {
      onError(error.message); // Call the error callback
    }
  };

  return (
    <button
      className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      onClick={handleUploadMerkleRoot}
    >
      Upload merkle root
    </button>
  );
};

export default UploadMerkleRootButton;
