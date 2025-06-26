import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import { authOptions } from "./api/auth/[...nextauth]/route"
import {
  ArrowRight,
  BarChart,
  DollarSign,
  ShieldCheck,
  Zap,
} from "lucide-react"

export default async function LandingPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  const features = [
    {
      title: "Dashboard Intuitivo",
      description: "Visualize todas as suas finanças em um único lugar, de forma clara e objetiva.",
      header: <Skeleton className="h-full w-full rounded-xl" />,
      className: "md:col-span-2",
      icon: <BarChart className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Controle Total",
      description: "Monitore entradas e saídas com poucos cliques.",
      header: <Skeleton className="h-full w-full rounded-xl" />,
      className: "md:col-span-1",
      icon: <DollarSign className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Segurança de Ponta",
      description: "Seus dados são criptografados e protegidos.",
      header: <Skeleton className="h-full w-full rounded-xl" />,
      className: "md:col-span-1",
      icon: <ShieldCheck className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Insights Automáticos",
      description: "Receba relatórios e dicas para melhorar sua saúde financeira.",
      header: <Skeleton className="h-full w-full rounded-xl" />,
      className: "md:col-span-2",
      icon: <Zap className="h-4 w-4 text-neutral-500" />,
    },
  ]

  return (
    <div className="min-h-screen w-full bg-black bg-grid-white/[0.05] relative">
      {/* Navbar */}
      <header className="p-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white">
          Nemori<span className="text-green-500">$</span>e
        </Link>
        <Button asChild variant="default" className="bg-white text-black font-semibold hover:bg-gray-200">
          <Link href="/login">Entrar</Link>
        </Button>
      </header>

      {/* Hero */}
      <main className="p-4 pt-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
          A Clareza Financeira <br /> que Você Sempre Quis
        </h1>
        <p className="mt-4 text-lg text-neutral-300 max-w-2xl mx-auto">
          Nemorise simplifica o complexo mundo das finanças pessoais. Menos
          planilhas, mais controle e mais paz de espírito.
        </p>
        <Button asChild size="lg" className="mt-8 bg-white text-black font-bold hover:bg-gray-200">
          <Link href="/login">
            Comece Agora <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </main>

      {/* Bento Grid */}
      <section className="p-4 md:p-10">
        <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
          {features.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={item.className}
              icon={item.icon}
            />
          ))}
        </BentoGrid>
      </section>

      <footer className="relative z-10 w-full py-6 text-center text-white px-6">
        <p className="text-sm select-none">
          © {new Date().getFullYear()} Nemorise. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  )
}

const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={`flex flex-1 w-full h-full min-h-[6rem] rounded-xl   dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black ${className}`}
  ></div>
)
