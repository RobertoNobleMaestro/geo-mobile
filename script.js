// Inicialización del mapa
const map = L.map('map').setView([0, 0], 13); // Inicializamos el mapa centrado en lat, lng 0,0 (esto se actualizará con la ubicación del usuario)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Geolocalización del usuario
let posUsuario = { lat: 0, lng: 0 };

navigator.geolocation.getCurrentPosition(function (position) {
  posUsuario.lat = position.coords.latitude;
  posUsuario.lng = position.coords.longitude;
  map.setView([posUsuario.lat, posUsuario.lng], 13);
  
  L.marker([posUsuario.lat, posUsuario.lng]).addTo(map)
    .bindPopup('Tu ubicación')
    .openPopup();
});

// Variable para almacenar rutas activas
let rutasActivas = [];

// Función para calcular y mostrar la ruta
function calcularRuta(latMarcador, lngMarcador) {
  // Limpiar rutas previas
  rutasActivas.forEach(r => map.removeControl(r));

  const controlRuta = L.Routing.control({
    waypoints: [
      L.latLng(posUsuario.lat, posUsuario.lng),
      L.latLng(latMarcador, lngMarcador)
    ],
    routeWhileDragging: true,
    show: false
  }).addTo(map);

  rutasActivas.push(controlRuta);
}

// Función para mostrar el panel móvil
function mostrarPanelRuta(latLngMarcador) {
  const panel = document.getElementById('panel-ruta');
  panel.style.transform = 'translateX(0)';
  
  // Actualizar datos en el panel
  const nombreLugar = "Destino"; // Aquí se puede personalizar según el marcador
  document.getElementById('nombre-lugar').textContent = nombreLugar;
  document.getElementById('distancia-tiempo').textContent = "Distancia: 10 km | Tiempo: 15 min"; // Datos ficticios

  // Botón "Cerrar"
  document.getElementById('cerrar-panel').onclick = () => {
    panel.style.transform = 'translateX(100%)';
    rutasActivas.forEach(r => map.removeControl(r));
  };
}

// Añadir marcador y manejar eventos táctiles (long press)
const marcador = L.marker([posUsuario.lat, posUsuario.lng]).addTo(map);

marcador.on('contextmenu', (e) => {
  mostrarPanelRuta(e.latlng);
});

// Función para centrar el mapa en la ubicación del usuario
function centrarEnUsuario() {
  map.setView([posUsuario.lat, posUsuario.lng], 13);
  if ("vibrate" in navigator) navigator.vibrate(50); // Feedback táctil
}

// Configuración para geolocalización con precisión alta
const opcionesGPS = {
  enableHighAccuracy: true, // Usar GPS del dispositivo (no solo WiFi)
  timeout: 5000,
  maximumAge: 0
};

// Actualización en tiempo real de la ubicación
navigator.geolocation.watchPosition(function(position) {
  posUsuario.lat = position.coords.latitude;
  posUsuario.lng = position.coords.longitude;
}, function(error) {
  console.error(error);
}, opcionesGPS);

document.getElementById('centrar-usuario').onclick = centrarEnUsuario;
