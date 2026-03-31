import React, { useEffect, useState } from "react";
import "./App.css";
import SectorChart from "./components/SectorChart";

const API_URL = "http://localhost:3000/data";

function App() {

  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [snapshots, setSnapshots] = useState({});

  useEffect(() => {
    fetchData();
    fetchSnapshots();

    const interval = setInterval(() => {
      fetchData();
      fetchSnapshots();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ===== FETCH DATA =====
  const fetchData = async () => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15 sec

    const res = await fetch(API_URL, { signal: controller.signal });
    const json = await res.json();

    clearTimeout(timeout);
    setData(json);

  } catch (err) {
    console.error("DATA ERROR:", err);
  }
  };

  // ===== FETCH SNAPSHOTS (FIXED) =====
  const fetchSnapshots = async () => {
    try {
      const res = await fetch("http://localhost:3000/snapshots");

      // ❌ If API not found → skip
      if (!res.ok) {
        console.warn("Snapshots API not ready");
        return;
      }

      const text = await res.text();

      // ❌ If HTML returned → skip
      if (text.startsWith("<")) {
        console.warn("Invalid JSON (HTML received)");
        return;
      }

      const json = JSON.parse(text);
      setSnapshots(json);

    } catch (err) {
      console.error("SNAPSHOT ERROR:", err);
    }
  };

  const formatNumber = (val) => {
    if (val === "" || val == null || isNaN(val)) return val;
    return Number(val).toLocaleString("en-IN", {
      maximumFractionDigits: 2
    });
  };

  // ===== FILTER =====
  const filteredData = data.filter(row => {
    const signal = (row[7] || "").toUpperCase();
    const pd = (row[13] || "").toUpperCase();

    return (
      (signal === "BUY" || signal === "SELL") &&
      (pd === "ABOVE PD HIGH" || pd === "BELOW PD LOW")
    );
  });

  // ===== Sector Data =====
  const [sectorData, setSectorData] = useState([]);

  const fetchSector = async () => {
    try {
      const res = await fetch("http://localhost:3000/sector-performance");
      const json = await res.json();
      setSectorData(json);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSector();
  }, []);

  // ===== SORT =====
  const sortData = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  function getStrengthPercent(green, red) {
    const total = green + red;
    if (!total) return 0;
    return (green / total) * 100;
  }

const sortedData = [...filteredData].sort((a, b) => {
  if (sortConfig.key === null) return 0;

  let valA, valB;

  switch (sortConfig.key) {

    // ✅ Strength %
    case "strength":
      valA = getStrengthPercent(a[16], a[17]);
      valB = getStrengthPercent(b[16], b[17]);
      break;

    // ✅ Since 9:30
    case "since930":
      valA = a[20] ? ((a[2] - a[20]) / a[20]) * 100 : -999;
      valB = b[20] ? ((b[2] - b[20]) / b[20]) * 100 : -999;
      break;

    // ✅ Since 10:00
    case "since1000":
      valA = a[22] ? ((a[2] - a[22]) / a[22]) * 100 : -999;
      valB = b[22] ? ((b[2] - b[22]) / b[22]) * 100 : -999;
      break;

    default:
      valA = a[sortConfig.key];
      valB = b[sortConfig.key];
  }

  // ✅ Handle numbers
  if (!isNaN(valA) && !isNaN(valB)) {
    return sortConfig.direction === "asc"
      ? valA - valB
      : valB - valA;
  }

  // ✅ Handle strings
  valA = (valA || "").toString();
  valB = (valB || "").toString();

  return sortConfig.direction === "asc"
    ? valA.localeCompare(valB)
    : valB.localeCompare(valA);
});

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>

      <h3>📊 Sector Performance</h3>
      {sectorData.length > 0 ? (
        <SectorChart data={sectorData} />
      ) : (
        <p>Loading sector data...</p>
      )}


      <h2>🚀 ORB Dashboard (Filtered + Sortable)</h2>

      <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th onClick={() => sortData(0)}>Symbol ⬍</th>
            <th onClick={() => sortData(1)}>Sector ⬍</th>
            <th onClick={() => sortData(2)}>LTP ⬍</th>
            <th onClick={() => sortData(4)}>% Change ⬍</th>
            <th onClick={() => sortData(7)}>Signal ⬍</th>
            <th onClick={() => sortData(8)}>RSI ⬍</th>
            <th onClick={() => sortData(10)}>Curr Vol ⬍</th>
            <th onClick={() => sortData(11)}>PD High ⬍</th>
            <th onClick={() => sortData(12)}>PD Low ⬍</th>
            <th onClick={() => sortData(13)}>PD Break ⬍</th>
            <th onClick={() => sortData(15)}>Breakout Time ⬍</th>
            <th onClick={() => sortData(18)}>ORB % ⬍</th>
            <th onClick={() => sortData(14)}>Vol X ⬍</th>
            <th onClick={() => sortData(16)}>Green ⬍</th>
            <th onClick={() => sortData(17)}>Red ⬍</th>
            <th onClick={() => sortData("strength")}>Strength % ⬍</th>
            <th onClick={() => sortData("since930")}>Since 9:30 ⬍</th>
            <th onClick={() => sortData("since1000")}>Since 10:00 ⬍</th>
          </tr>
        </thead>

        <tbody>
          {sortedData.map((row, i) => (
            <tr key={i}>
              <td>{row[0]}</td>
              <td>{row[1]}</td>
              <td>{formatNumber(row[2])}</td>

              <td style={{ color: row[4] >= 0 ? "green" : "red" }}>
                {formatNumber(row[4] * 100)}%
              </td>

              <td style={{
                background: row[7] === "BUY" ? "#dcfce7" : "#fee2e2",
                color: row[7] === "BUY" ? "green" : "red",
                textAlign: "center"
              }}>
                {row[7]}
              </td>

              <td>{formatNumber(row[8])}</td>
              <td>{formatNumber(row[10])}</td>
              <td>{formatNumber(row[11])}</td>
              <td>{formatNumber(row[12])}</td>
              <td>{row[13]}</td>
              <td>{row[15]}</td>

              <td>{formatNumber(row[18] * 100)}%</td>
              <td>{formatNumber(row[14])}</td>

              <td>{row[16]}</td>
              <td>{row[17]}</td>

              <td style={{
                color: getStrengthPercent(row[16], row[17]) >= 50 ? "green" : "red",
                fontWeight: "bold"
              }}>
                {formatNumber(getStrengthPercent(row[16], row[17]))}%
              </td>

              <td>
                {row[20]
                  ? formatNumber(((row[2] - row[20]) / row[20]) * 100) + "%"
                  : "-"}
              </td>

              <td>
                {row[22]
                  ? formatNumber(((row[2] - row[22]) / row[22]) * 100) + "%"
                  : "-"}
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default App;