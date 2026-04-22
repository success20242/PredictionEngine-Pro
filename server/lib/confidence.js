function confidence(match, count) {
  let score = 0;
  if (match.homeTeam) score += 0.3;
  if (match.awayTeam) score += 0.3;
  if (match.league) score += 0.2;
  if (count >= 2) score += 0.2;
  return score;
}

module.exports = confidence;
