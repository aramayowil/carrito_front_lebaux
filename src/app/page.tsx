import type { Metadata } from 'next'
import { Suspense } from 'react'

import { HomePage } from '@/screens/home/HomePage'
import { HomePageSkeleton } from '@/screens/home/HomePageSkeleton'
import { cargarDatosHome } from '@/server/datos-publicos'

export const metadata: Metadata = {
  title: 'Lebaux Aberturas',
  description:
    'Fábrica de aberturas de aluminio a medida en Tucumán. Líneas Herrero, Módena y A30.',
}

async function HomePageData() {
  return <HomePage datos={await cargarDatosHome()} />
}

export default function Page() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePageData />
    </Suspense>
  )
}
