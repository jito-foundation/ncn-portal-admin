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
