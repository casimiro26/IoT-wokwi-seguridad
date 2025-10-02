"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const heroImages = [
  {
    url: "https://digitalcxo.com/wp-content/uploads/2022/02/canstockphoto15223412resize.jpg",
    title: "Tecnología de Vanguardia",
    description: "Los mejores productos tecnológicos al alcance de tu mano",
  },
  {
    url: "https://sharkgaming.dk/media/contentmanager/content/erhverv/Topbanner-Hero-Gear.png",
    title: "Gaming Premium",
    description: "Equipa tu setup con lo último en gaming",
  },
  {
    url: "https://static.wixstatic.com/media/d96bda_70bb9561b10e4323bef018d9267bbc7b~mv2.jpg/v1/fill/w_2500,h_1816,al_c/d96bda_70bb9561b10e4323bef018d9267bbc7b~mv2.jpg",
    title: "Accesorios Esenciales",
    description: "Todo lo que necesitas para tu día a día",
  },
  {
    url: "../assets/images/cama.png",
    title: "Seguridad Inteligente",
    description: "Protege lo que más importa con tecnología avanzada",
  },
]

export const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  return (
    <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-black text-white overflow-hidden">
      {/* Patrón de fondo decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Título y descripción */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-fade-in bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent">
            Catálogo de Productos
          </h1>
          <p className="text-lg md:text-xl text-red-50 mb-6 max-w-3xl mx-auto font-light leading-relaxed">
            Encuentra los mejores accesorios tecnológicos para tus necesidades
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base">
            <span className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full font-semibold shadow-lg hover:bg-white/30 transition-all duration-300 hover:scale-105">
              Envío Express
            </span>
            <span className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full font-semibold shadow-lg hover:bg-white/30 transition-all duration-300 hover:scale-105">
              Compra Segura
            </span>
            <span className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full font-semibold shadow-lg hover:bg-white/30 transition-all duration-300 hover:scale-105">
              Calidad Premium
            </span>
          </div>
        </div>

        {/* Carrusel de imágenes */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-5xl mx-auto">
          <div className="relative h-64 md:h-96">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img src={image.url || "/placeholder.svg"} alt={image.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-2xl md:text-4xl font-bold mb-2">{image.title}</h3>
                  <p className="text-base md:text-lg text-gray-200">{image.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Botones de navegación */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
