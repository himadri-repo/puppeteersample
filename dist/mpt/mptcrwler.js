"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MPTCrawler = exports.Logger = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

//jshint esversion: 6
//jshint ignore:start
var cron = require("node-cron");

var express = require("express");

var fs = require("fs");

var uuidv4 = require('uuid/v4');

var delay = require('delay');

var moment = require('moment');

var fetch = require('isomorphic-fetch'); //import moment from "moment";
// import "isomorphic-fetch";


var Logger =
/*#__PURE__*/
function () {
  function Logger() {
    (0, _classCallCheck2["default"])(this, Logger);
  }

  (0, _createClass2["default"])(Logger, null, [{
    key: "log",
    value: function log(type, message) {
      switch (type) {
        case "info":
          Logger._write(arguments);

          break;

        case "warning":
          Logger._write(arguments);

          break;

        case "error":
          Logger._write(arguments);

          break;

        default:
          break;
      }
    }
  }, {
    key: "_write",
    value: function _write(type) {
      var time = moment().format("HH:mm:ss.SSS"); //arguments.splice(0)

      var args = Array.from(arguments[0]);
      type = args[0];
      args.splice(0, 1);
      args.unshift(time);
      args.unshift(type.toUpperCase());
      console.log.apply(console, args);
    }
  }]);
  return Logger;
}();

exports.Logger = Logger;

