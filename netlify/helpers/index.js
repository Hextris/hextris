module.exports = {
  orderScoreFunction: ([aScore, aTime],[bScore, bTime]) => {
    aScore = parseInt(aScore, 10);
    bScore = parseInt(bScore, 10);
    if (aScore < bScore) {
      return 1;
    } else if (aScore > bScore) {
      return -1;
    } else {
      return (aTime < bTime) ? 1: (aTime > bTime) ? -1 : 0;
    }
  }
}