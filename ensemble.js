function ensemble(models){
  let r={home:0,draw:0,away:0};
  models.forEach(m=>{
    r.home+=m.homeWin;
    r.draw+=m.draw;
    r.away+=m.awayWin;
  });
  return {
    home:r.home/models.length,
    draw:r.draw/models.length,
    away:r.away/models.length
  };
}
module.exports=ensemble;
