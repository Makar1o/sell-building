document.addEventListener("DOMContentLoaded", function () {
  // Initialize the map with EPAM Kyiv coordinates
  const map = L.map("map").setView([50.4501, 30.5234], 15);

  // Use OpenStreetMap with custom styling
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    detectRetina: true,
  }).addTo(map);

  // Custom EPAM icon
  const epamIcon = L.icon({
    iconUrl: "https://cdn.epam.com/static/images/logo/epam-logo.svg",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  // Add EPAM marker with custom popup
  L.marker([50.4501, 30.5234], { icon: epamIcon })
    .addTo(map)
    .bindPopup(
      `
      <div style="font-family: 'Nunito', sans-serif; padding: 1rem;">
        <h3 style="margin: 0 0 0.5rem 0; color: #012a41;">EPAM Kyiv Campus</h3>
        <p style="margin: 0.3rem 0;">123 Innovation Street</p>
        <p style="margin: 0.3rem 0;">Kyiv, Ukraine</p>
        <a href="https://maps.google.com?q=50.4501,30.5234" 
           style="color: #012a41; text-decoration: underline;">
          Get Directions
        </a>
      </div>
    `
    )
    .openPopup();

  // Add custom controls
  const zoomControl = L.control
    .zoom({
      position: "topright",
    })
    .addTo(map);
});
