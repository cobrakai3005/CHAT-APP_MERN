const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.url}`);
  res.status(404);
  next(error);
};
const errorHandler = (err, req, res, next) => {
  console.log(err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  return res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
