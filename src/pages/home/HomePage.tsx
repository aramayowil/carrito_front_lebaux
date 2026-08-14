import { AboutSection } from "@/pages/home/sections/AboutSection"
import { Benefits } from "@/pages/home/sections/Benefits"
import { Hero } from "@/pages/home/sections/Hero"
import { HomeCatalogsSection } from "@/pages/home/sections/HomeCatalogsSection"
import { HomeFeaturedProductsSection } from "@/pages/home/sections/HomeFeaturedProductsSection"
import { HomePromotionsSection } from "@/pages/home/sections/HomePromotionsSection"
import { HomeTechnicalCatalogsSection } from "@/pages/home/sections/HomeTechnicalCatalogsSection"
import { ObrasSection } from "@/pages/home/sections/ObrasSection"
import type { DatosHomePublica } from "@/server/datos-publicos"
import type { IdSeccionInicio } from "@/types"

/** Portada renderizada en servidor; solo Hero conserva hidratación interactiva. */
export function HomePage({ datos }: { datos: DatosHomePublica }) {
  const { productos, lineas, obras, beneficios, inicio, experienciaInicio } = datos

  function renderizarSeccion(id: IdSeccionInicio) {
    switch (id) {
      case "hero":
        return <Hero key={id} banners={inicio.banners} />
      case "catalogos":
        return <HomeCatalogsSection key={id} products={productos} lines={lineas} />
      case "catalogosTecnicos":
        return <HomeTechnicalCatalogsSection key={id} lines={lineas} />
      case "promociones":
        return (
          <HomePromotionsSection
            key={id}
            products={productos}
            lines={lineas}
            tipologias={datos.tipologias}
          />
        )
      case "destacados":
        return <HomeFeaturedProductsSection key={id} products={productos} />
      case "beneficios":
        return <Benefits key={id} beneficios={beneficios} encabezado={inicio.porQueElegirnos} />
      case "obras":
        return (
          <ObrasSection
            key={id}
            obras={obras}
            mensajeWhatsapp={inicio.obras.mensajeWhatsapp}
            telefonoWhatsapp={datos.telefonoWhatsapp}
          />
        )
      case "nosotros":
        return <AboutSection key={id} contenido={inicio.acercaDeNosotros} />
    }
  }

  const secciones = [...experienciaInicio.secciones]
    .filter((seccion) => seccion.visible)
    .sort((a, b) => a.orden - b.orden)

  return <div className="overflow-x-clip">{secciones.map((seccion) => renderizarSeccion(seccion.id))}</div>
}
