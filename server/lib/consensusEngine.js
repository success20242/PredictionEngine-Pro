function normalizeKey(teamA, teamB) {
  return `${teamA?.trim().toLowerCase()}_${teamB?.trim().toLowerCase()}`;
}

function isValidMatch(m) {
  if (!m) return false;
  if (!m.homeTeam || !m.awayTeam) return false;
  if (m.homeTeam === m.awayTeam) return false;
  return true;
}

function consensus(dataSets) {
  const map = {};

  if (!Array.isArray(dataSets)) return [];

  dataSets
    .filter(Array.isArray)
    .flat()
    .forEach(m => {
      if (!isValidMatch(m)) return;

      const key = normalizeKey(m.homeTeam, m.awayTeam);

      if (!map[key]) {
        map[key] = {
          count: 0,
          data: {
            homeTeam: m.homeTeam?.trim(),
            awayTeam: m.awayTeam?.trim(),
            league: m.league || "Unknown",
            date: m.date || null
          }
        };
      }

      map[key].count++;

      // keep most complete version of data
      if (m.league && m.league !== "Unknown") {
        map[key].data.league = m.league;
      }

      if (m.date) {
        map[key].data.date = m.date;
      }
    });

  return Object.values(map)
    .map(entry => {
      const confidence =
        entry.count >= 3 ? 0.8 :
        entry.count === 2 ? 0.6 :
        0.4;

      return {
        ...entry.data,
        sources: entry.count,
        confidence
      };
    })
    // 🔥 FIX: don't kill results too aggressively
    .filter(m => m.sources >= 1);
}

module.exports = consensus;
