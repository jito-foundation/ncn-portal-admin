import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getApiConfig } from "../../apiConfig";

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
            console.error(`NCN Portal response error: ${responseBody}`);
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
  ],
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
