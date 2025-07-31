import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import aurora from "./public/aurora.png"
import select from "./public/select.jpg"
import recomendation from "./public/recomendation.jpg"
import Image from "next/image";
import { ShoppingBagIcon } from "lucide-react";

export default function Home() {
  return (
    <>
        <section className="flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 relative h-screen">
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <Image
              src={aurora}
              alt="AuroraShop background"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
          <div className="relative z-10 max-w-2xl text-center p-6">
            <h1 className="text-5xl md:text-6xl font-extrabold text-neutral-800 mb-6">
              Descubre tu estilo con <span className="text-indigo-600">AuroraShop</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              La tienda de ropa que integra <span className="font-semibold text-indigo-600">inteligencia artificial</span> para recomendarte productos y outfits únicos, pensados solo para ti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link href="/shop" className="px-8 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition">
                Explorar tienda
              </Link>
              <Link href="/about-ai" className="px-8 py-3 rounded-full border border-indigo-600 text-indigo-600 font-bold hover:bg-indigo-50 transition">
                Chatea con la IA
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto py-16 px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-neutral-600">Recomendaciones personalizadas</h2>
            <p className="text-gray-700 mb-6">
              Nuestra IA analiza tus gustos, historial y tendencias para sugerirte prendas y outfits que se adaptan a tu personalidad y ocasión. ¡Haz que cada compra sea única!
            </p>
            <ul className="space-y-3 text-gray-700">
              <li>✔️ Outfits sugeridos para cada ocasión</li>
              <li>✔️ Recomendaciones basadas en tu estilo</li>
              <li>✔️ Descubre nuevas tendencias antes que nadie</li>
            </ul>
          </div>
          <div className="flex justify-center">
            <Image
              src={select}
              alt="AI fashion recommendation"
              width={400}
              height={400}
              className="rounded-xl shadow-xl object-cover"
            />
          </div>
        </section>

        <section className="max-w-5xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center order-2 md:order-1">
            <Image
              src={recomendation}
              alt="Outfit selection"
              width={400}
              height={400}
              className="rounded-xl shadow-xl object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Crea tu propio look</h2>
            <p className="text-gray-700 mb-6">
              Combina prendas, accede a recomendaciones instantáneas y guarda tus outfits favoritos. AuroraShop te ayuda a expresar tu mejor versión.
            </p>
            <Link href="/signup" className="inline-block px-8 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition">
              Comienza ahora
            </Link>
          </div>
        </section>
        
    </>
  );
}
