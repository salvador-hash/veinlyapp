

## Problema

Tu sitio está en `https://salvador-hash.github.io/veinlyapp/` pero la página sale en blanco. El problema es que `base: './'` no funciona correctamente cuando el sitio está en un subdirectorio (`/veinlyapp/`). Vite necesita saber la ruta exacta del subdirectorio para cargar los archivos JS/CSS.

## Solución

### 1. Cambiar `base` en `vite.config.ts`
- Cambiar `base: './'` → `base: '/veinlyapp/'`
- Esto le dice a Vite que todos los assets están bajo `/veinlyapp/` en GitHub Pages

Eso es todo. Con ese cambio, al hacer push, GitHub Actions reconstruirá el sitio y funcionará correctamente.

