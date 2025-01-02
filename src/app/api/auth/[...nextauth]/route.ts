import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
        console.log("Hi, username: ", credentials?.username);
        console.log("Hi, password: ", credentials?.password);
        // credentials に入力が渡ってくる
        // id, password はここでベタ打ちして検証している
        const matched =
          credentials?.username === "admin" && credentials?.password === "password";
        if (matched) {
          // 今回は null を返さなければなんでもよいので適当
          return {
            id: "29472084752894723890248902",
          };
        } else {
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
