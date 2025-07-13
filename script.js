const prerequisitos = {
  morfo17: [],
  spab113: [],
  obst002: ['obst001'],
  obst003: ['biol130'],
  ing129: ['ing119'],
  obst004: ['morfo17', 'obst003'],
  obst005: ['obst002', 'obst003', 'morfo17'],
  obst006: ['spab113'],
  cegpc13: [],
  ing239: ['ing129'],
  obst007: ['obst004'],
  obst008: ['obst005', 'obst006'],
  spab112: ['spab113'],
  obst009: ['obst004', 'obst005', 'obst006', 'ing239'],
  ing249: ['ing239'],
  farm151: ['biol130', 'quim075'],
  obst010: ['spab112', 'obst004', 'obst006'],
  obst011: ['obst008', 'obst007'],
  obst012: ['obst006'],
  obst013: ['obst006', 'obst008', 'obst010'],
  obst014: ['obst010', 'obst011', 'farm151'],
  spab300: ['spab112'],
  obst015: ['obst006', 'obst008', 'obst010'],
  spab303: ['spab300', 'obst006'],
  obst016: ['obst011'],
  obst017: ['obst012', 'obst015'],
  obst018: ['obst006', 'obst007'],
  obst019: ['spab303', 'obst013', 'obst014', 'obst016', 'obst017', 'obst018'],
  obst020: ['spab303', 'obst013', 'obst014', 'obst016', 'obst017', 'obst018'],
  obst021: ['spab303', 'obst013', 'obst014', 'obst016', 'obst017', 'obst018'],
  obst022: ['spab303'],
  obst023: ['obst019', 'obst020', 'obst021', 'obst022'],
  obst024: ['obst019', 'obst020', 'obst021', 'obst022']
};

const correquisitos = {
  obst008: ['obst007', 'spab112'],
  spab112: ['obst008'],
  obst013: ['obst015'],
  obst015: ['obst013'],
  obst016: ['obst018'],
  obst017: ['obst018'],
  obst018: ['obst016', 'obst017']
};


// Funciones para guardar y cargar progreso en localStorage
function obtenerAprobados() {
  const data = localStorage.getItem('mallaAprobados');
  return data ? JSON.parse(data) : [];
}

function guardarAprobados(aprobados) {
  localStorage.setItem('mallaAprobados', JSON.stringify(aprobados));
}

function actualizarDesbloqueos() {
  const aprobados = obtenerAprobados();

  for (const [ramo, prereqs] of Object.entries(prerequisitos)) {
    const elem = document.getElementById(ramo);
    if (!elem) continue;

    const prereqCumplido = prereqs.every(r => aprobados.includes(r));

    let correqsCumplidosInternamente = true; // Asumimos que los correquisitos se cumplen por default si no hay
    const correqs = correquisitos[ramo] || [];
    
    // Si hay correquisitos, verificar que los prerrequisitos de esos correquisitos también se cumplan
    if (correqs.length > 0) {
      correqsCumplidosInternamente = correqs.every(correqRamo => {
        const correqPrereqs = prerequisitos[correqRamo] || [];
        return correqPrereqs.every(p => aprobados.includes(p));
      });
    }

    // Un ramo puede desbloquearse si sus prerrequisitos están cumplidos
    // Y, si tiene correquisitos, los prerrequisitos de esos correquisitos también están cumplidos.
    const puedeDesbloquear = prereqCumplido && correqsCumplidosInternamente;

    if (!elem.classList.contains('aprobado')) {
      if (puedeDesbloquear) {
        elem.classList.remove('bloqueado');
      } else {
        elem.classList.add('bloqueado');
      }
    } else {
      elem.classList.remove('bloqueado');
      // Importante: Si ya está aprobado, asegúrate de que no vuelva a bloquearse.
    }
  }
}


// Maneja el clic para aprobar o desaprobar un ramo (solo si no está bloqueado)
function aprobar(e) {
  const ramo = e.currentTarget;
  if (ramo.classList.contains('bloqueado')) return;

  ramo.classList.toggle('aprobado');

  const aprobados = obtenerAprobados();
  if (ramo.classList.contains('aprobado')) {
    if (!aprobados.includes(ramo.id)) aprobados.push(ramo.id);
  } else {
    const idx = aprobados.indexOf(ramo.id);
    if (idx > -1) aprobados.splice(idx, 1);
  }
  guardarAprobados(aprobados);

  actualizarDesbloqueos();
}

// Al cargar la página, asignar eventos, cargar progreso y actualizar desbloqueos
window.addEventListener('DOMContentLoaded', () => {
  const todosRamos = document.querySelectorAll('.ramo');

  const aprobados = obtenerAprobados();
  todosRamos.forEach(ramo => {
    if (aprobados.includes(ramo.id)) {
      ramo.classList.add('aprobado');
    }
  });

  todosRamos.forEach(ramo => {
    ramo.addEventListener('click', aprobar);
  });

  actualizarDesbloqueos();
});
