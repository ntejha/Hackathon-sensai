import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import type { User, Account, Profile } from "next-auth";
import { registerUserWithBackend } from "./utils";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // If signing in for the first time, save user info in token
      if (account && user) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        
        // If this is a Google signin, get userId from backend
        if (account.provider === 'google') {
          try {
            console.log('Registering user with backend...');
            const result = await registerUserWithBackend(user, account);
            
            // Extract the ID from the result
            if (result && result.id) {
              // Store the backend userId directly in the token
              token.userId = result.id;
              console.log('Backend user ID stored in token:', result.id);
            } else {
              console.error("Backend response missing ID field:", result);
              // Don't fail the auth flow, but log the issue
              token.backendError = result?.error || 'No ID returned from backend';
            }
          } catch (error) {
            console.error("Error storing backend user ID:", error);
            // Don't fail the auth flow, but log the issue
            token.backendError = error instanceof Error ? error.message : 'Unknown error';
          }
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {      
      // Send properties to the client
      if (session.user) {
        // Use the backend user ID directly as the main ID
        if (token.userId) {
          session.user.id = String(token.userId); // Ensure ID is stored as string
          console.log('Session user ID set:', session.user.id);
        } else {
          console.log("No userId in token!", { token });
          // If no backend user ID, try to use the Google user ID as fallback
          if (token.sub) {
            session.user.id = token.sub;
            console.log('Using Google user ID as fallback:', token.sub);
          }
        }
        
        // Add access token to session if it exists
        if (token.accessToken) {
          (session as any).accessToken = token.accessToken;
        }
        
        // Add any backend errors to session for debugging
        if (token.backendError) {
          (session as any).backendError = token.backendError;
        }
      }
      
      return session;
    },
    
    async signIn({ user, account, profile }) {
      if (!account || !profile) {
        console.log('Missing account or profile in signIn callback');
        return true;
      }
      
      try {
        // We no longer need to call registerUserWithBackend here
        // since we're now doing it in the jwt callback to store the ID
        console.log('SignIn callback successful for user:', user.email);
        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        // Still return true to not block the auth flow
        return true;
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 