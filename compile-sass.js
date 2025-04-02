const sass = require('sass');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'src/scss/style.scss');
const outputFile = path.join(__dirname, 'dist/css/style.css');

sass.render({
  file: inputFile,
  outFile: outputFile,
  sourceMap: true
}, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, result.css);
    console.log('SCSS compiled to CSS!');
  }
});
