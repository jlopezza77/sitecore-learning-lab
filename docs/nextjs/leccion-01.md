# Lección 1: componentes, props y JSX

**Objetivo:** reconstruir la página de Banco Pacífico como piezas de React reutilizables.
**Resultado:** https://proud-mud-0dc4d820f.2.azurestaticapps.net/next/ (solo México, sin interacción todavía).

## Cómo correrlo en tu Mac

```bash
cd /Users/josezamora/cursor/learning/web
npm install        # solo la primera vez
npm run dev
```

Abre http://localhost:3000/next/. Cada vez que guardas un archivo, la página se actualiza sola (*hot reload*).

## Los conceptos, en tu código

### 1. Un componente es una función que devuelve JSX
`web/components/Header.tsx`:

```tsx
export default function Header({ brand }: HeaderProps) {
  return (
    <header>
      <strong>{brand}</strong>
    </header>
  );
}
```

- El nombre empieza con **mayúscula** (`Header`), así React sabe que es un componente y no una etiqueta HTML.
- **JSX** parece HTML, pero es JavaScript. Diferencias clave: `className` en lugar de `class`, y `{ }` para insertar valores (`{brand}`).

### 2. Las props son los parámetros del componente
`web/components/Hero.tsx` recibe `content` y `personalized`:

```tsx
<Hero content={content.hero.default} />                    // banner genérico
<Hero content={content.offers.card} personalized />        // oferta, con borde amarillo
```

Mismo componente, datos distintos, resultado distinto. **Esta es la idea central de React.**

En TypeScript, la `interface HeroProps` describe qué props acepta. Si pasas una prop que no existe, o te falta una obligatoria, el editor lo marca en rojo y la compilación falla.

### 3. Listas con `.map()` y `key`
`web/app/page.tsx` dibuja las 3 tarjetas desde los datos, sin repetir código:

```tsx
{content.products.map((product) => (
  <ProductCard key={product.id} product={product} ... />
))}
```

`key` le dice a React qué elemento es cuál cuando la lista cambia. Debe ser único y estable: el `id` del producto, no la posición.

### 4. Composición: una página es un árbol de componentes

```
HomePage (app/page.tsx)
├── Header
└── main
    ├── Hero
    ├── ProductCard × 3
    └── TrustSection
```

### 5. El contenido viene de afuera
Los componentes **no tienen texto escrito**: todo llega desde `site/content/es-MX.json`, el mismo archivo que usa la versión original. Los componentes ponen la forma; el contenido lo pone el "CMS".

## La relación con Sitecore

En SitecoreAI, una página **es** un árbol de componentes como este. El desarrollador crea `Hero`, `ProductCard`, `TrustSection` en Next.js y los registra en Sitecore. Después, **marketing arma las páginas en el editor visual (Pages)** arrastrando esos componentes y llenando su contenido, sin programar. Las props de tus componentes son los campos que marketing llena en Sitecore.

Por eso, para un Solutions Engineer, entender "componente + props" es entender cómo se divide el trabajo entre desarrolladores y marketing en un proyecto Sitecore.

## Comparación con la versión original

| | Versión original (`site/app.js`) | Versión React (`web/`) |
|---|---|---|
| Cómo se arma el HTML | Strings de texto con `innerHTML` | Componentes con JSX |
| Reutilizar la tarjeta | Copiar el template | `<ProductCard />` con otras props |
| Errores de datos | Se ven en el navegador, si alguien los nota | TypeScript los detecta al compilar |

## Ejercicio

1. **Crea un componente `Footer`** en `web/components/Footer.tsx` que reciba `brand` y `country` y muestre: `© 2026 Banco Pacífico Digital · México`. Úsalo al final de `app/page.tsx`.
2. **Agrega una prop opcional `badge?: string` a `ProductCard`.** Si viene, muestra una etiqueta arriba del nombre (por ejemplo, "Más popular"). Pásala solo a la tarjeta de crédito.
   Pista: `{badge && <span>{badge}</span>}` muestra algo solo si `badge` existe.

Cuando termines, dímelo y reviso tu código.

## Preguntas para comprobar que lo entendiste
- ¿Por qué `ProductCard` no tiene el texto "Tarjeta de crédito" escrito adentro?
- ¿Qué pasa si quitas `key` del `.map()`? (Pruébalo y mira la consola del navegador.)
- ¿Qué parte de este código haría marketing en Sitecore, y qué parte el desarrollador?

**Siguiente lección:** estado y eventos (`useState`): la ventana de detalle, el formulario y el selector de país.
