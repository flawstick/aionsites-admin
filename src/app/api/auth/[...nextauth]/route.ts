import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }: any) {
      try {
        const response = await axios.post(
          "https://api.aionsites.com/auth/app/google",
          {
            profile,
          },
        );

        if (response.status === 200) {
          // Attach the JWT token to the user object
          user.jwt = response.data.jwt;
          return true;
        } else {
          console.error("Error response from backend:", response.data);
          return false;
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.response?.data || error.message);
        } else {
          console.error("Unknown error:", error);
        }
        return false;
      }
    },
    async jwt({ token, user }: any) {
      // Attach the JWT token from the user object to the token object
      if (user) {
        token.jwt = user.jwt;
      }
      return token;
    },
    async session({ session, token }: any) {
      // Attach the JWT token from the token object to the session object
      session.jwt = token.jwt;

      // Fetch user data from backend using the JWT token
      try {
        const response = await axios.get(
          `http://api.aionsites.com/accounts/${token.jwt}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.jwt}`,
            },
          },
        );

        if (response.status === 200) {
          session.user = response.data; // Attach user data to the session object
        } else {
          console.error("Error fetching user data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      return session;
    },
    async redirect({ url, baseUrl }: any) {
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
