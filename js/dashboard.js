(() => {
  "use strict";

  const origen = window.CHAMPIONS_DATA;
  if (!origen || !Array.isArray(origen.equipos) || !Array.isArray(origen.marcadores)) return;

  const equipos = origen.equipos;
  const porId = new Map(equipos.map((equipo) => [equipo.id, equipo]));
  const partidos = crearCalendario();
  const filtros = {
    jornada: document.getElementById("roundFilter"),
    pais: document.getElementById("countryFilter"),
    equipo: document.getElementById("teamFilter"),
    buscar: document.getElementById("tableSearch"),
    compararA: document.getElementById("compareTeamA"),
    compararB: document.getElementById("compareTeamB")
  };
  const graficos = new Map();
  const contadores = new WeakMap();
  let orden = { clave: "puntos", direccion: -1 };
  let temaOscuro = localStorageSeguro("biDashboardTheme") === "dark";
  const paleta = { teAL: "#087e83", aqua: "#4bc5bd", gold: "#e9b84d", coral: "#d96752", green: "#57936c" };

  function localStorageSeguro(clave, valor) {
    try {
      if (valor === undefined) return localStorage.getItem(clave);
      localStorage.setItem(clave, valor);
    } catch { /* La página sigue funcionando si el navegador bloquea el almacenamiento. */ }
    return null;
  }

  function crearCalendario() {
    const rotacion = equipos.map((equipo) => equipo.id);
    const partidosCreados = [];
    origen.marcadores.forEach((marcadoresJornada, indiceJornada) => {
      for (let indicePartido = 0; indicePartido < equipos.length / 2; indicePartido += 1) {
        const localId = rotacion[indicePartido];
        const visitanteId = rotacion[equipos.length - 1 - indicePartido];
        const marcador = marcadoresJornada[indicePartido];
        if (!marcador) continue;
        const alternarSede = (indiceJornada + indicePartido) % 2 === 1;
        const [golesUno, golesDos] = marcador;
        partidosCreados.push({
          jornada: indiceJornada + 1,
          local: alternarSede ? visitanteId : localId,
          visitante: alternarSede ? localId : visitanteId,
          golesLocal: alternarSede ? golesDos : golesUno,
          golesVisitante: alternarSede ? golesUno : golesDos
        });
      }
      rotacion.splice(1, 0, rotacion.pop());
    });
    return partidosCreados;
  }

  function agregarOpciones(select, valores, etiqueta) {
    valores.forEach((valor) => {
      const opcion = document.createElement("option");
      opcion.value = valor.valor;
      opcion.textContent = valor.etiqueta;
      select.append(opcion);
    });
    if (etiqueta) select.setAttribute("aria-label", etiqueta);
  }

  function prepararFiltros() {
    agregarOpciones(filtros.jornada, origen.marcadores.map((_, indice) => ({ valor: String(indice + 1), etiqueta: `Jornada ${indice + 1}` })));
    const paises = [...new Set(equipos.map((equipo) => equipo.pais))].sort((a, b) => a.localeCompare(b, "es"));
    agregarOpciones(filtros.pais, paises.map((pais) => ({ valor: pais, etiqueta: pais })));
    const opcionesEquipos = equipos.map((equipo) => ({ valor: equipo.id, etiqueta: equipo.nombre }));
    agregarOpciones(filtros.equipo, opcionesEquipos);
    agregarOpciones(filtros.compararA, opcionesEquipos);
    agregarOpciones(filtros.compararB, opcionesEquipos);
    filtros.compararA.value = equipos[0]?.id || "";
    filtros.compararB.value = equipos[1]?.id || equipos[0]?.id || "";
  }

  function filtrarPartidos() {
    const jornada = filtros.jornada.value;
    const pais = filtros.pais.value;
    const equipo = filtros.equipo.value;
    return partidos.filter((partido) => {
      const local = porId.get(partido.local);
      const visitante = porId.get(partido.visitante);
      const coincideJornada = jornada === "all" || partido.jornada === Number(jornada);
      const coincidePais = pais === "all" || local.pais === pais || visitante.pais === pais;
      const coincideEquipo = equipo === "all" || partido.local === equipo || partido.visitante === equipo;
      return coincideJornada && coincidePais && coincideEquipo;
    });
  }

  function calcularEstadisticas(listaPartidos) {
    const estadisticas = new Map(equipos.map((equipo) => [equipo.id, {
      id: equipo.id, nombre: equipo.nombre, pais: equipo.pais, pj: 0,
      golesFavor: 0, golesContra: 0, victorias: 0, empates: 0, derrotas: 0,
      puntos: 0, posesion: equipo.posesion, pases: equipo.pases,
      disciplina: equipo.disciplina, golesJugadores: new Map()
    }]));
    const resultados = { local: 0, empate: 0, visitante: 0 };
    const porJornada = new Map(origen.marcadores.map((_, indice) => [indice + 1, 0]));

    listaPartidos.forEach((partido, indicePartido) => {
      const local = estadisticas.get(partido.local);
      const visitante = estadisticas.get(partido.visitante);
      local.pj += 1;
      visitante.pj += 1;
      local.golesFavor += partido.golesLocal;
      local.golesContra += partido.golesVisitante;
      visitante.golesFavor += partido.golesVisitante;
      visitante.golesContra += partido.golesLocal;
      porJornada.set(partido.jornada, (porJornada.get(partido.jornada) || 0) + partido.golesLocal + partido.golesVisitante);

      if (partido.golesLocal > partido.golesVisitante) {
        local.victorias += 1; local.puntos += 3; visitante.derrotas += 1; resultados.local += 1;
      } else if (partido.golesLocal < partido.golesVisitante) {
        visitante.victorias += 1; visitante.puntos += 3; local.derrotas += 1; resultados.visitante += 1;
      } else {
        local.empates += 1; visitante.empates += 1; local.puntos += 1; visitante.puntos += 1; resultados.empate += 1;
      }
      repartirGoles(local, partido.golesLocal, indicePartido);
      repartirGoles(visitante, partido.golesVisitante, indicePartido + 1);
    });
    estadisticas.forEach((fila) => { fila.diferencia = fila.golesFavor - fila.golesContra; });
    return { estadisticas, resultados, porJornada };
  }

  function repartirGoles(fila, cantidad, semilla) {
    const listaGoleadores = porId.get(fila.id).goleadores;
    for (let indiceGol = 0; indiceGol < cantidad; indiceGol += 1) {
      const jugador = listaGoleadores[(semilla + indiceGol) % listaGoleadores.length];
      fila.golesJugadores.set(jugador, (fila.golesJugadores.get(jugador) || 0) + 1);
    }
  }

  function animarNumero(elemento, destino, decimales = 0) {
    const anterior = contadores.get(elemento);
    if (anterior) cancelAnimationFrame(anterior);
    const inicial = Number(elemento.dataset.valorActual) || 0;
    const inicio = performance.now();
    const duracion = 430;
    const formato = new Intl.NumberFormat("es-ES", { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
    const paso = (ahora) => {
      const progreso = Math.min((ahora - inicio) / duracion, 1);
      const valor = inicial + (destino - inicial) * (1 - (1 - progreso) ** 3);
      elemento.textContent = formato.format(valor);
      if (progreso < 1) contadores.set(elemento, requestAnimationFrame(paso));
      else { elemento.dataset.valorActual = String(destino); contadores.delete(elemento); }
    };
    contadores.set(elemento, requestAnimationFrame(paso));
  }

  function actualizarIndicadores(listaPartidos, resumen) {
    const goles = listaPartidos.reduce((total, partido) => total + partido.golesLocal + partido.golesVisitante, 0);
    const promedio = listaPartidos.length ? goles / listaPartidos.length : 0;
    const filas = [...resumen.estadisticas.values()].filter((fila) => fila.pj > 0);
    const masVictorias = [...filas].sort((a, b) => b.victorias - a.victorias || a.nombre.localeCompare(b.nombre, "es"))[0];
    const goleadores = filas.flatMap((fila) => [...fila.golesJugadores].map(([nombre, cantidad]) => ({ nombre, cantidad })));
    goleadores.sort((a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre, "es"));
    const goleador = goleadores[0];
    animarNumero(document.getElementById("kpiGoals"), goles);
    animarNumero(document.getElementById("kpiAverage"), promedio, 1);
    document.getElementById("kpiWins").textContent = masVictorias?.nombre || "—";
    document.getElementById("kpiWinsDetail").textContent = `${masVictorias?.victorias || 0} victorias`;
    document.getElementById("kpiScorer").textContent = goleador?.nombre || "—";
    document.getElementById("kpiScorerDetail").textContent = `${goleador?.cantidad || 0} goles`;
    const jornada = filtros.jornada.value === "all" ? "todas las jornadas" : `jornada ${filtros.jornada.value}`;
    const pais = filtros.pais.value === "all" ? "todos los países" : filtros.pais.value;
    const equipo = filtros.equipo.value === "all" ? "todos los equipos" : porId.get(filtros.equipo.value)?.nombre;
    document.getElementById("filterSummary").textContent = `${listaPartidos.length} partidos · ${jornada} · ${pais} · ${equipo}`;
  }

  function colorCSS(nombre) { return getComputedStyle(document.body).getPropertyValue(nombre).trim(); }

  function opcionesComun() {
    const oscuro = temaOscuro;
    const texto = oscuro ? "#d9e6e1" : "#476168";
    const rejilla = oscuro ? "#345056" : "#e2e9e5";
    return { responsive: true, maintainAspectRatio: false, animation: { duration: 380 }, plugins: {
      legend: { labels: { color: texto, usePointStyle: true, boxWidth: 8, font: { family: "Trebuchet MS", size: 11 } } },
      tooltip: { backgroundColor: oscuro ? "#0d1e21" : "#17343b", padding: 10, titleFont: { weight: "bold" } }
    }, scales: { x: { ticks: { color: texto }, grid: { color: rejilla } }, y: { ticks: { color: texto }, grid: { color: rejilla } } } };
  }

  function crearGrafico(id, tipo, datos, opciones) {
    const canvas = document.getElementById(id);
    const previo = graficos.get(id);
    if (previo) previo.destroy();
    graficos.set(id, new Chart(canvas, { type: tipo, data: datos, options: opciones }));
  }

  function dibujarGraficos(resumen) {
    if (!window.Chart) return;
    const comunes = opcionesComun();
    const filas = [...resumen.estadisticas.values()].filter((fila) => fila.pj > 0);
    const top = [...filas].sort((a, b) => b.golesFavor - a.golesFavor || a.nombre.localeCompare(b.nombre, "es")).slice(0, 10);
    crearGrafico("goalsChart", "bar", { labels: top.map((fila) => fila.nombre), datasets: [{ label: "Goles a favor", data: top.map((fila) => fila.golesFavor), backgroundColor: paleta.teAL, borderRadius: 3 }] }, {
      ...comunes, indexAxis: "y", plugins: { ...comunes.plugins, legend: { display: false } }, scales: { x: { ...comunes.scales.x, beginAtZero: true, ticks: { ...comunes.scales.x.ticks, precision: 0 } }, y: { ...comunes.scales.y, grid: { display: false } } }
    });
    crearGrafico("resultsChart", "bar", { labels: filas.map((fila) => fila.nombre), datasets: [
      { label: "Victorias", data: filas.map((fila) => fila.victorias), backgroundColor: paleta.teAL },
      { label: "Empates", data: filas.map((fila) => fila.empates), backgroundColor: paleta.gold },
      { label: "Derrotas", data: filas.map((fila) => fila.derrotas), backgroundColor: paleta.coral }
    ] }, { ...comunes, indexAxis: "y", scales: { x: { ...comunes.scales.x, stacked: true, beginAtZero: true, ticks: { ...comunes.scales.x.ticks, precision: 0 } }, y: { ...comunes.scales.y, stacked: true, grid: { display: false } } } });
    crearGrafico("outcomesChart", "doughnut", { labels: ["Victoria local", "Empate", "Victoria visitante"], datasets: [{ data: [resumen.resultados.local, resumen.resultados.empate, resumen.resultados.visitante], backgroundColor: [paleta.teAL, paleta.gold, paleta.coral], borderWidth: 2, borderColor: temaOscuro ? "#1c373b" : "#fff" }] }, { ...comunes, cutout: "63%", scales: undefined, plugins: { ...comunes.plugins, legend: { position: "bottom", labels: comunes.plugins.legend.labels } } });
    const jornadas = [...resumen.porJornada.keys()];
    crearGrafico("roundChart", "line", { labels: jornadas.map((jornada) => `J${jornada}`), datasets: [{ label: "Goles", data: jornadas.map((jornada) => resumen.porJornada.get(jornada)), borderColor: paleta.teAL, backgroundColor: `${paleta.teAL}25`, fill: true, tension: .3, pointRadius: 4 }] }, { ...comunes, scales: { ...comunes.scales, y: { ...comunes.scales.y, beginAtZero: true, ticks: { ...comunes.scales.y.ticks, precision: 0 } } } });
    dibujarRadar(resumen);
  }

  function dibujarRadar(resumen) {
    const a = resumen.estadisticas.get(filtros.compararA.value) || calcularEstadisticas(partidos).estadisticas.get(filtros.compararA.value);
    const b = resumen.estadisticas.get(filtros.compararB.value) || calcularEstadisticas(partidos).estadisticas.get(filtros.compararB.value);
    const maxGoles = Math.max(1, ...[...resumen.estadisticas.values()].map((fila) => fila.golesFavor));
    const valores = (fila) => [
      Math.round((fila.golesFavor / maxGoles) * 100),
      Math.round((1 - fila.golesContra / Math.max(1, fila.pj * 3)) * 100),
      fila.posesion, fila.pases, fila.disciplina
    ].map((valor) => Math.max(0, Math.min(100, valor)));
    const base = opcionesComun();
    crearGrafico("radarChart", "radar", { labels: ["Ataque", "Defensa", "Posesión", "Pases", "Disciplina"], datasets: [
      { label: porId.get(a.id).nombre, data: valores(a), borderColor: paleta.teAL, backgroundColor: `${paleta.teAL}30`, pointBackgroundColor: paleta.teAL, borderWidth: 2 },
      { label: porId.get(b.id).nombre, data: valores(b), borderColor: paleta.coral, backgroundColor: `${paleta.coral}25`, pointBackgroundColor: paleta.coral, borderWidth: 2 }
    ] }, { ...base, scales: { r: { min: 0, max: 100, ticks: { display: false, stepSize: 20 }, grid: { color: temaOscuro ? "#345056" : "#e2e9e5" }, angleLines: { color: temaOscuro ? "#345056" : "#e2e9e5" }, pointLabels: { color: temaOscuro ? "#d9e6e1" : "#476168", font: { size: 11 } } } } });
  }

  function ordenarFilas(filas) {
    return filas.sort((a, b) => {
      const valorA = a[orden.clave];
      const valorB = b[orden.clave];
      const comparacion = typeof valorA === "string" ? valorA.localeCompare(valorB, "es") : valorA - valorB;
      return comparacion * orden.direccion || b.puntos - a.puntos || a.nombre.localeCompare(b.nombre, "es");
    });
  }

  function dibujarTabla(resumen) {
    const buscar = filtros.buscar.value.trim().toLocaleLowerCase("es");
    const filas = ordenarFilas([...resumen.estadisticas.values()].filter((fila) => fila.pj > 0 && `${fila.nombre} ${fila.pais}`.toLocaleLowerCase("es").includes(buscar)));
    const cuerpo = document.getElementById("standingsBody");
    const fragmento = document.createDocumentFragment();
    filas.forEach((fila, indice) => {
      const tr = document.createElement("tr");
      const celdas = [indice + 1, fila.nombre, fila.pj, fila.golesFavor, fila.golesContra, fila.diferencia, fila.victorias, fila.empates, fila.derrotas, fila.puntos];
      celdas.forEach((valor) => { const td = document.createElement("td"); td.textContent = String(valor); tr.append(td); });
      fragmento.append(tr);
    });
    cuerpo.replaceChildren(fragmento);
    document.getElementById("tableEmpty").classList.toggle("d-none", filas.length > 0);
  }

  function actualizarOrden(encabezado) {
    const clave = encabezado.dataset.sort;
    orden = { clave, direccion: orden.clave === clave ? -orden.direccion : (clave === "nombre" ? 1 : -1) };
    document.querySelectorAll(".sort-button").forEach((boton) => {
      const activo = boton === encabezado;
      boton.setAttribute("aria-sort", activo ? (orden.direccion > 0 ? "ascending" : "descending") : "none");
      const indicador = boton.querySelector("span");
      if (indicador) indicador.textContent = activo ? (orden.direccion > 0 ? "↑" : "↓") : "↕";
    });
    actualizar();
  }

  function actualizar() {
    const listaPartidos = filtrarPartidos();
    const resumen = calcularEstadisticas(listaPartidos);
    actualizarIndicadores(listaPartidos, resumen);
    dibujarGraficos(resumen);
    dibujarTabla(resumen);
  }

  function aplicarTema() {
    document.body.classList.toggle("dashboard-dark", temaOscuro);
    const boton = document.getElementById("themeToggle");
    boton.setAttribute("aria-pressed", String(temaOscuro));
    boton.setAttribute("aria-label", temaOscuro ? "Activar modo claro" : "Activar modo oscuro");
    boton.querySelector("span").textContent = temaOscuro ? "Modo claro" : "Modo oscuro";
    boton.querySelector("i").className = `bi ${temaOscuro ? "bi-sun" : "bi-moon-stars"}`;
  }

  prepararFiltros();
  document.getElementById("dataNotice").textContent = origen.aviso;
  document.getElementById("currentYear").textContent = String(new Date().getFullYear());
  aplicarTema();
  [filtros.jornada, filtros.pais, filtros.equipo, filtros.compararA, filtros.compararB].forEach((select) => select.addEventListener("change", actualizar));
  filtros.buscar.addEventListener("input", () => dibujarTabla(calcularEstadisticas(filtrarPartidos())));
  document.getElementById("resetFilters").addEventListener("click", () => {
    filtros.jornada.value = "all"; filtros.pais.value = "all"; filtros.equipo.value = "all"; filtros.buscar.value = ""; actualizar();
  });
  document.getElementById("themeToggle").addEventListener("click", () => {
    temaOscuro = !temaOscuro;
    localStorageSeguro("biDashboardTheme", temaOscuro ? "dark" : "light");
    aplicarTema();
    actualizar();
  });
  document.querySelectorAll(".sort-button").forEach((boton) => boton.addEventListener("click", () => actualizarOrden(boton)));
  actualizar();
})();