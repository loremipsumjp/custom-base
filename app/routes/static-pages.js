'use strict';

module.exports = {
  public: {
    top: publicTop,
  },
  private: {
    home: privateHome,
  },
}

function publicTop() {
  return function (req, res) {
    res.render('static-pages/public-top')
  }
}

function privateHome() {
  return function (req, res) {
    res.render('static-pages/private-Home')
  }
}
