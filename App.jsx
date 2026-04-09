import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, ReferenceLine } from "recharts";

// ==========================================
// 2025 China Life Tables - CL1~CL4 Complete Data
// ==========================================
const CL1 = {
  name: "养老类业务表 (CL1)",
  male: {0:0.204,1:0.167,2:0.138,3:0.115,4:0.097,5:0.083,6:0.075,7:0.070,8:0.069,9:0.071,10:0.077,11:0.085,12:0.096,13:0.109,14:0.122,15:0.136,16:0.150,17:0.164,18:0.178,19:0.191,20:0.205,21:0.218,22:0.231,23:0.243,24:0.254,25:0.266,26:0.279,27:0.292,28:0.308,29:0.326,30:0.348,31:0.373,32:0.402,33:0.436,34:0.475,35:0.519,36:0.569,37:0.623,38:0.682,39:0.744,40:0.809,41:0.877,42:0.949,43:1.025,44:1.104,45:1.188,46:1.277,47:1.371,48:1.471,49:1.580,50:1.698,51:1.831,52:1.980,53:2.151,54:2.347,55:2.570,56:2.824,57:3.111,58:3.434,59:3.794,60:4.194,61:4.635,62:5.116,63:5.633,64:6.180,65:6.752,66:7.345,67:7.959,68:8.602,69:9.293,70:10.060,71:10.941,72:11.984,73:13.243,74:14.773,75:16.631,76:18.870,77:21.539,78:24.678,79:28.323,80:32.498,81:37.209,82:41.777,83:46.892,84:52.617,85:59.018,86:66.171,87:74.155,88:83.060,89:92.979,90:104.014,91:116.272,92:129.868,93:144.919,94:161.547,95:179.874,96:200.021,97:222.104,98:246.229,99:272.486,100:300.944,101:331.642,102:364.582,103:399.715,104:433.938,105:1000},
  female: {0:0.162,1:0.127,2:0.100,3:0.080,4:0.066,5:0.057,6:0.051,7:0.049,8:0.049,9:0.050,10:0.054,11:0.058,12:0.062,13:0.067,14:0.072,15:0.076,16:0.080,17:0.084,18:0.088,19:0.092,20:0.096,21:0.101,22:0.105,23:0.110,24:0.114,25:0.118,26:0.121,27:0.125,28:0.128,29:0.132,30:0.137,31:0.143,32:0.151,33:0.160,34:0.173,35:0.187,36:0.205,37:0.225,38:0.247,39:0.272,40:0.300,41:0.330,42:0.362,43:0.396,44:0.434,45:0.475,46:0.520,47:0.571,48:0.626,49:0.686,50:0.750,51:0.816,52:0.884,53:0.955,54:1.029,55:1.110,56:1.200,57:1.304,58:1.425,59:1.565,60:1.727,61:1.910,62:2.113,63:2.338,64:2.583,65:2.854,66:3.157,67:3.502,68:3.904,69:4.382,70:4.958,71:5.656,72:6.502,73:7.524,74:8.749,75:10.206,76:11.921,77:13.924,78:16.240,79:18.896,80:21.917,81:25.329,82:29.156,83:33.421,84:38.148,85:42.745,86:48.851,87:55.803,88:63.710,89:72.695,90:82.890,91:94.440,92:107.502,93:122.247,94:138.851,95:157.502,96:178.388,97:201.696,98:227.607,99:256.279,100:287.844,101:322.387,102:359.933,103:400.425,104:440.707,105:1000}
};
const CL2 = {
  name: "非养老类业务一表 (CL2)",
  male: {0:0.319,1:0.253,2:0.201,3:0.160,4:0.130,5:0.110,6:0.099,7:0.096,8:0.100,9:0.111,10:0.129,11:0.151,12:0.176,13:0.202,14:0.228,15:0.252,16:0.274,17:0.294,18:0.312,19:0.329,20:0.347,21:0.366,22:0.387,23:0.410,24:0.435,25:0.460,26:0.486,27:0.512,28:0.537,29:0.562,30:0.587,31:0.615,32:0.647,33:0.685,34:0.730,35:0.784,36:0.847,37:0.921,38:1.004,39:1.097,40:1.202,41:1.318,42:1.448,43:1.593,44:1.755,45:1.933,46:2.129,47:2.342,48:2.572,49:2.822,50:3.093,51:3.390,52:3.719,53:4.087,54:4.499,55:4.959,56:5.468,57:6.024,58:6.626,59:7.269,60:7.952,61:8.679,62:9.456,63:10.298,64:11.222,65:12.252,66:13.414,67:14.739,68:16.257,69:18.005,70:20.019,71:22.340,72:25.013,73:28.086,74:31.617,75:35.667,76:40.307,77:45.612,78:51.667,79:58.563,80:66.396,81:75.666,82:84.166,83:93.467,84:103.608,85:114.625,86:126.542,87:139.375,88:153.129,89:167.791,90:183.334,91:199.714,92:216.867,93:234.710,94:253.142,95:272.048,96:291.295,97:310.743,98:330.242,99:349.642,100:368.796,101:387.564,102:405.815,103:423.437,104:440.330,105:1000},
  female: {0:0.293,1:0.213,2:0.156,3:0.117,4:0.092,5:0.078,6:0.072,7:0.073,8:0.078,9:0.087,10:0.098,11:0.111,12:0.123,13:0.135,14:0.146,15:0.154,16:0.160,17:0.165,18:0.169,19:0.172,20:0.175,21:0.178,22:0.182,23:0.187,24:0.192,25:0.199,26:0.205,27:0.212,28:0.219,29:0.227,30:0.235,31:0.243,32:0.252,33:0.263,34:0.276,35:0.292,36:0.311,37:0.335,38:0.364,39:0.399,40:0.440,41:0.487,42:0.541,43:0.602,44:0.669,45:0.744,46:0.826,47:0.916,48:1.015,49:1.123,50:1.241,51:1.370,52:1.511,53:1.665,54:1.835,55:2.023,56:2.232,57:2.463,58:2.719,59:3.003,60:3.317,61:3.666,62:4.055,63:4.493,64:4.992,65:5.565,66:6.230,67:7.008,68:7.925,69:9.012,70:10.302,71:11.836,72:13.657,73:15.815,74:18.361,75:21.350,76:24.842,77:28.894,78:33.567,79:38.924,80:45.027,81:51.700,82:58.829,83:66.833,84:75.787,85:85.767,86:96.841,87:109.070,88:122.502,89:137.169,90:153.082,91:170.224,92:188.551,93:207.984,94:228.411,95:249.686,96:271.632,97:294.044,98:316.698,99:339.360,100:361.794,101:383.773,102:405.089,103:425.557,104:445.027,105:1000}
};
const CL3 = {
  name: "非养老类业务二表 (CL3)",
  male: {0:0.233,1:0.194,2:0.160,3:0.131,4:0.108,5:0.092,6:0.082,7:0.080,8:0.084,9:0.094,10:0.108,11:0.126,12:0.145,13:0.164,14:0.181,15:0.195,16:0.207,17:0.217,18:0.227,19:0.236,20:0.247,21:0.261,22:0.276,23:0.294,24:0.314,25:0.335,26:0.357,27:0.379,28:0.401,29:0.423,30:0.445,31:0.469,32:0.496,33:0.527,34:0.565,35:0.610,36:0.663,37:0.725,38:0.794,39:0.870,40:0.952,41:1.040,42:1.133,43:1.232,44:1.338,45:1.452,46:1.577,47:1.713,48:1.863,49:2.029,50:2.212,51:2.414,52:2.636,53:2.879,54:3.144,55:3.432,56:3.744,57:4.081,58:4.446,59:4.843,60:5.276,61:5.752,62:6.281,63:6.870,64:7.531,65:8.277,66:9.119,67:10.075,68:11.165,69:12.412,70:13.848,71:15.508,72:17.436,73:19.679,74:22.289,75:25.324,76:28.841,77:32.899,78:37.558,79:42.875,80:48.907,81:55.711,82:63.208,83:71.335,84:80.365,85:90.362,86:101.382,87:113.475,88:126.679,89:141.014,90:156.486,91:173.074,92:190.734,93:209.395,94:228.954,95:249.284,96:270.230,97:291.613,98:313.241,99:334.908,100:356.410,101:377.545,102:398.127,103:417.987,104:436.634,105:1000},
  female: {0:0.195,1:0.148,2:0.113,3:0.089,4:0.072,5:0.063,6:0.058,7:0.059,8:0.062,9:0.068,10:0.076,11:0.085,12:0.093,13:0.101,14:0.106,15:0.110,16:0.112,17:0.114,18:0.116,19:0.119,20:0.123,21:0.129,22:0.136,23:0.144,24:0.151,25:0.157,26:0.163,27:0.168,28:0.173,29:0.179,30:0.185,31:0.194,32:0.203,33:0.215,34:0.228,35:0.243,36:0.260,37:0.279,38:0.301,39:0.328,40:0.358,41:0.393,42:0.432,43:0.477,44:0.528,45:0.584,46:0.646,47:0.713,48:0.785,49:0.861,50:0.942,51:1.027,52:1.116,53:1.211,54:1.313,55:1.425,56:1.547,57:1.685,58:1.840,59:2.016,60:2.217,61:2.448,62:2.713,63:3.019,64:3.373,65:3.784,66:4.265,67:4.832,68:5.502,69:6.297,70:7.243,71:8.369,72:9.708,73:11.294,74:13.165,75:15.362,76:17.924,77:20.893,78:24.312,79:28.222,80:32.668,81:37.692,82:43.338,83:49.748,84:57.407,85:66.116,86:75.980,87:87.097,88:99.561,89:113.451,90:128.826,91:145.719,92:164.126,93:184.003,94:205.258,95:227.747,96:251.278,97:275.610,98:300.464,99:325.532,100:350.498,101:375.046,102:398.883,103:421.748,104:443.426,105:1000}
};
const CL4 = {
  name: "单一生命体表 (CL4)",
  male: {0:0.252,1:0.206,2:0.167,3:0.136,4:0.111,5:0.094,6:0.085,7:0.082,8:0.087,9:0.097,10:0.112,11:0.130,12:0.149,13:0.169,14:0.187,15:0.203,16:0.216,17:0.228,18:0.239,19:0.250,20:0.262,21:0.276,22:0.293,23:0.312,24:0.333,25:0.355,26:0.378,27:0.401,28:0.425,29:0.448,30:0.473,31:0.499,32:0.529,33:0.563,34:0.604,35:0.652,36:0.709,37:0.773,38:0.846,39:0.927,40:1.015,41:1.110,42:1.215,43:1.329,44:1.454,45:1.591,46:1.740,47:1.903,48:2.079,49:2.272,50:2.481,51:2.711,52:2.964,53:3.245,54:3.557,55:3.905,56:4.290,57:4.715,58:5.180,59:5.686,60:6.233,61:6.822,62:7.454,63:8.135,64:8.872,65:9.675,66:10.561,67:11.550,68:12.671,69:13.959,70:15.454,71:17.202,72:19.255,73:21.665,74:24.486,75:27.770,76:31.568,77:35.927,78:40.890,79:46.496,80:52.780,81:59.710,82:67.244,83:75.608,84:84.861,85:95.062,86:106.260,87:118.496,88:131.800,89:146.186,90:161.651,91:178.169,92:195.691,93:214.143,94:233.424,95:253.408,96:273.947,97:294.871,98:315.999,99:337.140,100:358.103,101:378.702,102:398.764,103:418.135,104:436.681,105:1000},
  female: {0:0.222,1:0.164,2:0.122,3:0.093,4:0.075,5:0.064,6:0.060,7:0.061,8:0.065,9:0.071,10:0.079,11:0.088,12:0.097,13:0.104,14:0.110,15:0.115,16:0.118,17:0.121,18:0.124,19:0.127,20:0.132,21:0.137,22:0.144,23:0.151,24:0.157,25:0.164,26:0.170,27:0.175,28:0.181,29:0.187,30:0.194,31:0.202,32:0.212,33:0.223,34:0.237,35:0.252,36:0.270,37:0.290,38:0.314,39:0.343,40:0.376,41:0.413,42:0.456,43:0.504,44:0.558,45:0.618,46:0.685,47:0.758,48:0.838,49:0.923,50:1.015,51:1.112,52:1.216,53:1.328,54:1.450,55:1.585,56:1.737,57:1.911,58:2.110,59:2.336,60:2.592,61:2.879,62:3.201,63:3.561,64:3.964,65:4.420,66:4.941,67:5.546,68:6.258,69:7.107,70:8.126,71:9.353,72:10.829,73:12.597,74:14.700,75:17.181,76:20.083,77:23.448,78:27.314,79:31.722,80:36.709,81:42.313,82:48.570,83:55.515,84:63.267,85:72.418,86:82.707,87:94.222,88:107.039,89:121.222,90:136.810,91:153.818,92:172.226,93:191.977,94:212.970,95:235.058,96:258.052,97:281.724,98:305.814,99:330.042,100:354.120,101:377.767,102:400.720,103:422.749,104:443.661,105:1000}
};

