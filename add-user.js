const form = document.getElementById("userForm");
const formMessage = document.getElementById("formMessage");
const registryList = document.getElementById("registryList");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

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

function setMessage(message, type = "") {
  formMessage.textContent = message;
  formMessage.className = "form-message";

  if (type) {
    formMessage.classList.add(type);
  }
}

function renderUsers(users) {
  if (!users.length) {
    registryList.innerHTML = `
      <div class="registry-empty">
        No users stored yet. Add the first profile to populate Excommunicado and Location.
      </div>
    `;
    return;
  }

  registryList.innerHTML = users
    .map(
      (user) => `
        <article class="registry-card">
          <h3>${escapeHtml(user.name)}</h3>
          <p>Excommunicado: ${escapeHtml(formatDate(user.excommunicadoAt))}</p>
          <p>Lat ${Number(user.latitude).toFixed(4)} | Lng ${Number(user.longitude).toFixed(4)}</p>
        </article>
      `
    )
    .join("");
}

async function loadUsers() {
  try {
    const response = await fetch("/api/users");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to load users.");
    }

    renderUsers(data.users || []);
  } catch (error) {
    registryList.innerHTML = `
      <div class="registry-empty">
        ${escapeHtml(error.message)}
      </div>
    `;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    name: form.name.value.trim(),
    latitude: Number(form.latitude.value),
    longitude: Number(form.longitude.value),
    excommunicadoAt: new Date(form.excommunicadoAt.value).toISOString()
  };

  setMessage("Saving user to the registry...");

  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to save user.");
    }

    form.reset();
    setMessage(`Saved ${data.user.name} to the registry.`, "success");
    await loadUsers();
  } catch (error) {
    setMessage(error.message, "error");
  }
});

loadUsers();