var MPTCrawler =
/*#__PURE__*/
function () {
  function MPTCrawler(options) {
    (0, _classCallCheck2["default"])(this, MPTCrawler);
    this.options = options || {
      url: '',
      output: 'json',
      token: ''
    };
  }

  (0, _createClass2["default"])(MPTCrawler, [{
    key: "getData",
    value: function getData() {
      var _this = this;

      var searchOption = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        url: '',
        data: {
          usrId: 109,
          usrType: 'N'
        },
        token: ''
      };
      // Default options are marked with *
      var json_post = {
        method: "GET",
        // *GET, POST, PUT, DELETE, etc.
        mode: "cors",
        // no-cors, cors, *same-origin
        cache: "no-cache",
        // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin",
        // include, *same-origin, omit
        headers: {
          "Accept": "application/json, text/javascript, */*; q=0.01",
          "Content-Type": "application/json",
          "Authorization": 'Bearer j8edg53swttitdzzYiJ1iNDf7zg3oUdahhwa3EC3xRog08ANaEJYw74sCvAa',
          "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36",
          "Referer": "https://fd.metropolitantravels.com/dashboard",
          "Accept-Encoding": "gzip, deflate, br" // "Cookie": "_ga=GA1.2.1076591431.1557470013; _gid=GA1.2.1851459083.1557470013; remember_web_59ba36addc2b2f9401580f014c7f58ea4e30989d=eyJpdiI6IkpkbExWMnJhR3FhVFwvd3ZYdWRpSytRPT0iLCJ2YWx1ZSI6IldLVXhwMDFpekZKZ1VUVG01d1A0MFpHS3A1TnhlVEhHZWhJQmRcL08rSGlTT2cwYUdEa3NISVhrdThTOUlvenQ4Z05OWXB5Y0dhMU1IczdEN092aitcLzZYQWt4VVBoU1lqVnJCWUZLeGc0ZTBHdlNyWndjMUlveUdhaDVcL2E1dzJVR0pUanVVRWZhZnVyWEZlQm5kNUVuZjRuR0hzK0xjVUVaRFFjVk9OMEVmOD0iLCJtYWMiOiI3YzYzYTMyMjc5Yzc1NWM4N2MwMmM1Yjg5YTlkZDllNDIxMzkwOWI0ZWZlYzI5ZWUzOTdlODc5YjU3YjUzODhjIn0%3D; XSRF-TOKEN=eyJpdiI6IkxzSzRHS0VzZXQ1dnoyUUZGM21cL05BPT0iLCJ2YWx1ZSI6Im95cXBFNktZQlZydmxZclUwVUcwdjhBUlRxbXhHNnNWUmh0OGw4a2Eyejl1ZjRzTklWYTkzcTJrbHZxdURyV0IiLCJtYWMiOiI2MTgyMTRlNDlkZjk4MzAzNmNlZGZiNmVlYWI4ZDg3Njc3Zjc2OGJiZTY4ZjVjNzgxMzZlZTQyYWM3ZjNiYjYwIn0%3D; metropolitan_travels_session=eyJpdiI6IjVicW53N0NZZFJhNktTSVk2T0VBYVE9PSIsInZhbHVlIjoiMjQ3TEx5aEpsN2c5U3lCMmhrUGNDRCs2WUFuczRDUVZSQ2pFbkRpWmkzRStvOVwvMTQ5ZUY1SmUwZjh5SDVuOGQiLCJtYWMiOiJlZDU1ZWY5NDIxYjVjODEzYWJjN2M4YjFjZTM4NDhmZDFmOGY2OTEwMjVkZDExOTlkNzIyNWNlNmJhYWVlMWM5In0%3D;",
          // "Cookie": "metropolitan_travels_session=eyJpdiI6IkxhRE9PZHRmWk4yemlTRE5xTzRDY1E9PSIsInZhbHVlIjoiYVpIbXY5TlU5akRnaTdScm9UVkFvMXJQeThWY3lJN0pZODVmNW9HWEpnQzY5V29wdEpuQXAycTRGZ1dpamVQXC8iLCJtYWMiOiJmNTUzNDBhZTMxMmU2OTA1YzNmYmY4MDA0YzliMTI4ZWQyNzA2NGFhYTE2ZWQxNWY4YWFmZjdjOTNkYzljOTg3In0%3D"
          // "Content-Type": "application/x-www-form-urlencoded",

        },
        redirect: "follow",
        // manual, *follow, error
        referrer: "no-referrer" // no-referrer, *client

      };
      return fetch(searchOption.url, json_post).then(
      /*#__PURE__*/
      function () {
        var _ref = (0, _asyncToGenerator2["default"])(
        /*#__PURE__*/
        _regenerator["default"].mark(function _callee(response) {
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  Logger.log("info", "Response received");
                  _context.next = 3;
                  return response.json();

                case 3:
                  _this.data = _context.sent;
                  _context.next = 6;
                  return _this.transformData(_this.data);

                case 6:
                  _this.finalData = _context.sent;
                  return _context.abrupt("return", _this.data);

                case 8:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }())["catch"](function (reason) {
        Logger.log("error", reason);
        throw reason;
      }); // parses JSON response into native Javascript objects 
    }
  }, {
    key: "transformData",
    value: function () {
      var _transformData = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(data) {
        var parsedDataSet, parsedRecord, i, dataItem;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(data === null || data === undefined || data.length === 0)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                parsedDataSet = [];
                parsedRecord = {};
                data = data;
                i = 0;

              case 6:
                if (!(i < data.length)) {
                  _context2.next = 47;
                  break;
                }

                _context2.prev = 7;
                dataItem = data[i];

                if (dataItem.departure_time === null) {
                  dataItem.departure_time = "00:00";
                }

                _context2.t0 = dataItem.airline.name;
                _context2.t1 = dataItem.flight_number;
                _context2.t2 = -1;
                _context2.next = 15;
                return this._getCircleName(dataItem.sector_name, 0, ['-', ' ', 'to']).then(function (result) {
                  return result;
                })["catch"](function (reason) {
                  return Logger.log('error', reason);
                });

              case 15:
                _context2.t3 = _context2.sent;
                _context2.t4 = dataItem.departure_time;
                _context2.t5 = moment(dataItem.departure_at).format("YYYY-MM-DD");
                _context2.next = 20;
                return this._getDate(moment(dataItem.departure_at).format("YYYY-MM-DD"), dataItem.departure_time).then(function (result) {
                  return result;
                })["catch"](function (reason) {
                  return Logger.log('error', reason);
                });

              case 20:
                _context2.t6 = _context2.sent;
                _context2.t7 = {
                  id: _context2.t2,
                  circle: _context2.t3,
                  time: _context2.t4,
                  date: _context2.t5,
                  epoch_date: _context2.t6
                };
                _context2.t8 = -1;
                _context2.next = 25;
                return this._getCircleName(dataItem.sector_name, 1, ['-', ' ', 'to']).then(function (result) {
                  return result;
                })["catch"](function (reason) {
                  return Logger.log('error', reason);
                });

              case 25:
                _context2.t9 = _context2.sent;
                _context2.t10 = dataItem.departure_time;
                _context2.t11 = moment(dataItem.departure_at).format("YYYY-MM-DD");
                _context2.next = 30;
                return this._getDate(moment(dataItem.departure_at).format("YYYY-MM-DD"), dataItem.departure_time).then(function (result) {
                  return result;
                })["catch"](function (reason) {
                  return Logger.log('error', reason);
                });

              case 30:
                _context2.t12 = _context2.sent;
                _context2.t13 = {
                  id: _context2.t8,
                  circle: _context2.t9,
                  time: _context2.t10,
                  date: _context2.t11,
                  epoch_date: _context2.t12
                };
                _context2.t14 = dataItem.travel_class;
                _context2.t15 = dataItem.available_seats;
                _context2.t16 = dataItem.price;
                _context2.t17 = dataItem.id;
                parsedRecord = {
                  flight: _context2.t0,
                  flight_number: _context2.t1,
                  departure: _context2.t7,
                  arrival: _context2.t13,
                  ticket_type: _context2.t14,
                  availability: _context2.t15,
                  price: _context2.t16,
                  flight_id: 1,
                  runid: '',
                  recid: _context2.t17
                };
                parsedDataSet.push(parsedRecord);
                Logger.log('info', 'Data', JSON.stringify(parsedRecord));
                _context2.next = 44;
                break;

              case 41:
                _context2.prev = 41;
                _context2.t18 = _context2["catch"](7);
                Logger.log('error', _context2.t18);

              case 44:
                i++;
                _context2.next = 6;
                break;

              case 47:
                return _context2.abrupt("return", parsedDataSet);

              case 48:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[7, 41]]);
      }));

      function transformData(_x2) {
        return _transformData.apply(this, arguments);
      }

      return transformData;
    }()
  }, {
    key: "_getCircleName",
    value: function () {
      var _getCircleName2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(circle, index) {
        var delimeters,
            circleName,
            idx,
            delimeter,
            circles,
            _args3 = arguments;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                delimeters = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : ['-', ' ', 'to'];
                circleName = '';
                idx = 0;

              case 3:
                if (!(idx < delimeters.length)) {
                  _context3.next = 13;
                  break;
                }

                delimeter = delimeters[idx];

                if (!(circle !== null && circle !== undefined && circle.indexOf(delimeter) > -1)) {
                  _context3.next = 10;
                  break;
                }

                circles = circle.split(delimeter);

                if (!(circles.length > 0)) {
                  _context3.next = 10;
                  break;
                }

                circleName = circles[index].trim();
                return _context3.abrupt("break", 13);

              case 10:
                idx++;
                _context3.next = 3;
                break;

              case 13:
                if (circleName.toLowerCase().indexOf('bengaluru') > -1) circleName = 'Bangalore';
                return _context3.abrupt("return", circleName);

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function _getCircleName(_x3, _x4) {
        return _getCircleName2.apply(this, arguments);
      }

      return _getCircleName;
    }()
  }, {
    key: "_getDate",
    value: function () {
      var _getDate2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(strDate, strTime) {
        var dt;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                dt = Date.now();

                try {
                  dt = Date.parse("".concat(strDate, " ").concat(strTime));
                } catch (e) {
                  Logger.log('error', e);
                }

                return _context4.abrupt("return", dt);

              case 3:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function _getDate(_x5, _x6) {
        return _getDate2.apply(this, arguments);
      }

      return _getDate;
    }()
  }]);
  return MPTCrawler;
}(); //jshint ignore:end


