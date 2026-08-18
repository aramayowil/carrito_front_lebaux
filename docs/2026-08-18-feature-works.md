# Organización del feature Obras

Fecha: 2026-08-18

## Decisión

Las tarjetas y la galería pública dejan de vivir en `features/site-content` y
pasan a `features/works`. Obras ya no es sólo un fragmento de contenido de la
Home: cuenta con listado, categorías, fichas individuales, galería y navegación
propias, por lo que corresponde representarla como capacidad de negocio.

La estructura inicial queda así:

```text
src/features/works/
├── components/
│   ├── WorkCard.tsx
│   └── WorksGallery.tsx
└── types/
    └── index.ts
```

`WorkCard` conserva un contrato mínimo compatible con la entidad global `Obra`.
`WorksGallery` utiliza tipos propios del feature para categorías y resúmenes
navegables, evitando importar `ObraMock` desde `data/mock`. Los datos mock
actuales satisfacen estos contratos por tipado estructural; una fuente remota
podrá reemplazarlos sin reescribir los componentes.

Los componentes que sólo componen una pantalla puntual, como el lightbox de la
ficha, permanecen bajo `screens/works/components` hasta que aparezca una segunda
reutilización real.
