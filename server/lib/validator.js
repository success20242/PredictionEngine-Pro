function validate(match) {
  if (!match.homeTeam || !match.awayTeam) return false;
  if (match.homeTeam === match.awayTeam) return false;
  return true;
}

module.exports = validate;
