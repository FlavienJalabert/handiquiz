const fs = require('fs');

fs.readFile('handiquiz/index.html', (err, data) => {
  let file = data.toString();
  if (err) {
    console.error(err);
  }
  file = file.replace(/href=\//gm, 'href=./');
  file = file.replace(/src=\//gm, 'src=./');
  fs.writeFile('handiquiz/index.html', file, (error) => {
    if (error) {
      console.error(err);
    }
  });
});
