let peliculasArray = [];
let buscarInput = document.getElementById('inputBuscar');
let botonBuscar = document.getElementById('btnBuscar');
let offcanvasElement = null; 

document.addEventListener('DOMContentLoaded', () => {
    fetch('https://japceibal.github.io/japflix_api/movies-data.json')
        .then(response => response.json())
        .then(data => {
            peliculasArray = data;
            console.log('Películas subidas, sin mostrarlo al usuario', peliculasArray);
        })
        .catch(error => {
            console.error('Error con las películas subidas', error);
        });
});

botonBuscar.addEventListener('click', () => {
    let buscarTerm = buscarInput.value.toLowerCase();
    
    if (buscarTerm) {
        let filterPeli = peliculasArray.filter(peli => 
            peli.title.toLowerCase().includes(buscarTerm) || 
            peli.genres.some(genre => genre.name.toLowerCase().includes(buscarTerm)) ||
            peli.tagline.toLowerCase().includes(buscarTerm) || 
            peli.overview.toLowerCase().includes(buscarTerm)
        );
        mostrarPeli(filterPeli);  
    } 
});

function mostrarPeli(filterPeli) {
    let lista = document.getElementById('lista');
    lista.innerHTML = ''; 

    filterPeli.forEach(peli => {
        let li = crearElemento('li', { className: 'list-group-item' });
        let textContainer = crearElemento('div', { className: 'text-container' });
        let title = crearElemento('h5', { textContent: peli.title });
        let tagline = crearElemento('p', { textContent: peli.tagline });
        textContainer.append(title, tagline);
        
        let rating = crearElemento('div', { className: 'rating-container' });
        rating.appendChild(puntuacionEstrella(peli.vote_average));

        li.append(textContainer, rating);
        li.addEventListener('click', () => mostrarDetallesPelicula(peli)); 

        lista.appendChild(li);
    });
}

function crearElemento(tag, { className, textContent } = {}) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (textContent) el.textContent = textContent;
    return el;
}

function puntuacionEstrella(voteAverage) {
    let estrellaCont = document.createElement('div');
    estrellaCont.className = 'star-rating';
    
    for (let i = 1; i <= 5; i++) {
        let estrella = document.createElement('span');
        estrella.classList.add('fa', 'fa-star');
        if (i <= Math.round(voteAverage / 2)) {
            estrella.classList.add('checked');
        }
        estrellaCont.appendChild(estrella);
    }
    
    return estrellaCont;
}

function crearOffcanvas() {
    const offcanvasElement = document.createElement('div');
    configurarOffcanvas(offcanvasElement);
    document.body.appendChild(offcanvasElement);
}

function configurarOffcanvas(element) {
    element.className = 'offcanvas offcanvas-top';
    element.id = 'detallePeli';
}


function mostrarDetallesPelicula(peli) {
    if (!offcanvasElement) {
        crearOffcanvas();
    } else {
        offcanvasElement.innerHTML = ''; 
    }

    offcanvasElement.innerHTML = generarContenidoOffcanvas(peli);
    
    const detallePeli = new bootstrap.Offcanvas(offcanvasElement);
    detallePeli.show();
}

function generarContenidoOffcanvas(peli) {
    return `
        <div class="offcanvas-header">
            <h5 class="offcanvas-title">${peli.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body">
            <p>${peli.overview}</p>
            <p><strong>Géneros:</strong> ${peli.genres.map(genre => genre.name).join(', ')}</p>
            <div class="dropdown">
                <button class="btn btn-outline-secondary" type="button" data-bs-toggle="dropdown">
                    More
                </button>
                <ul class="dropdown-menu">
                    <li>Año: ${peli.release_date.split('-')[0]}</li>
                    <li>Duración: ${peli.runtime} minutos</li>
                    <li>Presupuesto: $${peli.budget.toLocaleString()}</li>
                    <li>Ingresos: $${peli.revenue.toLocaleString()}</li>
                </ul>
            </div>
        </div>
    `;
}
