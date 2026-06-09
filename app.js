const SUPABASE_URL = "https://qqqfuamvirzihkompcdk.supabase.co";
const SUPABASE_KEY = "sb_publishable_3IAI3-CfWc6tXyw5nNdQCQ_Qa3sobC6";

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
