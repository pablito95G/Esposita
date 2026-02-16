// Variables de estado
let noClicks = 0;
let movimientos = 0;
const mensajesNo = [
    "",                 // 1
    "",                 // 2
    "",                 // 3
    "¿Estás segura? 💔", // 4
    "¿Muy segura? 😢",   // 5
    "¿Segurísima? 🥺",   // 6
    "..."                // 7
];

document.addEventListener('DOMContentLoaded', function() {
    // 1. Iniciar la lluvia apenas carga la página
    iniciarLluviaCorazones();
    
    // 2. Referencias a elementos del DOM
    const btnSi = document.getElementById('btnSi');
    const btnNo = document.getElementById('btnNo');
    const mensajeNo = document.getElementById('mensajeNo');
    const fase1 = document.getElementById('fase1');
    const fase2 = document.getElementById('fase2');
    const fase3 = document.getElementById('fase3');
    const btnSiguiente = document.getElementById('btnSiguiente');
    
    // --- LÓGICA BOTÓN SÍ ---
    btnSi.addEventListener('click', function() {
        fase1.classList.remove('activa');
        fase2.classList.add('activa');
        cargarRecuerdos(); // Carga las fotos R1-R6
    });
    
    // --- LÓGICA BOTÓN NO (Compleja) ---
    btnNo.addEventListener('click', function() {
        if (noClicks < mensajesNo.length) {
            
            // FASE A: Primeras 3 veces solo se mueve
            if (movimientos < 3) {
                moverBotonNo();
                movimientos++;
                mensajeNo.textContent = ""; 
                
                // Si es el 3er click, prepárate para regresar
                if (movimientos === 3) {
                    setTimeout(() => {
                        // Regresa a su posición original relativa
                        btnNo.style.position = 'relative';
                        btnNo.style.left = 'auto';
                        btnNo.style.top = 'auto';
                    }, 500);
                }
            } 
            // FASE B: A partir del 4to click, mensajes y crecimiento del SI
            else {
                // Mostrar mensaje dramático
                mensajeNo.textContent = mensajesNo[noClicks];
                
                // Agrandar botón SÍ
                let estiloSi = window.getComputedStyle(btnSi);
                let fontSize = parseFloat(estiloSi.fontSize);
                let paddingV = parseFloat(estiloSi.paddingTop);
                let paddingH = parseFloat(estiloSi.paddingRight);
                
                btnSi.style.fontSize = (fontSize * 1.3) + 'px';
                btnSi.style.padding = (paddingV * 1.2) + 'px ' + (paddingH * 1.3) + 'px';
                
                // Asegurar que el NO esté quieto en el centro ahora
                btnNo.style.position = 'relative';
                btnNo.style.left = 'auto';
                btnNo.style.top = 'auto';
            }
            
            noClicks++;
            
            // FASE C: Final, desaparece el NO
            if (noClicks === mensajesNo.length) {
                btnNo.style.display = 'none';
                mensajeNo.textContent = "¡Ya no hay opción! ";
                // Botón SÍ gigante
                btnSi.style.fontSize = "3rem";
                btnSi.style.padding = "30px 80px";
                btnSi.classList.add("gigante");
            }
        }
    });
    
    // --- PASAR A FASE 3 (CARTA) ---
    btnSiguiente.addEventListener('click', function() {
        fase2.classList.remove('activa');
        fase3.classList.add('activa');
    });
});

// Función para mover el botón NO a un lugar aleatorio seguro
function moverBotonNo() {
    const btnNo = document.getElementById('btnNo');
    
    // Calcular límites de la pantalla (restamos el tamaño del botón)
    const anchoPantalla = window.innerWidth - 100;
    const altoPantalla = window.innerHeight - 100;
    
    const nuevoX = Math.random() * anchoPantalla;
    const nuevoY = Math.random() * altoPantalla;
    
    btnNo.style.position = 'fixed'; // Fixed para que se mueva por toda la ventana
    btnNo.style.left = nuevoX + 'px';
    btnNo.style.top = nuevoY + 'px';
}

// Función para cargar las fotos R1 a R6
function cargarRecuerdos() {
    const collage = document.getElementById('collage');
    collage.innerHTML = ''; // Limpiar por si acaso
    
    for (let i = 1; i <= 6; i++) {
        const img = document.createElement('img');
        // Usamos .jpeg porque así sale en tus capturas
        img.src = `img/M${i}.jpeg`; 
        img.alt = `Recuerdo hermoso ${i}`;
        
        // Animación escalonada (una tras otra)
        img.style.animationDelay = (i * 0.2) + 's';
        
        // Si falla la imagen (por si es jpg o png), intentar cargar png
        img.onerror = function() {
            this.src = `img/M${i}.jpg`; // Intento alternativo
        };
        
        collage.appendChild(img);
    }
}

// Función de Lluvia de Corazones
function iniciarLluviaCorazones() {
    const contenedor = document.getElementById('lluvia');
    const imagenes = ['1.png', '2.png']; // Nombres exactos en la carpeta img

    // Crear un corazón cada 300ms infinitamente
    setInterval(() => {
        const corazon = document.createElement('div');
        corazon.classList.add('corazon');
        
        // Elegir imagen random
        const imgRandom = imagenes[Math.floor(Math.random() * imagenes.length)];
        corazon.style.backgroundImage = `url('img/${imgRandom}')`;
        
        // Posición horizontal aleatoria (0 a 100vw)
        corazon.style.left = Math.random() * 100 + 'vw';
        
        // Tamaño aleatorio (entre 20px y 50px)
        const tamaño = Math.random() * 30 + 20;
        corazon.style.width = tamaño + 'px';
        corazon.style.height = tamaño + 'px';
        
        // Velocidad de caída aleatoria (entre 3s y 6s)
        const duracion = Math.random() * 3 + 3;
        corazon.style.animation = `caida ${duracion}s linear forwards`;
        
        contenedor.appendChild(corazon);
        
        // Eliminar el elemento del DOM al terminar para no saturar memoria
        setTimeout(() => {
            corazon.remove();
        }, duracion * 1000);
        
    }, 300);
}

// Inyectar la animación de caída en CSS dinámicamente
const estiloAnimacion = document.createElement('style');
estiloAnimacion.innerHTML = `
    @keyframes caida {
        0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
        100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
    }
`;
document.head.appendChild(estiloAnimacion);