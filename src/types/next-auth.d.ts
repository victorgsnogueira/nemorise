import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  /**
   * Retornada por `useSession`, `getSession` e recebida como propriedade no `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** O ID do usuário no banco de dados. */
      id: string
      theme?: {
        hue: number
        saturation: number
        lightness: number
        mode: 'light' | 'dark'
      } | null
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    theme?: {
      hue: number
      saturation: number
      lightness: number
      mode: 'light' | 'dark'
    } | null
  }
}

declare module "next-auth/jwt" {
  /** Extensão do token JWT para incluir o tema do usuário. */
  interface JWT {
    theme?: {
      hue: number
      saturation: number
      lightness: number
      mode: 'light' | 'dark'
    } | null
  }
} 