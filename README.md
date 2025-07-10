# Matías Villarruel - Consultoría Digital y Tecnológica

Página web profesional y moderna para Matías Villarruel, consultor especializado en servicios digitales y tecnológicos para empresas y estudios de arquitectura y construcción en Mendoza, Argentina.

## 🚀 Características

### Diseño y UX
- **Diseño Responsive**: Mobile-first design con breakpoints optimizados
- **Interfaz Moderna**: Gradientes, sombras y animaciones suaves
- **Accesibilidad**: Cumple con estándares WCAG 2.1
- **Performance**: Carga rápida y optimizada para SEO

### Funcionalidades
- **Navegación Suave**: Scroll suave entre secciones
- **Filtros de Proyectos**: Categorización por tipo de servicio
- **Modal de Proyectos**: Vista detallada de casos de éxito
- **Formulario de Contacto**: Validación en tiempo real
- **WhatsApp Flotante**: Contacto directo
- **Animaciones**: Efectos al hacer scroll
- **Menú Hamburger**: Navegación móvil optimizada

### Tecnologías
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño moderno con Grid y Flexbox
- **JavaScript Vanilla**: Interactividad sin dependencias
- **Font Awesome**: Iconografía profesional
- **Google Fonts**: Tipografía optimizada

## 📁 Estructura del Proyecto

```
matias-villarruel-website/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Funcionalidad JavaScript
├── README.md           # Documentación
└── favicon.ico         # Icono del sitio (opcional)
```

## 🛠️ Instalación

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, para desarrollo)

### Instalación Local

1. **Clonar o descargar el proyecto**
   ```bash
   git clone https://github.com/tu-usuario/matias-villarruel-website.git
   cd matias-villarruel-website
   ```

2. **Abrir en el navegador**
   - Doble clic en `index.html`
   - O usar un servidor local:
   ```bash
   # Con Python 3
   python -m http.server 8000
   
   # Con Node.js (si tienes http-server instalado)
   npx http-server
   
   # Con PHP
   php -S localhost:8000
   ```

3. **Acceder al sitio**
   - Abrir `http://localhost:8000` en el navegador

### Despliegue en Producción

#### Opción 1: Hosting Estático
- **Netlify**: Arrastra la carpeta del proyecto a Netlify
- **Vercel**: Conecta tu repositorio de GitHub
- **GitHub Pages**: Activa GitHub Pages en tu repositorio

#### Opción 2: Servidor Web
- Sube los archivos a tu servidor web
- Configura el servidor para servir archivos estáticos
- Asegúrate de que `index.html` sea el archivo por defecto

## 🎨 Personalización

### Colores
Los colores se definen en variables CSS en `styles.css`:

```css
:root {
    --primary-color: #2563eb;      /* Azul principal */
    --secondary-color: #64748b;    /* Gris secundario */
    --accent-color: #3b82f6;       /* Azul acento */
    /* ... más colores */
}
```

### Contenido
- **Información Personal**: Edita `index.html` para actualizar datos personales
- **Proyectos**: Modifica el objeto `projectData` en `script.js`
- **Servicios**: Actualiza las cards de servicios en `index.html`

### Imágenes
- Reemplaza las URLs de Unsplash con tus propias imágenes
- Optimiza las imágenes para web (formato WebP recomendado)
- Mantén proporciones consistentes

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1199px
- **Large Desktop**: 1200px+

### Características Móviles
- Menú hamburger con animación
- Navegación táctil optimizada
- Botones de tamaño adecuado
- Texto legible en pantallas pequeñas

## 🔧 Configuración Avanzada

### SEO
El sitio incluye:
- Meta tags completos
- Open Graph tags
- Schema markup
- URLs amigables
- Sitemap (generar automáticamente)

### Analytics
Para agregar Google Analytics:

1. Obtén tu ID de seguimiento
2. Agrega el código en `<head>` de `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Formulario de Contacto
El formulario actual simula el envío. Para funcionalidad real:

1. **Backend propio**: Implementa un endpoint para procesar el formulario
2. **Servicios externos**:
   - Formspree
   - Netlify Forms
   - EmailJS

Ejemplo con Formspree:
```html
<form action="https://formspree.io/f/tu-id" method="POST">
```

## 🚀 Optimización de Performance

### Imágenes
- Usa formatos modernos (WebP, AVIF)
- Implementa lazy loading
- Optimiza tamaños para diferentes dispositivos

### CSS/JS
- Minifica archivos en producción
- Usa compresión gzip
- Implementa cache headers

### Hosting
- Usa CDN para recursos estáticos
- Configura cache del navegador
- Optimiza TTFB (Time to First Byte)

## 🔒 Seguridad

### Recomendaciones
- Usa HTTPS en producción
- Implementa CSP (Content Security Policy)
- Valida inputs del formulario
- Mantén dependencias actualizadas

### CSP Header
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com;
```

## 📊 Monitoreo y Analytics

### Métricas a Seguir
- **Core Web Vitals**: LCP, FID, CLS
- **Tiempo de carga**: < 3 segundos
- **Tasa de rebote**: < 50%
- **Conversiones**: Formularios enviados

### Herramientas Recomendadas
- Google PageSpeed Insights
- Google Search Console
- Google Analytics 4
- Hotjar (análisis de comportamiento)

## 🐛 Solución de Problemas

### Problemas Comunes

**1. Imágenes no cargan**
- Verifica URLs de imágenes
- Asegúrate de que las URLs sean públicas
- Revisa la consola del navegador

**2. Formulario no funciona**
- Verifica conexión a internet
- Revisa configuración del backend
- Comprueba validación JavaScript

**3. Animaciones no funcionan**
- Verifica que JavaScript esté habilitado
- Revisa la consola para errores
- Asegúrate de que CSS esté cargado

**4. Problemas de responsive**
- Verifica viewport meta tag
- Revisa media queries
- Prueba en diferentes dispositivos

### Debug
1. Abre las herramientas de desarrollador (F12)
2. Revisa la consola para errores
3. Verifica la pestaña Network para recursos
4. Usa la pestaña Elements para inspeccionar CSS

## 📈 Mejoras Futuras

### Funcionalidades Sugeridas
- [ ] Blog integrado
- [ ] Sistema de testimonios dinámico
- [ ] Chat en vivo
- [ ] Calendario de citas
- [ ] Portfolio con filtros avanzados
- [ ] Integración con CRM
- [ ] Sistema de newsletter
- [ ] Página de servicios detallada

### Optimizaciones Técnicas
- [ ] Service Worker para offline
- [ ] PWA (Progressive Web App)
- [ ] Lazy loading avanzado
- [ ] Preload de recursos críticos
- [ ] Optimización de fuentes
- [ ] Compresión de imágenes automática

## 📞 Soporte

Para soporte técnico o consultas:
- **Email**: contacto@matiasvillarruel.com
- **WhatsApp**: +54 9 261 XXXXXXX
- **LinkedIn**: [Matías Villarruel](https://linkedin.com/in/matiasvillarruel)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Font Awesome** por los iconos
- **Google Fonts** por las tipografías
- **Unsplash** por las imágenes de muestra
- **Inter** por la fuente principal

---

**Desarrollado con ❤️ para Matías Villarruel**

*Consultoría Digital y Tecnológica en Mendoza, Argentina* 