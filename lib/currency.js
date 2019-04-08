'use strict';

var request = require('request');

function CurrencyController(options) {
  this.node = options.node;
  var refresh = options.currencyRefresh || CurrencyController.DEFAULT_CURRENCY_DELAY;
  this.currencyDelay = refresh * 60000;
  this.rate = 0.00760;
  this.timestamp = Date.now();
  this.source = "calculated";
}

CurrencyController.DEFAULT_CURRENCY_DELAY = 10;

CurrencyController.prototype.index = function(req, res) {
  var self = this;
  var currentTime = Date.now();
  //if ( self.rate === 0 || currentTime >= (self.timestamp + self.currencyDelay) || self.rate === null || self.rate == 'null') {
  if (1) {
    self.timestamp = currentTime;
    request('https://api.coinmarketcap.com/v1/ticker/sexcoin/?convert=USD', function(err, response, body) {
      if (err) {
        self.node.log.error(err);
      }
      if (!err && response.statusCode === 200) {
        self.rate = parseFloat(JSON.parse(body)[0].price_usd);

      }
      res.jsonp({
        status: 200,
        data: { 
          rate: self.rate ,
          source: "queried",
          timestamp: self.timestamp
        }
      });
    });
  } else {
    res.jsonp({
      status: 200,
      data: { 
        rate: self.rate ,
        source: "cached",
        timestamp: self.timestamp
      }
    });
  }

};

module.exports = CurrencyController;
