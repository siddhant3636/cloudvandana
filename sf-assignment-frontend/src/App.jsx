import { useEffect, useState } from "react";
import axios from "axios";
import Switch from "./Switch";

const API_URL = "http://localhost:5000";

function App() {
  const [rules, setRules] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRules();
  }, []);

  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/login`;
  };

  const fetchRules = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/rules`);
      setRules(data);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Please login to Salesforce first.");
      } else {
        setError("Unable to fetch validation rules.");
      }
    }
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = !currentStatus;

    setRules((prev) =>
      prev.map((rule) =>
        rule.Id === id ? { ...rule, Active: newStatus } : rule
      )
    );

    try {
      await axios.post(`${API_URL}/api/rules/toggle`, {
        id,
        active: newStatus,
      });
    } catch (err) {
      setRules((prev) =>
        prev.map((rule) =>
          rule.Id === id ? { ...rule, Active: currentStatus } : rule
        )
      );

      setError("Failed to update rule.");
    }
  };

  const handleEnableAll = async () => {
    const inactiveRuleIds = rules
      .filter((rule) => !rule.Active)
      .map((rule) => rule.Id);

    if (!inactiveRuleIds.length) return;

    setRules((prev) =>
      prev.map((rule) => ({
        ...rule,
        Active: true,
      }))
    );

    try {
      await axios.post(`${API_URL}/api/rules/enable-all`, {
        ruleIds: inactiveRuleIds,
      });
    } catch (err) {
      await fetchRules();
      setError("Failed to enable rules.");
    }
  };

  const handleDisableAll = async () => {
    const activeRuleIds = rules
      .filter((rule) => rule.Active)
      .map((rule) => rule.Id);

    if (!activeRuleIds.length) return;

    setRules((prev) =>
      prev.map((rule) => ({
        ...rule,
        Active: false,
      }))
    );

    try {
      await axios.post(`${API_URL}/api/rules/disable-all`, {
        ruleIds: activeRuleIds,
      });
    } catch (err) {
      await fetchRules();
      setError("Failed to disable rules.");
    }
  };

  const enableAllDisabled =
    rules.length === 0 || rules.every((rule) => rule.Active);

  const disableAllDisabled =
    rules.length === 0 || rules.every((rule) => !rule.Active);

  return (
    <div
      style={{
        padding: "40px",
        minHeight: "100vh",
        backgroundColor: "#1a1a1a",
        color: "#fff",
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ marginBottom: "40px" }}>
        Salesforce Validation Rule Manager
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <button style={btnStyle} onClick={handleLogin}>
          Login to Salesforce
        </button>

        <button style={btnStyle} onClick={fetchRules}>
          Fetch Rules
        </button>
      </div>

      {rules.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            padding: "15px",
            maxWidth: "360px",
            margin: "0 auto 30px",
            border: "1px solid #333",
            borderRadius: "8px",
            backgroundColor: "#222",
          }}
        >
          <button
            onClick={handleEnableAll}
            disabled={enableAllDisabled}
            style={{
              ...btnStyle,
              backgroundColor: enableAllDisabled ? "#2a5c35" : "#34C759",
              opacity: enableAllDisabled ? 0.5 : 1,
              cursor: enableAllDisabled ? "not-allowed" : "pointer",
            }}
          >
            Enable All
          </button>

          <button
            onClick={handleDisableAll}
            disabled={disableAllDisabled}
            style={{
              ...btnStyle,
              backgroundColor: disableAllDisabled ? "#69211c" : "#d93025",
              opacity: disableAllDisabled ? 0.5 : 1,
              cursor: disableAllDisabled ? "not-allowed" : "pointer",
            }}
          >
            Disable All
          </button>
        </div>
      )}

      {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

      {rules.length > 0 && (
        <table
          style={{
            width: "80%",
            margin: "0 auto",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #444" }}>
              <th style={{ padding: "12px" }}>Validation Rule</th>
              <th style={{ padding: "12px", textAlign: "center" }}>
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {rules.map((rule) => (
              <tr
                key={rule.Id}
                style={{ borderBottom: "1px solid #333" }}
              >
                <td style={{ padding: "12px" }}>
                  {rule.ValidationName}
                </td>

                <td
                  style={{
                    padding: "12px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Switch
                    id={rule.Id}
                    checked={rule.Active}
                    onChange={() =>
                      handleToggle(rule.Id, rule.Active)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const btnStyle = {
  padding: "10px 20px",
  backgroundColor: "#444",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  fontSize: "14px",
};

export default App;