const TABLES = { CL1, CL2, CL3, CL4 };

// ==========================================
// Actuarial Calculation Engine
// ==========================================
function getQx(table, gender, age) {
  const t = TABLES[table];
  if (!t) return 0.002;
  const data = gender === "male" ? t.male : t.female;
  return (data[age] || 2) / 1000;
}

function calcSurvivalCurve(table, gender) {
  const data = [];
  let lx = 100000;
  for (let age = 0; age <= 105; age++) {
    const qx = getQx(table, gender, age);
    data.push({ age, lx: Math.round(lx), qx: qx * 1000, dx: Math.round(lx * qx) });
    lx = lx * (1 - qx);
  }
  return data;
}

function calcLifeExpectancy(table, gender, fromAge = 0) {
  let lx = 1;
  let sum = 0;
  for (let age = fromAge; age <= 105; age++) {
    const qx = getQx(table, gender, age);
    sum += lx * (1 - qx / 2);
    lx *= (1 - qx);
  }
  return sum;
}

function calcAx(table, gender, age, interest) {
  let lx = 1;
  let ax = 0;
  for (let t = 0; t <= 105 - age; t++) {
    const qx = getQx(table, gender, age + t);
    const v = Math.pow(1 + interest, -(t + 1));
    ax += lx * qx * v;
    lx *= (1 - qx);
  }
  return ax;
}

