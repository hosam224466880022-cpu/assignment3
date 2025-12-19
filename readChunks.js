const fs = require('fs');

const readStream = fs.createReadStream('./big.txt', {
  encoding: 'utf8',
  highWaterMark: 64
});

readStream.on('data', (chunk) => {
  console.log('Chunk:', chunk);
});

readStream.on('end', () => {
  console.log('Finished reading file');
});
