import React from "react";

function Heatmap({ data, selectedSector, setSelectedSector }) {

  const sectorMap = {};

  data.forEach(row => {

    let signal = (row[7] || "").toUpperCase();
    let pd = (row[13] || "").toUpperCase();

    if (
      (signal !== "BUY" && signal !== "SELL") ||
      (pd !== "ABOVE PD HIGH" && pd !== "BELOW PD LOW")
    ) return;

    let sector = row[1] || "Others";

    if (!sectorMap[sector]) sectorMap[sector] = [];
    sectorMap[sector].push(row);
  });

  return (
    <div>
      <h3>🔥 Market Heatmap</h3>

      {Object.keys(sectorMap).map(sec => {

        const stocks = sectorMap[sec];

        let buyCount = 0, sellCount = 0, sum = 0, count = 0;

        stocks.forEach(r => {
          let signal = r[7];
          let change = parseFloat(r[4]);

          if (!isNaN(change)) {
            sum += change;
            count++;
          }

          if (signal === "BUY") buyCount++;
          if (signal === "SELL") sellCount++;
        });

        let avgPercent = count ? (sum / count) * 100 : 0;

        return (
          <div key={sec} className="sector-block">

            <div
              className="sector-title"
              onClick={() =>
                setSelectedSector(selectedSector === sec ? null : sec)
              }
            >
              {sec} ({avgPercent.toFixed(2)}%) 🟢 {buyCount} 🔴 {sellCount}
            </div>

            <div className="sector-grid">
              {stocks.map((r, i) => (
                <div
                  key={i}
                  className={"tile " + (r[7] === "BUY" ? "buy" : "sell")}
                >
                  <b>{r[0]}</b>
                  <br />
                  {(r[4] * 100).toFixed(2)}%
                </div>
              ))}
            </div>

          </div>
        );
      })}
    </div>
  );
}

export default Heatmap;