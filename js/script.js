const databaseURL = "https://landing-fc926-default-rtdb.firebaseio.com/votes.json";
const databaseAlbumsURL = "https://landing-fc926-default-rtdb.firebaseio.com/votesAlbums.json";
const databaseRegistroURL = "https://landing-fc926-default-rtdb.firebaseio.com/data.json";


//------------------------- VOTOS DE BANDAS ---------------------------
const sendVote = async (bandId) => {
    // Objeto de datos a enviar
    const voteData = {
        bandId: bandId,
        voteTime: new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' }),
    };

    try {
        // Enviar los datos a Firebase
        const response = await fetch(databaseURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(voteData), // Convertir el objeto a JSON
        });

        // Verificar si la solicitud fue exitosa
        if (!response.ok) {
            throw new Error("Error al enviar el voto.");
        }

        console.log(`Voto registrado para ${bandId}`);
        alert("¡Gracias por tu voto!");

    } catch (error) {
        console.error("Error al registrar el voto:", error);
        alert("Hubo un problema al registrar tu voto. Intenta más tarde.");
    }
};

//------------------------- VOTOS DE ALBUMNES ---------------------------
const sendAlbumVote = async (albumId) => {
    const voteData = {
        albumId: albumId, // Asegurar que el ID sea un string
        voteTime: new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' }),
    };

    try {
        const response = await fetch(databaseAlbumsURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(voteData),
        });

        if (!response.ok) throw new Error("Error al enviar el voto.");
        console.log(`Voto registrado para el álbum ${albumId}`);
        alert("¡Gracias por recomendar este álbum!");
        updateAlbumVotes();
    } catch (error) {
        console.error("Error al registrar el voto del álbum:", error);
    }
};

const Registrar = async (bandId) => {
    // Objeto de datos a enviar
    const voteData = {
        bandId: bandId,
        voteTime: new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' }),
    };

    try {
        // Enviar los datos a Firebase
        const response = await fetch(databaseURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(voteData), // Convertir el objeto a JSON
        });

        // Verificar si la solicitud fue exitosa
        if (!response.ok) {
            throw new Error("Error al enviar el voto.");
        }

        console.log(`Voto registrado para ${bandId}`);
        alert("¡Gracias por tu voto!");

    } catch (error) {
        console.error("Error al registrar el voto:", error);
        alert("Hubo un problema al registrar tu voto. Intenta más tarde.");
    }
};

//------------------------- REGISTROS ---------------------------

const registrarFormulario = async () => {
    const form = document.getElementById("rockForm");
    const responseMessage = document.getElementById("responseMessage");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evitar el envío por defecto del formulario

        // Obtener los valores del formulario
        const name = document.getElementById("inputName").value.trim();
        const email = document.getElementById("inputEmail").value.trim();
        const favoriteBand = document.getElementById("inputBand").value;

        // Crear el objeto de datos
        const formData = {
            name,
            email,
            favoriteBand,
            joinTime: new Date().toLocaleString("es-CO", { timeZone: "America/Guayaquil" }),
        };

        try {
            // Enviar los datos a Firebase
            const response = await fetch(databaseRegistroURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            // Verificar si la solicitud fue exitosa
            if (!response.ok) throw new Error("Error al enviar los datos del formulario.");

            console.log("Formulario registrado:", formData);
            responseMessage.innerHTML = `
                <div class="alert alert-success">
                    ¡Gracias, ${name}! Te has unido a nuestra comunidad exitosamente.
                </div>`;
            form.reset(); // Limpiar el formulario
        } catch (error) {
            console.error("Error al registrar el formulario:", error);
            responseMessage.innerHTML = `
                <div class="alert alert-danger">
                    Hubo un problema al unirte a la comunidad. Intenta más tarde.
                </div>`;
        }
    });
};

// Llamar a la función al cargar el DOM
document.addEventListener("DOMContentLoaded", registrarFormulario);


//------------------------- CARGAR/ACTUALIZAR DE BANDAS ---------------------------

const updateTopBands = async () => {
    try {
        // Realizar una solicitud GET a Firebase
        const response = await fetch(databaseURL, {
            method: 'GET'
        });

        if (!response.ok) {
            alert('Hemos experimentado un error al obtener el conteo de votos de bandas. ¡Vuelve pronto!'); // Maneja el error con un mensaje
        }

        // Convierte la respuesta en formato JSON
        const data = await response.json();

        if (!data) {
            console.warn("No hay datos de bandas en la base de datos.");
            return; // Salir si no hay datos
        }

        const voteCounts = {};

        // Votos x Banda
        for (let key in data) {
            const { bandId } = data[key];
            voteCounts[bandId] = (voteCounts[bandId] || 0) + 1;
        }

        // Votos a arreglo
        const sortedBands = Object.entries(voteCounts)
            .sort(([, votesA], [, votesB]) => votesB - votesA) // Ordenar por votos
            .slice(0, 10); // # De los resultados para mostrar, no te olvides :c

        // Generar filas top 5
        const topBandsList = document.getElementById("top-bands-list");
        topBandsList.innerHTML = ""; // Limpiar

        sortedBands.forEach(([bandId, votes], index) => {
            const row = `
          <tr>
            <th scope="row">${index + 1}</th>
            <td>${bandId}</td>
            <td>${votes}</td>
          </tr>
        `;
            topBandsList.innerHTML += row;
        });

        console.log("Top 5 actualizado:", sortedBands);
    } catch (error) {
        console.error("Error al actualizar el Top 10:", error);
    }
};

