import { NextResponse } from "next/server";
import { getApiConfig } from "../apiConfig";
import { getServerSession } from "next-auth";

export async function GET(_req: Request) {
  try {
    const { apiUrl } = getApiConfig();
    const proof = await getWhitelists(apiUrl);
    return NextResponse.json(proof);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

const getWhitelists = async (apiUrl: string) => {
  const session = await getServerSession();
  const token = session?.user?.name;

  const url = `${apiUrl}/rest/whitelist/get/all`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
  });

  if (res.status !== 200) {
    const statusText = res.statusText;
    const responseBody = await res.text();
    console.error(`NCN Portal response error: ${responseBody}`);
    throw new Error(
      `NCN Portal has encountered an error with a status code of ${res.status} ${statusText}: ${responseBody}`,
    );
  }

  const json = await res.json();
  return json;
};

// POST method
export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    switch (action) {
      case "addUser":
        return addUser(req);

      case "updateUser":
        return updateUser(req);

      case "updateMerkleRoot":
        return updateMerkleRoot(req);

      default:
        break;
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

// Add a new user to the whitelist
async function addUser(req: Request) {
  const body = await req.json();
  const { pubkey, maxTokens, outputTokens, upperTokensLimit } = body;

  // Validate the input
  if (!pubkey) {
    return NextResponse.json(
      { error: "Public Key are required." },
      { status: 400 },
    );
  }

  const session = await getServerSession();
  const token = session?.user?.name;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in first." },
      { status: 401 },
    );
  }

  const { apiUrl } = getApiConfig();
  const url = `${apiUrl}/rest/whitelist/add?walletPubkey=${pubkey}&maxTokens=${maxTokens}&outputTokens=${outputTokens}&upperTokensLimit=${upperTokensLimit}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const responseBody = await res.text();
    console.error(`Failed to create whitelist user: ${responseBody}`);
    throw new Error(`Error: ${responseBody}`);
  }

  const data = await res.json();
  return NextResponse.json({ success: true, data }, { status: 201 });
}

async function updateUser(req: Request) {
  const body = await req.json();
  const { id, pubkey, maxTokens, outputTokens, upperTokensLimit } = body;

  const session = await getServerSession();
  const token = session?.user?.name;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in first." },
      { status: 401 },
    );
  }

  const { apiUrl } = getApiConfig();
  const url = `${apiUrl}/rest/whitelist/update`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id,
      pubkey,
      maxTokens: parseInt(maxTokens, 10),
      outputTokens: parseInt(outputTokens, 10),
      upperTokensLimit: parseInt(upperTokensLimit, 10),
    }),
  });
  0;

  if (!res.ok) {
    const responseBody = await res.text();
    console.error(`Failed to update whitelist user: ${responseBody}`);
    throw new Error(`Error: ${responseBody}`);
  }

  const data = await res.json();
  return NextResponse.json({ success: true, data }, { status: 201 });
}

// Update Merkle Root
async function updateMerkleRoot(req: Request) {
  const session = await getServerSession();
  const token = session?.user?.name;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in first." },
      { status: 401 },
    );
  }

  const { apiUrl } = getApiConfig();
  const url = `${apiUrl}/rest/merkle_tree/update`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const responseBody = await res.text();
    console.error(`Failed to update merkle root: ${responseBody}`);
    throw new Error(`Error: ${responseBody}`);
  }

  const data = await res.json();
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pubkey = searchParams.get("pubkey");

    if (!pubkey) {
      return NextResponse.json(
        { error: "Pubkey is required for deletion" },
        { status: 400 },
      );
    }

    const session = await getServerSession();
    const token = session?.user?.name;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in first." },
        { status: 401 },
      );
    }

    const { apiUrl } = getApiConfig();
    const url = `${apiUrl}/rest/whitelist/remove/${pubkey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const responseBody = await res.text();
      console.error(`Failed to delete whitelist entry: ${responseBody}`);
      throw new Error(`Error: ${responseBody}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting whitelist entry:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
