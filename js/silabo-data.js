window.SILABO_GAME_DATA = {
  curso: {
    nombre: "Sistemas de Información para la Inteligencia de Negocios",
    carrera: "Sistemas de Información",
    ciclo: "8.º ciclo",
    universidad: "Universidad Técnica de Cotopaxi",
    inicio: "2026-10-12",
    fin: "2027-02-21",
    creditos: 3,
    horas: { docencia: 48, practicas: 48, autonomas: 48 },
    objetivo: "Analizar los fundamentos, características y modelamiento de la inteligencia de negocios para entender cómo implementarla en una organización."
  },
  unidades: [
    {
      id: 1,
      nombre: "Fundamentos y gestión de BI",
      problema: "La gestión de BI requiere conocer fundamentos, herramientas y componentes.",
      resultado: "Identificar conceptos básicos, herramientas y componentes de BI.",
      metodologia: "Aprendizaje Cooperativo",
      evaluacion: "Ensayos e informes",
      temas: [
        { titulo: "Conceptos básicos", explicacion: "Reconoce las ideas esenciales de inteligencia de negocios y su propósito en una organización." },
        { titulo: "Componentes de BI", explicacion: "Identifica las piezas que permiten integrar, analizar y presentar información." },
        { titulo: "Sistemas de información y valor", explicacion: "Relaciona los sistemas de información con la generación de valor y la ventaja corporativa." },
        { titulo: "Herramientas de BI", explicacion: "Distingue las herramientas que apoyan el análisis y la presentación de información." }
      ],
      preguntas: [
        { pregunta: "¿Qué busca lograr esta unidad?", opciones: ["Identificar conceptos, herramientas y componentes de BI", "Construir un proyecto aplicado", "Organizar un esquema estrella"], correcta: 0, explicacion: "El resultado de la unidad es identificar conceptos básicos, herramientas y componentes de BI." },
        { pregunta: "¿Qué enfoque de aprendizaje propone la unidad?", opciones: ["Aprendizaje Basado en Problemas", "Aprendizaje Cooperativo", "Aprendizaje Basado en Proyectos"], correcta: 1, explicacion: "La metodología indicada es Aprendizaje Cooperativo." },
        { pregunta: "¿Qué evaluación corresponde a la unidad?", opciones: ["Portafolio", "Proyecto", "Ensayos e informes"], correcta: 2, explicacion: "La evaluación de la unidad considera ensayos e informes." },
        { pregunta: "¿Qué relación se estudia entre sistemas de información y organización?", opciones: ["Generación de valor y ventaja corporativa", "Configuración de redes domésticas", "Diseño de sensores"], correcta: 0, explicacion: "El tema aborda la generación de valor y la ventaja corporativa." },
        { pregunta: "¿Cuál de estos temas forma parte de la unidad?", opciones: ["Patrones de visualización", "Principales herramientas de BI", "Monitoreo satelital"], correcta: 1, explicacion: "Las principales herramientas de BI aparecen entre los temas de la unidad." }
      ],
      clasificacion: [
        { texto: "Conceptos básicos", categoria: "conceptos" }, { texto: "Ventaja corporativa", categoria: "conceptos" }, { texto: "Sistemas de información", categoria: "conceptos" },
        { texto: "Data Warehouse", categoria: "componentes" }, { texto: "Procesos ETL", categoria: "componentes" }, { texto: "Dashboards y KPIs", categoria: "componentes" },
        { texto: "Power BI", categoria: "herramientas" }, { texto: "Reporteadores", categoria: "herramientas" }, { texto: "Herramientas de visualización", categoria: "herramientas" }
      ],
      categorias: [{ id: "conceptos", nombre: "Conceptos" }, { id: "componentes", nombre: "Componentes" }, { id: "herramientas", nombre: "Herramientas" }],
      memoria: [
        ["BI", "Analiza información para apoyar decisiones en una organización."],
        ["Data Warehouse", "Almacén de datos utilizado para consultas y análisis."],
        ["ETL", "Extraer, transformar y cargar datos."],
        ["KPI", "Indicador clave que permite seguir un objetivo." ]
      ]
    },
    {
      id: 2,
      nombre: "Sistemas de soporte a la administración y Data Warehouse",
      problema: "Puede ser difícil analizar bases de datos multidimensionales para tomar decisiones.",
      resultado: "Explotar esquemas multidimensionales con herramientas de visualización, análisis y consultas.",
      metodologia: "Aprendizaje Basado en Problemas",
      evaluacion: "Portafolio",
      temas: [
        { titulo: "Variables de medición y análisis", explicacion: "Distingue las variables que se observan y analizan dentro de una consulta." },
        { titulo: "Data Warehouse", explicacion: "Explora el almacén de datos como base para consultas y análisis multidimensional." },
        { titulo: "Gestión del conocimiento", explicacion: "Relaciona los sistemas de gestión del conocimiento con el soporte a la administración." },
        { titulo: "Evaluación y visualización", explicacion: "Practica patrones para evaluar, interpretar y visualizar información." }
      ],
      preguntas: [
        { pregunta: "¿Qué dificultad motiva esta unidad?", opciones: ["Analizar bases multidimensionales para decidir", "Elegir un apodo", "Crear una biblioteca digital"], correcta: 0, explicacion: "El problema planteado es la dificultad de analizar bases multidimensionales para la toma de decisiones." },
        { pregunta: "¿Qué permite hacer el resultado de aprendizaje?", opciones: ["Diseñar una identidad gráfica", "Explotar esquemas multidimensionales", "Programar satélites"], correcta: 1, explicacion: "El resultado propone explotar esquemas con visualización, análisis y consultas." },
        { pregunta: "¿Qué metodología se utiliza?", opciones: ["Aprendizaje Cooperativo", "Aprendizaje Basado en Proyectos", "Aprendizaje Basado en Problemas"], correcta: 2, explicacion: "La metodología es Aprendizaje Basado en Problemas." },
        { pregunta: "¿Cómo se evalúa la unidad?", opciones: ["Con un portafolio", "Con ensayos e informes", "Con un proyecto"], correcta: 0, explicacion: "La evaluación indicada para la unidad es un portafolio." },
        { pregunta: "¿Cuál es un tema de esta unidad?", opciones: ["Herramientas de BI", "Patrones de evaluación, interpretación y visualización", "Alertas tempranas pesqueras"], correcta: 1, explicacion: "Estos patrones forman parte de los temas de la unidad." }
      ],
      esquema: [
        { id: "hechos", nombre: "Tabla de hechos", clase: "hechos" },
        { id: "tiempo", nombre: "Dimensión: tiempo", clase: "dimension" },
        { id: "producto", nombre: "Dimensión: producto", clase: "dimension" },
        { id: "cliente", nombre: "Dimensión: cliente", clase: "dimension" },
        { id: "region", nombre: "Dimensión: región", clase: "dimension" }
      ],
      caso: [
        { pregunta: "Quieres analizar una medida desde distintos periodos. ¿Qué dimensión eliges?", opciones: ["Tiempo", "Cliente", "Región"], correcta: 0 },
        { pregunta: "Quieres comparar el comportamiento entre artículos. ¿Qué dimensión eliges?", opciones: ["Región", "Producto", "Tiempo"], correcta: 1 },
        { pregunta: "¿Qué herramienta ayuda a explorar y consultar el esquema?", opciones: ["Una visualización y consulta multidimensional", "Una lista sin filtros", "Un texto sin datos"], correcta: 0 }
      ]
    },
    {
      id: 3,
      nombre: "Soporte para toma de decisiones empresariales",
      problema: "Evaluar objetivos de negocio exige procesos para organizar grandes cantidades de datos.",
      resultado: "Construir una solución de BI para un caso práctico.",
      metodologia: "Aprendizaje Basado en Proyectos",
      evaluacion: "Proyecto",
      temas: [
        { titulo: "Vistas multidimensionales", explicacion: "Usa hipercubos para observar información desde varias dimensiones." },
        { titulo: "Procesos ETL", explicacion: "Ordena extracción, transformación y carga para preparar los datos." },
        { titulo: "Reporteadores", explicacion: "Reconoce los reporteadores como parte de una solución de inteligencia de negocios." },
        { titulo: "Alertas, dashboards y KPIs", explicacion: "Presenta indicadores y alertas para seguir objetivos de negocio." }
      ],
      preguntas: [
        { pregunta: "¿Qué problema aborda esta unidad?", opciones: ["Organizar grandes cantidades de datos para evaluar objetivos", "Clasificar herramientas por color", "Elegir una metodología cooperativa"], correcta: 0, explicacion: "El problema se centra en organizar grandes volúmenes de datos para evaluar objetivos." },
        { pregunta: "¿Qué resultado se espera?", opciones: ["Redactar un portafolio", "Construir una solución de BI para un caso práctico", "Identificar solo conceptos básicos"], correcta: 1, explicacion: "El resultado indicado es construir una solución de BI aplicada." },
        { pregunta: "¿Qué metodología corresponde?", opciones: ["Aprendizaje Cooperativo", "Aprendizaje Basado en Problemas", "Aprendizaje Basado en Proyectos"], correcta: 2, explicacion: "La unidad propone Aprendizaje Basado en Proyectos." },
        { pregunta: "¿Qué se debe ordenar dentro de ETL?", opciones: ["Extraer, transformar y cargar", "Cargar, decidir y extraer", "Visualizar, medir y copiar"], correcta: 0, explicacion: "ETL sigue las fases Extract, Transform, Load: extraer, transformar y cargar." },
        { pregunta: "¿Qué elementos aparecen junto a los reporteadores?", opciones: ["Insignias y vidas", "Alertas, dashboards y KPIs", "Dimensiones de cliente y región"], correcta: 1, explicacion: "La unidad incluye alertas, dashboards y KPIs." }
      ],
      etl: ["Extraer", "Transformar", "Cargar"],
      graficos: [
        { indicador: "Evolución de un KPI en el tiempo", opciones: ["Líneas", "Dona", "Radar"], correcta: 0 },
        { indicador: "Comparar valores entre categorías", opciones: ["Barras", "Dona", "Radar"], correcta: 0 },
        { indicador: "Mostrar partes de un total", opciones: ["Líneas", "Barras", "Dona"], correcta: 2 }
      ],
      alerta: { indicador: "KPI de ejemplo", valor: 62, umbral: 70, operador: "menor que" }
    }
  ],
  jefe: {
    nombre: "PlasTrack",
    aviso: "Simulación con datos ilustrativos; no representa mediciones satelitales en tiempo real.",
    contexto: "Monitoreo inteligente de microplásticos con datos satelitales Copernicus/CMEMS para conservar ecosistemas insulares, con dashboards, KPIs y alertas tempranas para el sector pesquero y gestores ambientales.",
    decisiones: [
      { tema: "Fuente de datos", pregunta: "¿Qué fuente se indica para el monitoreo?", opciones: ["Copernicus/CMEMS", "Una lista de apodos", "Un reporte sin origen"], correcta: 0, impacto: 20 },
      { tema: "ETL", pregunta: "¿Qué flujo prepara los datos para analizarlos?", opciones: ["Cargar, extraer, duplicar", "Extraer, transformar, cargar", "Visualizar, alertar, borrar"], correcta: 1, impacto: 20 },
      { tema: "KPIs", pregunta: "¿Qué componente permite seguir objetivos del proyecto?", opciones: ["KPIs", "Apodos", "Insignias"], correcta: 0, impacto: 20 },
      { tema: "Visualizaciones", pregunta: "¿Qué se construye para comunicar indicadores?", opciones: ["Dashboards", "Portafolios", "Esquemas de memoria"], correcta: 0, impacto: 20 },
      { tema: "Alertas", pregunta: "¿Qué mecanismo ayuda a avisar sobre cambios relevantes?", opciones: ["Alertas tempranas", "Tarjetas volteables", "Tabla de dimensiones"], correcta: 0, impacto: 20 }
    ]
  },
  habilidades: [
    { id: "digital", nombre: "Competencia digital", icono: "bi-cpu", reto: "El equipo necesita consultar una herramienta documentada para BI.", opciones: ["Revisar la documentación oficial de Power BI", "Ignorar la herramienta", "Adivinar sus funciones"], correcta: 0 },
    { id: "creatividad", nombre: "Creatividad", icono: "bi-lightbulb", reto: "El grupo debe explicar cómo se conectan los componentes de BI.", opciones: ["Proponer una representación visual clara", "Copiar una lista sin organizarla", "Ocultar las relaciones"], correcta: 0 },
    { id: "etica", nombre: "Ética", icono: "bi-shield-check", reto: "Un análisis incluye datos sensibles que no son necesarios para comunicar el resultado.", opciones: ["Protegerlos y compartir solo lo necesario", "Publicarlos completos", "Ignorar su sensibilidad"], correcta: 0 },
    { id: "critico", nombre: "Pensamiento crítico", icono: "bi-search", reto: "Un KPI parece favorable, pero no permite evaluar el objetivo de negocio.", opciones: ["Revisar si el indicador realmente representa el objetivo", "Aceptar el KPI sin cuestionarlo", "Eliminar todos los indicadores"], correcta: 0 },
    { id: "liderazgo", nombre: "Liderazgo", icono: "bi-people", reto: "El proyecto articulador requiere coordinar dashboards, KPIs y alertas.", opciones: ["Organizar tareas y responsabilidades del equipo", "Trabajar sin comunicar cambios", "Evitar acordar prioridades"], correcta: 0 },
    { id: "problemas", nombre: "Resolución de problemas", icono: "bi-puzzle", reto: "Hay grandes cantidades de datos y se necesita construir una solución de BI.", opciones: ["Organizar los datos mediante procesos ETL", "Duplicar registros", "Evitar analizar el caso"], correcta: 0 }
  ],
  evaluaciones: [
    { nombre: "EVAL1", fecha: "2026-11-22" },
    { nombre: "EVAL2", fecha: "2027-01-10" },
    { nombre: "EVAL3", fecha: "2027-02-14" }
  ],
  biblioteca: [
    { titulo: "¿Cómo planificar un proyecto de inteligencia de negocio?", sitio: "eLibro", url: "https://elibro.net/" },
    { titulo: "La toma de decisiones en la práctica", sitio: "eLibro", url: "https://elibro.net/" },
    { titulo: "Excel y Power BI: el cóctel perfecto", sitio: "eLibro", url: "https://elibro.net/" },
    { titulo: "Documentación oficial de Power BI", sitio: "Microsoft Learn", url: "https://learn.microsoft.com/es-es/power-bi/" }
  ]
};