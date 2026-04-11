const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const userListEl = document.getElementById("userList");
const selectedUserNameEl = document.getElementById("selectedUserName");
const countdownContextEl = document.getElementById("countdownContext");
const statusDetailEl = document.getElementById("statusDetail");
const statusTimestampEl = document.getElementById("statusTimestamp");

let users = [];
let selectedUserId = null;
let timerHandle = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function setTimerDisplay(days, hours, minutes, seconds) {
  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function renderUserList() {
  if (!users.length) {
    userListEl.innerHTML = `
      <div class="user-empty">
        No users in the registry yet. Add one from the intake page to activate this board.
      </div>
    `;
    return;
  }

  userListEl.innerHTML = users
    .map(
      (user) => `
        <button class="user-card ${user.id === selectedUserId ? "active" : ""}" data-user-id="${user.id}">
          <span class="user-card__name">${escapeHtml(user.name)}</span>
          <span class="user-card__date">${escapeHtml(formatDate(user.excommunicadoAt))}</span>
        </button>
      `
    )
    .join("");

  document.querySelectorAll(".user-card").forEach((button) => {
    button.addEventListener("click", () => {
      selectUser(Number(button.dataset.userId));
    });
  });
}

function updateCountdown(user) {
  const target = new Date(user.excommunicadoAt).getTime();
  const now = Date.now();
  const delta = target - now;
  const isFuture = delta >= 0;
  const duration = Math.abs(delta);

  const days = Math.floor(duration / (1000 * 60 * 60 * 24));
  const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((duration % (1000 * 60)) / 1000);

  setTimerDisplay(days, hours, minutes, seconds);

  if (isFuture) {
    countdownContextEl.textContent = `Time remaining until ${user.name} is marked excommunicado.`;
    statusDetailEl.textContent = "Countdown armed";
    statusTimestampEl.textContent = `Excommunicado set for: ${formatDate(user.excommunicadoAt)}`;
    return;
  }

  countdownContextEl.textContent = `${user.name} has been excommunicado for the duration shown below.`;
  statusDetailEl.textContent = "Status confirmed";
  statusTimestampEl.textContent = `Excommunicado since: ${formatDate(user.excommunicadoAt)}`;
}

function selectUser(userId) {
  const user = users.find((entry) => entry.id === userId);

  if (!user) {
    return;
  }

  selectedUserId = user.id;
  selectedUserNameEl.textContent = user.name;
  renderUserList();
  updateCountdown(user);

  if (timerHandle) {
    clearInterval(timerHandle);
  }

  timerHandle = setInterval(() => updateCountdown(user), 1000);
}

async function loadUsers() {
  try {
    const response = await fetch("/api/users");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to load users.");
    }

    users = data.users || [];
    renderUserList();

    if (users.length) {
      selectUser(users[0].id);
      return;
    }

    selectedUserNameEl.textContent = "No active profiles";
    countdownContextEl.textContent = "Add a user from the intake page to populate this timer.";
    statusDetailEl.textContent = "Registry empty";
    statusTimestampEl.textContent = "Awaiting intake";
    setTimerDisplay(0, 0, 0, 0);
  } catch (error) {
    userListEl.innerHTML = `
      <div class="user-empty">${escapeHtml(error.message)}</div>
    `;
    statusDetailEl.textContent = "Connection failed";
    statusTimestampEl.textContent = "API unavailable";
    setTimerDisplay(0, 0, 0, 0);
  }
}

loadUsers();
