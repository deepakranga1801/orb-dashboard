import React from "react";

function SectorBars({ data, selectedSector, setSelectedSector }) {

  const sectorMap = {};

  data.forEach(row => {
    let sector = row[1] || "Others";
    if (!sectorMap[sector]) sectorMap[sector] = [];
    sectorMap[sector].push(row);
  });

  let sectorPerf = [];

  for (let sector in sectorMap) {
    let sum = 0, count = 0;

    sectorMap[sector].forEach(r => {
      let signal = r[7];
      let change = parseFloat(r[4]);

      if ((signal === "BUY" || signal === "SELL") && !isNaN(change)) {
        sum += change;
        count++;
      }
    });

    if (count) sectorPerf.push({ sector, avg: sum / count });
  }

  sectorPerf.sort((a, b) => b.avg - a.avg);

  let max = Math.max(...sectorPerf.map(s => Math.abs(s.avg))) || 1;

  return (
    <div className="sector-performance">
      <h3>Sector Performance ● Live</h3>

      <div className="bars">
        {sectorPerf.map((s, i) => (
          <div
            key={i}
            className="bar"
            onClick={() =>
              setSelectedSector(selectedSector === s.sector ? null : s.sector)
            }
          >
            <div
              className={s.avg >= 0 ? "green-bar" : "red-bar"}
              style={{ height: (Math.abs(s.avg) / max) * 200 }}
            >
              {(s.avg * 100).toFixed(2)}%
            </div>

            <div>{s.sector}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SectorBars;