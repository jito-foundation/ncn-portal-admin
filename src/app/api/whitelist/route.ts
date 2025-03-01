import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import {
  addWhitelistEndpoint,
  getApiConfig,
  listWhitelistEndpoint,
  removeWhitelistEndpoint,
  updateWhitelistEndpoint,
} from "../apiConfig";

export async function GET(req: Request) {
  try {
    const { apiUrl } = getApiConfig();
    const proof = await getWhitelists(apiUrl);
    return NextResponse.json(proof);
  } catch (error) {
    console.error(error);

    // Check if error is 401 Unauthorized
    if (error instanceof Error && error.message.includes("401")) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * Get all whitelists
 *
 * @param apiUrl base server url
 * @returns
 */
const getWhitelists = async (apiUrl: string) => {
  const session = await getServerSession();
  const token = session?.user?.name;

  const endpoint = listWhitelistEndpoint();
  const url = new URL(`${apiUrl}${endpoint}`);

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

      default:
        break;
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("401")) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
      console.error(error.message);
      return NextResponse.json(
        { error: error.message },
        { status: error.message.startsWith("400") ? 400 : 500 },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

/**
 * Add a new user to the whitelist
 *
 * @param req Request
 * @returns
 */
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
    throw new Error("401 Unauthorized");
  }

  const { apiUrl } = getApiConfig();
  const endpoint = addWhitelistEndpoint();
  const url = new URL(`${apiUrl}${endpoint}`);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      walletPubkey: pubkey,
      maxTokens: parseInt(maxTokens, 10),
      outputTokens: parseInt(outputTokens, 10),
      upperTokensLimit: parseInt(upperTokensLimit, 10),
    }),
  });

  if (!res.ok) {
    const responseBody = await res.text();
    console.error(`Failed to create whitelist user: ${responseBody}`);
    throw new Error(`Error: ${responseBody}`);
  }

  const data = await res.json();
  return NextResponse.json({ success: true, data }, { status: 201 });
}

/**
 * Update the following  user's fieds:
 *
 * - `maxTokens`
 * - `outputTokens`
 * - `upperTokensLimit`
 *
 * @param req Request
 * @returns
 */
async function updateUser(req: Request) {
  const body = await req.json();
  const {
    id,
    pubkey,
    maxTokens,
    outputTokens,
    upperTokensLimit,
    accessStatus,
  } = body;

  const session = await getServerSession();
  const token = session?.user?.name;

  if (!token) {
    throw new Error("401 Unauthorized");
  }

  const { apiUrl } = getApiConfig();
  const endpoint = updateWhitelistEndpoint();
  const url = new URL(`${apiUrl}${endpoint}`);

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
      accessStatus: parseInt(accessStatus, 10),
    }),
  });

  if (!res.ok) {
    const responseBody = await res.text();
    console.error(`Failed to update whitelist user: ${responseBody}`);
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
      throw new Error("401 Unauthorized");
    }

    const { apiUrl } = getApiConfig();
    const endpoint = removeWhitelistEndpoint(pubkey);
    const url = new URL(`${apiUrl}${endpoint}`);

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
    if (error instanceof Error) {
      if (error.message.includes("401")) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
      console.error(error.message);
      return NextResponse.json(
        { error: error.message },
        { status: error.message.startsWith("400") ? 400 : 500 },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
