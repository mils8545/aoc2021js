const fs = require('fs')

fs.readFile(process.argv[2], 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  let arrayData = data.split(/\r?\n/);
  console.log(arrayData);
  let firstCount = 0;
  let secondCount = 0;

  for (let i = 1; i < arrayData.length; i++) {
    if ((Number(arrayData[i]) > Number(arrayData[i - 1]))) {
      firstCount++;
    };
  };

  for (let i = 3; i < arrayData.length; i++) {
    if ((Number(arrayData[i]) > Number(arrayData[i - 3]))) {
      secondCount++;
    };
  };
  console.log(`Data Set Size: ${arrayData.length}   Single Increase Count: ${firstCount}   Rolling Set of 3 Increase Count: ${secondCount}`);
});