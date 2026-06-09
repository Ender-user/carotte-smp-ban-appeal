const SUPABASE_URL = "https://qqqfuamvirzihkompcdk.supabase.co";
const SUPABASE_KEY = "sb_publishable_3IAI3-CfWc6tXyw5nNdQCQ_Qa3sobC6";

// 🔑 récupérer token
function getToken() {
  const hash = window.location.hash;
  if (!hash) return null;

  const params = new URLSearchParams(hash.substring(1));
  return params.get("access_token");
}

// 👤 récupérer user Discord
async function getUser(token) {
  const res = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return await res.json();
}

// 🔐 vérifier admin
async function checkAdmin() {
  const token = getToken();
  if (!token) {
    document.body.innerHTML = "<h1>Pas connecté</h1>";
    return;
  }

  const user = await getUser(token);

  const res = await fetch(`${SUPABASE_URL}/rest/v1/admins?discord_id=eq.${user.id}`, {
    headers: { apikey: SUPABASE_KEY }
  });

  const data = await res.json();

  if (!Array.isArray(data) || data.length === 0) {
    document.body.innerHTML = "<h1>Accès refusé</h1>";
    return;
  }

  loadAppeals();
}

// 📥 charger appeals
async function loadAppeals() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/appeals?order=created_at.desc`, {
    headers: { apikey: SUPABASE_KEY }
  });

  const data = await res.json();

  const container = document.getElementById("list");
  container.innerHTML = "";

  data.forEach(a => {
    const div = document.createElement("div");

    div.innerHTML = `
      <hr>
      <b>${a.minecraft_name}</b><br>
      ${a.reason}<br>
      ${a.message}<br>
      Status: ${a.status}<br>

      <button class="accept" onclick="updateStatus(${a.id}, 'accepted')">✔ Accept</button>
      <button class="deny" onclick="updateStatus(${a.id}, 'denied')">❌ Refuse</button>
    `;

    container.appendChild(div);
  });
}

// 🔁 update
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

// 🚀 start
checkAdmin();
