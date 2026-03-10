const apiKey = "3199f0456362215e9a696b005dc7b5c9";

window.onload = () => {
    detectarLocalizacao();
};

function detectarLocalizacao() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;

                buscarClimaCoords(lat, lon);
                buscarPrevisaoCoords(lat, lon);
            },
            () => {
                console.log("Localização não permitida");
            }
        );
    }
}

function buscarCidade() {
    const city = document.getElementById("cityInput").value.trim();

    if (!city) return;

    buscarClimaCidade(city);
    buscarPrevisaoCidade(city);
}

function buscarClimaCidade(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`)
        .then(r => r.json())
        .then(data => {
            if (data.cod !== 200) {
                alert("Cidade não encontrada");
                return;
            }
            mostrarClima(data);
        })
        .catch(err => console.error(err));
}

function buscarClimaCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`)
        .then(r => r.json())
        .then(data => mostrarClima(data))
        .catch(err => console.error(err));
}

function mostrarClima(data) {
    document.getElementById("weather").innerHTML = `
        <div class="card">
            <h2>${data.name}</h2>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
            <p>${data.weather[0].description}</p>
            <h1>${Math.round(data.main.temp)}°C</h1>
        </div>
    `;

    animarClima(data.weather[0].main);
}

function buscarPrevisaoCidade(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`)
        .then(r => r.json())
        .then(data => mostrarPrevisao(data))
        .catch(err => console.error(err));
}

function buscarPrevisaoCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`)
        .then(r => r.json())
        .then(data => mostrarPrevisao(data))
        .catch(err => console.error(err));
}

function mostrarPrevisao(data) {
    if (!data.list) return;

    let html = '<div class="forecast">';

    for (let i = 0; i < 5; i++) {
        const item = data.list[i * 8];

        if (!item) continue;

        html += `
            <div class="day">
                <p>${new Date(item.dt_txt).toLocaleDateString()}</p>
                <p>${Math.round(item.main.temp)}°C</p>
            </div>
        `;
    }

    html += '</div>';

    document.getElementById("forecast").innerHTML = html;
}

function animarClima(tipo) {
    const anim = document.getElementById("animation");
    anim.innerHTML = "";

    if (tipo === "Clear") {
        anim.innerHTML = '<div class="sun"></div>';
    }

    if (tipo === "Clouds") {
        anim.innerHTML = '<div class="cloud"></div>';
    }

    if (tipo === "Rain") {
        for (let i = 0; i < 80; i++) {
            const drop = document.createElement("div");
            drop.className = "rain";
            drop.style.left = Math.random() * 100 + "%";
            drop.style.animationDuration = (Math.random() * 1 + 0.5) + "s";
            anim.appendChild(drop);
        }
    }

    if (tipo === "Snow") {
        for (let i = 0; i < 50; i++) {
            const flake = document.createElement("div");
            flake.className = "snow";
            flake.innerHTML = "❄";
            flake.style.left = Math.random() * 100 + "%";
            anim.appendChild(flake);
        }
    }
}

document.getElementById("darkMode").onclick = () => {
    document.body.classList.toggle("dark");
};