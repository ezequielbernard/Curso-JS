let clientName = "";
const returnUserName = () => {
  return clientName.charAt(0).toUpperCase() + clientName.slice(1);
};

const promptClientName = () => {
  while (clientName === "") {
    clientName = prompt("Indique su usuario para ingresar en la aplicación");

    if (clientName !== "") {
      showToDoList();
    } else {
      alert("Error! Debe completar el nombre de usuario");
    }
  }
};

const showToDoList = () => {
  const greetingElement = document.getElementById("greeting");
  greetingElement.textContent = returnUserName();
};

promptClientName();

const CLAVE_LOCALSTORAGE = "listado_tareas";

document.addEventListener("DOMContentLoaded", () => {
  let tareas = [];
  let tareasFiltradas = [];
  const $contenedorTareas = document.querySelector("#contenedorTareas");
  const $contenedorTareasFinalizadas = document.querySelector("#contenedorTareasFinalizadas");
  const $btnGuardarTarea = document.querySelector("#AgregarTarea");
  const $NuevaTarea = document.querySelector("#NuevaTarea");
  const $contadorTareas = document.querySelector("#contadorTareas");
  const $contadorTareasFinalizadas = document.querySelector("#contadorTareasFinalizadas");
  const $buscarTarea = document.querySelector("#BuscarTarea");

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
    refrescarTareas();
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
    const tareasPendientes = tareas.filter((tarea) => !tarea.terminada);
    const tareasFinalizadas = tareas.filter((tarea) => tarea.terminada);
    localStorage.setItem(CLAVE_LOCALSTORAGE, JSON.stringify(tareasPendientes));
    localStorage.setItem("tareas_finalizadas", JSON.stringify(tareasFinalizadas));
  };

  const filtrarTareas = (tareas, filtro) => {
    return tareas.filter((tarea) => tarea.tarea.toLowerCase().includes(filtro));
  };
  const eliminarTarea = (indice) => {
    if (!confirm("¿Estás seguro/a que deseas eliminar la tarea?")) {
      return;
    }
    tareas.splice(indice, 1);
    guardarTareas();
    refrescarTareas();
  };
  
  const renderizarTareas = (tareas, $contenedorTareas, $contenedorTareasFinalizadas) => {
    $contenedorTareas.innerHTML = "";
    $contenedorTareasFinalizadas.innerHTML = "";
    
    for (const [indice, tarea] of tareas.entries()) {
      const $enlaceParaEliminar = document.createElement("a");
      $enlaceParaEliminar.classList.add("enlace-eliminar");
      $enlaceParaEliminar.innerHTML = "&times;";
      $enlaceParaEliminar.href = "";
      $enlaceParaEliminar.onclick = (evento) => {
        evento.preventDefault();
        eliminarTarea(indice);
      };
  
      const $checkbox = document.createElement("input");
      $checkbox.type = "checkbox";
      $checkbox.onchange = function () {
        tarea.terminada = this.checked;
        guardarTareas();
        refrescarTareas();
      };
  
      const $span = document.createElement("span");
      $span.textContent = tarea.tarea;
  
      const $li = document.createElement("li");
      $li.appendChild($checkbox);
      $li.appendChild($span);
      $li.appendChild($enlaceParaEliminar);
  
      if (tarea.terminada) {
        $checkbox.checked = true;
        $span.classList.add("tachado");
        $contenedorTareasFinalizadas.appendChild($li);
      } else {
        $contenedorTareas.appendChild($li);
      }
    }
  };
  

  const refrescarTareas = () => {
    const filtro = $buscarTarea.value.toLowerCase().trim();
    tareasFiltradas = filtrarTareas(tareas, filtro);

    $contadorTareas.textContent = `Tareas Pendientes: ${tareas.filter(
      (tarea) => !tarea.terminada
    ).length}`;
    $contadorTareasFinalizadas.textContent = `Tareas Finalizadas: ${tareas.filter(
      (tarea) => tarea.terminada
    ).length}`;

    renderizarTareas(tareasFiltradas, $contenedorTareas, $contenedorTareasFinalizadas);
  };

  tareas = obtenerTareas();
  refrescarTareas();
});
