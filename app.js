const SUPABASE_URL = "TON_URL";
const SUPABASE_KEY = "TA_KEY";

async function send() {
  const data = {
    minecraft_name: document.getElementById("mc").value,
    reason: document.getElementById("reason").value,
    message: document.getElementById("msg").value,
    status: "pending"
  };

  await fetch(`${SUPABASE_URL}/rest/v1/appeals`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  alert("Appeal envoyé !");
}
