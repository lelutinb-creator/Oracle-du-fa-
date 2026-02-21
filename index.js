
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

let codes = [];

function generateCode(uses) {
  const code = "FA-" + crypto.randomBytes(3).toString("hex").toUpperCase();
  codes.push({ code, uses });
  return code;
}

app.post("/generate-code", (req, res) => {
  const { plan } = req.body;

  let uses = 1;
  if (plan === "3") uses = 3;
  if (plan === "7") uses = 7;
  if (plan === "month") uses = 30;

  const newCode = generateCode(uses);
  res.json({ code: newCode });
});

app.post("/verify-code", (req, res) => {
  const { code } = req.body;
  let found = codes.find(c => c.code === code);

  if (!found || found.uses <= 0) {
    return res.json({ success: false });
  }

  found.uses -= 1;
  res.json({ success: true });
});

app.listen(3001, () => {
  console.log("Serveur lancé sur 3001");
});