function calcAnnuity(table, gender, age, interest) {
  let lx = 1;
  let ax = 0;
  for (let t = 0; t <= 105 - age; t++) {
    const v = Math.pow(1 + interest, -t);
    ax += lx * v;
    const qx = getQx(table, gender, age + t);
    lx *= (1 - qx);
  }
  return ax;
}

function runProfitTest(params) {
  const { table, gender, age, benefit, term, interest, lapse, expenseRate, commissionRate, premiumLoading } = params;
  const Ax = calcAx(table, gender, age, interest);
  const annuity = calcAnnuity(table, gender, age, interest);
  const netPremium = benefit * Ax / annuity;
  const grossPremium = netPremium * (1 + premiumLoading);
  const results = [];
  let lx = 1;
  let totalPV = 0;

  for (let t = 0; t < term; t++) {
    const currentAge = age + t;
    const qx = getQx(table, gender, currentAge);
    const claim = benefit * qx * lx;
    const commission = t === 0 ? grossPremium * commissionRate * lx : 0;
    const expense = grossPremium * expenseRate * lx;
    const premiumIncome = grossPremium * lx;
    const lapseOut = grossPremium * lapse * lx;
    const profit = premiumIncome - claim - commission - expense - lapseOut;
    const pvFactor = Math.pow(1 + interest, -(t + 1));
    totalPV += profit * pvFactor;

    results.push({
      year: t + 1,
      age: currentAge,
      lx: +(lx * 100).toFixed(2),
      premium: +premiumIncome.toFixed(2),
      claim: +claim.toFixed(2),
      commission: +commission.toFixed(2),
      expense: +expense.toFixed(2),
      lapse: +lapseOut.toFixed(2),
      profit: +profit.toFixed(2),
      cumProfit: 0,
    });
    lx *= (1 - qx) * (1 - lapse);
  }

  let cum = 0;
  results.forEach(r => { cum += r.profit; r.cumProfit = +cum.toFixed(2); });

  return { netPremium, grossPremium, Ax, annuity, nbv: totalPV, results };
}

