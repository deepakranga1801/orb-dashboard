const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// ✅ AXIOS CONFIG (CRITICAL FIX FOR YAHOO)
const axiosInstance = axios.create({
  headers: {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json"
  },
  timeout: 10000
});

// ✅ IST HELPER
function toIST(ts) {
  return new Date(new Date(ts * 1000).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

// ✅ GLOBAL SNAPSHOTS
let morningSnapshots = {
  "09:30": null,
  "09:45": null,
  "10:00": null,
  "10:15": null
};

// ===== STOCK LIST =====
const stocks = [ { symbol: "JPPOWER", sector: "Energy" }, { symbol: "ETERNAL", sector: "Consumption" }, { symbol: "SUZLON", sector: "Energy" }, { symbol: "HDFCBANK", sector: "Private Bank" }, { symbol: "RPOWER", sector: "Energy" }, { symbol: "TATASTEEL", sector: "Metals" }, { symbol: "ITC", sector: "FMCG" }, { symbol: "SBIN", sector: "PSU Bank" }, { symbol: "MOTHERSON", sector: "Automobile" }, { symbol: "IOC", sector: "Energy" }, { symbol: "MAHABANK", sector: "PSU Bank" }, { symbol: "IDFCFIRSTB", sector: "Private Bank" }, { symbol: "POWERGRID", sector: "Energy" }, { symbol: "NMDC", sector: "Metals" }, { symbol: "GAIL", sector: "Energy" }, { symbol: "ADANIPOWER", sector: "Energy" }, { symbol: "COALINDIA", sector: "Energy" }, { symbol: "CANBK", sector: "PSU Bank" }, { symbol: "ICICIBANK", sector: "Private Bank" }, { symbol: "BPCL", sector: "Energy" }, { symbol: "PNB", sector: "PSU Bank" }, { symbol: "BAJFINANCE", sector: "Finserv" }, { symbol: "ONGC", sector: "Energy" }, { symbol: "KOTAKBANK", sector: "Private Bank" }, { symbol: "SAIL", sector: "Metals" }, { symbol: "RELIANCE", sector: "Energy" }, { symbol: "ASHOKLEY", sector: "Automobile" }, { symbol: "JIOFIN", sector: "Finserv" }, { symbol: "BEL", sector: "Consumption" }, { symbol: "VEDL", sector: "Metals" }, { symbol: "SHRIRAMFIN", sector: "Finserv" }, { symbol: "INFY", sector: "IT Services" }, { symbol: "PFC", sector: "Finserv" }, { symbol: "UNIONBANK", sector: "PSU Bank" }, { symbol: "ADANIENT", sector: "Metals" }, { symbol: "LODHA", sector: "Realty" }, { symbol: "WIPRO", sector: "IT Services" }, { symbol: "HINDPETRO", sector: "Energy" }, { symbol: "HINDCOPPER", sector: "Metals" }, { symbol: "TATAPOWER", sector: "Energy" }, { symbol: "NHPC", sector: "Energy" }, { symbol: "INOXWIND", sector: "Energy" }, { symbol: "NATIONALUM", sector: "Metals" }, { symbol: "NTPC", sector: "Energy" }, { symbol: "RECLTD", sector: "Finserv" }, { symbol: "BANKBARODA", sector: "PSU Bank" }, { symbol: "HINDZINC", sector: "Metals" }, { symbol: "AXISBANK", sector: "Private Bank" }, { symbol: "UCOBANK", sector: "PSU Bank" }, { symbol: "BANDHANBNK", sector: "Private Bank" }, { symbol: "TMPV", sector: "Automobile" }, { symbol: "CENTRALBK", sector: "PSU Bank" }, { symbol: "BHEL", sector: "Energy" }, { symbol: "LTF", sector: "Finserv" }, { symbol: "FEDERALBNK", sector: "Private Bank" }, { symbol: "BHARTIARTL", sector: "Consumption" }, { symbol: "INDUSINDBK", sector: "Private Bank" }, { symbol: "LT", sector: "Consumption" }, { symbol: "VBL", sector: "FMCG" }, { symbol: "PETRONET", sector: "Energy" }, { symbol: "IOB", sector: "PSU Bank" }, { symbol: "CASTROLIND", sector: "Energy" }, { symbol: "BANKINDIA", sector: "PSU Bank" }, { symbol: "DLF", sector: "Realty" }, { symbol: "IGL", sector: "Energy" }, { symbol: "SJVN", sector: "Energy" }, { symbol: "INDUSTOWER", sector: "Consumption" }, { symbol: "BIOCON", sector: "Pharma" }, { symbol: "ADANIGREEN", sector: "Energy" }, { symbol: "MCX", sector: "Finserv" }, { symbol: "TECHM", sector: "IT Services" }, { symbol: "BSE", sector: "Finserv" }, { symbol: "PGEL", sector: "Consumer Durables" }, { symbol: "M&M", sector: "Automobile" }, { symbol: "MANAPPURAM", sector: "Finserv" }, { symbol: "HDFCLIFE", sector: "Finserv" }, { symbol: "OIL", sector: "Energy" }, { symbol: "CGPOWER", sector: "Energy" }, { symbol: "HCLTECH", sector: "IT Services" }, { symbol: "ATGL", sector: "Energy" }, { symbol: "TCS", sector: "IT Services" }, { symbol: "HINDALCO", sector: "Metals" }, { symbol: "PPLPHARMA", sector: "Pharma" }, { symbol: "DRREDDY", sector: "Pharma" }, { symbol: "ADANIPORTS", sector: "Consumption" }, { symbol: "COFORGE", sector: "IT Services" }, { symbol: "INDHOTEL", sector: "Consumption" }, { symbol: "LICHSGFIN", sector: "Finserv" }, { symbol: "KALYANKJIL", sector: "Consumer Durables" }, { symbol: "RBLBANK", sector: "Private Bank" }, { symbol: "FORTIS", sector: "Pharma" }, { symbol: "GUJGASLTD", sector: "Energy" }, { symbol: "CHOLAFIN", sector: "Finserv" }, { symbol: "ADANIENSOL", sector: "Energy" }, { symbol: "DABUR", sector: "FMCG" }, { symbol: "MAXHEALTH", sector: "Consumption" }, { symbol: "CROMPTON", sector: "Consumer Durables" }, { symbol: "JSWENERGY", sector: "Energy" }, { symbol: "INDIGO", sector: "Consumption" }, { symbol: "AUBANK", sector: "Private Bank" }, { symbol: "SUNPHARMA", sector: "Pharma" }, { symbol: "ANANTRAJ", sector: "Realty" }, { symbol: "AUROPHARMA", sector: "Pharma" }, { symbol: "BAJAJFINSV", sector: "Finserv" }, { symbol: "MARICO", sector: "FMCG" }, { symbol: "SBICARD", sector: "Finserv" }, { symbol: "M&MFIN", sector: "Finserv" }, { symbol: "UNITDSPR", sector: "FMCG" }, { symbol: "HINDUNILVR", sector: "FMCG" }, { symbol: "GODREJCP", sector: "FMCG" }, { symbol: "MUTHOOTFIN", sector: "Finserv" }, { symbol: "LAURUSLABS", sector: "Pharma" }, { symbol: "SONACOMS", sector: "Automobile" }, { symbol: "EXIDEIND", sector: "Automobile" }, { symbol: "ASIANPAINT", sector: "FMCG" }, { symbol: "NLCINDIA", sector: "Energy" }, { symbol: "INDIANB", sector: "PSU Bank" }, { symbol: "SBILIFE", sector: "Finserv" }, { symbol: "NAUKRI", sector: "Consumption" }, { symbol: "SRF", sector: "Consumption" }, { symbol: "VOLTAS", sector: "Consumer Durables" }, { symbol: "TITAN", sector: "Consumer Durables" }, { symbol: "LUPIN", sector: "Pharma" }, { symbol: "TVSMOTOR", sector: "Automobile" }, { symbol: "BHARATFORG", sector: "Automobile" }, { symbol: "JINDALSTEL", sector: "Metals" }, { symbol: "GRANULES", sector: "Pharma" }, { symbol: "JSWSTEEL", sector: "Metals" }, { symbol: "TATACONSUM", sector: "FMCG" } ];

// ===== SECTOR LIST =====
const sectors = [
  { name: "Bank", symbol: "^NSEBANK" },
  { name: "IT", symbol: "^CNXIT" },
  { name: "Pharma", symbol: "^CNXPHARMA" },
  { name: "FMCG", symbol: "^CNXFMCG" },
  { name: "Auto", symbol: "^CNXAUTO" },
  { name: "Metal", symbol: "^CNXMETAL" },
  { name: "Realty", symbol: "^CNXREALTY" },
  { name: "Energy", symbol: "^CNXENERGY" }
];

// ===== SECTOR PERFORMANCE =====
app.get("/sector-performance", async (req, res) => {
  try {

    const requests = sectors.map(sec =>
      axiosInstance.get(`https://query1.finance.yahoo.com/v8/finance/chart/${sec.symbol}?interval=5m&range=1d`)
        .catch(() => null)
    );

    const responses = await Promise.all(requests);

    let output = [];

    responses.forEach((r, i) => {
      try {
        if (!r || !r.data?.chart?.result) return;

        const closes = r.data.chart.result[0].indicators.quote[0].close;

        const first = closes.find(v => v != null);
        const last = closes[closes.length - 1];

        if (!first || !last) return;

        const change = ((last - first) / first) * 100;

        output.push({
          sector: sectors[i].name,
          value: change
        });

      } catch {}
    });

    res.json(output);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== GET LTP =====
function getLTPAtTime(timestamps, closes, targetHour, targetMin, todayDate) {
  for (let i = 0; i < timestamps.length; i++) {
    let ist = toIST(timestamps[i]);

    if (ist.getDate() !== todayDate) continue;

    let h = ist.getHours();
    let m = ist.getMinutes();

    if (h > targetHour || (h === targetHour && m >= targetMin)) {
      return closes[i];
    }
  }
  return null;
}

// ===== SNAPSHOT =====
async function captureSnapshots() {
  const now = new Date();
  const times = ["09:30", "09:45", "10:00", "10:15"];

  for (let t of times) {
    if (!morningSnapshots[t]) {

      const [h, m] = t.split(":").map(Number);

      const snapshotTime = new Date();
      snapshotTime.setHours(h, m, 0, 0);

      if (now >= snapshotTime) {
        const data = await fetchORBData();

        morningSnapshots[t] = data.map(row => ({
          symbol: row[0],
          ltp: row[2]
        }));
      }
    }
  }
}

// ===== MAIN FUNCTION =====
async function fetchORBData() {

  const requests = stocks.map(s =>
    axiosInstance.get(`https://query1.finance.yahoo.com/v8/finance/chart/${s.symbol}.NS?interval=5m&range=2d`)
      .catch(() => null)
  );

  const responses = await Promise.all(requests);

  let output = [];

  responses.forEach((res, index) => {

    try {

      if (!res || !res.data?.chart?.result) {
        output.push(["No Data"]);
        return;
      }

      const result = res.data.chart.result[0];
      const q = result.indicators.quote[0];

      const { high: highs, low: lows, close: closes, volume: volumes, open: opens } = q;
      const timestamps = result.timestamp;

      if (!highs || highs.length < 5) {
        output.push(["No Data"]);
        return;
      }

      const lastIST = toIST(timestamps[timestamps.length - 1]);
      const todayDate = lastIST.getDate();

      const ltp_930  = getLTPAtTime(timestamps, closes, 9, 30, todayDate);
      const ltp_945  = getLTPAtTime(timestamps, closes, 9, 45, todayDate);
      const ltp_1000 = getLTPAtTime(timestamps, closes, 10, 0, todayDate);
      const ltp_1015 = getLTPAtTime(timestamps, closes, 10, 15, todayDate);

      let greenCount = 0, redCount = 0;
      let todayIdx = [], prevIdx = [];

      for (let i = 0; i < timestamps.length; i++) {

        let d = toIST(timestamps[i]);

        if (d.getDate() === todayDate) {
          todayIdx.push(i);

          let o = opens[i];
          let c = closes[i];

          if (o != null && c != null) {
            if (c > o) greenCount++;
            else if (c < o) redCount++;
          }

        } else {
          prevIdx.push(i);
        }
      }

      if (!prevIdx.length) {
        output.push(["No Prev Day"]);
        return;
      }

      const prevClose = closes[prevIdx[prevIdx.length - 1]];
      const ltp = closes[closes.length - 1];

      const percentChange = prevClose ? ((ltp - prevClose) / prevClose) : 0;

      let orbIdx = todayIdx.filter(i => {
        let d = toIST(timestamps[i]);
        return d.getHours() === 9 && d.getMinutes() >= 15 && d.getMinutes() < 30;
      });

      if (orbIdx.length < 3) {
        output.push(["No ORB"]);
        return;
      }

      const first3 = orbIdx.slice(0, 3);

      const orHigh = Math.max(...first3.map(i => highs[i]));
      const orLow = Math.min(...first3.map(i => lows[i]));

      let signal = ltp > orHigh ? "BUY" : ltp < orLow ? "SELL" : "WAIT";

      const prevHigh = Math.max(...prevIdx.map(i => highs[i]));
      const prevLow = Math.min(...prevIdx.map(i => lows[i]));

      let pdStatus = "INSIDE";
      if (ltp > prevHigh) pdStatus = "ABOVE PD HIGH";
      else if (ltp < prevLow) pdStatus = "BELOW PD LOW";

      const currentVol = todayIdx.reduce((a, i) => a + (volumes[i] || 0), 0);
      const prevVol = prevIdx.reduce((a, i) => a + (volumes[i] || 0), 0);

      const volX = prevVol ? currentVol / prevVol : 0;

      // ✅ RSI FIX
      let gains = 0, losses = 0;
      for (let i = closes.length - 15; i < closes.length - 1; i++) {
        let ch = closes[i + 1] - closes[i];
        if (ch > 0) gains += ch;
        else losses -= ch;
      }

      let rs = losses === 0 ? 100 : gains / losses;
      let rsi = 100 - (100 / (1 + rs));

      const orbPercent = orHigh ? ((ltp - orHigh) / orHigh) : 0;

      output.push([
        stocks[index].symbol,
        stocks[index].sector,
        ltp,
        prevClose,
        percentChange,
        orHigh,
        orLow,
        signal,
        rsi,
        prevVol,
        currentVol,
        prevHigh,
        prevLow,
        pdStatus,
        volX,
        "",
        greenCount,
        redCount,
        orbPercent,
        0,
        ltp_930,
        ltp_945,
        ltp_1000,
        ltp_1015
      ]);

    } catch (e) {
      console.log("ERROR:", stocks[index].symbol);
      output.push(["ERROR"]);
    }
  });

  return output;
}

// ===== CACHE =====
let cachedData = null;
let lastFetchTime = 0;

app.get("/data", async (req, res) => {
  try {
    const now = Date.now();

    if (cachedData && now - lastFetchTime < 60000) {
      return res.json(cachedData);
    }

    const data = await fetchORBData();

    cachedData = data;
    lastFetchTime = now;

    res.json(data);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/snapshots", (req, res) => {
  res.json(morningSnapshots);
});

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
  setInterval(captureSnapshots, 60000);
});