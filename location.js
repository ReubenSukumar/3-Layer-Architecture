const placeEl = document.getElementById("place");
const latitudeEl = document.getElementById("latitude");
const longitudeEl = document.getElementById("longitude");
const excommunicadoAtEl = document.getElementById("excommunicadoAt");
const userGridEl = document.getElementById("userGrid");
const globeContainer = document.getElementById("globeViz");

let users = [];
let selectedUserId = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const markerData = [
  {
    lat: 0,
    lng: 0,
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

function formatDate(dateString) {
  const parsed = new Date(dateString);

  if (Number.isNaN(parsed.getTime())) {
    return "Unknown";
  }

  return parsed.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function updateInfo(user) {
  placeEl.textContent = user.name;
  latitudeEl.textContent = Number(user.latitude).toFixed(4);
  longitudeEl.textContent = Number(user.longitude).toFixed(4);
  excommunicadoAtEl.textContent = formatDate(user.excommunicadoAt);

  markerData[0] = {
    lat: Number(user.latitude),
    lng: Number(user.longitude),
    size: 0.35,
    color: "#d4af37"
  };

  world.pointsData([...markerData]);
  world.pointOfView(
    {
      lat: Number(user.latitude),
      lng: Number(user.longitude),
      altitude: 1.8
    },
    1400
  );
}

function renderUserGrid() {
  if (!users.length) {
    userGridEl.innerHTML = `
      <div class="user-empty">
        No stored users found. Add one from the intake page to activate the globe.
      </div>
    `;
    return;
  }

  userGridEl.innerHTML = users
    .map(
      (user) => `
        <button class="location-card ${user.id === selectedUserId ? "active" : ""}" data-user-id="${user.id}">
          ${escapeHtml(user.name)}
        </button>
      `
    )
    .join("");

  document.querySelectorAll(".location-card").forEach((button) => {
    button.addEventListener("click", () => {
      selectUser(Number(button.dataset.userId));
    });
  });
}

function selectUser(userId) {
  const user = users.find((entry) => entry.id === userId);

  if (!user) {
    return;
  }

  selectedUserId = user.id;
  renderUserGrid();
  updateInfo(user);
}

async function loadUsers() {
  try {
    const response = await fetch("/api/users");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to load users.");
    }

    users = data.users || [];
    renderUserGrid();

    if (users.length) {
      selectUser(users[0].id);
      return;
    }

    placeEl.textContent = "No active profiles";
    latitudeEl.textContent = "0.0000";
    longitudeEl.textContent = "0.0000";
    excommunicadoAtEl.textContent = "Awaiting intake";
  } catch (error) {
    userGridEl.innerHTML = `
      <div class="user-empty">${escapeHtml(error.message)}</div>
    `;
    excommunicadoAtEl.textContent = "API unavailable";
  }
}

window.addEventListener("resize", () => {
  world.width(globeContainer.offsetWidth);
  world.height(globeContainer.offsetHeight);
});

world.width(globeContainer.offsetWidth);
world.height(globeContainer.offsetHeight);
loadUsers();
