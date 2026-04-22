function consensus(dataSets) {
  const map = {};

  dataSets.flat().forEach(m => {
    const key = m.homeTeam + m.awayTeam;

    if (!map[key]) map[key] = { count: 0, data: m };

    map[key].count++;
  });

  return Object.values(map)
    .filter(m => m.count >= 2)
    .map(m => m.data);
}

module.exports = consensus;
