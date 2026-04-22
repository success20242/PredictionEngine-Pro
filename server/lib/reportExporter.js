const fs = require("fs");

function exportCSV(data){
  const rows=["Team,Prob"];
  data.forEach(d=>rows.push(`${d.team},${d.prob}`));
  fs.writeFileSync("report.csv",rows.join("\n"));
}

module.exports={exportCSV};
