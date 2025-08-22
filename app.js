const express = require("express");
const app = express();

const port = process.env.PORT || 3001;
const VERIFY_TOKEN = "odoo_16_enterprise"; // must match the token you set in Meta

app.use(express.json());

// ----- Hello Render homepage -----
const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      body { font-family: Arial, sans-serif; background: white; }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`;

app.get("/", (req, res) => res.type("html").send(html));

// ----- WhatsApp Cloud Webhook Verification -----
app.get("/whatsapp/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified by Meta!");
    res.status(200).send(challenge);
  } else {
    console.warn("Failed verification attempt.");
    res.sendStatus(403);
  }
});

// ----- WhatsApp Cloud Webhook Messages -----
app.post("/whatsapp/webhook", (req, res) => {
  console.log("Incoming webhook event:", JSON.stringify(req.body, null, 2));
  // TODO: here you can forward messages into Odoo via API/RPC if needed
  res.sendStatus(200);
});

// ----- Start server -----
const server = app.listen(port, () =>
  console.log(`App listening on port ${port}!`)
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
