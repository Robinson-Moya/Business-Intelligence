/* Datos sintéticos de ejemplo; sustituirlos por fuentes verificadas al actualizar el dashboard. */
window.CHAMPIONS_DATA = {
  aviso: "Datos ilustrativos con fines educativos. No representan resultados oficiales de la UEFA Champions League 2026-2027.",
  equipos: [
    { id: "ATL", nombre: "Atlético de Madrid", pais: "España", posesion: 54, pases: 84, disciplina: 72, goleadores: ["Mateo Ríos", "Iván Soler"], asistencias: ["Leo Campos", "Nico Vidal"] },
    { id: "ARS", nombre: "Arsenal", pais: "Inglaterra", posesion: 59, pases: 89, disciplina: 78, goleadores: ["Noah Clarke", "Elliot Ward"], asistencias: ["Milo James", "Theo Brooks"] },
    { id: "BAY", nombre: "Bayern Múnich", pais: "Alemania", posesion: 61, pases: 88, disciplina: 74, goleadores: ["Lukas Weber", "Jonas Keller"], asistencias: ["Felix Braun", "Mika Hoffmann"] },
    { id: "BEN", nombre: "Benfica", pais: "Portugal", posesion: 56, pases: 85, disciplina: 81, goleadores: ["Tiago Nunes", "Rui Costa"], asistencias: ["André Lima", "Duarte Melo"] },
    { id: "CHE", nombre: "Chelsea", pais: "Inglaterra", posesion: 57, pases: 87, disciplina: 76, goleadores: ["Oliver Hayes", "Liam Carter"], asistencias: ["Ethan Moore", "Aiden Hill"] },
    { id: "DOR", nombre: "Borussia Dortmund", pais: "Alemania", posesion: 52, pases: 82, disciplina: 69, goleadores: ["Tom Fischer", "Paul Neumann"], asistencias: ["Luca Wolf", "Emil Krüger"] },
    { id: "INT", nombre: "Inter de Milán", pais: "Italia", posesion: 55, pases: 86, disciplina: 79, goleadores: ["Luca Romano", "Marco Conti"], asistencias: ["Enzo Ricci", "Matteo Galli"] },
    { id: "JUV", nombre: "Juventus", pais: "Italia", posesion: 51, pases: 83, disciplina: 73, goleadores: ["Nicolò Greco", "Paolo Moretti"], asistencias: ["Diego Riva", "Lorenzo Villa"] },
    { id: "LIV", nombre: "Liverpool", pais: "Inglaterra", posesion: 58, pases: 87, disciplina: 71, goleadores: ["Jack Turner", "Harry Lewis"], asistencias: ["Ben Foster", "Sam Reed"] },
    { id: "MAD", nombre: "Real Madrid", pais: "España", posesion: 60, pases: 90, disciplina: 77, goleadores: ["Álex Martín", "Daniel Vega"], asistencias: ["Pablo León", "Sergio Ruiz"] },
    { id: "MIL", nombre: "AC Milan", pais: "Italia", posesion: 53, pases: 84, disciplina: 75, goleadores: ["Andrea Bianchi", "Giulio Serra"], asistencias: ["Fabio Costa", "Pietro Romano"] },
    { id: "PSG", nombre: "Paris Saint-Germain", pais: "Francia", posesion: 62, pases: 89, disciplina: 70, goleadores: ["Hugo Laurent", "Louis Bernard"], asistencias: ["Jules Moreau", "Noé Petit"] },
    { id: "POR", nombre: "FC Porto", pais: "Portugal", posesion: 50, pases: 81, disciplina: 83, goleadores: ["Diogo Reis", "Pedro Alves"], asistencias: ["João Faria", "Bruno Rocha"] },
    { id: "PSV", nombre: "PSV Eindhoven", pais: "Países Bajos", posesion: 57, pases: 85, disciplina: 68, goleadores: ["Daan Visser", "Milan de Jong"], asistencias: ["Finn Bakker", "Jesse Smit"] },
    { id: "RBL", nombre: "RB Leipzig", pais: "Alemania", posesion: 52, pases: 83, disciplina: 66, goleadores: ["Leon Richter", "Max Brandt"], asistencias: ["Tim Schuster", "Erik Lange"] },
    { id: "TOT", nombre: "Tottenham", pais: "Inglaterra", posesion: 56, pases: 86, disciplina: 80, goleadores: ["Charlie Evans", "Ryan Scott"], asistencias: ["Luke Bennett", "Oscar Gray"] }
  ],
  /* 8 jornadas de 8 partidos; el fixture circular da un partido por equipo en cada jornada. */
  golesPorJornada: [
    [2, 1, 1, 0, 3, 1, 0, 1], [1, 2, 2, 1, 0, 1, 2, 0],
    [3, 0, 1, 2, 1, 2, 0, 1], [1, 1, 0, 2, 2, 1, 3, 0],
    [2, 0, 2, 1, 1, 3, 0, 2], [0, 2, 1, 1, 2, 0, 1, 3],
    [2, 1, 0, 3, 1, 2, 2, 1], [1, 3, 2, 0, 1, 1, 0, 2]
  ],
  /* Cada fila contiene goles del local y visitante; son marcadores ficticios. */
  marcadores: [
    [[2, 1], [1, 0], [2, 2], [0, 1], [3, 1], [1, 1], [0, 2], [2, 0]],
    [[1, 0], [2, 2], [1, 0], [0, 1], [2, 1], [1, 3], [2, 0], [0, 0]],
    [[3, 1], [0, 0], [1, 2], [2, 1], [1, 0], [2, 2], [0, 1], [1, 0]],
    [[1, 1], [0, 2], [2, 0], [1, 1], [2, 0], [1, 2], [3, 1], [0, 0]],
    [[2, 0], [0, 1], [2, 2], [1, 0], [3, 1], [1, 1], [0, 0], [2, 1]],
    [[0, 0], [2, 1], [1, 1], [0, 2], [1, 0], [2, 0], [1, 1], [3, 2]],
    [[2, 1], [1, 1], [0, 2], [3, 0], [1, 0], [2, 2], [1, 0], [1, 2]],
    [[1, 0], [3, 1], [2, 1], [0, 1], [1, 1], [2, 0], [0, 2], [2, 2]]
  ]
};