// ==========================================
// CSM Amortization (IFRS 17 BBA)
// ==========================================
function calcCSM(params) {
  const { premium, claimRatio, expenseRatio, riskAdj, interest, term } = params;
  const pvFutureCF = premium * term * (1 - claimRatio - expenseRatio) / Math.pow(1 + interest, term / 2);
  let csm = pvFutureCF - riskAdj;
  if (csm < 0) csm = 0;
  const results = [];
  let remaining = csm;
  for (let t = 1; t <= term; t++) {
    const coverageUnits = (term - t + 1);
    const totalUnits = (term - t + 1) * (term - t + 2) / 2 + coverageUnits;
    const amort = remaining * coverageUnits / (totalUnits || 1);
    remaining -= amort;
    remaining *= (1 + interest);
    results.push({
      year: t,
      amortization: +amort.toFixed(2),
      remaining: +remaining.toFixed(2),
      coverageUnits,
      revenue: +(premium + amort).toFixed(2),
    });
  }
  return { initialCSM: csm, results };
}


// ==========================================
// Styles
// ==========================================
const fonts = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap');`;

const theme = {
  bg: "#0B0F1A",
  surface: "#111827",
  surfaceHover: "#1a2332",
  border: "#1E293B",
  borderLight: "#334155",
  text: "#E2E8F0",
  textMuted: "#94A3B8",
  textDim: "#64748B",
  accent: "#38BDF8",
  accentDim: "#0EA5E9",
  green: "#34D399",
  red: "#F87171",
  orange: "#FB923C",
  purple: "#A78BFA",
  pink: "#F472B6",
  yellow: "#FBBF24",
};

// ==========================================
// Sub-components
// ==========================================
const TabBtn = ({ active, children, onClick }) => (
  <button onClick={onClick} style={{
    padding: "10px 20px", border: "none", cursor: "pointer",
    background: active ? theme.accent : "transparent",
    color: active ? theme.bg : theme.textMuted,
    fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: active ? 600 : 400,
    borderRadius: 8, transition: "all 0.2s",
  }}>{children}</button>
);

const Card = ({ children, style }) => (
  <div style={{
    background: theme.surface, border: `1px solid ${theme.border}`,
    borderRadius: 12, padding: 24, ...style,
  }}>{children}</div>
);

const Label = ({ children }) => (
  <span style={{ fontSize: 12, color: theme.textMuted, fontWeight: 500, letterSpacing: 0.5 }}>{children}</span>
);

const Input = ({ label, value, onChange, type = "number", step, min, max, style }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
    <Label>{label}</Label>
    <input type={type} value={value} onChange={e => onChange(type === "number" ? +e.target.value : e.target.value)}
      step={step} min={min} max={max}
      style={{
        background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 8,
        padding: "8px 12px", color: theme.text, fontSize: 14, fontFamily: "'JetBrains Mono', monospace",
        outline: "none", width: "100%", boxSizing: "border-box",
      }} />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <Label>{label}</Label>
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{
        background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 8,
        padding: "8px 12px", color: theme.text, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
        outline: "none", cursor: "pointer",
      }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Stat = ({ label, value, color, sub }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: 11, color: theme.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 700, color: color || theme.text, fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>{sub}</div>}
  </div>
);

const Btn = ({ children, onClick, primary, style, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: "10px 24px", border: primary ? "none" : `1px solid ${theme.border}`,
    background: primary ? `linear-gradient(135deg, ${theme.accent}, ${theme.accentDim})` : "transparent",
    color: primary ? theme.bg : theme.text, fontFamily: "'DM Sans', sans-serif",
    fontSize: 13, fontWeight: 600, borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1, transition: "all 0.2s", ...style,
  }}>{children}</button>
);

const chartColors = { male: theme.accent, female: theme.pink };

