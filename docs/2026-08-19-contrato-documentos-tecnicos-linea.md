# Contrato dual de documentos técnicos

Fecha: 2026-08-19.

La tienda consume por cada línea dos documentos independientes administrados en
Supabase: catálogo de productos y especificaciones técnicas. Cada documento
expone URL, versión y fecha de actualización.

`cargarLineas` normaliza las seis propiedades a cadenas. Esto permite desplegar
la tienda antes de finalizar el backfill remoto y evita que payloads anteriores
entreguen valores `undefined` a la Home o a la biblioteca documental.

La biblioteca `Catálogos y especificaciones` crea una colección para cada
pestaña y sólo muestra líneas con una URL HTTPS válida. La Home se mantiene
visible cuando existe al menos uno de los dos documentos.
