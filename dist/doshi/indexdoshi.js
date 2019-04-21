"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _doshicrwler = require("./doshicrwler");

//jshint esversion: 6
//jshint ignore:start
var cron = require("node-cron");

var express = require("express");

var fs = require("fs");

var datastore = require('../../radharani/doshidatastore'); //require("babel-core/register");
//require("babel-polyfill");


var uuidv4 = require('uuid/v4');

var moment = require('moment');

//import { loggers } from 'winston';
var app = express();

function startProcess() {
  return _startProcess.apply(this, arguments);
}

function _startProcess() {
  _startProcess = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var doshicrawler, response;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _doshicrwler.Logger.log('info', "Starting process ...");

            _context.next = 3;
            return datastore.fetchCities();

          case 3:
            this.cities = _context.sent;
            _context.next = 6;
            return datastore.fetchAirlines();

          case 6:
            this.airlines = _context.sent;

            if (!(this.cities === null || this.cities === undefined || this.cities.length === 0)) {
              _context.next = 9;
              break;
            }

            return _context.abrupt("return");

          case 9:
            if (!(this.airlines === null || this.airlines === undefined || this.airlines.length === 0)) {
              _context.next = 11;
              break;
            }

            return _context.abrupt("return");

          case 11:
            doshicrawler = new _doshicrwler.DoshiCrawler({
              url: '',
              output: 'json',
              cities: this.cities,
              airlines: this.airlines
            });
            response = doshicrawler.postData({
              url: 'https://api.doshitravels.com/ticket/getFlightDetails',
              data: {}
            });
            response.then(function (data) {
              _doshicrwler.Logger.log("info", JSON.stringify(data.success));

              _doshicrwler.Logger.log('info', JSON.stringify(doshicrawler.finalData));

              var runid = "".concat(uuidv4(), "_").concat(moment().format("DD-MMM-YYYY HH:mm:ss.SSS"));
              datastore.saveCircleBatchData(runid, doshicrawler.finalData, "", function (rrid) {
                datastore.finalization(rrid, function () {
                  _doshicrwler.Logger.log('info', 'Finished');

                  process.removeAllListeners("unhandledRejection");
                  process.removeAllListeners('exit');
                  process.removeAllListeners();
                  return;
                });
                return;
              });
            }).catch(function (error) {
              _doshicrwler.Logger.log("error", error);
            });

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _startProcess.apply(this, arguments);
}

var excutionStarted = false; // cron.schedule("*/5 * * * *", function() {
//     Logger.log("info", "Cron started");
//     if(excutionStarted) {
//         Logger.log("info", 'Previous process still running ...');
//         return false;
//     }

