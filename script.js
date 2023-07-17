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

  const refrescarTareas = () => {
    $contenedorTareas.innerHTML = "";
    $contenedorTareasFinalizadas.innerHTML = "";
    let contadorPendientes = 0;
    let contadorFinalizadas = 0;
    const filtro = $buscarTarea.value.toLowerCase().trim();

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
        guardarTareas();
        refrescarTareas();
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
        if (tarea.tarea.toLowerCase().includes(filtro)) {
          $checkbox.checked = true;
          $span.classList.add("tachado");
          $contenedorTareasFinalizadas.appendChild($li);
          contadorFinalizadas++;
        }
      } else {
        if (tarea.tarea.toLowerCase().includes(filtro)) {
          $contenedorTareas.appendChild($li);
          contadorPendientes++;
        }
      }
    }

    $contadorTareas.textContent = `Tareas Pendientes: ${contadorPendientes}`;
    $contadorTareasFinalizadas.textContent = `Tareas Finalizadas: ${contadorFinalizadas}`;
  };

  tareas = obtenerTareas();
  refrescarTareas();
});
