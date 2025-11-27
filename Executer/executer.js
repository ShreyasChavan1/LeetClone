const express = require("express");
const cors = require("cors");
const runner = require("./runner");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/", (req, res) => {
  console.log("Health check hit");
  res.status(200).send("Executor is alive and working 🚀");
});

app.post("/run", async (req, res) => {
  const { code, language, prob, subID } = req.body;

  if (!code || !language || !prob || !subID) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const resu = await runner(code, language, prob, subID);
    res.json({ resu });
  } catch (err) {
    console.error("Executor error in runner.js:", err);
    res.status(500).json({ error: err.message || "Runner execution failed" });
  }
});

app.listen(5000, "0.0.0.0", () => {
  console.log(`Executor service listening on port ${port}...`);
});