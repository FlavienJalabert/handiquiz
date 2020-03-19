module.exports.serverError = (req, res) => {
  res.status(500).send('cannot access');
};
