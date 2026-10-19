# Business-Intelligence
Sitio educativo estático sobre los fundamentos de Business Intelligence, con cuestionario y dashboard demostrativo.

## Ejecutar en Codespaces

Abre `index.html` con la extensión Live Server, o inicia el servidor integrado de Python desde la raíz del proyecto:

```bash
python3 -m http.server 8000
```

Visita `http://localhost:8000`. El dashboard requiere conexión a Internet para cargar Bootstrap y Chart.js desde sus CDN.

## Publicar en GitHub Pages

1. Sube estos archivos a la rama del repositorio que quieras publicar.
2. En GitHub, abre **Settings → Pages**.
3. En **Build and deployment**, elige **Deploy from a branch**, selecciona la rama y la carpeta `/ (root)`, y guarda.
4. Abre la URL que GitHub Pages muestra en esa sección. La portada del sitio es `index.html`.

Los resultados del dashboard son ilustrativos y no son datos oficiales de la temporada.
