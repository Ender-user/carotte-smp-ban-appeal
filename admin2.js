const SUPABASE_URL = "https://qqqfuamvirzihkompcdk.supabase.co";
const SUPABASE_KEY = "TA_PUBLISHABLE_KY";

const CLIENT_ID = "1431610110412722206";
const REDIRECT_URI = "https://ender-user.github.io/carotte-smp-ban-appeal/admin.html";

// 🔐 Login Discord
function login() {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=identify`;
  window.location.href = url;
}

// 🔑 Récup token
function getToken() {
  const hash = window.location.hash;
  if (!hash) return null;

  const params = new URLSearchParams(hash.substring(1));
  return params.get("access_token");
}

// 👤 Récup user Discord
async function getUser(token) {
  const res = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return await res.json();
}

// 🛡️ Vérifier admin
async function checkAdmin() {
  const token = getToken();
  if (!token) return;

  const user = await getUser(token);

  const res = await fetch(`${SUPABASE_URL}/rest/v1/admins?discord_id=eq.${user.id}`, {
    headers: {
      apikey: SUPABASE_KEY
    }
  });

  const data = await res.json();

  if (!Array.isArray(data) || data.length === 0) {
    document.body.innerHTML = "<h1>Accès refusé</h1>";
    return;
  }

  loadAppeals();
}

// 📥 Charger appeals
async function loadAppeals() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/appeals?order=created_at.desc`, {
    headers: {
      apikey: SUPABASE_KEY
    }
  });

  const data = await res.json();

  const container = document.getElementById("list");
  container.innerHTML = "";

  if (!Array.isArray(data)) {
    container.innerHTML = "<h2>Erreur chargement</h2>";
    console.log(data);
    return;
  }

  data.forEach(a => {
    const div = document.createElement("div");

    div.innerHTML = `
      <hr>
      <b>${a.minecraft_name}</b><br>
      ${a.reason}<br>
      ${a.message}<br>
      Status: ${a.status}<br>

      <button onclick="updateStatus(${a.id}, 'accepted')">✔ Accept</button>
      <button onclick="updateStatus(${a.id}, 'denied')">❌ Refuse</button>
    `;

    container.appendChild(div);
  });
}

// 🔁 Update
async function updateStatus(id, status) {
  await fetch(`${SUPABASE_URL}/rest/v1/appeals?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      "apikey": SUPABASE_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  loadAppeals();
}

// 🚀 Start
checkAdmin();
