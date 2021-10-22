const formulario = document.getElementById('formulario')
const listaTareas = document.getElementById('lista-tareas')
const template = document.getElementById('template').content
const fragment = document.createDocumentFragment()
const barraprogreso = document.getElementById('barrita')
const numtareas = document.getElementById('ntareas')
const numporcentaje = document.getElementById('nporcentaje')
const checkbox1 = document.getElementById('botonradio1')
const checkbox2 = document.getElementById('botonradio2')


let tareas = {}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('tareas')) {
        tareas = JSON.parse(localStorage.getItem('tareas'))
    }
    cargarbarra()
    pintarTareas()
})

listaTareas.addEventListener('click', (e) => { btnAccion(e) })
checkbox1.addEventListener("change", validaCheckbox, false);
checkbox2.addEventListener("change", validaCheckbox, false);

formulario.addEventListener('submit', e => {
    e.preventDefault()
    setTarea(e)
})

const setTarea = e => {
    const texto = e.target.querySelector('input').value

    if (texto.trim() === '') {
        alert("Agrega una tarea: campo vacio!")
        return
    }
    const tarea = {
        id: Date.now(),
        texto: texto,
        estado: false
    }

    alert("Tarea agregada!")
    tareas[tarea.id] = tarea
    cargarbarra()
    pintarTareas()

    formulario.reset()
    e.target.querySelector('input').focus()
}

const pintarTareas = () => {

    localStorage.setItem('tareas', JSON.stringify(tareas))

    if (Object.values(tareas).length === 0) {
        listaTareas.innerHTML = `
        <div class="alert alert-dark text-center">
        Sin tareas pendientes
        <i class="tasks icon"></i>
        </div>
        `
        return
    }

    listaTareas.innerHTML = ''

    Object.values(tareas).forEach(tarea => {

        const clone = template.cloneNode(true)
        clone.querySelector('p').textContent = tarea.texto
        if (tarea.estado) {
            clone.querySelectorAll('.fas')[0].classList.replace('fa-check-circle', 'fa-undo-alt')
            clone.querySelector('.alert').classList.replace('alert-warning', 'alert-primary')
            clone.querySelector('p').style.textDecoration = 'line-through'
        }

        if(!checkbox1.checked && !checkbox2.checked){
        clone.querySelectorAll('.fas')[0].dataset.id = tarea.id
        clone.querySelectorAll('.fas')[1].dataset.id = tarea.id
        fragment.appendChild(clone)
        }

        if (tarea.estado && checkbox1.checked) {
        clone.querySelectorAll('.fas')[0].dataset.id = tarea.id
        clone.querySelectorAll('.fas')[1].dataset.id = tarea.id
        fragment.appendChild(clone)

        } else if(!tarea.estado && checkbox2.checked){
            clone.querySelectorAll('.fas')[0].dataset.id = tarea.id
            clone.querySelectorAll('.fas')[1].dataset.id = tarea.id
            fragment.appendChild(clone)

        }

    })
    listaTareas.appendChild(fragment)
}

const btnAccion = e => {
    if (e.target.classList.contains('fa-check-circle')) {
        tareas[e.target.dataset.id].estado = true
        pintarTareas()
        cargarbarra()
    }

    if (e.target.classList.contains('fa-minus-circle')) {
        delete tareas[e.target.dataset.id]
        pintarTareas()
        cargarbarra()
    }

    if (e.target.classList.contains('fa-undo-alt')) {
        tareas[e.target.dataset.id].estado = false
        pintarTareas()
        cargarbarra()
    }

    e.stopPropagation()
}

const cargarbarra = () => {
    let tamañocompletas = 0;
    let tamañoincompletas = 0;
    let totaltareas = Object.values(tareas).length

    Object.values(tareas).forEach(tarea => {
        if (!tarea.estado) {
            tamañoincompletas++;

        }
        else {
            tamañocompletas++;

        }
        console.log();
    })


    if (totaltareas === 0) {
        porcentaje = 100;
        barraprogreso.style.width = porcentaje + '%';
        numtareas.innerHTML = `

        `
        numporcentaje.innerHTML = `
        0%
        `
    } else {
        porcentaje = Number.parseInt((tamañocompletas * 100) / totaltareas);
        numtareas.innerHTML = `${tamañocompletas} de ${totaltareas} tareas completadas`
        numporcentaje.innerHTML = `${porcentaje}%`
    }

    barraprogreso.style.width = porcentaje + '%';
}


function validaCheckbox() {
    let verificar1 = checkbox1.checked;
    let verificar2 = checkbox2.checked;

    Object.values(tareas).forEach(tarea => {
        if (tarea.estado && verificar1) {
            checkbox2.disabled=true;
        
        }
        if (!verificar1) {
            checkbox2.disabled=false;
        
        }

        if (tarea.estado && verificar2) {
            checkbox1.disabled=true;
        
        }
        if (!verificar2) {
            checkbox1.disabled=false;
        
        }

        if (!tarea.estado && verificar1) {
            checkbox2.disabled=true;
        
        }
        if (!verificar1) {
            checkbox2.disabled=false;
        
        }

        if (!tarea.estado && verificar2) {
            checkbox1.disabled=true;
        
        }
        if (!verificar2) {
            checkbox1.disabled=false;
        
        }
        pintarTareas()
    })

}



