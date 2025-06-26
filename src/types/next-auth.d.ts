import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Retornada por `useSession`, `getSession` e recebida como propriedade no `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** O ID do usuário no banco de dados. */
      id: string
    } & DefaultSession["user"]
  }
} 