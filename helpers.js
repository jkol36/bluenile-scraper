import agent from 'superagent-bluebird-promise'


export const fetchBluenileDiamonds = (startIndex, caret) => {
  let url =  `https://www.bluenile.com/api/public/diamond-search-grid/v2?country=USA&language=en-us&currency=USD&startIndex=${startIndex}&pageSize=257&shape=RD&minCut=Ideal&maxCut=Signature%20Ideal&minColor=H&maxColor=H&hasVisualization=false&minCarat=${caret}&maxCarat=${caret}&sortColumn=price&sortDirection=asc&_=1504925444393`
  return agent
          .get(url)
          .then(res => res.body.results)
          .catch(err => err)
}