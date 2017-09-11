import mongoose from 'mongoose'
global.Promise = require('bluebird')
mongoose.Promise = require('bluebird')
require('./models')

if(process.env.NODE_ENV != 'production')
  require('dotenv').load()
const DATABASE_URL = 'mongodb://localhost/bluenile_db'
export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, {useMongoClient:true}, (err, success) => {
      console.log('error', err, 'success', success)
      if(!!err) {
        reject(err)
      }
      else {
        resolve('connected to database')
      }
    })
    
  })
}

export const headers = {
    'accept-encoding': 'gzip, deflate, br',
    'x-requested-with': 'XMLHttpRequest',
    'accept-language': 'en-US,en;q=0.8',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
    'accept': '*/*',
    'referer': 'https://www.bluenile.com/diamond-search?track=NavDiaSeaRD',
    'authority': 'www.bluenile.com',
    'x-bn-pageid': 'Diamond Search',
    'Cookie': 'cookie: split=ver~4&DIA_PRICE~TEST&HUGE_HP~CONTROL&DIASER_MOD~CONTROL; locale=ver~2&country~USA&currency~USD&language~en-us&productSet~BN; clrdsearch=ver~2&view~grid; devconfig=ver~4&debugmode~false&force_serve_awesome~false&force_serve_local_chat~false&force_serve_non_awesome~false&force_serve_non_local_chat~false&force_serve_non_pre_launch~false&force_serve_non_solr~false&force_serve_pre_launch~false&force_serve_solr~false; GUID=E5CEA5BA_4912_4B35_84BB_B918D156886A; browserCheckCookie=true; sitetrack=ver~3&jse~1; bnper=ver~6&NIB~0&DM~-&GUID~E5CEA5BA_4912_4B35_84BB_B918D156886A&SESS-CT~1&STC~82C9X1&FB_MINI~false&SUB~false; bnses=ver~2&cdclosed~false&ace~false&isbml~false&livechat~false&fbcs~false&imeu~false&ss~0&mbpop~false&sswpu~true&deo~false&nogtm~false; pop=ver~3&belpop~false&china~false&emailpop~false&french~false&ie~false&internationalSelect~false&iphoneApp~false&survey~false&uae~false&webroompop~true; migrationstatus=ver~2&redirected~false; _dc_gtm_UA-171306-15=1; dsearch=ver~7&visible~800005000&newUser~false&state~RD-50-1500-------------------1------0%2Cnull%2Cnull-price-asc-USD-3-3%2C4%2C5%2C6-1%2C2%2C3%2C4%2C5%2C6%2C7%2C8--false; bc_pv_end=; device=ver~2&device_type~Desktop&orientation~Portrait&resolution~880x840; _bcvm_vid_3855064483794580490=618410267134024222T21FE9B90EF13AFFF6C549008D96D261FA8E8A759688E1737FDB4891FF6C1127FE5454AA285169145BBA2A872E6941BF6256411AF277CBA8A4D67794A163F56DE; _bcvm_vrid_3855064483794580490=618403958159526864TBDC4B328147CC2922C53E2B642992A62A72979FC8EB57CA02931F0C25AE930462C1C427CFE3933B6771597EFFCCEC6251F92625195FFBEFC4EAD89F998AB0D87; mp_blue_nile_mixpanel=%7B%22distinct_id%22%3A%20%2215e3eef584b77d-0eb8f8390e3304-31637e01-1aeaa0-15e3eef584c6b2%22%7D; _ga=GA1.2.965135694.1504294427; _gid=GA1.2.620405445.1504900857'
};


export const DEFAULT_START_INDEX = 0
export const DEFAULT_END_INDEX = 257
export const INCREMENT_VARIABLE = 257
export const CARET_INCREMENT_VARIABLE = 0.1
export const START_CARET = 0.50
export const END_CARET = 10