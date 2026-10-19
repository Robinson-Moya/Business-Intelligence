(() => {
  "use strict";

  const preguntas = [
    { pregunta: "¿Cuál es el propósito principal de Business Intelligence?", opciones: ["Almacenar todos los archivos de una organización", "Convertir datos en evidencia útil para decidir", "Automatizar cada decisión sin intervención humana", "Diseñar campañas publicitarias"], correcta: "Convertir datos en evidencia útil para decidir", explicacion: "BI organiza y analiza datos para que las personas puedan tomar decisiones mejor informadas.", tema: "Fundamentos" },
    { pregunta: "Una dirección define la expansión de la empresa para los próximos cinco años. ¿Qué nivel de decisión es?", opciones: ["Operativo", "Táctico", "Estratégico", "Transaccional"], correcta: "Estratégico", explicacion: "Las decisiones estratégicas establecen el rumbo de largo plazo de la organización.", tema: "Decisiones" },
    { pregunta: "En el modelo DIKW, ¿qué describe mejor la información?", opciones: ["Datos organizados que adquieren contexto", "Una acción ya ejecutada", "Una colección de datos sin procesar", "La intuición de una persona experta"], correcta: "Datos organizados que adquieren contexto", explicacion: "La información aparece cuando los datos se ordenan y se interpretan dentro de un contexto.", tema: "Decisiones" },
    { pregunta: "¿Qué actividad corresponde a la fase Extract de ETL?", opciones: ["Eliminar duplicados de clientes", "Leer ventas desde el sistema de caja", "Crear un gráfico de tendencias", "Guardar una tabla en el Data Warehouse"], correcta: "Leer ventas desde el sistema de caja", explicacion: "Extraer significa obtener datos desde sus fuentes, como un sistema de caja o una hoja de cálculo.", tema: "ETL" },
    { pregunta: "Una fecha llega como 04/05/26 en unos archivos y como 2026-05-04 en otros. ¿Qué acción ETL ayuda más?", opciones: ["Duplicar los registros", "Estandarizar el formato de fecha", "Eliminar la columna", "Cambiar el nombre del archivo"], correcta: "Estandarizar el formato de fecha", explicacion: "Un formato común evita interpretaciones distintas y permite comparar fechas de forma confiable.", tema: "ETL" },
    { pregunta: "¿Para qué se utiliza principalmente un Data Warehouse?", opciones: ["Para reemplazar los sistemas de operación", "Para guardar datos integrados orientados al análisis", "Para diseñar páginas web", "Para enviar mensajes a clientes"], correcta: "Para guardar datos integrados orientados al análisis", explicacion: "El Data Warehouse consolida datos preparados para consultas, indicadores e informes.", tema: "ETL" },
    { pregunta: "Una tienda estudia ventas e inventario por hora para reducir quiebres de stock. ¿Qué decisión es coherente?", opciones: ["Ajustar los puntos de reposición según la demanda", "Dejar de registrar inventario", "Comprar la misma cantidad cada mes", "Eliminar las ventas de días atípicos"], correcta: "Ajustar los puntos de reposición según la demanda", explicacion: "Al cruzar ventas e inventario se puede anticipar la demanda y definir reposiciones más adecuadas.", tema: "Retail" },
    { pregunta: "¿Qué paso sigue a analizar los datos en un ciclo de decisión que también mide resultados?", opciones: ["Decidir una acción", "Borrar las fuentes", "Volver a extraer sin una pregunta", "Publicar todos los datos"], correcta: "Decidir una acción", explicacion: "Después del análisis se elige una acción; luego se miden sus resultados para aprender.", tema: "Decisiones" },
    { pregunta: "En un hospital se comparan horas de llegada y atención para estudiar las esperas. ¿Qué se busca?", opciones: ["Cambiar diagnósticos por promedios", "Detectar franjas de alta demanda y organizar turnos", "Publicar datos personales", "Reducir la captura de horarios"], correcta: "Detectar franjas de alta demanda y organizar turnos", explicacion: "Los tiempos anonimizados ayudan a encontrar cuellos de botella y adaptar la cobertura.", tema: "Salud" },
    { pregunta: "¿Cuál es un riesgo de eliminar duplicados sin documentar la regla aplicada?", opciones: ["Se pierde trazabilidad y podrían borrarse registros válidos", "El análisis será siempre más exacto", "El Data Warehouse se vuelve automático", "Los datos quedan anonimizados"], correcta: "Se pierde trazabilidad y podrían borrarse registros válidos", explicacion: "La deduplicación necesita criterios explícitos y verificables para no descartar información legítima.", tema: "ETL" },
    { pregunta: "Un indicador muestra correlación entre dos variables. ¿Qué conclusión es prudente?", opciones: ["Una variable necesariamente causa la otra", "Existe una relación que requiere más análisis para explicar causas", "Los datos no sirven", "La decisión debe automatizarse"], correcta: "Existe una relación que requiere más análisis para explicar causas", explicacion: "La correlación señala asociación, pero por sí sola no demuestra causalidad.", tema: "Análisis" },
    { pregunta: "¿Qué decisión sería más útil para un equipo que tiene posesión pero crea pocas ocasiones?", opciones: ["Revisar tiros y progresión para orientar el entrenamiento", "Medir solo los colores de la equipación", "Ignorar el contexto de cada partido", "Comparar únicamente el presupuesto"], correcta: "Revisar tiros y progresión para orientar el entrenamiento", explicacion: "Las métricas de tiros y progresión ayudan a identificar dónde se corta la creación de ocasiones.", tema: "Deporte" },
    { pregunta: "¿Qué diferencia una decisión táctica de una operativa?", opciones: ["La táctica distribuye recursos por área; la operativa resuelve tareas cotidianas", "La táctica siempre usa datos y la operativa nunca", "La operativa define el rumbo a cinco años", "No existe diferencia"], correcta: "La táctica distribuye recursos por área; la operativa resuelve tareas cotidianas", explicacion: "La táctica traduce objetivos en planes de área; la operativa ejecuta acciones concretas del día a día.", tema: "Decisiones" },
    { pregunta: "¿Qué práctica mejora la confianza en una carga ETL?", opciones: ["Validar tipos, rangos y duplicados después de cargar", "Sobrescribir datos sin conservar registros del proceso", "Usar nombres distintos para la misma métrica", "Evitar registrar el origen"], correcta: "Validar tipos, rangos y duplicados después de cargar", explicacion: "Las verificaciones posteriores a la carga detectan fallos antes de que afecten los informes.", tema: "ETL" }
  ];

  const duracionPregunta = 20;
  const cantidadPreguntas = 10;
  const maxVidas = 3;
  const elementos = {
    start: document.getElementById("quizStart"),
    game: document.getElementById("quizGame"),
    result: document.getElementById("quizResult"),
    startButton: document.getElementById("startQuizButton"),
    retryButton: document.getElementById("retryQuizButton"),
    question: document.getElementById("questionText"),
    topic: document.getElementById("questionTopic"),
    counter: document.getElementById("questionCounter"),
    options: document.getElementById("answerOptions"),
    feedback: document.getElementById("quizFeedback"),
    nextButton: document.getElementById("nextQuestionButton"),
    progress: document.getElementById("quizProgress"),
    progressTrack: document.querySelector(".quiz-progress"),
    timer: document.getElementById("timerBar"),
    timerLabel: document.getElementById("timerLabel"),
    timerTrack: document.querySelector(".timer-track"),
    lives: document.getElementById("livesDisplay"),
    combo: document.getElementById("comboDisplay"),
    score: document.getElementById("scoreDisplay"),
    best: document.getElementById("bestScoreDisplay"),
    sound: document.getElementById("soundToggle"),
    finalScore: document.getElementById("finalScore"),
    finalCorrect: document.getElementById("finalCorrect"),
    finalStreak: document.getElementById("finalStreak"),
    rank: document.getElementById("resultRank"),
    message: document.getElementById("resultMessage")
  };

  let ronda = [];
  let indice = 0;
  let puntaje = 0;
  let aciertos = 0;
  let vidas = maxVidas;
  let racha = 0;
  let mejorRacha = 0;
  let tiempo = duracionPregunta;
  let temporizador = null;
  let respuestaBloqueada = false;
  let sonidoActivo = false;
  let contextoAudio = null;

  function mezclar(lista) {
    const resultado = [...lista];
    for (let indiceActual = resultado.length - 1; indiceActual > 0; indiceActual -= 1) {
      const indiceAleatorio = Math.floor(Math.random() * (indiceActual + 1));
      [resultado[indiceActual], resultado[indiceAleatorio]] = [resultado[indiceAleatorio], resultado[indiceActual]];
    }
    return resultado;
  }

  function mejorPuntajeGuardado() {
    try { return Number(localStorage.getItem("biQuizBestScore")) || 0; } catch { return 0; }
  }

  function actualizarMejorPuntaje(valor) {
    try { localStorage.setItem("biQuizBestScore", String(valor)); } catch { /* El juego sigue disponible sin almacenamiento local. */ }
  }

  function reproducirTono(correcto) {
    if (!sonidoActivo) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      contextoAudio ??= new AudioContext();
      const oscilador = contextoAudio.createOscillator();
      const volumen = contextoAudio.createGain();
      oscilador.type = "sine";
      oscilador.frequency.value = correcto ? 660 : 220;
      volumen.gain.setValueAtTime(.06, contextoAudio.currentTime);
      volumen.gain.exponentialRampToValueAtTime(.001, contextoAudio.currentTime + .16);
      oscilador.connect(volumen);
      volumen.connect(contextoAudio.destination);
      oscilador.start();
      oscilador.stop(contextoAudio.currentTime + .16);
    } catch { /* El audio es opcional y no afecta el cuestionario. */ }
  }

  function actualizarVidas() {
    [...elementos.lives.children].forEach((corazon, indiceCorazon) => {
      corazon.classList.toggle("lost", indiceCorazon >= vidas);
    });
    elementos.lives.setAttribute("aria-label", `${vidas} ${vidas === 1 ? "vida" : "vidas"} restantes`);
  }

  function actualizarRacha() {
    const multiplicador = Math.min(1 + Math.floor(racha / 3), 4);
    elementos.combo.textContent = `Racha ×${multiplicador}${racha ? ` · ${racha}` : ""}`;
  }

  function dibujarPregunta() {
    if (indice >= ronda.length || vidas <= 0) {
      finalizarRonda();
      return;
    }
    respuestaBloqueada = false;
    tiempo = duracionPregunta;
    elementos.game.classList.remove("answer-correct", "answer-wrong");
    elementos.nextButton.classList.add("d-none");
    elementos.feedback.textContent = "";
    elementos.feedback.className = "quiz-feedback";
    elementos.counter.textContent = `Pregunta ${indice + 1} de ${ronda.length}`;
    elementos.topic.textContent = ronda[indice].tema;
    elementos.question.textContent = ronda[indice].pregunta;
    elementos.progress.style.width = `${(indice / ronda.length) * 100}%`;
    elementos.progressTrack.setAttribute("aria-valuenow", String(indice));
    elementos.options.replaceChildren();

    mezclar(ronda[indice].opciones).forEach((opcion, numero) => {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "quiz-option";
      boton.textContent = `${String.fromCharCode(65 + numero)}. ${opcion}`;
      boton.dataset.answer = opcion;
      boton.addEventListener("click", () => responder(opcion));
      elementos.options.append(boton);
    });
    actualizarTemporizadorVisual();
    elementos.question.focus({ preventScroll: true });
    iniciarTemporizador();
  }

  function actualizarTemporizadorVisual() {
    elementos.timer.style.width = `${(tiempo / duracionPregunta) * 100}%`;
    elementos.timer.classList.toggle("timer-danger", tiempo <= 5);
    elementos.timerLabel.textContent = `${tiempo} s`;
    elementos.timerTrack.setAttribute("aria-valuenow", String(tiempo));
  }

  function iniciarTemporizador() {
    clearInterval(temporizador);
    temporizador = window.setInterval(() => {
      tiempo -= 1;
      actualizarTemporizadorVisual();
      if (tiempo <= 0) responder(null);
    }, 1000);
  }

  function responder(opcionElegida) {
    if (respuestaBloqueada) return;
    respuestaBloqueada = true;
    clearInterval(temporizador);
    const preguntaActual = ronda[indice];
    const correcta = opcionElegida === preguntaActual.correcta;
    const botones = [...elementos.options.querySelectorAll(".quiz-option")];
    botones.forEach((boton) => {
      boton.disabled = true;
      if (boton.dataset.answer === preguntaActual.correcta) boton.classList.add("correct");
      if (boton.dataset.answer === opcionElegida && !correcta) boton.classList.add("incorrect");
    });

    if (correcta) {
      racha += 1;
      aciertos += 1;
      mejorRacha = Math.max(mejorRacha, racha);
      const multiplicador = Math.min(1 + Math.floor((racha - 1) / 3), 4);
      puntaje += (100 + tiempo * 5) * multiplicador;
      elementos.feedback.textContent = `¡Correcto! ${preguntaActual.explicacion}`;
      elementos.feedback.classList.add("feedback-correct");
      elementos.game.classList.add("answer-correct");
    } else {
      vidas -= 1;
      racha = 0;
      elementos.feedback.textContent = `${opcionElegida === null ? "Se acabó el tiempo. " : "No es correcto. "}${preguntaActual.explicacion}`;
      elementos.feedback.classList.add("feedback-wrong");
      elementos.game.classList.add("answer-wrong");
    }
    elementos.score.textContent = String(puntaje);
    actualizarVidas();
    actualizarRacha();
    elementos.progress.style.width = `${((indice + 1) / ronda.length) * 100}%`;
    elementos.progressTrack.setAttribute("aria-valuenow", String(indice + 1));
    reproducirTono(correcta);
    elementos.nextButton.textContent = vidas <= 0 || indice === ronda.length - 1 ? "Ver resultado" : "Continuar →";
    elementos.nextButton.classList.remove("d-none");
    elementos.nextButton.focus({ preventScroll: true });
  }

  function finalizarRonda() {
    clearInterval(temporizador);
    elementos.game.classList.add("d-none");
    elementos.result.classList.remove("d-none");
    elementos.finalScore.textContent = String(puntaje);
    elementos.finalCorrect.textContent = `${aciertos}/${ronda.length}`;
    elementos.finalStreak.textContent = String(mejorRacha);
    const puntajeAnterior = mejorPuntajeGuardado();
    const nuevoMejor = Math.max(puntajeAnterior, puntaje);
    actualizarMejorPuntaje(nuevoMejor);
    elementos.best.textContent = String(nuevoMejor);
    const rango = puntaje >= 1000 ? ["Experto BI", "Lees patrones con rapidez y conviertes evidencia en acción."] : puntaje >= 500 ? ["Analista", "Vas construyendo una mirada analítica sólida."] : ["Aprendiz BI", "Cada ronda es una nueva oportunidad para afinar tu criterio."];
    elementos.rank.textContent = rango[0];
    elementos.message.textContent = puntaje > puntajeAnterior ? `${rango[1]} Nuevo mejor puntaje.` : rango[1];
    elementos.result.focus({ preventScroll: true });
  }

  function iniciarRonda() {
    ronda = mezclar(preguntas).slice(0, cantidadPreguntas);
    indice = 0;
    puntaje = 0;
    aciertos = 0;
    vidas = maxVidas;
    racha = 0;
    mejorRacha = 0;
    elementos.score.textContent = "0";
    elementos.best.textContent = String(mejorPuntajeGuardado());
    elementos.start.classList.add("d-none");
    elementos.result.classList.add("d-none");
    elementos.game.classList.remove("d-none");
    actualizarVidas();
    actualizarRacha();
    dibujarPregunta();
  }

  elementos.startButton.addEventListener("click", iniciarRonda);
  elementos.retryButton.addEventListener("click", iniciarRonda);
  elementos.nextButton.addEventListener("click", () => {
    indice += 1;
    dibujarPregunta();
  });
  elementos.sound.addEventListener("click", () => {
    sonidoActivo = !sonidoActivo;
    elementos.sound.setAttribute("aria-pressed", String(sonidoActivo));
    elementos.sound.setAttribute("aria-label", sonidoActivo ? "Desactivar sonidos" : "Activar sonidos");
    elementos.sound.innerHTML = `<i class="bi ${sonidoActivo ? "bi-volume-up" : "bi-volume-mute"}" aria-hidden="true"></i>`;
    if (sonidoActivo) reproducirTono(true);
  });
  elementos.best.textContent = String(mejorPuntajeGuardado());
  document.getElementById("currentYear").textContent = String(new Date().getFullYear());
})();