// ==========================================
// Mortality Dashboard
// ==========================================
function MortalityDashboard() {
  const [table, setTable] = useState("CL1");
  const [logScale, setLogScale] = useState(false);
  const [ageRange, setAgeRange] = useState([0, 105]);
  const [compareTable, setCompareTable] = useState("");

  const data = useMemo(() => {
    const t = TABLES[table];
    const arr = [];
    for (let age = ageRange[0]; age <= ageRange[1]; age++) {
      const entry = {
        age,
        male: t.male[age] || 0,
        female: t.female[age] || 0,
      };
      if (compareTable && TABLES[compareTable]) {
        entry.male2 = TABLES[compareTable].male[age] || 0;
        entry.female2 = TABLES[compareTable].female[age] || 0;
      }
      arr.push(entry);
    }
    return arr;
  }, [table, ageRange, compareTable]);

  const survivalM = useMemo(() => calcSurvivalCurve(table, "male"), [table]);
  const survivalF = useMemo(() => calcSurvivalCurve(table, "female"), [table]);

  const leM = useMemo(() => calcLifeExpectancy(table, "male", 0).toFixed(1), [table]);
  const leF = useMemo(() => calcLifeExpectancy(table, "female", 0).toFixed(1), [table]);
  const le30M = useMemo(() => calcLifeExpectancy(table, "male", 30).toFixed(1), [table]);
  const le30F = useMemo(() => calcLifeExpectancy(table, "female", 30).toFixed(1), [table]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
        <Select label="生命表" value={table} onChange={setTable}
          options={Object.keys(TABLES).map(k => ({ value: k, label: TABLES[k].name }))} />
        <Select label="对比表" value={compareTable} onChange={setCompareTable}
          options={[{ value: "", label: "无" }, ...Object.keys(TABLES).filter(k => k !== table).map(k => ({ value: k, label: k }))]} />
        <Input label="起始年龄" value={ageRange[0]} onChange={v => setAgeRange([v, ageRange[1]])} min={0} max={104} style={{ width: 80 }} />
        <Input label="终止年龄" value={ageRange[1]} onChange={v => setAgeRange([ageRange[0], v])} min={1} max={105} style={{ width: 80 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 2 }}>
          <input type="checkbox" checked={logScale} onChange={e => setLogScale(e.target.checked)} style={{ accentColor: theme.accent }} />
          <Label>对数坐标</Label>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <Card><Stat label="男性期望寿命(0岁)" value={leM} color={theme.accent} sub="years" /></Card>
        <Card><Stat label="女性期望寿命(0岁)" value={leF} color={theme.pink} sub="years" /></Card>
        <Card><Stat label="男性余命(30岁)" value={le30M} color={theme.accent} sub="years" /></Card>
        <Card><Stat label="女性余命(30岁)" value={le30F} color={theme.pink} sub="years" /></Card>
      </div>

      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: theme.text }}>死亡率曲线 qx (‰)</div>
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
            <XAxis dataKey="age" stroke={theme.textDim} fontSize={11} />
            <YAxis stroke={theme.textDim} fontSize={11} scale={logScale ? "log" : "auto"} domain={logScale ? [0.01, "auto"] : [0, "auto"]}
              allowDataOverflow tickFormatter={v => v >= 1 ? v.toFixed(0) : v.toFixed(2)} />
            <Tooltip contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: theme.text }} />
            <Legend />
            <Line type="monotone" dataKey="male" stroke={theme.accent} strokeWidth={2} dot={false} name={`${table} 男`} />
            <Line type="monotone" dataKey="female" stroke={theme.pink} strokeWidth={2} dot={false} name={`${table} 女`} />
            {compareTable && <Line type="monotone" dataKey="male2" stroke={theme.purple} strokeWidth={1.5} dot={false} strokeDasharray="5 5" name={`${compareTable} 男`} />}
            {compareTable && <Line type="monotone" dataKey="female2" stroke={theme.orange} strokeWidth={1.5} dot={false} strokeDasharray="5 5" name={`${compareTable} 女`} />}
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: theme.text }}>生存人数 lx (10万人)</div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={survivalM.filter((_, i) => i <= 105)}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
              <XAxis dataKey="age" stroke={theme.textDim} fontSize={11} />
              <YAxis stroke={theme.textDim} fontSize={11} tickFormatter={v => (v / 1000).toFixed(0) + "k"} />
              <Tooltip contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="lx" stroke={theme.accent} fill={theme.accent} fillOpacity={0.15} name="男性 lx" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: theme.text }}>生存人数 lx (10万人)</div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={survivalF.filter((_, i) => i <= 105)}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
              <XAxis dataKey="age" stroke={theme.textDim} fontSize={11} />
              <YAxis stroke={theme.textDim} fontSize={11} tickFormatter={v => (v / 1000).toFixed(0) + "k"} />
              <Tooltip contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="lx" stroke={theme.pink} fill={theme.pink} fillOpacity={0.15} name="女性 lx" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

