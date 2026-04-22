# Gestor de Presupuesto Personal

Una aplicación web completa para la gestión de finanzas personales, desarrollada con HTML5, CSS3 y JavaScript vanilla, se comunica mediante una API rest desarrollada en Django rest framework. La aplicación permite llevar un control detallado de ingresos, gastos, presupuestos mensuales e inversiones.

## 🚀 Características Principales

### Dashboard Financiero
- **Resumen Visual**: Tarjetas con ingresos, gastos, presupuesto y balance actual
- **Gráficos Interactivos**: 
  - Gráfico de dona para distribución de gastos por categoría
  - Gráfico de líneas para tendencia mensual de ingresos vs gastos
- **Actualización en Tiempo Real**: Datos actualizados automáticamente

### Gestión de Ingresos
- **Registro Completo**: Fecha, monto, categoría, fuente y estado
- **Categorías Predefinidas**: Salario, Freelance, Inversiones, Regalos, Otros
- **Estados**: Pendiente, Recibido, Cancelado
- **Tabla de Visualización**: Lista completa con opciones de eliminación

### Gestión de Gastos
- **Control Detallado**: Fecha, monto, categoría, descripción, método de pago
- **Categorías**: Alimentación, Vivienda, Transporte, Servicios, Salud, Entretenimiento, Compras, Otros
- **Métodos de Pago**: Efectivo, Tarjeta, Transferencia, Otro
- **Estados**: Pendiente, Pagado, Cancelado

### Presupuestos Mensuales
- **Planificación**: Creación de presupuestos por mes y año
- **Control de Uso**: Visualización del porcentaje de uso del presupuesto
- **Análisis de Diferencias**: Comparación entre presupuesto y gastos reales
- **Alertas Visuales**: Indicadores de color para uso del presupuesto

### Gestión de Inversiones
- **Fondos de Inversión**: Registro de fondos con nombre, tipo y descripción
- **Tipos de Fondos**: Acciones, Bonos, Mixto, Indexado, Otro
- **Base para Transacciones**: Estructura preparada para futuras operaciones de compra/venta

## 📊 Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño moderno con CSS Grid y Flexbox
- **JavaScript ES6+**: Programación orientada a objetos
- **Bootstrap 5**: Framework CSS para diseño responsivo
- **Font Awesome**: Iconos vectoriales
- **Google Fonts**: Tipografía Inter para mejor legibilidad

### Gráficos y Visualización
- **Chart.js**: Gráficos interactivos y responsivos
- **SweetAlert2**: Notificaciones y diálogos elegantes

### Almacenamiento de Datos
- **RESTful Table API**: API interna para persistencia de datos
- **Tablas de Datos**: Estructura normalizada basada en el esquema PostgreSQL original

## 🗂️ Estructura de Datos

### Tablas Principales

1. **categoria_ingreso**: Categorías de ingresos
2. **categoria_egreso**: Categorías de gastos
3. **fondo_inversion**: Fondos de inversión disponibles
4. **presupuesto_mensual**: Presupuestos mensuales
5. **ingreso**: Registros de ingresos
6. **egreso**: Registros de gastos
7. **transaccion_fondo**: Transacciones de fondos (estructura preparada)

## 🎯 Funcionalidades Detalladas

### Navegación por Secciones
- Navegación intuitiva con menú superior
- Transiciones suaves entre secciones
- Indicadores visuales de sección activa

### Formularios Inteligentes
- Validación de campos requeridos
- Fechas predeterminadas al día actual
- Selectores dinámicos con categorías cargadas
- Mensajes de error y confirmación amigables

### Tablas de Datos
- Diseño responsivo para móviles
- Ordenamiento implícito por fecha
- Botones de acción para eliminar registros
- Confirmación antes de eliminación

### Dashboard Interactivo
- Tarjetas de resumen con colores diferenciados
- Gráficos actualizados automáticamente
- Diseño adaptable a diferentes tamaños de pantalla

## 🔧 Instalación y Uso

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet para CDN de librerías

### Instalación
1. Clonar o descargar todos los archivos del proyecto
2. Abrir `index.html` en un navegador web
3. La aplicación está lista para usar

### Uso Básico
1. **Configurar Categorías**: Las categorías vienen pre-cargadas
2. **Registrar Ingresos**: Usar la sección de ingresos
3. **Registrar Gastos**: Usar la sección de gastos
4. **Establecer Presupuestos**: Crear presupuestos mensuales
5. **Monitorear**: Usar el dashboard para ver el estado financiero

