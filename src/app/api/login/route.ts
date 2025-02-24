import { NextRequest, NextResponse } from "next/server";
import { getApiConfig, getLoginSiwsMessageEndpoint } from "../apiConfig";
import { UiWalletAccount } from "@wallet-standard/react";

export async function POST(req: NextRequest) {
  try {
    const { requestType, url, address, account, signedMessage, signature } =
      (await req.json()) as {
        requestType: string;
        address: string;
        account: UiWalletAccount | undefined;
        signedMessage: Uint8Array<ArrayBufferLike> | undefined;
        signature: Uint8Array<ArrayBufferLike> | undefined;
        url: string | undefined;
      };

    const { apiUrl } = getApiConfig();

    switch (requestType) {
      case "getSiwsMessage": {
        const response = await getSiwsMessage(apiUrl, address, url!);
        return NextResponse.json(response);
      }
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

const getSiwsMessage = async (apiUrl: string, address: string, url: string) => {
  const endpoint = getLoginSiwsMessageEndpoint(address);
  const requestUrl = new URL(`${apiUrl}${endpoint}`);
  const data = {
    address,
    url,
  };

  const res = await fetch(requestUrl, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res.status !== 200) {
    const statusText = res.statusText;
    const responseBody = await res.text();
    throw new Error(
      `NCN Portal has encountered an error with a status code of ${res.status} ${statusText}: ${responseBody}`,
    );
  }

  const json = await res.json();
  return json;
};