exports.MPTCrawler = MPTCrawler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tcHQvbXB0Y3J3bGVyLmpzIl0sIm5hbWVzIjpbImNyb24iLCJyZXF1aXJlIiwiZXhwcmVzcyIsImZzIiwidXVpZHY0IiwiZGVsYXkiLCJtb21lbnQiLCJmZXRjaCIsIkxvZ2dlciIsInR5cGUiLCJtZXNzYWdlIiwiX3dyaXRlIiwiYXJndW1lbnRzIiwidGltZSIsImZvcm1hdCIsImFyZ3MiLCJBcnJheSIsImZyb20iLCJzcGxpY2UiLCJ1bnNoaWZ0IiwidG9VcHBlckNhc2UiLCJjb25zb2xlIiwibG9nIiwiYXBwbHkiLCJNUFRDcmF3bGVyIiwib3B0aW9ucyIsInVybCIsIm91dHB1dCIsInRva2VuIiwic2VhcmNoT3B0aW9uIiwiZGF0YSIsInVzcklkIiwidXNyVHlwZSIsImpzb25fcG9zdCIsIm1ldGhvZCIsIm1vZGUiLCJjYWNoZSIsImNyZWRlbnRpYWxzIiwiaGVhZGVycyIsInJlZGlyZWN0IiwicmVmZXJyZXIiLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwidHJhbnNmb3JtRGF0YSIsImZpbmFsRGF0YSIsInJlYXNvbiIsInVuZGVmaW5lZCIsImxlbmd0aCIsInBhcnNlZERhdGFTZXQiLCJwYXJzZWRSZWNvcmQiLCJpIiwiZGF0YUl0ZW0iLCJkZXBhcnR1cmVfdGltZSIsImFpcmxpbmUiLCJuYW1lIiwiZmxpZ2h0X251bWJlciIsIl9nZXRDaXJjbGVOYW1lIiwic2VjdG9yX25hbWUiLCJyZXN1bHQiLCJkZXBhcnR1cmVfYXQiLCJfZ2V0RGF0ZSIsImlkIiwiY2lyY2xlIiwiZGF0ZSIsImVwb2NoX2RhdGUiLCJ0cmF2ZWxfY2xhc3MiLCJhdmFpbGFibGVfc2VhdHMiLCJwcmljZSIsImZsaWdodCIsImRlcGFydHVyZSIsImFycml2YWwiLCJ0aWNrZXRfdHlwZSIsImF2YWlsYWJpbGl0eSIsImZsaWdodF9pZCIsInJ1bmlkIiwicmVjaWQiLCJwdXNoIiwiSlNPTiIsInN0cmluZ2lmeSIsImluZGV4IiwiZGVsaW1ldGVycyIsImNpcmNsZU5hbWUiLCJpZHgiLCJkZWxpbWV0ZXIiLCJpbmRleE9mIiwiY2lyY2xlcyIsInNwbGl0IiwidHJpbSIsInRvTG93ZXJDYXNlIiwic3RyRGF0ZSIsInN0clRpbWUiLCJkdCIsIkRhdGUiLCJub3ciLCJwYXJzZSIsImUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBLElBQU1BLElBQUksR0FBR0MsT0FBTyxDQUFDLFdBQUQsQ0FBcEI7O0FBQ0EsSUFBTUMsT0FBTyxHQUFHRCxPQUFPLENBQUMsU0FBRCxDQUF2Qjs7QUFDQSxJQUFNRSxFQUFFLEdBQUdGLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUVBLElBQU1HLE1BQU0sR0FBR0gsT0FBTyxDQUFDLFNBQUQsQ0FBdEI7O0FBQ0EsSUFBTUksS0FBSyxHQUFHSixPQUFPLENBQUMsT0FBRCxDQUFyQjs7QUFDQSxJQUFNSyxNQUFNLEdBQUdMLE9BQU8sQ0FBQyxRQUFELENBQXRCOztBQUNBLElBQU1NLEtBQUssR0FBR04sT0FBTyxDQUFDLGtCQUFELENBQXJCLEMsQ0FFQTtBQUNBOzs7SUFFYU8sTTs7Ozs7Ozs7O3dCQUNFQyxJLEVBQU1DLE8sRUFBUztBQUN0QixjQUFRRCxJQUFSO0FBQ0ksYUFBSyxNQUFMO0FBQ0FELFVBQUFBLE1BQU0sQ0FBQ0csTUFBUCxDQUFjQyxTQUFkOztBQUNJOztBQUNKLGFBQUssU0FBTDtBQUNJSixVQUFBQSxNQUFNLENBQUNHLE1BQVAsQ0FBY0MsU0FBZDs7QUFDQTs7QUFDSixhQUFLLE9BQUw7QUFDSUosVUFBQUEsTUFBTSxDQUFDRyxNQUFQLENBQWNDLFNBQWQ7O0FBQ0E7O0FBQ0o7QUFDSTtBQVhSO0FBYUg7OzsyQkFFYUgsSSxFQUFNO0FBQ2hCLFVBQUlJLElBQUksR0FBR1AsTUFBTSxHQUFHUSxNQUFULENBQWdCLGNBQWhCLENBQVgsQ0FEZ0IsQ0FFaEI7O0FBQ0EsVUFBSUMsSUFBSSxHQUFHQyxLQUFLLENBQUNDLElBQU4sQ0FBV0wsU0FBUyxDQUFDLENBQUQsQ0FBcEIsQ0FBWDtB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a0RBRUdBLFU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxREFHSVEsTyxFQUFTQyxPOzs7Ozs7QUFDaEJDLGdCQUFBQSxFLEdBQUtDLElBQUksQ0FBQ0MsR0FBTCxFOztBQUNULG9CQUFHO0FBQ0NGLGtCQUFBQSxFQUFFLEdBQUdDLElBQUksQ0FBQ0UsS0FBTCxXQUFjTCxPQUFkLGNBQXlCQyxPQUF6QixFQUFMO0FBQ0gsaUJBRkQsQ0FHQSxPQUFNSyxDQUFOLEVBQVM7QUFDTHhGLGtCQUFBQSxNQUFNLENBQUNjLEdBQVAsQ0FBVyxPQUFYLEVBQW9CMEUsQ0FBcEI7QUFDSDs7a0RBRU1KLEU7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQUlmIiwic291cmNlc0NvbnRlbnQiOlsiLy9qc2hpbnQgZXN2ZXJzaW9uOiA2XHJcbi8vanNoaW50IGlnbm9yZTpzdGFydFxyXG5jb25zdCBjcm9uID0gcmVxdWlyZShcIm5vZGUtY3JvblwiKTtcclxuY29uc3QgZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xyXG5jb25zdCBmcyA9IHJlcXVpcmUoXCJmc1wiKTtcclxuXHJcbmNvbnN0IHV1aWR2NCA9IHJlcXVpcmUoJ3V1aWQvdjQnKTtcclxuY29uc3QgZGVsYXkgPSByZXF1aXJlKCdkZWxheScpO1xyXG5jb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxuY29uc3QgZmV0Y2ggPSByZXF1aXJlKCdpc29tb3JwaGljLWZldGNoJyk7XHJcblxyXG4vL2ltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xyXG4vLyBpbXBvcnQgXCJpc29tb3JwaGljLWZldGNoXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9nZ2VyIHtcclxuICAgIHN0YXRpYyBsb2codHlwZSwgbWVzc2FnZSkge1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiaW5mb1wiOlxyXG4gICAgICAgICAgICBMb2dnZXIuX3dyaXRlKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIndhcm5pbmdcIjpcclxuICAgICAgICAgICAgICAgIExvZ2dlci5fd3JpdGUoYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiZXJyb3JcIjpcclxuICAgICAgICAgICAgICAgIExvZ2dlci5fd3JpdGUoYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBfd3JpdGUodHlwZSkge1xyXG4gICAgICAgIHZhciB0aW1lID0gbW9tZW50KCkuZm9ybWF0KFwiSEg6bW06c3MuU1NTXCIpO1xyXG4gICAgICAgIC8vYXJndW1lbnRzLnNwbGljZSgwKVxyXG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkuZnJvbShhcmd1bWVudHNbMF0pO1xyXG4gICAgICAgIHR5cGUgPSBhcmdzWzBdO1xyXG4gICAgICAgIGFyZ3Muc3BsaWNlKDAsMSk7XHJcbiAgICBcclxuICAgICAgICBhcmdzLnVuc2hpZnQodGltZSk7XHJcbiAgICAgICAgYXJncy51bnNoaWZ0KHR5cGUudG9VcHBlckNhc2UoKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJncyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNUFRDcmF3bGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt1cmw6ICcnLCBvdXRwdXQ6ICdqc29uJywgdG9rZW46ICcnfTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREYXRhKHNlYXJjaE9wdGlvbj17dXJsOiAnJywgZGF0YToge3VzcklkOiAxMDksIHVzclR5cGU6ICdOJ30sIHRva2VuOiAnJ30pIHtcclxuICAgICAgICAvLyBEZWZhdWx0IG9wdGlvbnMgYXJlIG1hcmtlZCB3aXRoICpcclxuICAgICAgICBsZXQganNvbl9wb3N0ID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIC8vICpHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBldGMuXHJcbiAgICAgICAgICAgIG1vZGU6IFwiY29yc1wiLCAvLyBuby1jb3JzLCBjb3JzLCAqc2FtZS1vcmlnaW5cclxuICAgICAgICAgICAgY2FjaGU6IFwibm8tY2FjaGVcIiwgLy8gKmRlZmF1bHQsIG5vLWNhY2hlLCByZWxvYWQsIGZvcmNlLWNhY2hlLCBvbmx5LWlmLWNhY2hlZFxyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCAvLyBpbmNsdWRlLCAqc2FtZS1vcmlnaW4sIG9taXRcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L2phdmFzY3JpcHQsICovKjsgcT0wLjAxXCIsXHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIFwiQXV0aG9yaXphdGlvblwiOiAnQmVhcmVyIGo4ZWRnNTNzd3R0aXRkenpZaUoxaU5EZjd6ZzNvVWRhaGh3YTNFQzN4Um9nMDhBTmFFSll3NzRzQ3ZBYScsXHJcbiAgICAgICAgICAgICAgICBcIlVzZXItQWdlbnRcIjogXCJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCA2LjE7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS83NC4wLjM3MjkuMTMxIFNhZmFyaS81MzcuMzZcIixcclxuICAgICAgICAgICAgICAgIFwiUmVmZXJlclwiOiBcImh0dHBzOi8vZmQubWV0cm9wb2xpdGFudHJhdmVscy5jb20vZGFzaGJvYXJkXCIsXHJcbiAgICAgICAgICAgICAgICBcIkFjY2VwdC1FbmNvZGluZ1wiOiBcImd6aXAsIGRlZmxhdGUsIGJyXCIsXHJcbiAgICAgICAgICAgICAgICAvLyBcIkNvb2tpZVwiOiBcIl9nYT1HQTEuMi4xMDc2NTkxNDMxLjE1NTc0NzAwMTM7IF9naWQ9R0ExLjIuMTg1MTQ1OTA4My4xNTU3NDcwMDEzOyByZW1lbWJlcl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZD1leUpwZGlJNklrcGtiRXhXTW5KaFIzRmhWRnd2ZDNaWWRXUnBTeXRSUFQwaUxDSjJZV3gxWlNJNklsZExWWGh3TURGcGVrWktaMVZVVkcwMWQxQTBNRnBIUzNBMVRuaGxWRWhIWldoSlFtUmNMMDhyU0dsVFQyY3dZVWRFYTNOSVNWaHJkVGhUT1VsdmVuUTRaMDVPV1hCNVkwZGhNVTFJY3pkRU4wOTJhaXRjTHpaWVFXdDRWVkJvVTFscVZuSkNXVVpMZUdjMFpUQkhkbE55V25kak1VbHZlVWRoYURWY0wyRTFkekpWUjBwVWFuVlZSV1poWm5WeVdFWmxRbTVrTlVWdVpqUnVSMGh6SzB4alZVVmFSRkZqVms5T01FVm1PRDBpTENKdFlXTWlPaUkzWXpZellUTXlNamM1WXpjMU5XTTROMk13TW1NMVlqZzVZVGxrWkRsbE5ESXhNemt3T1dJMFpXWmxZekk1WldVek9UZGxPRGM1WWpVM1lqVXpPRGhqSW4wJTNEOyBYU1JGLVRPS0VOPWV5SnBkaUk2SWt4elN6UkhTMFZ6WlhRMWRub3lVVVpHTTIxY0wwNUJQVDBpTENKMllXeDFaU0k2SW05NWNYQkZOa3RaUWxaeWRteFpjbFV3VlVjd2RqaEJVbFJ4YlhoSE5uTldVbWgwT0d3NGEyRXllamwxWmpSelRrbFdZVGt6Y1RKcmJIWnhkVVJ5VjBJaUxDSnRZV01pT2lJMk1UZ3lNVFJsTkRsa1pqazRNekF6Tm1ObFpHWmlObVZsWVdJNFpEZzNOamMzWmpjMk9HSmlaVFk0WmpWak56Z3hNelpsWlRReVlXTTNaak5pWWpZd0luMCUzRDsgbWV0cm9wb2xpdGFuX3RyYXZlbHNfc2Vzc2lvbj1leUpwZGlJNklqVmljVzUzTjBOWlpGSmhOa3RUU1ZrMlQwVkJZVkU5UFNJc0luWmhiSFZsSWpvaU1qUTNURXg1YUVwc04yYzVVM2xDTW1oclVHTkRSQ3MyV1VGdWN6UkRVVlpTUTJwRmJrUnBXbWt6UlN0dk9Wd3ZNVFE1WlVZMVNtVXdaamg1U0RWdU9HUWlMQ0p0WVdNaU9pSmxaRFUxWldZNU5ESXhZalZqT0RFellXSmpOMk00WWpGalpUTTRORGhtWkRGbU9HWTJPVEV3TWpWa1pERXhPVGxrTnpJeU5XTmxObUpoWVdWbE1XTTVJbjAlM0Q7XCIsXHJcbiAgICAgICAgICAgICAgICAvLyBcIkNvb2tpZVwiOiBcIm1ldHJvcG9saXRhbl90cmF2ZWxzX3Nlc3Npb249ZXlKcGRpSTZJa3hoUkU5UFpIUm1XazR5ZW1sVFJFNXhUelJEWTFFOVBTSXNJblpoYkhWbElqb2lZVnBJYlhZNVRsVTVha1JuYVRkU2NtOVVWa0Z2TVhKUWVUaFdZM2xKTjBwWk9EVm1OVzlIV0VwblF6WTVWMjl3ZEVwdVFYQXljVFJHWjFkcGFtVlFYQzhpTENKdFlXTWlPaUptTlRVek5EQmhaVE14TW1VMk9UQTFZek5tWW1ZNE1EQTBZemxpTVRJNFpXUXlOekEyTkdGaFlURTJaV1F4TldZNFlXRm1aamRqT1ROa1l6bGpPVGczSW4wJTNEXCJcclxuICAgICAgICAgICAgICAgIC8vIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlZGlyZWN0OiBcImZvbGxvd1wiLCAvLyBtYW51YWwsICpmb2xsb3csIGVycm9yXHJcbiAgICAgICAgICAgIHJlZmVycmVyOiBcIm5vLXJlZmVycmVyXCIsIC8vIG5vLXJlZmVycmVyLCAqY2xpZW50XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHNlYXJjaE9wdGlvbi51cmwsIGpzb25fcG9zdClcclxuICAgICAgICAudGhlbihhc3luYyByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIExvZ2dlci5sb2coXCJpbmZvXCIsIFwiUmVzcG9uc2UgcmVjZWl2ZWRcIik7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICAgICAgdGhpcy5maW5hbERhdGEgPSBhd2FpdCB0aGlzLnRyYW5zZm9ybURhdGEodGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWFzb24gPT4ge1xyXG4gICAgICAgICAgICBMb2dnZXIubG9nKFwiZXJyb3JcIiwgcmVhc29uKTtcclxuICAgICAgICAgICAgdGhyb3cgcmVhc29uO1xyXG4gICAgICAgIH0pOyAvLyBwYXJzZXMgSlNPTiByZXNwb25zZSBpbnRvIG5hdGl2ZSBKYXZhc2NyaXB0IG9iamVjdHMgXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgdHJhbnNmb3JtRGF0YShkYXRhKSB7XHJcbiAgICAgICAgaWYoZGF0YT09PW51bGwgfHwgZGF0YT09PXVuZGVmaW5lZCB8fCBkYXRhLmxlbmd0aD09PTApIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IHBhcnNlZERhdGFTZXQgPSBbXTtcclxuICAgICAgICBsZXQgcGFyc2VkUmVjb3JkID0ge307XHJcbiAgICAgICAgZGF0YSA9IGRhdGE7XHJcblxyXG4gICAgICAgIGZvcih2YXIgaT0wOyBpPGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCBkYXRhSXRlbSA9IGRhdGFbaV07XHJcbiAgICAgICAgICAgICAgICBpZihkYXRhSXRlbS5kZXBhcnR1cmVfdGltZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFJdGVtLmRlcGFydHVyZV90aW1lID0gXCIwMDowMFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcGFyc2VkUmVjb3JkID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZsaWdodDogZGF0YUl0ZW0uYWlybGluZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGZsaWdodF9udW1iZXI6IGRhdGFJdGVtLmZsaWdodF9udW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVwYXJ0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2lyY2xlOiBhd2FpdCB0aGlzLl9nZXRDaXJjbGVOYW1lKGRhdGFJdGVtLnNlY3Rvcl9uYW1lLCAwLCBbJy0nLCcgJywgJ3RvJ10pLnRoZW4ocmVzdWx0ID0+IHJlc3VsdCkuY2F0Y2gocmVhc29uID0+IExvZ2dlci5sb2coJ2Vycm9yJywgcmVhc29uKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6IGRhdGFJdGVtLmRlcGFydHVyZV90aW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBtb21lbnQoZGF0YUl0ZW0uZGVwYXJ0dXJlX2F0KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcG9jaF9kYXRlOiBhd2FpdCB0aGlzLl9nZXREYXRlKG1vbWVudChkYXRhSXRlbS5kZXBhcnR1cmVfYXQpLmZvcm1hdChcIllZWVktTU0tRERcIiksIGRhdGFJdGVtLmRlcGFydHVyZV90aW1lKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpLmNhdGNoKHJlYXNvbiA9PiBMb2dnZXIubG9nKCdlcnJvcicsIHJlYXNvbikpXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBhcnJpdmFsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2lyY2xlOiBhd2FpdCB0aGlzLl9nZXRDaXJjbGVOYW1lKGRhdGFJdGVtLnNlY3Rvcl9uYW1lLCAxLCBbJy0nLCAnICcsICd0byddKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpLmNhdGNoKHJlYXNvbiA9PiBMb2dnZXIubG9nKCdlcnJvcicsIHJlYXNvbikpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lOiBkYXRhSXRlbS5kZXBhcnR1cmVfdGltZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbW9tZW50KGRhdGFJdGVtLmRlcGFydHVyZV9hdCkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXBvY2hfZGF0ZTogYXdhaXQgdGhpcy5fZ2V0RGF0ZShtb21lbnQoZGF0YUl0ZW0uZGVwYXJ0dXJlX2F0KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpLCBkYXRhSXRlbS5kZXBhcnR1cmVfdGltZSkudGhlbihyZXN1bHQgPT4gcmVzdWx0KS5jYXRjaChyZWFzb24gPT4gTG9nZ2VyLmxvZygnZXJyb3InLCByZWFzb24pKVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRpY2tldF90eXBlOiBkYXRhSXRlbS50cmF2ZWxfY2xhc3MsXHJcbiAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmlsaXR5OiBkYXRhSXRlbS5hdmFpbGFibGVfc2VhdHMsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IChkYXRhSXRlbS5wcmljZSksXHJcbiAgICAgICAgICAgICAgICAgICAgZmxpZ2h0X2lkOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHJ1bmlkOiAnJyxcclxuICAgICAgICAgICAgICAgICAgICByZWNpZDogZGF0YUl0ZW0uaWRcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgcGFyc2VkRGF0YVNldC5wdXNoKHBhcnNlZFJlY29yZCk7XHJcbiAgICAgICAgICAgICAgICBMb2dnZXIubG9nKCdpbmZvJywgJ0RhdGEnLCBKU09OLnN0cmluZ2lmeShwYXJzZWRSZWNvcmQpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaChlKSB7XHJcbiAgICAgICAgICAgICAgICBMb2dnZXIubG9nKCdlcnJvcicsIGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcGFyc2VkRGF0YVNldDtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBfZ2V0Q2lyY2xlTmFtZShjaXJjbGUsIGluZGV4LCBkZWxpbWV0ZXJzPVsnLScsJyAnLCd0byddKSB7XHJcbiAgICAgICAgbGV0IGNpcmNsZU5hbWUgPSAnJztcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaWR4ID0gMDsgaWR4IDwgZGVsaW1ldGVycy5sZW5ndGg7IGlkeCsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlbGltZXRlciA9IGRlbGltZXRlcnNbaWR4XTtcclxuICAgICAgICAgICAgaWYoY2lyY2xlIT09bnVsbCAmJiBjaXJjbGUhPT11bmRlZmluZWQgJiYgY2lyY2xlLmluZGV4T2YoZGVsaW1ldGVyKT4tMSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNpcmNsZXMgPSBjaXJjbGUuc3BsaXQoZGVsaW1ldGVyKTtcclxuICAgICAgICAgICAgICAgIGlmKGNpcmNsZXMubGVuZ3RoPjApIHtcclxuICAgICAgICAgICAgICAgICAgICBjaXJjbGVOYW1lID0gY2lyY2xlc1tpbmRleF0udHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihjaXJjbGVOYW1lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZignYmVuZ2FsdXJ1Jyk+LTEpXHJcbiAgICAgICAgICAgIGNpcmNsZU5hbWUgPSAnQmFuZ2Fsb3JlJztcclxuXHJcbiAgICAgICAgcmV0dXJuIGNpcmNsZU5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgX2dldERhdGUoc3RyRGF0ZSwgc3RyVGltZSkge1xyXG4gICAgICAgIGxldCBkdCA9IERhdGUubm93KCk7XHJcbiAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICBkdCA9IERhdGUucGFyc2UoYCR7c3RyRGF0ZX0gJHtzdHJUaW1lfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaChlKSB7XHJcbiAgICAgICAgICAgIExvZ2dlci5sb2coJ2Vycm9yJywgZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZHQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vanNoaW50IGlnbm9yZTplbmQiXX0=