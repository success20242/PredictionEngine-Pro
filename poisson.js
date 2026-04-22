function poisson(l, k) {
  return (Math.pow(l, k) * Math.exp(-l)) / factorial(k);
}
function factorial(n){ return n<=1?1:n*factorial(n-1); }

function predict(h, a){
  return {
    homeWin: poisson(h,1),
    draw: 0.2,
    awayWin: poisson(a,1)
  };
}

module.exports = { predict };