// ==========================================
// Premium Calculator
// ==========================================
function PremiumCalc() {
  const [table, setTable] = useState("CL1");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(30);
  const [benefit, setBenefit] = useState(1000000);
  const [interest, setInterest] = useState(0.035);
  const [term, setTerm] = useState(20);

  const result = useMemo(() => {
    const Ax = calcAx(table, gender, age, interest);
    const ann = calcAnnuity(table, gender, age, interest);
    const termAx = (() => {
      let lx = 1, ax = 0;
      for (let t = 0; t < term; t++) {
        const qx = getQx(table, gender, age + t);
        ax += lx * qx * Math.pow(1 + interest, -(t + 1));
        lx *= (1 - qx);
      }
      return ax;
    })();
    const termAnn = (() => {
      let lx = 1, ax = 0;
      for (let t = 0; t < term; t++) {
        ax += lx * Math.pow(1 + interest, -t);
        const qx = getQx(table, gender, age + t);
        lx *= (1 - qx);
      }
      return ax;
    })();
    return {
      wholeLifePremium: benefit * Ax / ann,
      termPremium: benefit * termAx / termAnn,
      Ax, termAx, ann, termAnn,
      singlePremium: benefit * Ax,
      termSinglePremium: benefit * termAx,
    };
  }, [table, gender, age, benefit, interest, term]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Select label="生命表" value={table} onChange={setTable}
          options={Object.keys(TABLES).map(k => ({ value: k, label: k }))} />
        <Select label="性别" value={gender} onChange={setGender}
          options={[{ value: "male", label: "男" }, { value: "female", label: "女" }]} />
        <Input label="年龄" value={age} onChange={setAge} min={0} max={100} style={{ width: 80 }} />
        <Input label="保额" value={benefit} onChange={setBenefit} style={{ width: 140 }} />
        <Input label="预定利率" value={interest} onChange={setInterest} step={0.005} style={{ width: 100 }} />
        <Input label="缴费期(年)" value={term} onChange={setTerm} min={1} max={60} style={{ width: 100 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <Card><Stat label="终身寿险年缴净保费" value={result.wholeLifePremium.toFixed(2)} color={theme.accent} /></Card>
        <Card><Stat label={`${term}年定期年缴净保费`} value={result.termPremium.toFixed(2)} color={theme.green} /></Card>
        <Card><Stat label="终身趸缴净保费" value={result.singlePremium.toFixed(2)} color={theme.orange} /></Card>
      </div>

      <Card>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: theme.text }}>精算现值</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, fontSize: 13 }}>
          <div style={{ color: theme.textMuted }}>Ax (终身) = <span style={{ color: theme.text, fontFamily: "'JetBrains Mono'" }}>{result.Ax.toFixed(6)}</span></div>
          <div style={{ color: theme.textMuted }}>äx (终身) = <span style={{ color: theme.text, fontFamily: "'JetBrains Mono'" }}>{result.ann.toFixed(4)}</span></div>
          <div style={{ color: theme.textMuted }}>Ax:{term}| (定期) = <span style={{ color: theme.text, fontFamily: "'JetBrains Mono'" }}>{result.termAx.toFixed(6)}</span></div>
          <div style={{ color: theme.textMuted }}>äx:{term}| (定期) = <span style={{ color: theme.text, fontFamily: "'JetBrains Mono'" }}>{result.termAnn.toFixed(4)}</span></div>
        </div>
      </Card>
    </div>
  );
}