try {
  excutionStarted = true;
  process.on('unhandledRejection', function (reason, promise) {
    _doshicrwler.Logger.log('info', 'Unhandled Rejection at:', reason);
  });
  startProcess();
} catch (e) {
  _doshicrwler.Logger.log('error', e);
} finally {
  excutionStarted = false;
} // });
// app.listen("3235");
//jshint ignore:end
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kb3NoaS9pbmRleGRvc2hpLmpzIl0sIm5hbWVzIjpbImNyb24iLCJyZXF1aXJlIiwiZXhwcmVzcyIsImZzIiwiZGF0YXN0b3JlIiwidXVpZHY0IiwibW9tZW50IiwiYXBwIiwic3RhcnRQcm9jZXNzIiwiTG9nZ2VyIiwibG9nIiwiZmV0Y2hDaXRpZXMiLCJjaXRpZXMiLCJmZXRjaEFpcmxpbmVzIiwiYWlybGluZXMiLCJ1bmRlZmluZWQiLCJsZW5ndGgiLCJkb3NoaWNyYXdsZXIiLCJEb3NoaUNyYXdsZXIiLCJ1cmwiLCJvdXRwdXQiLCJyZXNwb25zZSIsInBvc3REYXRhIiwiZGF0YSIsInRoZW4iLCJKU09OIiwic3RyaW5naWZ5Iiwic3VjY2VzcyIsImZpbmFsRGF0YSIsInJ1bmlkIiwiZm9ybWF0Iiwic2F2ZUNpcmNsZUJhdGNoRGF0YSIsInJyaWQiLCJmaW5hbGl6YXRpb24iLCJwcm9jZXNzIiwicmVtb3ZlQWxsTGlzdGVuZXJzIiwiY2F0Y2giLCJlcnJvciIsImV4Y3V0aW9uU3RhcnRlZCIsIm9uIiwicmVhc29uIiwicHJvbWlzZSIsImUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBWUE7O0FBWkE7QUFDQTtBQUNBLElBQU1BLElBQUksR0FBR0MsT0FBTyxDQUFDLFdBQUQsQ0FBcEI7O0FBQ0EsSUFBTUMsT0FBTyxHQUFHRCxPQUFPLENBQUMsU0FBRCxDQUF2Qjs7QUFDQSxJQUFNRSxFQUFFLEdBQUdGLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUNBLElBQU1HLFNBQVMsR0FBR0gsT0FBTyxDQUFDLGdDQUFELENBQXpCLEMsQ0FDQTtBQUNBOzs7QUFFQSxJQUFNSSxNQUFNLEdBQUdKLE9BQU8sQ0FBQyxTQUFELENBQXRCOztBQUNBLElBQU1LLE1BQU0sR0FBR0wsT0FBTyxDQUFDLFFBQUQsQ0FBdEI7O0FBR0E7QUFFQSxJQUFJTSxHQUFHLEdBQUdMLE9BQU8sRUFBakI7O1NBRWVNLFk7Ozs7Ozs7NEJBQWY7QUFBQTtBQUFBO0FBQUE7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QUFTO0FBQ0xqQyxzQkFBT0MsR0FBUCxDQUFXLE9BQVgsRUFBb0JnQyxDQUFwQjtBQUNILENBVkQsU0FXUTtBQUNKSixFQUFBQSxlQUFlLEdBQUcsS0FBbEI7QUFDSCxDLENBQ0w7QUFFQTtBQUVBIiwic291cmNlc0NvbnRlbnQiOlsiLy9qc2hpbnQgZXN2ZXJzaW9uOiA2XHJcbi8vanNoaW50IGlnbm9yZTpzdGFydFxyXG5jb25zdCBjcm9uID0gcmVxdWlyZShcIm5vZGUtY3JvblwiKTtcclxuY29uc3QgZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xyXG5jb25zdCBmcyA9IHJlcXVpcmUoXCJmc1wiKTtcclxuY29uc3QgZGF0YXN0b3JlID0gcmVxdWlyZSgnLi4vLi4vcmFkaGFyYW5pL2Rvc2hpZGF0YXN0b3JlJyk7XHJcbi8vcmVxdWlyZShcImJhYmVsLWNvcmUvcmVnaXN0ZXJcIik7XHJcbi8vcmVxdWlyZShcImJhYmVsLXBvbHlmaWxsXCIpO1xyXG5cclxuY29uc3QgdXVpZHY0ID0gcmVxdWlyZSgndXVpZC92NCcpO1xyXG5jb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxuXHJcbmltcG9ydCB7TG9nZ2VyLCBEb3NoaUNyYXdsZXJ9IGZyb20gJy4vZG9zaGljcndsZXInO1xyXG4vL2ltcG9ydCB7IGxvZ2dlcnMgfSBmcm9tICd3aW5zdG9uJztcclxuXHJcbmxldCBhcHAgPSBleHByZXNzKCk7XHJcblxyXG5hc3luYyBmdW5jdGlvbiBzdGFydFByb2Nlc3MoKSB7XHJcbiAgICBMb2dnZXIubG9nKCdpbmZvJywgXCJTdGFydGluZyBwcm9jZXNzIC4uLlwiKTtcclxuXHJcbiAgICB0aGlzLmNpdGllcyA9IGF3YWl0IGRhdGFzdG9yZS5mZXRjaENpdGllcygpO1xyXG4gICAgdGhpcy5haXJsaW5lcyA9IGF3YWl0IGRhdGFzdG9yZS5mZXRjaEFpcmxpbmVzKCk7XHJcblxyXG4gICAgaWYodGhpcy5jaXRpZXM9PT1udWxsIHx8IHRoaXMuY2l0aWVzPT09dW5kZWZpbmVkIHx8IHRoaXMuY2l0aWVzLmxlbmd0aD09PTApIHJldHVybjtcclxuICAgIGlmKHRoaXMuYWlybGluZXM9PT1udWxsIHx8IHRoaXMuYWlybGluZXM9PT11bmRlZmluZWQgfHwgdGhpcy5haXJsaW5lcy5sZW5ndGg9PT0wKSByZXR1cm47XHJcblxyXG4gICAgbGV0IGRvc2hpY3Jhd2xlciA9IG5ldyBEb3NoaUNyYXdsZXIoe3VybDogJycsIG91dHB1dDogJ2pzb24nLCBjaXRpZXM6IHRoaXMuY2l0aWVzLCBhaXJsaW5lczogdGhpcy5haXJsaW5lc30pO1xyXG4gICAgbGV0IHJlc3BvbnNlID0gZG9zaGljcmF3bGVyLnBvc3REYXRhKHt1cmw6ICdodHRwczovL2FwaS5kb3NoaXRyYXZlbHMuY29tL3RpY2tldC9nZXRGbGlnaHREZXRhaWxzJywgZGF0YToge319KTtcclxuXHJcbiAgICByZXNwb25zZS50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgIExvZ2dlci5sb2coXCJpbmZvXCIsIEpTT04uc3RyaW5naWZ5KGRhdGEuc3VjY2VzcykpO1xyXG5cclxuICAgICAgICBMb2dnZXIubG9nKCdpbmZvJywgSlNPTi5zdHJpbmdpZnkoZG9zaGljcmF3bGVyLmZpbmFsRGF0YSkpO1xyXG5cclxuICAgICAgICBsZXQgcnVuaWQgPSBgJHt1dWlkdjQoKX1fJHttb21lbnQoKS5mb3JtYXQoXCJERC1NTU0tWVlZWSBISDptbTpzcy5TU1NcIil9YDtcclxuICAgICAgICBkYXRhc3RvcmUuc2F2ZUNpcmNsZUJhdGNoRGF0YShydW5pZCwgZG9zaGljcmF3bGVyLmZpbmFsRGF0YSwgXCJcIiwgZnVuY3Rpb24ocnJpZCkge1xyXG4gICAgICAgICAgICBkYXRhc3RvcmUuZmluYWxpemF0aW9uKHJyaWQsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIExvZ2dlci5sb2coJ2luZm8nLCAnRmluaXNoZWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyhcInVuaGFuZGxlZFJlamVjdGlvblwiKTtcclxuICAgICAgICAgICAgICAgIHByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzKCdleGl0Jyk7XHJcbiAgICAgICAgICAgICAgICBwcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycygpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgIExvZ2dlci5sb2coXCJlcnJvclwiLCBlcnJvcik7XHJcbiAgICB9KTtcclxufVxyXG5cclxudmFyIGV4Y3V0aW9uU3RhcnRlZCA9IGZhbHNlO1xyXG4vLyBjcm9uLnNjaGVkdWxlKFwiKi81ICogKiAqICpcIiwgZnVuY3Rpb24oKSB7XHJcbi8vICAgICBMb2dnZXIubG9nKFwiaW5mb1wiLCBcIkNyb24gc3RhcnRlZFwiKTtcclxuLy8gICAgIGlmKGV4Y3V0aW9uU3RhcnRlZCkge1xyXG4vLyAgICAgICAgIExvZ2dlci5sb2coXCJpbmZvXCIsICdQcmV2aW91cyBwcm9jZXNzIHN0aWxsIHJ1bm5pbmcgLi4uJyk7XHJcbi8vICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4vLyAgICAgfVxyXG5cclxuICAgIHRyeVxyXG4gICAge1xyXG4gICAgICAgIGV4Y3V0aW9uU3RhcnRlZCA9IHRydWU7XHJcbiAgICAgICAgcHJvY2Vzcy5vbigndW5oYW5kbGVkUmVqZWN0aW9uJywgKHJlYXNvbiwgcHJvbWlzZSkgPT4ge1xyXG4gICAgICAgICAgICBMb2dnZXIubG9nKCdpbmZvJywnVW5oYW5kbGVkIFJlamVjdGlvbiBhdDonLCByZWFzb24pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHN0YXJ0UHJvY2VzcygpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2goZSkge1xyXG4gICAgICAgIExvZ2dlci5sb2coJ2Vycm9yJywgZSk7XHJcbiAgICB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICBleGN1dGlvblN0YXJ0ZWQgPSBmYWxzZTtcclxuICAgIH1cclxuLy8gfSk7XHJcblxyXG4vLyBhcHAubGlzdGVuKFwiMzIzNVwiKTtcclxuXHJcbi8vanNoaW50IGlnbm9yZTplbmQiXX0=