## 📱 Diseño Responsivo

### Desktop
- Layout de dos columnas para formularios y tablas
- Gráficos grandes y detallados
- Espaciado generoso para mejor legibilidad

### Tablet
- Ajuste automático a una columna cuando es necesario
- Tamaños de fuente optimizados
- Manteniendo funcionalidad completa

### Móvil
- Diseño de una sola columna
- Botones grandes para fácil interacción táctil
- Tablas desplazables horizontalmente
- Menú de navegación colapsable

## 🎨 Personalización

### Colores
- Variables CSS personalizables en `:root`
- Esquema de colores basado en Bootstrap
- Colores diferenciados para ingresos (verde) y gastos (rojo)

### Tipografía
- Fuente Inter de Google Fonts
- Tamaños de fuente responsivos
- Jerarquía visual clara

### Temas
- Diseño preparado para modo oscuro (futura implementación)
- Variables CSS para fácil cambio de tema

## 🔄 API y Almacenamiento

### Endpoints Utilizados
- `GET tables/{tabla}`: Listar registros
- `POST tables/{tabla}`: Crear nuevo registro
- `PUT tables/{tabla}/{id}`: Actualizar registro
- `DELETE tables/{tabla}/{id}`: Eliminar registro

### Persistencia de Datos
- Todos los datos se almacenan localmente en el navegador
- No requiere servidor externo
- Datos persistentes entre sesiones

## 🔒 Seguridad

### Validación de Datos
- Validación de campos en el lado del cliente
- Sanitización de entradas
- Prevención de caracteres especiales problemáticos

### Privacidad
- Todos los datos se almacenan localmente
- Sin envío de información a servidores externos
- Sin requisito de registro o autenticación

## 🐛 Manejo de Errores

### Validaciones
- Campos requeridos marcados y validados
- Tipos de datos correctos (números, fechas)
- Rangos válidos para fechas y montos

### Mensajes de Error
- Notificaciones claras y amigables
- Indicación de campos problemáticos
- Sugerencias para corrección

### Recuperación
- Mantenimiento de datos en caso de error
- Posibilidad de reintentar operaciones
- Conservación de formularios parcialmente completados

## 📈 Rendimiento

### Optimizaciones
- Carga asíncrona de datos
- Actualización diferida de gráficos
- Uso eficiente de memoria

### Escalabilidad
- Diseño preparado para grandes volúmenes de datos
- Paginación implementada en tablas (lista para activar)
- Caché de datos frecuentemente usados

## 🌟 Características Avanzadas

### Inteligencia de Datos
- Cálculo automático de balances
- Análisis de tendencias mensuales
- Indicadores visuales de estado financiero

### Reportes
- Vista de dashboard con métricas clave
- Comparación de ingresos vs gastos
- Seguimiento de uso de presupuestos

### Personalización
- Configuración de categorías
- Preferencias de visualización
- Temas de color personalizables

## 🔮 Futuras Mejoras

### Funcionalidades Planificadas
1. **Exportación de Datos**: Generar reportes en PDF/Excel
2. **Importación**: Carga masiva de datos desde archivos
3. **Recordatorios**: Notificaciones de pagos pendientes
4. **Análisis Predictivo**: Proyecciones basadas en históricos
5. **Meta Financieras**: Establecimiento y seguimiento de objetivos

### Mejoras Técnicas
1. **Modo Oscuro**: Tema oscuro para mejor experiencia nocturna
2. **Offline Completo**: Funcionamiento sin conexión a internet
3. **Multi-idioma**: Soporte para múltiples idiomas
4. **Accesibilidad**: Mejora de compatibilidad con lectores de pantalla

## 📞 Soporte

### Documentación
- Código comentado y documentado
- Guía de usuario integrada
- Ejemplos de uso en cada sección

### Solución de Problemas
- Validación exhaustiva de errores
- Mensajes de error descriptivos
- Sugerencias de solución

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso personal y comercial.

---

**Nota**: Esta aplicación es una implementación frontend completa basada en el esquema PostgreSQL proporcionado. Toda la funcionalidad de backend se ha trasladado al cliente usando la API de tablas disponible, manteniendo la misma estructura de datos y relaciones del esquema original.
