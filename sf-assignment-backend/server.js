require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jsforce = require("jsforce");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
let sfConn = null;

const oauth2 = new jsforce.OAuth2({
  clientId: process.env.SF_CLIENT_ID,
  clientSecret: process.env.SF_CLIENT_SECRET,
  redirectUri: process.env.SF_REDIRECT_URI,
});

app.get("/", (req, res) => res.send("Server Running"));

app.get("/auth/login", (req, res) => {
  res.redirect(oauth2.getAuthorizationUrl({ scope: 'api full refresh_token' }));
});

app.get("/oauth2/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("Authorization code missing.");

  try {
    const conn = new jsforce.Connection({ oauth2 });
    await conn.authorize(code);
    sfConn = conn;
    // Redirecting directly back to your React frontend after successful login
    res.redirect("http://localhost:5173"); 
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.get("/api/rules", async (req, res) => {
  if (!sfConn) return res.status(401).json({ message: "Login first." });
  try {
    const result = await sfConn.tooling.query(
      "SELECT Id, ValidationName, Active FROM ValidationRule WHERE EntityDefinition.DeveloperName='Account'"
    );
    res.json(result.records);
  } catch (err) {
    res.status(500).json(err);
  }
});

// NEW: Safely Toggle a single rule (Read-Modify-Write)
app.post("/api/rules/toggle", async (req, res) => {
  if (!sfConn) return res.status(401).json({ message: "Login first." });
  try {
    const { id, active } = req.body;
    
    // 1. Fetch the entire rule's current metadata
    const rule = await sfConn.tooling.sobject('ValidationRule').retrieve(id);
    
    // 2. Modify only the active flag
    rule.Metadata.active = active;
    
    // 3. Send the full package back to Salesforce
    const result = await sfConn.tooling.sobject('ValidationRule').update({
      Id: id,
      FullName: rule.FullName,
      Metadata: rule.Metadata
    });
    
    res.json(result);
  } catch (err) {
    console.error("Toggle Error:", err);
    res.status(500).json(err);
  }
});

// Helper function: Acts like a robot clicking the single toggle multiple times
async function bulkUpdateRules(ruleIds, targetState) {
  if (!ruleIds || ruleIds.length === 0) return [];
  
  const results = [];
  
  // Loop through the IDs one at a time
  for (const id of ruleIds) {
    // 1. Fetch exactly like the single toggle does
    const rule = await sfConn.tooling.sobject('ValidationRule').retrieve(id);
    
    // 2. Modify the flag
    rule.Metadata.active = targetState;
    
    // 3. Update exactly like the single toggle does
    const result = await sfConn.tooling.sobject('ValidationRule').update({
      Id: id,
      FullName: rule.FullName,
      Metadata: rule.Metadata
    });
    
    results.push(result);
  }
  
  return results;
}

// NEW: Disable all rules
app.post("/api/rules/disable-all", async (req, res) => {
  if (!sfConn) return res.status(401).json({ message: "Login first." });
  try {
    const result = await bulkUpdateRules(req.body.ruleIds, false);
    res.json(result);
  } catch (err) {
    console.error("Disable All Error:", err);
    res.status(500).json(err);
  }
});

// NEW: Enable all rules
app.post("/api/rules/enable-all", async (req, res) => {
  if (!sfConn) return res.status(401).json({ message: "Login first." });
  try {
    const result = await bulkUpdateRules(req.body.ruleIds, true);
    res.json(result);
  } catch (err) {
    console.error("Enable All Error:", err);
    res.status(500).json(err);
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));