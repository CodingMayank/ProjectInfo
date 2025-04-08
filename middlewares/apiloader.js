module.exports = function apiLoader(req, res, next) {
  console.log(`Processing request: ${req.method} ${req.url}`);

  // 2 sec ka delay
  setTimeout(() => {
      next(); 
  }, 2000);
};
