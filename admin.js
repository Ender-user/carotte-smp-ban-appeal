const SUPABASE_URL = "https://qqqfuamvirzihkompcdk.supabase.co/rest/v1/L";
const SUPABASE_KEY = "sb_publishable_3IAI3-CfWc6tXyw5nNdQCQ_Qa3sobC6";

async function loadAppeals() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/appeals?order=created_at.desc`, {
    headers: {
      "apikey": SUPABASE_KEY
    }
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

      <button onclick="updateStatus(${a.id}, 'accepted')">✔ Accept</button>
      <button onclick="updateStatus(${a.id}, 'denied')">❌ Refuse</button>
    `;

    container.appendChild(div);
  });
}