// ==========================================
// Profit Testing
// ==========================================
function ProfitTesting() {
  const [params, setParams] = useState({
    table: "CL1", gender: "male", age: 30, benefit: 1000000,
    term: 20, interest: 0.035, lapse: 0.05, expenseRate: 0.08,
    commissionRate: 0.4, premiumLoading: 0.3,
  });
  const set = (k, v) => setParams(p => ({ ...p, [k]: v }));

  const result = useMemo(() => runProfitTest(params), [params]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Select label="生命表" value={params.table} onChange={v => set("table", v)}
          options={Object.keys(TABLES).map(k => ({ value: k, label: k }))} />
        <Select label="性别" value={params.gender} onChange={v => set("gender", v)}
          options={[{ value: "male", label: "男" }, { value: "female", label: "女" }]} />
        <Input label="年龄" value={params.age} onChange={v => set("age", v)} min={0} max={100} style={{ width: 70 }} />
        <Input label="保额" value={params.benefit} onChange={v => set("benefit", v)} style={{ width: 120 }} />
        <Input label="期限" value={params.term} onChange={v => set("term", v)} min={1} max={60} style={{ width: 70 }} />
        <Input label="利率" value={params.interest} onChange={v => set("interest", v)} step={0.005} style={{ width: 80 }} />
        <Input label="退保率" value={params.lapse} onChange={v => set("lapse", v)} step={0.01} style={{ width: 80 }} />
        <Input label="费用率" value={params.expenseRate} onChange={v => set("expenseRate", v)} step={0.01} style={{ width: 80 }} />
        <Input label="佣金率" value={params.commissionRate} onChange={v => set("commissionRate", v)} step={0.05} style={{ width: 80 }} />
        <Input label="附加费率" value={params.premiumLoading} onChange={v => set("premiumLoading", v)} step={0.05} style={{ width: 80 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <Card><Stat label="净保费" value={result.netPremium.toFixed(2)} color={theme.accent} /></Card>
        <Card><Stat label="毛保费" value={result.grossPremium.toFixed(2)} color={theme.green} /></Card>
        <Card><Stat label="NBV" value={result.nbv.toFixed(2)} color={result.nbv >= 0 ? theme.green : theme.red} /></Card>
        <Card><Stat label="Ax" value={result.Ax.toFixed(6)} color={theme.purple} /></Card>
      </div>

      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>利润现金流 & 累计利润</div>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={result.results}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
            <XAxis dataKey="year" stroke={theme.textDim} fontSize={11} />
            <YAxis stroke={theme.textDim} fontSize={11} />
            <Tooltip contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 12 }} />
            <Legend />
            <Bar dataKey="profit" fill={theme.accent} fillOpacity={0.7} name="年利润" />
            <Line type="monotone" dataKey="cumProfit" stroke={theme.orange} strokeWidth={2} dot={false} name="累计利润" />
            <ReferenceLine y={0} stroke={theme.textDim} strokeDasharray="3 3" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>现金流分解</div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={result.results.slice(0, 20)}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
            <XAxis dataKey="year" stroke={theme.textDim} fontSize={11} />
            <YAxis stroke={theme.textDim} fontSize={11} />
            <Tooltip contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 12 }} />
            <Legend />
            <Bar dataKey="premium" stackId="a" fill={theme.green} fillOpacity={0.8} name="保费" />
            <Bar dataKey="claim" stackId="b" fill={theme.red} fillOpacity={0.7} name="赔付" />
            <Bar dataKey="commission" stackId="b" fill={theme.orange} fillOpacity={0.7} name="佣金" />
            <Bar dataKey="expense" stackId="b" fill={theme.purple} fillOpacity={0.7} name="费用" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card style={{ overflowX: "auto" }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>逐年明细</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
              {["年", "年龄", "存续%", "保费", "赔付", "佣金", "费用", "利润", "累计"].map(h => (
                <th key={h} style={{ padding: "8px 6px", textAlign: "right", color: theme.textMuted, fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.results.map(r => (
              <tr key={r.year} style={{ borderBottom: `1px solid ${theme.border}` }}>
                <td style={{ padding: "6px", textAlign: "right", color: theme.text }}>{r.year}</td>
                <td style={{ padding: "6px", textAlign: "right", color: theme.textMuted }}>{r.age}</td>
                <td style={{ padding: "6px", textAlign: "right", color: theme.textMuted }}>{r.lx}%</td>
                <td style={{ padding: "6px", textAlign: "right", color: theme.green }}>{r.premium.toFixed(0)}</td>
                <td style={{ padding: "6px", textAlign: "right", color: theme.red }}>{r.claim.toFixed(0)}</td>
                <td style={{ padding: "6px", textAlign: "right", color: theme.orange }}>{r.commission.toFixed(0)}</td>
                <td style={{ padding: "6px", textAlign: "right", color: theme.purple }}>{r.expense.toFixed(0)}</td>
                <td style={{ padding: "6px", textAlign: "right", color: r.profit >= 0 ? theme.green : theme.red }}>{r.profit.toFixed(0)}</td>
                <td style={{ padding: "6px", textAlign: "right", color: r.cumProfit >= 0 ? theme.green : theme.red }}>{r.cumProfit.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ==========================================
// IFRS 17 CSM Module
// ==========================================
function IFRS17Module() {
  const [premium, setPremium] = useState(50000);
  const [claimRatio, setClaimRatio] = useState(0.6);
  const [expenseRatio, setExpenseRatio] = useState(0.15);
  const [riskAdj, setRiskAdj] = useState(20000);
  const [interest, setInterest] = useState(0.035);
  const [term, setTerm] = useState(10);

  const result = useMemo(() => calcCSM({ premium, claimRatio, expenseRatio, riskAdj, interest, term }), [premium, claimRatio, expenseRatio, riskAdj, interest, term]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Input label="年保费" value={premium} onChange={setPremium} style={{ width: 120 }} />
        <Input label="赔付率" value={claimRatio} onChange={setClaimRatio} step={0.05} style={{ width: 100 }} />
        <Input label="费用率" value={expenseRatio} onChange={setExpenseRatio} step={0.01} style={{ width: 100 }} />
        <Input label="风险调整" value={riskAdj} onChange={setRiskAdj} style={{ width: 120 }} />
        <Input label="折现率" value={interest} onChange={setInterest} step={0.005} style={{ width: 100 }} />
        <Input label="保障期" value={term} onChange={setTerm} min={1} max={40} style={{ width: 80 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <Card><Stat label="初始 CSM" value={result.initialCSM.toFixed(0)} color={theme.accent} /></Card>
        <Card><Stat label="首年摊销" value={result.results[0]?.amortization.toFixed(0) || "0"} color={theme.green} /></Card>
        <Card><Stat label="末年余额" value={result.results[result.results.length - 1]?.remaining.toFixed(0) || "0"} color={theme.orange} /></Card>
      </div>

      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>CSM 摊销 & 余额</div>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={result.results}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
            <XAxis dataKey="year" stroke={theme.textDim} fontSize={11} />
            <YAxis stroke={theme.textDim} fontSize={11} />
            <Tooltip contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 12 }} />
            <Legend />
            <Bar dataKey="amortization" fill={theme.green} fillOpacity={0.7} name="CSM 摊销" />
            <Line type="monotone" dataKey="remaining" stroke={theme.accent} strokeWidth={2} dot={false} name="CSM 余额" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>保险收入 (保费 + CSM 释放)</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={result.results}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
            <XAxis dataKey="year" stroke={theme.textDim} fontSize={11} />
            <YAxis stroke={theme.textDim} fontSize={11} />
            <Tooltip contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="revenue" fill={theme.purple} fillOpacity={0.7} name="保险收入" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ==========================================
// AI Copilot
// ==========================================
function AICopilot() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const askAI = useCallback(async () => {
    if (!question.trim() || loading) return;
    const q = question.trim();
    setQuestion("");
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setLoading(true);

    try {
      const systemPrompt = `你是一名资深寿险精算师（Life Actuary）和IFRS 17专家。

你的专业领域包括：
- 中国人身保险业经验生命表（2025）解读，包含CL1(养老类)、CL2(非养老类一)、CL3(非养老类二)、CL4(单一生命体)四张表
- 保险产品精算定价（净保费、毛保费、趸缴保费）
- IFRS 17 保险合同准则（BBA/VFA/PAA、CSM摊销、风险调整、覆盖单元）
- Profit Testing 利润测试
- 死亡率建模 (Lee-Carter, CBD等)
- 准备金计算 (Net Premium Reserve, Gross Premium Reserve)
- 新业务价值 (NBV) 和内含价值 (EV)

请用专业但清晰的语言回答问题。中英文术语并用。如涉及公式，请用文字描述。`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          system: systemPrompt,
          messages: [...messages.slice(-6), { role: "user", content: q }],
        }),
      });
      const data = await response.json();
      const text = data.content?.map(c => c.text || "").join("") || "无法获取回复";
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: `请求失败: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  }, [question, messages, loading]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const presets = [
    "IFRS 17 BBA下CSM的计算步骤是什么？",
    "解释Risk Adjustment的常用方法",
    "CL1和CL2生命表的适用场景有什么区别？",
    "如何进行利润测试(Profit Testing)？",
    "VFA和BBA有什么核心区别？",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "100%" }}>
      {messages.length === 0 && (
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: theme.text }}>精算问答助手</div>
          <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16 }}>基于 Claude API，涵盖 IFRS 17、产品定价、死亡率建模等专业领域</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {presets.map((p, i) => (
              <button key={i} onClick={() => { setQuestion(p); }}
                style={{
                  padding: "8px 14px", background: theme.surface, border: `1px solid ${theme.border}`,
                  borderRadius: 8, color: theme.textMuted, fontSize: 12, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                }}>{p}</button>
            ))}
          </div>
        </div>
      )}

      <div ref={chatRef} style={{
        flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12,
        minHeight: 300, maxHeight: 500, paddingRight: 8,
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            maxWidth: "85%", padding: "12px 16px", borderRadius: 12,
            background: m.role === "user" ? theme.accent : theme.surface,
            color: m.role === "user" ? theme.bg : theme.text,
            fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap",
            border: m.role === "assistant" ? `1px solid ${theme.border}` : "none",
          }}>{m.content}</div>
        ))}
        {loading && (
          <div style={{ alignSelf: "flex-start", padding: "12px 16px", background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 12, color: theme.textMuted, fontSize: 13 }}>
            思考中...
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input value={question} onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && askAI()}
          placeholder="输入精算问题..."
          style={{
            flex: 1, background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 8,
            padding: "12px 16px", color: theme.text, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
            outline: "none",
          }} />
        <Btn primary onClick={askAI} disabled={loading || !question.trim()}>发送</Btn>
      </div>
    </div>
  );
}

// ==========================================
// Main App
// ==========================================
export default function App() {
  const [tab, setTab] = useState("mortality");

  const tabs = [
    { key: "mortality", label: "死亡率分析" },
    { key: "premium", label: "保费计算" },
    { key: "profit", label: "利润测试" },
    { key: "ifrs17", label: "IFRS 17" },
    { key: "ai", label: "AI 问答" },
  ];

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif", background: theme.bg, color: theme.text,
      minHeight: "100vh", padding: 0,
    }}>
      <style>{fonts}</style>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 3px; }
        .recharts-text { fill: ${theme.textDim} !important; }
        input:focus, select:focus { border-color: ${theme.accent} !important; }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${theme.border}`, padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: `linear-gradient(180deg, ${theme.surface} 0%, ${theme.bg} 100%)`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.purple})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700, color: theme.bg,
          }}>A</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>Actuarial Copilot Pro</div>
            <div style={{ fontSize: 11, color: theme.textDim, letterSpacing: 0.5 }}>中国人身保险业经验生命表 2025 · IFRS 17 · AI精算助手</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: theme.textDim, fontFamily: "'JetBrains Mono'" }}>v2.0</div>
      </div>

      {/* Nav */}
      <div style={{
        padding: "8px 32px", display: "flex", gap: 4,
        borderBottom: `1px solid ${theme.border}`, background: theme.bg,
        overflowX: "auto",
      }}>
        {tabs.map(t => <TabBtn key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>{t.label}</TabBtn>)}
      </div>

      {/* Content */}
      <div style={{ padding: "24px 32px", maxWidth: 1200, margin: "0 auto" }}>
        {tab === "mortality" && <MortalityDashboard />}
        {tab === "premium" && <PremiumCalc />}
        {tab === "profit" && <ProfitTesting />}
        {tab === "ifrs17" && <IFRS17Module />}
        {tab === "ai" && <AICopilot />}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "24px", color: theme.textDim, fontSize: 11, borderTop: `1px solid ${theme.border}` }}>
        数据来源：中国人身保险业经验生命表（2025）· IFRS 17 Insurance Contracts · Powered by Claude API
      </div>
    </div>
  );
}
