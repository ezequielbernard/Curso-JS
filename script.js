let clientName = "";

const returnUserName = () => {
  return clientName.charAt(0).toUpperCase() + clientName.slice(1);
};

const promptClientName = () => {
  while (clientName === "") {
    clientName = prompt("Indique su usuario para ingresar en la aplicación");

    if (clientName !== "") {
      showProductCatalog();
    } else {
      alert("Error! Debe completar el nombre de usuario");
    }
  }
};

const showProductCatalog = () => {
  const greetingElement = document.getElementById("greeting");
  greetingElement.textContent = returnUserName();
};

promptClientName();

const CLAVE_LOCALSTORAGE = "listado_tareas";

document.addEventListener("DOMContentLoaded", () => {
  let tareas = [];
  const $contenedorTareas = document.querySelector("#contenedorTareas"),
    $btnGuardarTarea = document.querySelector("#AgregarTarea"),
    $NuevaTarea = document.querySelector("#NuevaTarea"),
    $contadorTareas = document.querySelector("#contadorTareas"),
    $buscarTarea = document.querySelector("#BuscarTarea");

  $btnGuardarTarea.onclick = () => {
    const tarea = $NuevaTarea.value;
    if (!tarea) {
      return;
    }
    tareas.push({
      tarea: tarea,
      terminada: false,
    });
    $NuevaTarea.value = "";
    guardarTareas();
    refrescarTareas();
  };

  $buscarTarea.oninput = () => {
    const filtro = $buscarTarea.value.toLowerCase().trim();
    const tareasFiltradas = tareas.filter((tarea) =>
      tarea.tarea.toLowerCase().includes(filtro)
    );
    $contenedorTareas.innerHTML = "";
    let contadorPendientes = 0;

    for (const [indice, tarea] of tareasFiltradas.entries()) {
      const $enlaceParaEliminar = document.createElement("a");
      $enlaceParaEliminar.classList.add("enlace-eliminar");
      $enlaceParaEliminar.innerHTML = "&times;";
      $enlaceParaEliminar.href = "";
      $enlaceParaEliminar.onclick = (evento) => {
        evento.preventDefault();
        if (!confirm("¿Estás seguro/a que deseas eliminar la tarea?")) {
          return;
        }
        const indiceTareaOriginal = tareas.findIndex(
          (t) => t.tarea === tarea.tarea
        );
        if (indiceTareaOriginal !== -1) {
          tareas.splice(indiceTareaOriginal, 1);
          guardarTareas(tareas);
          refrescarTareas();
        }
      };

      const $checkbox = document.createElement("input");
      $checkbox.type = "checkbox";
      $checkbox.onchange = function () {
        if (this.checked) {
          tarea.terminada = true;
        } else {
          tarea.terminada = false;
        }
        guardarTareas(tareas);
        refrescarTareas();
      };

      const $span = document.createElement("span");
      $span.textContent = tarea.tarea;

      const $li = document.createElement("li");
      if (tarea.terminada) {
        $checkbox.checked = true;
        $span.classList.add("tachado");
      }
      $li.appendChild($checkbox);
      $li.appendChild($span);
      $li.appendChild($enlaceParaEliminar);
      $contenedorTareas.appendChild($li);

      if (!tarea.terminada) {
        contadorPendientes++;
      }
    }

    $contadorTareas.textContent = `Tareas Pendientes: ${contadorPendientes}`;
  };

  const obtenerTareas = () => {
    const posibleLista = JSON.parse(localStorage.getItem(CLAVE_LOCALSTORAGE));
    if (posibleLista) {
      return posibleLista;
    } else {
      return [];
    }
  };

  const guardarTareas = () => {
    localStorage.setItem(CLAVE_LOCALSTORAGE, JSON.stringify(tareas));
  };

  const refrescarTareas = () => {
    $contenedorTareas.innerHTML = "";
    let contadorPendientes = 0;

    for (const [indice, tarea] of tareas.entries()) {
      const $enlaceParaEliminar = document.createElement("a");
      $enlaceParaEliminar.classList.add("enlace-eliminar");
      $enlaceParaEliminar.innerHTML = "&times;";
      $enlaceParaEliminar.href = "";
      $enlaceParaEliminar.onclick = (evento) => {
        evento.preventDefault();
        if (!confirm("¿Estás seguro/a que deseas eliminar la tarea?")) {
          return;
        }
        tareas.splice(indice, 1);
        guardarTareas(tareas);
        refrescarTareas();
      };

      const $checkbox = document.createElement("input");
      $checkbox.type = "checkbox";
      $checkbox.onchange = function () {
        if (this.checked) {
          tareas[indice].terminada = true;
        } else {
          tareas[indice].terminada = false;
        }
        guardarTareas(tareas);
        refrescarTareas();
      };

      const $span = document.createElement("span");
      $span.textContent = tarea.tarea;

      const $li = document.createElement("li");
      if (tarea.terminada) {
        $checkbox.checked = true;
        $span.classList.add("tachado");
      }
      $li.appendChild($checkbox);
      $li.appendChild($span);
      $li.appendChild($enlaceParaEliminar);
      $contenedorTareas.appendChild($li);

      if (!tarea.terminada) {
        contadorPendientes++;
      }
    }

    $contadorTareas.textContent = `Tareas Pendientes: ${contadorPendientes}`;
  };

  tareas = obtenerTareas();
  refrescarTareas();
});
