const fs = require('fs')
// const path = require('path')


function normalize(str){
  return str.replace(/\r/g,'')
}

function isEqual(u, e, tolerance = 1e-6) {
   u = String(u).trim();
   e = String(e).trim();
   
   // First check if strings are exactly equal
   if (u === e) return true;
   
   // Only try numeric comparison if BOTH are valid numbers (no spaces or extra chars)
   const uNum = parseFloat(u);
   const eNum = parseFloat(e);

   // Check if the ENTIRE string is a valid number (not just the beginning)
   const uIsNumber = !isNaN(uNum) && u === String(uNum);
   const eIsNumber = !isNaN(eNum) && e === String(eNum);

   if(uIsNumber && eIsNumber){
    return Math.abs(uNum - eNum) <= tolerance;
   }
   
   return false;
}

function splitTestCases(data) {
  const lines = data.split('\n').map(normalize);
  const cases = [];
  let currentCase = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '---') {
      // Join and preserve the structure
      cases.push(currentCase.join('\n').trim());
      currentCase = [];
    } else {
      currentCase.push(line);
    }
  }
  
  if (currentCase.length > 0) {
    cases.push(currentCase.join('\n').trim());
  }
  
  return cases;
}

function compareOutput(useroutput, expected, inputfile) {
  return new Promise((resolve, reject) => {
    let udata = null, edata = null, idata = null;
    let completed = 0;
    
    fs.readFile(useroutput, 'utf-8', (err, data) => {
      if (err) return reject(err);
      udata = data;
      completed++;
      if (completed === 3) processCompare();
    })
    
    fs.readFile(expected, 'utf-8', (err, data) => {
      if (err) return reject(err);
      edata = data;
      completed++;
      if (completed === 3) processCompare();
    })

    fs.readFile(inputfile, 'utf-8', (err, data) => {
      if (err) return reject(err);
      idata = data;
      completed++;
      if (completed === 3) processCompare();
    })

    function processCompare() {
      const icases = splitTestCases(idata);
      const ucases = splitTestCases(udata);
      const ecases = splitTestCases(edata);

      const total = Math.min(ucases.length, ecases.length, icases.length);

      for (let idx = 0; idx < total; idx++) {
        const u = ucases[idx].trim();
        const e = ecases[idx].trim();
        const inp = icases[idx];

        let matched = isEqual(u, e);

        if (!matched) {
          return resolve({
            caseno: idx + 1,
            input: inp,
            user: u || "(empty)",
            expected: e || "(empty)"
          });
        }
      }

      return resolve(null);
    }
  })
}


module.exports = {compareOutput}
// compareOutput(useroutputfile, outputfile, inputfile)
//   .then(fail => {
//     if (!fail) console.log('all testcases passed')
//     else {
//       console.log(`first failing testcase at ${fail.caseno}`);
//       console.log(`at input:\n${fail.input}`);
//       console.log(`user output:\n${fail.user}`);
//       console.log(`expected output:\n${fail.expected}`);
//     }
//   })
//   .catch(err => {
//     console.error('Error:', err);
//   })