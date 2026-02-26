

## Problema

Tu proyecto es una app React + Vite. GitHub Pages solo sirve archivos estáticos (HTML/CSS/JS ya compilados). Necesitas:

1. Configurar Vite para que genere el build correctamente para GitHub Pages
2. Agregar un GitHub Actions workflow que compile y publique automáticamente
3. Usar `HashRouter` en vez de `BrowserRouter` (GitHub Pages no soporta rutas SPA con historial)

## Plan de implementación

### 1. Cambiar `BrowserRouter` a `HashRouter` en `src/App.tsx`
- Importar `HashRouter` de `react-router-dom` en lugar de `BrowserRouter`
- Reemplazar `<BrowserRouter>` por `<HashRouter>`
- Esto hace que las rutas usen `/#/login`, `/#/dashboard`, etc., que funcionan en GitHub Pages

### 2. Configurar `base` en `vite.config.ts`
- Agregar `base: './'` para que los assets se carguen con rutas relativas
- Sin esto, GitHub Pages no encuentra los JS/CSS generados

### 3. Crear archivo `.github/workflows/deploy.yml`
- Workflow de GitHub Actions que:
  - Instala dependencias (`npm ci`)
  - Ejecuta `npm run build`
  - Publica la carpeta `dist/` en GitHub Pages usando `actions/deploy-pages`
- Se activa automáticamente en cada push a `main`

### 4. Agregar archivo `dist/404.html` via workflow
- Copiar `index.html` a `404.html` en el paso de build para que GitHub Pages redirija correctamente rutas desconocidas al SPA

