import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { getApiConfig } from "../apiConfig";

export async function GET(req: Request) {
  try {
    const { apiUrl } = getApiConfig();
    const adminConfig = await getAdminConfig(apiUrl);
    return NextResponse.json(adminConfig);
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
 * Get Admin Configuration
 *
 * @param apiUrl base server url
 * @returns
 */
const getAdminConfig = async (apiUrl: string) => {
  const session = await getServerSession();
  const token = session?.user?.name;

  const url = `${apiUrl}/rest/admin/config`;
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
