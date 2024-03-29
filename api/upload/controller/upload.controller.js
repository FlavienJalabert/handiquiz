const fs = require('fs');
const path = require('path');

module.exports.save = (req, res) => {
  if (!req.files) {
    const meta = req.body;
    meta.name.forEach((name) => {
      fs.writeFile(path.join('public', 'uploads', 'meta', `${name}.metajson`), JSON.stringify(meta), (err, response) => {
        if (err) {
          console.error(err);
          res.status(500).send('unable to save the metas, maybe wrong format');
        } else {
          res.status(200).json(response);
        }
      });
    });
  } else {
    console.log(req.files);
    Object.keys(req.files).forEach((key) => {
      const file = req.files[key];
      fs.writeFile(path.join('public', 'uploads', 'images', file.name), file.data, (err, response) => {
        if (err) {
          console.error(err);
          res.status(500).send('unable to save image, maybe wrong format or file name');
        } else {
          res.status(200).json(response);
        }
      });
    });
  }
};
