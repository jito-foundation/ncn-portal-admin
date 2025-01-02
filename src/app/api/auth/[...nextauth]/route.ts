import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getApiConfig } from "../../apiConfig";
import { NextResponse } from "next/server";

const signin = async (apiUrl: string) => {
  const url = `${apiUrl}/rest/whitelist/get/all`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
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

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: {
          type: "text",
        },
        password: { type: "password" },
      },
      async authorize(credentials) {
        try {
          const { apiUrl } = getApiConfig();
          //   const res = await signin(apiUrl);
          //   return {
          //     token: res.data,
          //   }

          // credentials に入力が渡ってくる
          // id, password はここでベタ打ちして検証している
          // const matched =
          //   credentials?.username === "admin" && credentials?.password === "password";
          // if (matched) {
          //   // 今回は null を返さなければなんでもよいので適当
          //   return {
          //     id: "29472084752894723890248902",
          //   };
          // } else {
          //   return null;
          // }
          const data = {
            username: credentials?.username,
            password: credentials?.password
          };
          const url = `${apiUrl}/rest/login`;
          const res = await fetch(url, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data)
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
          return {
            id: json.data,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
