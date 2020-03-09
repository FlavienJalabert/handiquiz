const fs = require('fs');

module.exports.getAll = (req, res) => {
  const json = {
    images: [],
  };
  fs.readdir('public/uploads/images', (err, images) => {
    if (err) {
      console.error(err);
    } else {
      const promises = [];
      images.forEach((image, i) => {
        promises[i] = new Promise((resolve, reject) => {
          fs.readFile(`public/uploads/meta/${image}.metajson`, (error, data) => {
            if (error) {
              reject(error);
            } else {
              const meta = JSON.parse(data.toString());
              resolve({
                url: `http://${req.headers.host}/uploads/images/${image}`, // http://localhost:4000/uploads/images/5f8b0f5d94932318ad2d5574936fa48c--play-cat-fanart.jpg
                alt: meta.alt,
                title: meta.title,
              });
            }
          });
        });
      });
      Promise.all(promises).then((values) => {
        json.images = values;
        res.status(200).json(json);
      });
    }
  });
};
