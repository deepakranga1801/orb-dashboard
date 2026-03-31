import React, { useState } from "react";

function Table({ data, selectedSector }) {

  const [search, setSearch] = useState("");

  const filtered = data.filter(row => {
    let sectorOk = !selectedSector || row[1] === selectedSector;
    let searchOk = row[0].toLowerCase().includes(search.toLowerCase());

    return sectorOk && searchOk;
  });

  return (
    <div>

      <input
        placeholder="Search Symbol..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Sector</th>
            <th>LTP</th>
            <th>% Change</th>
            <th>Signal</th>
            <th>RSI</th>
            <th>Volume</th>
            <th>Green</th>
            <th>Red</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((row, i) => (
            <tr key={i}>
              <td>{row[0]}</td>
              <td>{row[1]}</td>
              <td>{row[2]}</td>
              <td>{(row[4] * 100).toFixed(2)}%</td>
              <td className={row[7] === "BUY" ? "buy" : "sell"}>
                {row[7]}
              </td>
              <td>{row[8]}</td>
              <td>{row[10]}</td>
              <td>{row[16]}</td>
              <td>{row[17]}</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default Table;