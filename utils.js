import csv from 'ya-csv'
import csv2json from 'csv2json'
import fs from 'fs'

const allowableColors = ['K', 'J', 'I', 'H', 'G', 'F', 'E', 'D']
export const openIdexJsonFile = (filename) => {
  return new Promise(resolve => {
    var jsonFile = require('json-file-plus');
    var path = require('path'); // in node-core
    var f = path.join(process.cwd(), `${filename}.json`);


    jsonFile(f, function (err, file) {
      console.log(err)
      return resolve(file.data)
    });

  })
}

export const getUniqueIdexDiamonds = array => {
  let idexLookup = {}
  let unique = []
  const findSimilar = item => {
    return Object.keys(item).map(k => {
      return array.filter(obj => obj[k] === obj[item[k]])
    })

  }
  array.forEach(item => {

    let idNum = item['Item ID #']
    if(idexLookup[idNum] === undefined) {
      idexLookup[idNum] = true
      unique.push(item)
    }
  })
  return unique

}

// export const cleanDiamond = diamond => {
//   return 
// }
export const convertCsvToJson = (filename) => {
  fs.createReadStream(`${filename}.csv`)
  .pipe(csv2json({
    // Defaults to comma. 
    separator: ','
  }))
  .pipe(fs.createWriteStream(`${filename}.json`));
}

export const createCsvFileWriter = (file) => {
  return csv.createCsvFileWriter(`${file}.csv`, {'flags': 'a'})
}
export const writeResultsToCsv = (results, csv) => {
  return new Promise(resolve => {
    csv.writeRecord(results)
    resolve()
  })
}
export const writeHeadersToCsv = (headers, csv) => {
  csv.writeRecord(headers)
  return Promise.resolve(200)
}


export const eliminateDuplicates = arr => {
  var i,
    len=arr.length,
    out=[],
    obj={};

  for (i=0;i<len;i++) {
    obj[arr[i]]=0;
  }
  for (i in obj) {
    out.push(i);
  }
  return out;
}

export const removeFile = file => {
  return new Promise((resolve, reject) => {
    fs.unlink(file, (err, res) => {
      if(!!err) {
        reject(err)
      }
      else {
        resolve(res)
      }
    })
  })
}

export const prepareForSave = diamonds => {
  let final = []
  diamonds.map(diamond => {
    let newDiamond = {}
    Object.keys(diamond).map(k => {
      newDiamond[k] = diamond[k].toString()
    })
    final.push(newDiamond)
  })
  return Promise.resolve(final)
}
export const isValid = (idexDiamond) => {
  return (allowableColors.indexOf(idexDiamond.Color) !== -1)
}