//------------------------- CARGAR/ACTUALIZAR DE ALBUMNES ---------------------------

const updateTopAlbums = async () => {
    try {
        // Realizar una solicitud GET a Firebase
        const response = await fetch(databaseAlbumsURL, {
            method: 'GET'
        });

        if (!response.ok) {
            alert('Hemos experimentado un error al obtener el conteo de votos de Albumnes. ¡Vuelve pronto!'); // Maneja el error con un mensaje
        }

        const data = await response.json();

        if (!data) {
            console.warn("No hay datos de álbumes en la base de datos.");
            return; // Salir si no hay datos
        }

        const voteCounts = {};

        // Contar votos por álbum
        for (let key in data) {
            const { albumId } = data[key];
            voteCounts[albumId] = (voteCounts[albumId] || 0) + 1;
        }

        // Ordenar votos y tomar los 20 mejores
        const sortedAlbums = Object.entries(voteCounts)
            .sort(([, votesA], [, votesB]) => votesB - votesA) // Ordenar por votos descendente
            .slice(0, 20); // Mostrar los 20 mejores

        // Generar las filas para el Top 20
        const topAlbumsList = document.getElementById("top-albums-list");
        topAlbumsList.innerHTML = ""; // Limpiar contenido anterior

        sortedAlbums.forEach(([albumId, votes], index) => {
            const row = `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${albumId}</td>
                    <td>${votes}</td>
                </tr>
            `;
            topAlbumsList.innerHTML += row;
        });

        console.log("Top 20 álbumes actualizado:", sortedAlbums);
    } catch (error) {
        console.error("Error al actualizar el Top 20 álbumes:", error);
        alert("Hubo un problema al obtener el Top 20 de álbumes. Por favor, intenta más tarde.");
    }
};






//---------------------------------------------------------
const ready = () => {
    console.log("DOM cargado.");

    const voteButtons = document.querySelectorAll("button.vote-btn");

    // Lógica de votos Bandas
    voteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const bandId = button.dataset.id;

            console.log(`Band ID capturado: ${bandId}`);

            sendVote(bandId);

            // Deshabilitar el botón click
            button.disabled = true;
            button.textContent = "✔  Recomendado";
            button.classList.add("btn-success"); // Boton éxito
            button.classList.remove("btn-outline-danger"); // Quitar original
        });
    });

    const voteAlbumsButtons = document.querySelectorAll(".recommend-btn");

    // Lógica de votos
    voteAlbumsButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const albumId = button.dataset.id;

            console.log(`Band ID capturado: ${albumId}`);

            sendAlbumVote(albumId);

            // Deshabilitar el botón click
            button.disabled = true;
            button.textContent = "✔  Recomendado";
            button.classList.add("btn-success"); // Boton éxito
            button.classList.remove("btn-outline-danger"); // Quitar original
        });
    });

};


const loaded = () => {
    console.log("Todos los recursos están cargados.");

    updateTopBands();
    updateTopAlbums();
};


// Eventos DOMContentLoaded y load
window.addEventListener("DOMContentLoaded", ready);
window.addEventListener("load", loaded);



//--------------------- REPRODUCTOR MUSICAL ---------------------------

// Reproductor de audio y su fuente
const audioPlayer = document.getElementById("audioPlayer");
const audioSource = document.getElementById("audioSource");

// Agregar eventos a las canciones
document.querySelectorAll(".music-item").forEach((item) => {
    item.addEventListener("click", () => {
        // Verificar si el atributo data-src existe
        const audioSrc = item.getAttribute("data-src");
        console.log(`chola ${audioSrc}`);

        if (audioSrc) {
            // Cambia fuente audio y reproducir
            audioSource.src = audioSrc;
            audioPlayer.load(); // Carga
            audioPlayer.play(); // Reproduce

            // Resaltar la canción activa
            document.querySelectorAll(".music-item").forEach((el) => {
                el.classList.remove("active");
            });
            item.classList.add("active");

            console.log(`Reproduciendo: ${audioSrc}`);
        } else {
            console.error("La canción no tiene un archivo de audio asociado.");
        }
    });
});

document.addEventListener("scroll", () => {
    const audioPlayer = document.querySelector(".audio-player");
    const musicSection = document.querySelector("#albums-60-70");
    const rect = musicSection.getBoundingClientRect();

    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        audioPlayer.style.display = "block";
    } else {
        audioPlayer.style.display = "none";
    }
});
