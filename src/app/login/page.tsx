import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { LoginForm } from "./_components/login-form";
import Link from "next/link";
import { TipCarousel } from "./_components/tip-carousel";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen w-full bg-black">
      <div className="grid md:grid-cols-2">
        <div className="hidden md:flex flex-col justify-between bg-black bg-grid-white/[0.05] p-12 h-screen">
          <Link href="/" className="text-2xl font-bold text-white self-start">
            Nemori<span className="text-green-500">$</span>e
          </Link>
          
          <TipCarousel />

          <div />
        </div>
        <div className="flex items-center justify-center bg-black bg-grid-white/[0.05] relative h-screen">
          <div className="absolute top-0 left-0 w-full h-full bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <LoginForm />
        </div>
      </div>
      <footer className="absolute bottom-5 w-full text-center text-xs text-[#737373]">
        © {new Date().getFullYear()} Nemorise
      </footer>
    </div>
  );
} 