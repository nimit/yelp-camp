module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); //Equivalent to .catch(e => next(e))
  };
};
