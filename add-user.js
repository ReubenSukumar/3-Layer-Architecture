const form = document.getElementById("userForm");
const formMessage = document.getElementById("formMessage");
const registryMessage = document.getElementById("registryMessage");
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

function setRegistryMessage(message, type = "") {
  registryMessage.textContent = message;
  registryMessage.className = "registry-message";

  if (type) {
    registryMessage.classList.add(type);
  }
}

function getErrorMessage(data, fallback) {
  return data?.message || data?.error || fallback;
}

async function readResponseData(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
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
          <div>
            <h3>${escapeHtml(user.name)}</h3>
            <p>Excommunicado: ${escapeHtml(formatDate(user.excommunicadoAt))}</p>
            <p>Lat ${Number(user.latitude).toFixed(4)} | Lng ${Number(user.longitude).toFixed(4)}</p>
          </div>
          <div class="registry-card__actions">
            <button type="button" class="delete-btn" data-user-id="${user.id}">
              Delete
            </button>
          </div>
        </article>
      `
    )
    .join("");
}

async function deleteUser(userId) {
  const response = await fetch(`/api/users/${userId}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const data = await readResponseData(response);
    throw new Error(getErrorMessage(data, "Unable to delete user."));
  }
}

async function loadUsers() {
  try {
    const response = await fetch("/api/users");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(getErrorMessage(data, "Unable to load users."));
    }

    setRegistryMessage("");
    renderUsers(data.users || []);
  } catch (error) {
    registryList.innerHTML = `
      <div class="registry-empty">
        ${escapeHtml(error.message)}
      </div>
    `;
    setRegistryMessage(error.message, "error");
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
      throw new Error(getErrorMessage(data, "Unable to save user."));
    }

    form.reset();
    setMessage(`Saved ${data.user.name} to the registry.`, "success");
    await loadUsers();
  } catch (error) {
    setMessage(error.message, "error");
  }
});

registryList.addEventListener("click", async (event) => {
  const deleteButton = event.target.closest(".delete-btn");

  if (!deleteButton || !registryList.contains(deleteButton)) {
    return;
  }

  const userId = Number(deleteButton.dataset.userId);
  const userCard = deleteButton.closest(".registry-card");
  const userName = userCard?.querySelector("h3")?.textContent?.trim() || "this user";

  if (!Number.isFinite(userId)) {
    setRegistryMessage("Invalid user selection.", "error");
    return;
  }

  const confirmed = window.confirm(`Delete ${userName} from the registry?`);

  if (!confirmed) {
    return;
  }

  deleteButton.disabled = true;
  deleteButton.textContent = "Deleting...";
  setRegistryMessage(`Removing ${userName} from the registry...`);

  try {
    await deleteUser(userId);
    setRegistryMessage(`Deleted ${userName} from the registry.`, "success");
    await loadUsers();
  } catch (error) {
    setRegistryMessage(error.message, "error");
  } finally {
    deleteButton.disabled = false;
    deleteButton.textContent = "Delete";
  }
});

loadUsers();
