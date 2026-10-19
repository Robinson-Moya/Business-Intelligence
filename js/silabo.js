(() => {
	"use strict";

	const datos = window.SILABO_GAME_DATA;
	const claveGuardado = "misionBiSilaboProgress";
	const rangoXP = [0, 100, 250, 450];
	const rangoNombre = ["Aprendiz", "Analista", "Arquitecto de Datos", "Líder BI"];
	const insigniasPorUnidad = { 1: ["digital", "creatividad"], 2: ["etica", "critico"], 3: ["liderazgo", "problemas"] };
	const elementos = {
		entrada: document.getElementById("playerForm"), apodo: document.getElementById("playerNickname"), inicio: document.getElementById("inicioJuego"),
		mapa: document.getElementById("mapa"), ruta: document.getElementById("levelPath"), panel: document.getElementById("levelPanel"), contenido: document.getElementById("levelContent"),
		vitrina: document.getElementById("badgeSection"), insignias: document.getElementById("badgeGrid"), nombre: document.getElementById("playerNameDisplay"),
		xp: document.getElementById("xpValue"), barraXP: document.getElementById("xpFill"), rango: document.getElementById("playerRank"), racha: document.getElementById("streakValue"),
		sonido: document.getElementById("soundToggle"), aviso: document.getElementById("liveAnnouncement")
	};
	let progreso = leerProgreso();
	let sesion = null;
	let audioContexto = null;
	let sonidoActivo = false;
	let graficoHoras = null;

	function leerProgreso() {
		try {
			const guardado = JSON.parse(localStorage.getItem(claveGuardado));
			if (guardado && typeof guardado === "object") return {
				apodo: String(guardado.apodo || "").slice(0, 20), xp: Math.max(0, Number(guardado.xp) || 0),
				completados: Array.isArray(guardado.completados) ? guardado.completados.filter((id) => [1, 2, 3].includes(id)) : [],
				estrellas: guardado.estrellas && typeof guardado.estrellas === "object" ? guardado.estrellas : {},
				insignias: Array.isArray(guardado.insignias) ? guardado.insignias.filter((id) => datos.habilidades.some((habilidad) => habilidad.id === id)) : [],
				racha: Math.max(0, Number(guardado.racha) || 0), mejorRacha: Math.max(0, Number(guardado.mejorRacha) || 0), jefeCompleto: Boolean(guardado.jefeCompleto), impactoJefe: Math.max(0, Number(guardado.impactoJefe) || 0)
			};
		} catch { /* El juego inicia sin progreso si el almacenamiento está bloqueado. */ }
		return { apodo: "", xp: 0, completados: [], estrellas: {}, insignias: [], racha: 0, mejorRacha: 0, jefeCompleto: false, impactoJefe: 0 };
	}

	function guardarProgreso() {
		try { localStorage.setItem(claveGuardado, JSON.stringify(progreso)); } catch { anunciar("No se pudo guardar el avance en este navegador."); }
		actualizarHUD();
	}

	function anunciar(mensaje) { elementos.aviso.textContent = mensaje; }

	function actualizarHUD() {
		const nivelRango = rangoXP.reduce((indice, umbral, actual) => progreso.xp >= umbral ? actual : indice, 0);
		const siguiente = rangoXP[nivelRango + 1];
		elementos.nombre.textContent = progreso.apodo || "Explorador";
		elementos.xp.textContent = String(progreso.xp);
		elementos.rango.textContent = rangoNombre[nivelRango];
		elementos.racha.textContent = String(progreso.racha);
		const base = rangoXP[nivelRango];
		const porcentaje = siguiente ? Math.min(100, ((progreso.xp - base) / (siguiente - base)) * 100) : 100;
		elementos.barraXP.style.width = `${porcentaje}%`;
		elementos.barraXP.parentElement.setAttribute("aria-valuenow", String(Math.round(porcentaje)));
	}

	function sumarXP(cantidad) {
		progreso.xp += cantidad;
		progreso.racha += 1;
		progreso.mejorRacha = Math.max(progreso.mejorRacha, progreso.racha);
		guardarProgreso();
		sonar(true);
	}

	function respuestaIncorrecta(mensaje = "Inténtalo de nuevo: revisa las pistas del reto.") {
		progreso.racha = 0;
		guardarProgreso();
		sonar(false);
		anunciar(mensaje);
	}

	function sonar(acierto) {
		if (!sonidoActivo) return;
		try {
			const Contexto = window.AudioContext || window.webkitAudioContext;
			if (!Contexto) return;
			audioContexto ??= new Contexto();
			const oscilador = audioContexto.createOscillator();
			const volumen = audioContexto.createGain();
			oscilador.type = "sine";
			oscilador.frequency.value = acierto ? 650 : 190;
			volumen.gain.setValueAtTime(.055, audioContexto.currentTime);
			volumen.gain.exponentialRampToValueAtTime(.001, audioContexto.currentTime + .16);
			oscilador.connect(volumen); volumen.connect(audioContexto.destination);
			oscilador.start(); oscilador.stop(audioContexto.currentTime + .16);
		} catch { /* El sonido es opcional y no bloquea la misión. */ }
	}

	function iniciarGrafico() {
		if (!window.Chart) return;
		const horas = datos.curso.horas;
		graficoHoras = new Chart(document.getElementById("hoursChart"), {
			type: "doughnut",
			data: { labels: ["Docencia", "Prácticas", "Autónomas"], datasets: [{ data: [horas.docencia, horas.practicas, horas.autonomas], backgroundColor: ["#087e83", "#e9b84d", "#d96752"], borderColor: "#fff", borderWidth: 3, hoverOffset: 5 }] },
			options: { responsive: true, maintainAspectRatio: false, cutout: "72%", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (contexto) => ` ${contexto.label}: ${contexto.raw} horas` } } } }
		});
	}

	function pintarCalendario() {
		const hoy = new Date();
		const hoyFecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
		const proxima = datos.evaluaciones.find((evaluacion) => fechaLocal(evaluacion.fecha) >= hoyFecha);
		const linea = document.getElementById("evaluationTrack");
		linea.replaceChildren();
		datos.evaluaciones.forEach((evaluacion) => {
			const fecha = fechaLocal(evaluacion.fecha);
			const item = document.createElement("div");
			item.className = `evaluation-item${fecha < hoyFecha ? " past" : evaluacion.fecha === proxima?.fecha ? " upcoming" : ""}`;
			const dias = Math.ceil((fecha - hoyFecha) / 86400000);
			item.innerHTML = `<span class="eval-name">${evaluacion.nombre}</span><span class="eval-date">${formatearFecha(fecha)}</span><span class="eval-state">${dias < 0 ? "Realizada" : dias === 0 ? "Hoy" : `${dias} días`}</span>`;
			linea.append(item);
		});
		const contador = document.getElementById("countdownText");
		if (!proxima) { contador.textContent = "Todas las evaluaciones del calendario ya pasaron."; return; }
		const dias = Math.ceil((proxima.fecha - hoyFecha) / 86400000);
		contador.textContent = dias === 0 ? `${proxima.nombre}: es hoy` : `${proxima.nombre} en ${dias} ${dias === 1 ? "día" : "días"}`;
	}

	function fechaLocal(fechaISO) { const [anio, mes, dia] = fechaISO.split("-").map(Number); return new Date(anio, mes - 1, dia); }
	function formatearFecha(fecha) { return new Intl.DateTimeFormat("es-EC", { day: "2-digit", month: "2-digit", year: "numeric" }).format(fecha); }

	function pintarBiblioteca() {
		const lista = document.getElementById("libraryList");
		datos.biblioteca.forEach((recurso) => {
			const enlace = document.createElement("a");
			enlace.className = "library-link"; enlace.href = recurso.url; enlace.target = "_blank"; enlace.rel = "noopener";
			enlace.innerHTML = `<i class="bi bi-book" aria-hidden="true"></i><span>${recurso.titulo}<small>${recurso.sitio}</small></span><i class="bi bi-arrow-up-right" aria-hidden="true"></i>`;
			lista.append(enlace);
		});
	}

	function pintarInsignias() {
		const cuadrilla = elementos.insignias;
		cuadrilla.replaceChildren();
		datos.habilidades.forEach((habilidad) => {
			const ganada = progreso.insignias.includes(habilidad.id);
			const tarjeta = document.createElement("div");
			tarjeta.className = `badge-card${ganada ? " earned" : ""}`;
			tarjeta.innerHTML = `<i class="bi ${ganada ? habilidad.icono : "bi-lock-fill"}" aria-hidden="true"></i><strong>${habilidad.nombre}</strong><small>${ganada ? "Insignia obtenida" : "Bloqueada"}</small>`;
			cuadrilla.append(tarjeta);
		});
		document.getElementById("badgeCount").textContent = `${progreso.insignias.length} / ${datos.habilidades.length}`;
	}

	function estrellas(nivel) { const cantidad = Number(progreso.estrellas[nivel]) || 0; return `${"★".repeat(cantidad)}${"☆".repeat(3 - cantidad)}`; }

	function nivelDesbloqueado(id) { return id === 1 || progreso.completados.includes(id - 1); }

	function pintarMapa() {
		const ruta = elementos.ruta;
		ruta.replaceChildren();		
		datos.unidades.forEach((unidad) => {
			const completado = progreso.completados.includes(unidad.id);
			const disponible = nivelDesbloqueado(unidad.id);
			const boton = document.createElement("button");
			boton.type = "button"; boton.className = `level-card ${completado ? "completed" : disponible ? "available" : "locked"}`;
			boton.disabled = !disponible; boton.dataset.openLevel = String(unidad.id);
			boton.innerHTML = `<span class="level-index">0${unidad.id}</span><span><span class="level-name">${unidad.nombre}</span><span class="level-subtitle">${unidad.metodologia}</span></span><span class="level-state">${completado ? "Completado" : disponible ? "Disponible" : "Bloqueado"}<span class="level-stars">${estrellas(unidad.id)}</span></span>`;
			ruta.append(boton);
		});
		const jefe = document.createElement("button");
		const jefeAbierto = datos.unidades.every((unidad) => progreso.completados.includes(unidad.id));
		jefe.type = "button"; jefe.className = `level-card boss-card ${progreso.jefeCompleto ? "completed" : jefeAbierto ? "available" : "locked"}`;
		jefe.disabled = !jefeAbierto; jefe.dataset.openBoss = "true";
		jefe.innerHTML = `<span class="level-index"><i class="bi bi-trophy-fill" aria-hidden="true"></i></span><span><span class="level-name">Jefe: ${datos.jefe.nombre}</span><span class="level-subtitle">Proyecto articulador · simulación</span></span><span class="level-state">${progreso.jefeCompleto ? "Completado" : jefeAbierto ? "Disponible" : "Bloqueado"}<span class="level-stars">${estrellas("jefe")}</span></span>`;
		ruta.append(jefe);
	}

	function abrirMapa() {
		elementos.entrada.closest(".player-entry").classList.add("d-none");
		elementos.mapa.classList.remove("d-none");
		elementos.vitrina.classList.remove("d-none");
		pintarMapa(); pintarInsignias(); actualizarHUD();
	}

	function abrirUnidad(id) {
		const unidad = datos.unidades.find((item) => item.id === id);
		if (!unidad || !nivelDesbloqueado(id)) return;
		sesion = { tipo: "unidad", id, unidad, fase: "intro", vidas: 3, quizIndex: 0, quizAciertos: 0, quizBloqueada: false, micro: {} };
		elementos.panel.classList.remove("d-none");
		elementos.contenido.innerHTML = `<div class="level-topbar"><button class="back-map" type="button" data-action="back-map"><i class="bi bi-arrow-left" aria-hidden="true"></i> Volver al mapa</button><span class="level-number">UNIDAD 0${unidad.id} / 03</span></div><h2 class="level-title" id="levelPanelTitle">${unidad.nombre}</h2><div class="briefing-grid"><div class="briefing-item"><strong>Situación</strong><p>${unidad.problema}</p></div><div class="briefing-item"><strong>Objetivo de ruta</strong><p>${unidad.resultado}</p></div><div class="briefing-item"><strong>Modo de juego · ${unidad.metodologia}</strong><p>Forma de trabajo del sílabo. Evaluación: ${unidad.evaluacion}.</p></div></div><div class="topic-heading"><h3>Explora los temas</h3><span>Toca una tarjeta para voltearla</span></div><div class="topic-grid">${unidad.temas.map((tema, indice) => `<button class="topic-flip" type="button" aria-expanded="false" aria-label="Revelar explicación: ${tema.titulo}" data-flip="${indice}"><span class="flip-inner"><span class="flip-face flip-front"><strong>${tema.titulo}</strong><small>Ver idea clave <i class="bi bi-arrow-repeat" aria-hidden="true"></i></small></span><span class="flip-face flip-back">${tema.explicacion}</span></span></button>`).join("")}</div><div id="playArea"></div>`;
		pintarMinijuego();
		elementos.panel.scrollIntoView({ behavior: "smooth", block: "start" });
	}

	function vidasHTML() { return `<span class="mini-lives" aria-label="${sesion.vidas} vidas">${[0, 1, 2].map((indice) => `<i class="bi ${indice < sesion.vidas ? "bi-heart-fill" : "bi-heart"}" aria-hidden="true"></i>`).join("")}</span>`; }

	function pintarMinijuego() {
		const zona = document.getElementById("playArea");
		if (!zona) return;
		if (sesion.fase === "intro") {
			zona.innerHTML = `<section class="play-panel"><div class="play-panel-header"><div><p class="eyebrow">Minijuego · 3 vidas</p><h3>${tituloMinijuego()}</h3><p>${instruccionMinijuego()}</p></div>${vidasHTML()}</div><div class="game-actions"><button class="game-action" type="button" data-action="start-mini"><i class="bi bi-play-fill" aria-hidden="true"></i> Iniciar reto</button></div></section>`;
			return;
		}
		if (sesion.fase === "mini-failed") {
			zona.innerHTML = `<section class="play-panel"><p class="eyebrow">Reto detenido</p><h3>Se agotaron las vidas</h3><p class="mini-instruction">Reinicia el minijuego y prueba otra estrategia. Tu experiencia ganada se conserva.</p><button class="game-action" type="button" data-action="retry-mini">Reintentar minijuego</button></section>`;
			return;
		}
		if (sesion.fase === "quiz") { pintarPregunta(zona); return; }
		if (sesion.fase === "quiz-failed") { pintarResultadoQuiz(zona, false); return; }
		if (sesion.fase === "passed") { pintarResultadoQuiz(zona, true); return; }
		if (sesion.fase === "mini") pintarRetoActual(zona);
	}

	function tituloMinijuego() {
		return sesion.id === 1 ? "Clasifica y recuerda" : sesion.id === 2 ? "Construye un esquema estrella" : "Ordena ETL y diseña indicadores";
	}

	function instruccionMinijuego() {
		return sesion.id === 1 ? "Arrastra cada elemento a su grupo o selecciónalo y toca una categoría; después juega memoria." : sesion.id === 2 ? "Coloca los hechos y las cuatro dimensiones, y resuelve tres decisiones." : "Ordena ETL, relaciona cada KPI con un gráfico y activa una alerta de umbral.";
	}

	function iniciarMinijuego() {
		sesion.fase = "mini"; sesion.vidas = 3; sesion.micro = {};
		if (sesion.id === 1) sesion.micro = { paso: "clasificar", colocados: {}, seleccionado: null, memoria: prepararMemoria(), reveladas: [], parejas: [] };
		if (sesion.id === 2) sesion.micro = { paso: "esquema", colocados: {}, seleccionado: null, decision: 0 };
		if (sesion.id === 3) sesion.micro = { paso: "orden", orden: [2, 0, 1], decisionGrafico: 0 };
		pintarMinijuego();
	}

	function prepararMemoria() {
		const tarjetas = datos.unidades[0].memoria.flatMap((pareja, indice) => [{ pareja: indice, texto: pareja[0] }, { pareja: indice, texto: pareja[1] }]);
		return mezclar(tarjetas);
	}

	function mezclar(lista) {
		const resultado = [...lista];
		for (let indice = resultado.length - 1; indice > 0; indice -= 1) {
			const alAzar = Math.floor(Math.random() * (indice + 1));
			[resultado[indice], resultado[alAzar]] = [resultado[alAzar], resultado[indice]];
		}
		return resultado;
	}

	function pintarRetoActual(zona) {
		if (sesion.id === 1) pintarClasificacion(zona);
		if (sesion.id === 2) pintarEsquema(zona);
		if (sesion.id === 3) pintarETL(zona);
	}

	function pintarCabeceraReto(nombre, instruccion) {
		return `<div class="play-panel-header"><div><p class="eyebrow">Minijuego · ${nombre}</p><p>${instruccion}</p></div>${vidasHTML()}</div><p class="game-message" id="gameMessage" role="status" aria-live="polite"></p>`;
	}

	function pintarClasificacion(zona) {
		const micro = sesion.micro;
		if (micro.paso === "clasificar") {
			const elementosLibres = datos.unidades[0].clasificacion.filter((item) => !micro.colocados[item.texto]);
			zona.innerHTML = `<section class="play-panel">${pintarCabeceraReto("Clasificación", "Selecciona una ficha y su destino, o usa arrastrar y soltar.")}<div class="item-bank" aria-label="Fichas por clasificar">${elementosLibres.map((item) => `<button class="game-tile" type="button" draggable="true" data-item="${item.texto}" aria-pressed="${micro.seleccionado === item.texto}">${item.texto}</button>`).join("")}</div><div class="category-board">${datos.unidades[0].categorias.map((categoria) => `<button class="drop-target" type="button" data-category="${categoria.id}" aria-label="Colocar en ${categoria.nombre}"><strong>${categoria.nombre}</strong>${Object.entries(micro.colocados).filter(([texto]) => datos.unidades[0].clasificacion.find((item) => item.texto === texto)?.categoria === categoria.id).map(([texto]) => `<span class="placed-tile">${texto}</span>`).join("")}</button>`).join("")}</div><p class="mini-instruction">Clasificadas: ${Object.keys(micro.colocados).length} / ${datos.unidades[0].clasificacion.length}</p></section>`;
			return;
		}
		const tarjetas = micro.memoria;
		zona.innerHTML = `<section class="play-panel">${pintarCabeceraReto("Memoria BI", "Encuentra los pares término–definición. Selecciona dos tarjetas por turno.")}<div class="memory-grid">${tarjetas.map((tarjeta, indice) => { const visible = micro.reveladas.includes(indice) || micro.parejas.includes(tarjeta.pareja); return `<button class="memory-card${micro.parejas.includes(tarjeta.pareja) ? " matched" : ""}" type="button" data-memory="${indice}" aria-label="${visible ? tarjeta.texto : "Revelar tarjeta de memoria"}" ${micro.parejas.includes(tarjeta.pareja) ? "disabled" : ""}>${visible ? tarjeta.texto : "<span class='memory-hidden' aria-hidden='true'>?</span>"}</button>`; }).join("")}</div><p class="mini-instruction">Pares encontrados: ${micro.parejas.length} / 4</p></section>`;
	}

	function pintarEsquema(zona) {
		const micro = sesion.micro;
		if (micro.paso === "esquema") {
			const fichas = datos.unidades[1].esquema.filter((ficha) => !micro.colocados[ficha.id]);
			zona.innerHTML = `<section class="play-panel">${pintarCabeceraReto("Esquema estrella", "Coloca cada ficha en su espacio, por clic o arrastre.")}<div class="schema-pool">${fichas.map((ficha) => `<button class="schema-tile" type="button" draggable="true" data-schema-tile="${ficha.id}" aria-pressed="${micro.seleccionado === ficha.id}">${ficha.nombre}</button>`).join("")}</div><div class="schema-board">${datos.unidades[1].esquema.map((ficha) => `<button class="schema-slot${micro.colocados[ficha.id] ? " filled" : ""}${ficha.clase === "hechos" ? " fact-slot" : ""}" type="button" data-schema-slot="${ficha.id}" aria-label="${ficha.clase === "hechos" ? "Colocar tabla de hechos" : `Colocar ${ficha.nombre}`}">${micro.colocados[ficha.id] ? ficha.nombre : ficha.clase === "hechos" ? "Centro · tabla de hechos" : "Dimensión"}</button>`).join("")}</div><p class="mini-instruction">Espacios completos: ${Object.keys(micro.colocados).length} / 5</p></section>`;
			return;
		}
		const decision = datos.unidades[1].caso[micro.decision];
		zona.innerHTML = `<section class="play-panel">${pintarCabeceraReto(`Mini caso · decisión ${micro.decision + 1} de 3`, "Aplica dimensiones y análisis para resolver el caso.")}<div class="case-question"><p>${decision.pregunta}</p><div class="choice-row">${decision.opciones.map((opcion, indice) => `<button class="choice-button" type="button" data-case-option="${indice}">${opcion}</button>`).join("")}</div></div></section>`;
	}

	function pintarETL(zona) {
		const micro = sesion.micro;
		if (micro.paso === "orden") {
			zona.innerHTML = `<section class="play-panel">${pintarCabeceraReto("Secuencia ETL", "Reordena con las flechas, el teclado o arrastrando cada paso.")}<div class="sortable-list" aria-label="Pasos ETL en orden editable">${micro.orden.map((indicePaso, posicion) => `<div class="sort-step" draggable="true" data-sort-step="${posicion}"><span>${datos.unidades[2].etl[indicePaso]}</span><span class="sort-controls"><button type="button" data-move-step="${posicion}" data-direction="-1" aria-label="Mover ${datos.unidades[2].etl[indicePaso]} arriba" ${posicion === 0 ? "disabled" : ""}>↑</button><button type="button" data-move-step="${posicion}" data-direction="1" aria-label="Mover ${datos.unidades[2].etl[indicePaso]} abajo" ${posicion === 2 ? "disabled" : ""}>↓</button></span></div>`).join("")}</div><button class="game-action" type="button" data-action="check-etl">Comprobar secuencia</button></section>`;
			return;
		}
		if (micro.paso === "graficos") {
			const reto = datos.unidades[2].graficos[micro.decisionGrafico];
			zona.innerHTML = `<section class="play-panel">${pintarCabeceraReto(`Elige la visualización · ${micro.decisionGrafico + 1} de 3`, "Asocia cada KPI con el gráfico que comunica mejor su patrón.")}<div class="chart-choice"><p>${reto.indicador}</p><div class="choice-row">${reto.opciones.map((opcion, indice) => `<button class="choice-button" type="button" data-chart-option="${indice}">${opcion}</button>`).join("")}</div></div></section>`;
			return;
		}
		const alerta = datos.unidades[2].alerta;
		zona.innerHTML = `<section class="play-panel">${pintarCabeceraReto("Alerta por umbral", "No hay valores de ejemplo en el sílabo: aplica el principio sin inventar mediciones.")}<div class="chart-choice"><p>${alerta.principio}</p><div class="choice-row">${alerta.opciones.map((opcion, indice) => `<button class="choice-button" type="button" data-alert-option="${indice}">${opcion}</button>`).join("")}</div><p class="alert-result" id="alertResult" aria-live="polite"></p></div></section>`;
	}

	function quitarVida(mensaje) {
		sesion.vidas -= 1;
		respuestaIncorrecta(mensaje);
		if (sesion.vidas <= 0) sesion.fase = "mini-failed";
		pintarMinijuego();
	}

	function completarMinijuego() {
		sumarXP(25);
		sesion.fase = "quiz"; sesion.quizIndex = 0; sesion.quizAciertos = 0; sesion.quizBloqueada = false;
		anunciar("Minijuego completado. Empieza la evaluación de cinco preguntas.");
		pintarMinijuego();
	}

	function pintarPregunta(zona) {
		const preguntas = sesion.unidad.preguntas;
		if (sesion.quizIndex >= preguntas.length) { finalizarCuestionario(); pintarMinijuego(); return; }
		const pregunta = preguntas[sesion.quizIndex];
		zona.innerHTML = `<section class="quiz-card"><div class="quiz-progress-line"><span>Evaluación · pregunta ${sesion.quizIndex + 1} de ${preguntas.length}</span><span>${sesion.quizAciertos} aciertos</span></div><h3>${pregunta.pregunta}</h3><div class="quiz-options">${pregunta.opciones.map((opcion, indice) => `<button class="quiz-option" type="button" data-quiz-option="${indice}" ${sesion.quizBloqueada ? "disabled" : ""}>${opcion}</button>`).join("")}</div><p class="quiz-feedback" id="quizFeedback" role="status" aria-live="polite"></p>${sesion.quizBloqueada ? "<button class='game-action' type='button' data-action='quiz-next'>Siguiente <i class='bi bi-arrow-right' aria-hidden='true'></i></button>" : ""}</section>`;
	}

	function responderPregunta(indice) {
		if (sesion.quizBloqueada) return;
		const pregunta = sesion.unidad.preguntas[sesion.quizIndex];
		const correcto = indice === pregunta.correcta;
		sesion.quizBloqueada = true;
		if (correcto) { sesion.quizAciertos += 1; sumarXP(10); } else respuestaIncorrecta();
		pintarPregunta(document.getElementById("playArea"));
		const opciones = [...document.querySelectorAll("[data-quiz-option]")];
		opciones.forEach((boton) => {
			const esCorrecta = Number(boton.dataset.quizOption) === pregunta.correcta;
			if (esCorrecta) boton.classList.add("correct");
			if (Number(boton.dataset.quizOption) === indice && !correcto) boton.classList.add("wrong");
		});
		const comentario = document.getElementById("quizFeedback");
		comentario.textContent = `${correcto ? "¡Correcto! " : "Revisa este concepto. "}${pregunta.explicacion}`;
		comentario.classList.add(correcto ? "correct" : "wrong");
	}

	function finalizarCuestionario() {
		const aprobado = sesion.quizAciertos >= 3;
		if (aprobado) {
			const estrellasGanadas = sesion.quizAciertos === 5 ? 3 : sesion.quizAciertos === 4 ? 2 : 1;
			const anteriores = Number(progreso.estrellas[sesion.id]) || 0;
			progreso.estrellas[sesion.id] = Math.max(anteriores, estrellasGanadas);
			if (!progreso.completados.includes(sesion.id)) { progreso.completados.push(sesion.id); progreso.completados.sort(); progreso.xp += 40; }
			guardarProgreso(); pintarMapa();
		}
		sesion.fase = aprobado ? "passed" : "quiz-failed";
	}

	function pintarResultadoQuiz(zona, aprobado) {
		const habilidadIds = insigniasPorUnidad[sesion.id];
		const retos = datos.habilidades.filter((habilidad) => habilidadIds.includes(habilidad.id));
		const resultado = aprobado ? `<div class="level-result"><span class="result-stars" aria-label="${progreso.estrellas[sesion.id]} estrellas">${"★".repeat(progreso.estrellas[sesion.id])}${"☆".repeat(3 - progreso.estrellas[sesion.id])}</span><h3>Unidad completada</h3><p>${sesion.quizAciertos} de 5 respuestas correctas. Nivel siguiente desbloqueado.</p></div>` : `<div class="level-result"><h3>Te faltó una pista</h3><p>Logra al menos 3 respuestas correctas para completar el nivel.</p><button class="game-action" type="button" data-action="retry-quiz">Reintentar evaluación</button></div>`;
		const retosHtml = aprobado ? `<div class="badge-challenges"><div class="topic-heading"><h3>Retos de insignia</h3><span>También puedes jugarlos después</span></div><div class="badge-challenge-list">${retos.map((habilidad) => `<article class="badge-challenge"><h4><i class="bi ${habilidad.icono}" aria-hidden="true"></i> ${habilidad.nombre}${progreso.insignias.includes(habilidad.id) ? " · obtenida" : ""}</h4><p>${habilidad.reto}</p><div class="choice-row">${habilidad.opciones.map((opcion, indice) => `<button class="choice-button" type="button" data-skill-id="${habilidad.id}" data-skill-option="${indice}" ${progreso.insignias.includes(habilidad.id) ? "disabled" : ""}>${opcion}</button>`).join("")}</div><p class="skill-feedback" id="skillFeedback-${habilidad.id}" aria-live="polite"></p></article>`).join("")}</div></div>` : "";
		zona.innerHTML = `<section class="play-panel">${resultado}${retosHtml}</section>`;
	}

	function ganarInsignia(id) {
		if (progreso.insignias.includes(id)) return;
		progreso.insignias.push(id); sumarXP(15); pintarInsignias();
		const habilidad = datos.habilidades.find((item) => item.id === id);
		const comentario = document.getElementById(`skillFeedback-${id}`);
		if (comentario) comentario.textContent = `Insignia ganada: ${habilidad.nombre}.`;
		const tarjeta = [...document.querySelectorAll(".badge-card")].find((item) => item.textContent.includes(habilidad.nombre));
		if (tarjeta) tarjeta.classList.add("earned");
		anunciar(`Insignia obtenida: ${habilidad.nombre}.`);
	}

	function abrirJefe() {
		if (!datos.unidades.every((unidad) => progreso.completados.includes(unidad.id))) return;
		sesion = { tipo: "jefe", fase: "boss", paso: 0, vidas: 3, impacto: 0, decisiones: [] };
		elementos.panel.classList.remove("d-none");
		pintarJefe();
		elementos.panel.scrollIntoView({ behavior: "smooth", block: "start" });
	}

	function pintarJefe() {
		const zona = elementos.contenido;
		if (sesion.fase === "boss-failed") {
			zona.innerHTML = `<div class="level-topbar"><button class="back-map" type="button" data-action="back-map"><i class="bi bi-arrow-left" aria-hidden="true"></i> Mapa</button><span class="level-number">JEFE FINAL</span></div><section class="play-panel"><p class="eyebrow">PlasTrack · simulación</p><h2 class="level-title">Se agotaron las vidas</h2><p>El impacto alcanzado fue ${sesion.impacto} puntos. Puedes reiniciar la simulación.</p><button class="game-action" type="button" data-action="retry-boss">Reintentar jefe</button></section>`;
			return;
		}
		if (sesion.fase === "boss-done") {
			progreso.jefeCompleto = true; progreso.impactoJefe = Math.max(progreso.impactoJefe, sesion.impacto); progreso.estrellas.jefe = sesion.impacto >= 100 ? 3 : sesion.impacto >= 60 ? 2 : 1;
			pintarMapa(); pintarInsignias();
			zona.innerHTML = `<div class="level-topbar"><button class="back-map" type="button" data-action="back-map"><i class="bi bi-arrow-left" aria-hidden="true"></i> Volver al mapa</button><span class="level-number">MISIÓN FINALIZADA</span></div><div class="boss-summary"><p class="eyebrow">${datos.jefe.nombre} · simulación con datos ilustrativos</p><h2 class="level-title">Impacto: ${sesion.impacto} / 100</h2><p>Resolviste las cinco decisiones de la misión.</p><ul>${sesion.decisiones.map((decision) => `<li>${decision.tema}: ${decision.elegida}</li>`).join("")}</ul><p><strong>Racha máxima:</strong> ${progreso.mejorRacha} · <strong>Insignias:</strong> ${progreso.insignias.length} de 6</p></div>`;
			guardarProgreso();
			return;
		}
		const decision = datos.jefe.decisiones[sesion.paso];
		zona.innerHTML = `<div class="level-topbar"><button class="back-map" type="button" data-action="back-map"><i class="bi bi-arrow-left" aria-hidden="true"></i> Volver al mapa</button><span class="level-number">JEFE FINAL · DECISIÓN ${sesion.paso + 1} / 5</span></div><div class="boss-banner"><strong>${datos.jefe.nombre} · simulación</strong><p>${datos.jefe.contexto} ${datos.jefe.aviso}</p></div><section class="play-panel boss-decision"><div class="play-panel-header"><div><p class="eyebrow">${decision.tema}</p><h3>${decision.pregunta}</h3></div>${vidasHTML()}</div><p class="impact-score">Impacto actual: ${sesion.impacto} / 100</p><div class="choice-row">${decision.opciones.map((opcion, indice) => `<button class="choice-button" type="button" data-boss-option="${indice}">${opcion}</button>`).join("")}</div><p class="game-message" id="bossFeedback" role="status" aria-live="polite"></p></section>`;
	}

	function responderJefe(indice) {
		const decision = datos.jefe.decisiones[sesion.paso];
		const correcto = indice === decision.correcta;
		if (correcto) { sesion.impacto += decision.impacto; sumarXP(12); sesion.decisiones.push({ tema: decision.tema, elegida: decision.opciones[indice] }); }
		else { respuestaIncorrecta("La decisión no se ajusta al sílabo. Sigue con la siguiente etapa de la misión."); sesion.decisiones.push({ tema: decision.tema, elegida: decision.opciones[indice] }); sesion.vidas -= 1; }
		const botones = [...document.querySelectorAll("[data-boss-option]")];
		botones.forEach((boton) => { boton.disabled = true; if (Number(boton.dataset.bossOption) === decision.correcta) boton.classList.add("correct"); if (Number(boton.dataset.bossOption) === indice && !correcto) boton.classList.add("wrong"); });
		const feedback = document.getElementById("bossFeedback");
		feedback.textContent = correcto ? `+${decision.impacto} puntos de impacto.` : "Decisión registrada; el equipo continúa con la misión.";
		const sesionActual = sesion;
		window.setTimeout(() => {
			if (sesion !== sesionActual) return;
			if (sesion.vidas <= 0) sesion.fase = "boss-failed";
			else if (sesion.paso === datos.jefe.decisiones.length - 1) sesion.fase = "boss-done";
			else sesion.paso += 1;
			pintarJefe();
		}, 650);
	}

	function reordenar(origen, destino) {
		if (destino < 0 || destino >= sesion.micro.orden.length || origen === destino) return;
		const [paso] = sesion.micro.orden.splice(origen, 1);
		sesion.micro.orden.splice(destino, 0, paso);
		pintarMinijuego();
	}

	function moverTileA(categoriaId, itemTexto) {
		const item = datos.unidades[0].clasificacion.find((actual) => actual.texto === itemTexto);
		if (!item || sesion.micro.colocados[item.texto]) return;
		if (item.categoria !== categoriaId) { quitarVida("Esa ficha pertenece a otra categoría."); return; }
		sesion.micro.colocados[item.texto] = categoriaId; sesion.micro.seleccionado = null; sumarXP(4);
		if (Object.keys(sesion.micro.colocados).length === datos.unidades[0].clasificacion.length) { sesion.micro.paso = "memoria"; anunciar("Clasificación completa. Ahora encuentra los cuatro pares."); }
		pintarMinijuego();
	}

	function manejarClicNivel(evento) {
		const objetivo = evento.target.closest("button");
		if (!objetivo || !sesion || sesion.tipo !== "unidad") return;
		if (objetivo.dataset.flip !== undefined) { objetivo.classList.toggle("is-flipped"); objetivo.setAttribute("aria-expanded", String(objetivo.classList.contains("is-flipped"))); return; }
		if (objetivo.dataset.action === "back-map") { elementos.panel.classList.add("d-none"); sesion = null; return; }
		if (sesion.fase === "intro" && objetivo.dataset.action === "start-mini") { iniciarMinijuego(); return; }
		if (sesion.fase === "mini-failed" && objetivo.dataset.action === "retry-mini") { iniciarMinijuego(); return; }
		if (objetivo.dataset.quizOption !== undefined) { responderPregunta(Number(objetivo.dataset.quizOption)); return; }
		if (objetivo.dataset.action === "quiz-next") { sesion.quizIndex += 1; sesion.quizBloqueada = false; pintarMinijuego(); return; }
		if (objetivo.dataset.action === "retry-quiz") { sesion.quizIndex = 0; sesion.quizAciertos = 0; sesion.quizBloqueada = false; sesion.fase = "quiz"; pintarMinijuego(); return; }
		if (objetivo.dataset.skillId) { const habilidad = datos.habilidades.find((item) => item.id === objetivo.dataset.skillId); if (Number(objetivo.dataset.skillOption) === habilidad.correcta) ganarInsignia(habilidad.id); else { respuestaIncorrecta(); const comentario = document.getElementById(`skillFeedback-${habilidad.id}`); if (comentario) comentario.textContent = "Revisa el propósito de la habilidad e inténtalo de nuevo."; } return; }
		if (objetivo.dataset.item) { sesion.micro.seleccionado = objetivo.dataset.item; pintarMinijuego(); return; }
		if (objetivo.dataset.category) { if (sesion.micro.seleccionado) moverTileA(objetivo.dataset.category, sesion.micro.seleccionado); return; }
		if (objetivo.dataset.memory !== undefined) { voltearMemoria(Number(objetivo.dataset.memory)); return; }
		if (objetivo.dataset.schemaTile) { sesion.micro.seleccionado = objetivo.dataset.schemaTile; pintarMinijuego(); return; }
		if (objetivo.dataset.schemaSlot) { colocarEsquema(objetivo.dataset.schemaSlot, sesion.micro.seleccionado); return; }
		if (objetivo.dataset.caseOption !== undefined) { responderCaso(Number(objetivo.dataset.caseOption)); return; }
		if (objetivo.dataset.moveStep !== undefined) { reordenar(Number(objetivo.dataset.moveStep), Number(objetivo.dataset.moveStep) + Number(objetivo.dataset.direction)); return; }
		if (objetivo.dataset.action === "check-etl") { comprobarETL(); return; }
		if (objetivo.dataset.chartOption !== undefined) { responderGrafico(Number(objetivo.dataset.chartOption)); return; }
		if (objetivo.dataset.alertOption !== undefined) { comprobarAlerta(Number(objetivo.dataset.alertOption)); }
	}

	function voltearMemoria(indice) {
		const micro = sesion.micro;
		if (micro.parejas.includes(micro.memoria[indice].pareja) || micro.reveladas.includes(indice) || micro.reveladas.length >= 2) return;
		micro.reveladas.push(indice);
		if (micro.reveladas.length === 2) {
			const [primera, segunda] = micro.reveladas;
			if (micro.memoria[primera].pareja === micro.memoria[segunda].pareja) {
				micro.parejas.push(micro.memoria[primera].pareja); sumarXP(8);
				if (micro.parejas.length === 4) { completarMinijuego(); return; }
			} else {
				respuestaIncorrecta("No forman pareja. Prueba con otro término y definición."); sesion.vidas -= 1;
				if (sesion.vidas <= 0) { sesion.fase = "mini-failed"; pintarMinijuego(); return; }
				const sesionActual = sesion;
				window.setTimeout(() => { if (sesion === sesionActual && sesion.fase === "mini") { micro.reveladas = []; pintarMinijuego(); } }, 700);
				pintarMinijuego(); return;
			}
		}
		pintarMinijuego();
	}

	function colocarEsquema(slotId, tileId) {
		if (!tileId || sesion.micro.colocados[slotId]) return;
		if (slotId !== tileId) { quitarVida("La tabla de hechos y las dimensiones deben ir en espacios distintos."); return; }
		sesion.micro.colocados[slotId] = true; sesion.micro.seleccionado = null; sumarXP(6);
		if (Object.keys(sesion.micro.colocados).length === datos.unidades[1].esquema.length) { sesion.micro.paso = "caso"; anunciar("Esquema estrella completo. Resuelve el mini caso."); }
		pintarMinijuego();
	}

	function responderCaso(indice) {
		const decision = datos.unidades[1].caso[sesion.micro.decision];
		if (indice !== decision.correcta) { quitarVida("Esa decisión no responde al análisis solicitado."); return; }
		sumarXP(7); sesion.micro.decision += 1;
		if (sesion.micro.decision >= datos.unidades[1].caso.length) { completarMinijuego(); return; }
		pintarMinijuego();
	}

	function comprobarETL() {
		if (sesion.micro.orden.join(",") !== "0,1,2") { quitarVida("Revisa el orden: primero extraer, luego transformar y al final cargar."); return; }
		sumarXP(8); sesion.micro.paso = "graficos"; pintarMinijuego();
	}

	function responderGrafico(indice) {
		const reto = datos.unidades[2].graficos[sesion.micro.decisionGrafico];
		if (indice !== reto.correcta) { quitarVida("Ese gráfico no representa el patrón solicitado."); return; }
		sumarXP(7); sesion.micro.decisionGrafico += 1;
		if (sesion.micro.decisionGrafico >= datos.unidades[2].graficos.length) sesion.micro.paso = "alerta";
		pintarMinijuego();
	}

	function comprobarAlerta(indice) {
		const alerta = datos.unidades[2].alerta;
		if (indice === alerta.correcta) {
			const resultado = document.getElementById("alertResult");
			resultado.textContent = "Correcto: el equipo define la condición del umbral para generar la alerta.";
			window.setTimeout(completarMinijuego, 450);
		} else { quitarVida("La alerta necesita un KPI y una condición de umbral definida."); }
	}

	function manejarArrastreInicio(evento) {
		const ficha = evento.target.closest("[data-item], [data-schema-tile], [data-sort-step]");
		if (!ficha) return;
		const clave = ficha.dataset.item !== undefined ? "item" : ficha.dataset.schemaTile !== undefined ? "schema" : "sort";
		evento.dataTransfer.setData("text/plain", JSON.stringify({ clave, valor: ficha.dataset.item || ficha.dataset.schemaTile || ficha.dataset.sortStep }));
		evento.dataTransfer.effectAllowed = "move";
	}

	function manejarSoltar(evento) {
		const datosArrastre = evento.dataTransfer.getData("text/plain");
		if (!datosArrastre || !sesion || sesion.tipo !== "unidad") return;
		let ficha;
		try { ficha = JSON.parse(datosArrastre); } catch { return; }
		const destino = evento.target.closest("[data-category], [data-schema-slot], [data-sort-step]");
		if (!destino) return;
		if (ficha.clave === "item" && destino.dataset.category) moverTileA(destino.dataset.category, ficha.valor);
		if (ficha.clave === "schema" && destino.dataset.schemaSlot) colocarEsquema(destino.dataset.schemaSlot, ficha.valor);
		if (ficha.clave === "sort" && destino.dataset.sortStep !== undefined) reordenar(Number(ficha.valor), Number(destino.dataset.sortStep));
	}

	function manejarJefe(evento) {
		const boton = evento.target.closest("button");
		if (!boton || !sesion || sesion.tipo !== "jefe") return;
		if (boton.dataset.action === "back-map") { elementos.panel.classList.add("d-none"); sesion = null; return; }
		if (boton.dataset.action === "retry-boss") { abrirJefe(); return; }
		if (boton.dataset.bossOption !== undefined && sesion.fase === "boss") responderJefe(Number(boton.dataset.bossOption));
	}

	function reiniciarProgreso() {
		try { localStorage.removeItem(claveGuardado); } catch { /* El reinicio local sigue en memoria. */ }
		progreso = { apodo: "", xp: 0, completados: [], estrellas: {}, insignias: [], racha: 0, mejorRacha: 0, jefeCompleto: false, impactoJefe: 0 };
		sesion = null; elementos.panel.classList.add("d-none"); elementos.apodo.value = "";
		elementos.entrada.closest(".player-entry").classList.remove("d-none"); elementos.mapa.classList.add("d-none"); elementos.vitrina.classList.add("d-none");
		actualizarHUD();
		if (window.bootstrap?.Modal) bootstrap.Modal.getOrCreateInstance(document.getElementById("resetModal")).hide();
		elementos.inicio.scrollIntoView({ behavior: "smooth", block: "center" });
	}

	elementos.entrada.addEventListener("submit", (evento) => {
		evento.preventDefault();
		progreso.apodo = elementos.apodo.value.trim().slice(0, 20) || "Explorador";
		guardarProgreso(); abrirMapa();
	});
	elementos.ruta.addEventListener("click", (evento) => {
		const boton = evento.target.closest("button");
		if (!boton || boton.disabled) return;
		if (boton.dataset.openLevel) abrirUnidad(Number(boton.dataset.openLevel));
		if (boton.dataset.openBoss) abrirJefe();
	});
	elementos.contenido.addEventListener("click", (evento) => {
		if (sesion?.tipo === "jefe") { manejarJefe(evento); return; }
		manejarClicNivel(evento);
	});
	elementos.contenido.addEventListener("dragstart", manejarArrastreInicio);
	elementos.contenido.addEventListener("dragover", (evento) => { if (evento.target.closest("[data-category], [data-schema-slot], [data-sort-step]")) evento.preventDefault(); });
	elementos.contenido.addEventListener("drop", (evento) => { evento.preventDefault(); manejarSoltar(evento); });
	elementos.sonido.addEventListener("click", () => {
		sonidoActivo = !sonidoActivo;
		elementos.sonido.setAttribute("aria-pressed", String(sonidoActivo));
		elementos.sonido.setAttribute("aria-label", sonidoActivo ? "Desactivar sonidos" : "Activar sonidos");
		elementos.sonido.innerHTML = `<i class="bi ${sonidoActivo ? "bi-volume-up" : "bi-volume-mute"}" aria-hidden="true"></i>`;
		if (sonidoActivo) sonar(true);
	});
	document.getElementById("confirmReset").addEventListener("click", reiniciarProgreso);
	
	document.getElementById("currentYear").textContent = String(new Date().getFullYear());
	document.getElementById("playerNickname").value = progreso.apodo;
	iniciarGrafico(); pintarCalendario(); pintarBiblioteca(); actualizarHUD();
	if (progreso.apodo) abrirMapa();
})();