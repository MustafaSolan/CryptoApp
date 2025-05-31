import React, { useState, useEffect } from "react";

const COIN_PRICES = {
  BTC: 30000,
  ETH: 2000,
  ADA: 0.5,
};

const coinOptions = Object.keys(COIN_PRICES);

function CryptoPortfolio() {
  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem("cryptoPortfolio");
    return saved ? JSON.parse(saved) : [];
  });

  const [coin, setCoin] = useState(coinOptions[0]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");

  useEffect(() => {
    localStorage.setItem("cryptoPortfolio", JSON.stringify(portfolio));
  }, [portfolio]);

  const addCoin = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || !name.trim() || !surname.trim()) return;

    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const existing = portfolio.find((p) => p.coin === coin);
    if (existing) {
      setPortfolio(
        portfolio.map((p) =>
          p.coin === coin
            ? { ...p, amount: p.amount + amt, date, note, name, surname }
            : p
        )
      );
    } else {
      setPortfolio([
        ...portfolio,
        {
          coin,
          amount: amt,
          note: note || "",
          date,
          name: name.trim(),
          surname: surname.trim(),
        },
      ]);
    }

    setAmount("");
    setNote("");
    setName("");
    setSurname("");
  };

  const deleteCoin = (coinToDelete) => {
    setPortfolio(portfolio.filter((p) => p.coin !== coinToDelete));
  };

  const totalValue = portfolio.reduce(
    (acc, p) => acc + p.amount * COIN_PRICES[p.coin],
    0
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Crypto Portfolio Tracker</h1>

      <div style={styles.inputArea}>
        <input
          style={styles.input}
          type="text"
          placeholder="First Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Last Name"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
        <select
          style={styles.select}
          value={coin}
          onChange={(e) => setCoin(e.target.value)}
        >
          {coinOptions.map((c) => (
            <option key={c} value={c}>
              {c} (${COIN_PRICES[c].toLocaleString()})
            </option>
          ))}
        </select>
        <input
          style={styles.input}
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="any"
          onKeyDown={(e) => e.key === "Enter" && addCoin()}
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button style={styles.button} onClick={addCoin}>
          Add
        </button>
      </div>

      <ul style={styles.list}>
        {portfolio.length === 0 && (
          <li style={{ color: "#777" }}>Your portfolio is empty.</li>
        )}
        {portfolio.map((p, index) => (
          <li key={index} style={styles.listItem}>
            <div>
              <strong>{p.coin}</strong> - {p.amount} units = $
              {(p.amount * COIN_PRICES[p.coin]).toFixed(2)}
              <br />
              <small>🗓 {p.date}</small> <br />
              <small>👤 {p.name} {p.surname}</small> <br />
              {p.note && <small>📝 {p.note}</small>}
            </div>
            <button
              style={styles.deleteBtn}
              onClick={() => deleteCoin(p.coin)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <h3 style={styles.total}>Total Coins: {portfolio.length}</h3>
      <h2 style={styles.total}>Total Value: ${totalValue.toFixed(2)}</h2>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 550,
    margin: "40px auto",
    padding: 20,
    boxShadow: "0 0 20px rgba(0,0,0,0.2)",
    borderRadius: 12,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(135deg, #ffffff, #f3faff)",
  },
  title: {
    textAlign: "center",
    color: "#1a237e",
  },
  inputArea: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 20,
  },
  select: {
    padding: 10,
    fontSize: 16,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#3949ab",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontWeight: "600",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginBottom: 20,
  },
  listItem: {
    backgroundColor: "#e3f2fd",
    marginBottom: 12,
    padding: "12px 18px",
    borderRadius: 10,
    borderLeft: "5px solid #2196f3",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  deleteBtn: {
    backgroundColor: "#e53935",
    border: "none",
    color: "white",
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer",
  },
  total: {
    textAlign: "center",
    color: "#0d47a1",
  },
};

export default CryptoPortfolio;
