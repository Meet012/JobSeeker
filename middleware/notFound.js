const notFound = (req, res) => res.status(404).render('errorHandle');

module.exports = notFound;