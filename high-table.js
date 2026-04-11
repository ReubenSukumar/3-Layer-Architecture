const locations = {
  rome: {
    place: "Rome",
    lat: 41.9028,
    lng: 12.4964
  },
  tokyo: {
    place: "Tokyo",
    lat: 35.6762,
    lng: 139.6503
  },
  paris: {
    place: "Paris",
    lat: 48.8566,
    lng: 2.3522
  },
  newyork: {
    place: "New York",
    lat: 40.7128,
    lng: -74.0060
  },
  london: {
    place: "London",
    lat: 51.5074,
    lng: -0.1278
  },
  dubai: {
    place: "Dubai",
    lat: 25.2048,
    lng: 55.2708
  }
};

const placeEl = document.getElementById("place");
const latitudeEl = document.getElementById("latitude");
const longitudeEl = document.getElementById("longitude");
const locationButtons = document.querySelectorAll(".location-card");
const globeContainer = document.getElementById("globeViz");

const markerData = [
  {
    lat: locations.rome.lat,
    lng: locations.rome.lng,
    size: 0.35,
    color: "#d4af37"
  }
];

const world = Globe()(globeContainer)
  .globeImageUrl("//unpkg.com/three-globe/example/img/earth-dark.jpg")
  .backgroundColor("rgba(0,0,0,0)")
  .showAtmosphere(true)
  .atmosphereColor("#7a0f18")
  .atmosphereAltitude(0.18)
  .pointOfView({ lat: 18, lng: 8, altitude: 1.9 }, 0)
  .pointsData(markerData)
  .pointAltitude("size")
  .pointRadius(0.45)
  .pointColor("color");

world.controls().autoRotate = true;
world.controls().autoRotateSpeed = 0.45;
world.controls().enablePan = false;
world.controls().minDistance = 180;
world.controls().maxDistance = 300;

function updateInfo(locationKey) {
  const selected = locations[locationKey];

  placeEl.textContent = selected.place;
  latitudeEl.textContent = selected.lat.toFixed(4);
  longitudeEl.textContent = selected.lng.toFixed(4);

  markerData[0] = {
    lat: selected.lat,
    lng: selected.lng,
    size: 0.35,
    color: "#d4af37"
  };

  world.pointsData([...markerData]);
  world.pointOfView(
    {
      lat: selected.lat,
      lng: selected.lng,
      altitude: 1.8
    },
    1400
  );
}

locationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const locationKey = button.dataset.location;

    locationButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    updateInfo(locationKey);
  });
});

window.addEventListener("resize", () => {
  world.width(globeContainer.offsetWidth);
  world.height(globeContainer.offsetHeight);
});

world.width(globeContainer.offsetWidth);
world.height(globeContainer.offsetHeight);
updateInfo("rome");
