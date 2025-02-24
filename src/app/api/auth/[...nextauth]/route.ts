import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getApiConfig, loginEndpoint } from "../../apiConfig";
import { UiWalletAccount } from "@wallet-standard/react";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Login With Username",
      credentials: {
        username: {
          type: "text",
        },
        password: { type: "password" },
      },
      async authorize(credentials) {
        try {
          const { apiUrl } = getApiConfig();

          const data = {
            username: credentials?.username,
            password: credentials?.password,
          };
          const url = `${apiUrl}/rest/login?username=${data.username}&password=${data.password}`;
          const res = await fetch(url, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          });

          if (res.status !== 200) {
            const statusText = res.statusText;
            const responseBody = await res.text();
            throw new Error(
              `NCN Portal has encountered an error with a status code of ${res.status} ${statusText}: ${responseBody}`,
            );
          }

          const json = await res.json();
          return {
            id: json.data,
            name: json.data,
          };
        } catch (error) {
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "solana",
      name: "Login with Solana",
      credentials: {
        url: { label: "URL", type: "text" },
        address: { label: "Wallet Address", type: "text" },
        account: { label: "Account Info", type: "text" },
        signedMessage: { label: "Signed Message", type: "text" },
        signature: { label: "Signature", type: "text" },
      },
      async authorize(credentials) {
        const url = credentials?.url;
        const address = credentials?.address;
        const account = credentials?.account;
        const signedMessage = credentials?.signedMessage;
        const signature = credentials?.signature;

        if (!address || !signedMessage || !signature) {
          throw new Error("Missing credentials");
        }

        const parsedAccount = JSON.parse(account!);
        const parsedSignedMessage = JSON.parse(signedMessage!);
        const parsedSignature = JSON.parse(signature!);

        const { apiUrl } = getApiConfig();
        const response = await validateAndVerify(
          apiUrl,
          url!,
          parsedAccount,
          parsedSignedMessage,
          parsedSignature,
        );
        return {
          id: response.data,
          name: response.data,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
};

const validateAndVerify = async (
  apiUrl: string,
  url: string,
  accountData: UiWalletAccount | undefined,
  signedMessageData: Uint8Array<ArrayBufferLike> | undefined,
  signatureData: Uint8Array<ArrayBufferLike> | undefined,
) => {
  const endpoint = loginEndpoint();
  const requestUrl = new URL(`${apiUrl}${endpoint}`);
  // const requestUrl = new URL(`${apiUrl}/rest/login`);
  requestUrl.searchParams.set("url", url);

  const convertPublicKeyToArray = (publicKey: any) => {
    if (!publicKey) return [];
    return Object.keys(publicKey)
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => publicKey[key]);
  };

  const getByteArray = (input: any) => {
    if (!input) return [];
    if (input instanceof Uint8Array) return Array.from(input);
    if (input.data) return Array.from(input.data);
    return [];
  };

  const account = {
    publicKey: convertPublicKeyToArray(accountData?.publicKey),
  };
  const signedMessage = getByteArray(signedMessageData);
  const signature = getByteArray(signatureData);
  const data = {
    account,
    signedMessage,
    signature,
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
