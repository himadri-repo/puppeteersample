"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MPTCrawler = exports.Logger = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

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
        headers: (0, _defineProperty2["default"])({
          "Accept": "application/json, text/javascript, */*; q=0.01",
          "Content-Type": "application/json",
          "Authorization": 'Bearer j8edg53swttitdzzYiJ1iNDf7zg3oUdahhwa3EC3xRog08ANaEJYw74sCvAa',
          "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36",
          "Referer": "https://fd.metropolitantravels.com/dashboard",
          "Accept-Encoding": "gzip, deflate, br",
          "Cookie": "_ga=GA1.2.1076591431.1557470013; _gid=GA1.2.1851459083.1557470013; remember_web_59ba36addc2b2f9401580f014c7f58ea4e30989d=eyJpdiI6InpWMHFVQWtBV3pqZXVIaFwvSCtcL1JxUT09IiwidmFsdWUiOiJNdkFVZytqM3ljOHA5Nit5R1UycWtRdUdUK2lmZ3FPazZNaG95Q1wvdjArbURGeXFZVnR2ZFVxd2s0RVY4dWtCd2g5QWQ1WnhrZGxxZWtzckQwNFRJUWFpTXBFZWRaU3JabFwvTm9lOUxQc3lScmhtXC9CdG5QK2RIU3BQZ0tMalZzeCtkcFVFUXNqWjluSHNnNlQzaER2OStqRVVCRnFzTmV5WkR1dWk4QXBHc1E9IiwibWFjIjoiNjBjMTg1ZGMzYjc4MDYyMTY1ODA2ODZjY2IxMDBmNzhiODlkZjZlMjg4MzNmYTczMDE4ZWRmZjNjMGQ3N2U0OCJ9; XSRF-TOKEN=eyJpdiI6IjJIRkhjQTF2R244WEttRXVkSHJjeXc9PSIsInZhbHVlIjoiS1wvZE1XZGtoWXltaCtqTVdGTGlsM3NocERDYUp3YmNOZTlsaW1XQmxiMnI5TFptM0tmTDFEMHZDWUc3VVBjOEMiLCJtYWMiOiJiNzI1M2MyMWVhMWVkZDYyNjk5YmYwODljZGViMTY1NWJjZmE5YzkwMGU2NjYzYTkxZDhlZWVhZmFhNzgyMGNkIn0%3D;"
        }, "Cookie", "metropolitan_travels_session=eyJpdiI6IkxhRE9PZHRmWk4yemlTRE5xTzRDY1E9PSIsInZhbHVlIjoiYVpIbXY5TlU5akRnaTdScm9UVkFvMXJQeThWY3lJN0pZODVmNW9HWEpnQzY5V29wdEpuQXAycTRGZ1dpamVQXC8iLCJtYWMiOiJmNTUzNDBhZTMxMmU2OTA1YzNmYmY4MDA0YzliMTI4ZWQyNzA2NGFhYTE2ZWQxNWY4YWFmZjdjOTNkYzljOTg3In0%3D"),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tcHQvbXB0Y3J3bGVyLmpzIl0sIm5hbWVzIjpbImNyb24iLCJyZXF1aXJlIiwiZXhwcmVzcyIsImZzIiwidXVpZHY0IiwiZGVsYXkiLCJtb21lbnQiLCJmZXRjaCIsIkxvZ2dlciIsInR5cGUiLCJtZXNzYWdlIiwiX3dyaXRlIiwiYXJndW1lbnRzIiwidGltZSIsImZvcm1hdCIsImFyZ3MiLCJBcnJheSIsImZyb20iLCJzcGxpY2UiLCJ1bnNoaWZ0IiwidG9VcHBlckNhc2UiLCJjb25zb2xlIiwibG9nIiwiYXBwbHkiLCJNUFRDcmF3bGVyIiwib3B0aW9ucyIsInVybCIsIm91dHB1dCIsInRva2VuIiwic2VhcmNoT3B0aW9uIiwiZGF0YSIsInVzcklkIiwidXNyVHlwZSIsImpzb25fcG9zdCIsIm1ldGhvZCIsIm1vZGUiLCJjYWNoZSIsImNyZWRlbnRpYWxzIiwiaGVhZGVycyIsInJlZGlyZWN0IiwicmVmZXJyZXIiLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwidHJhbnNmb3JtRGF0YSIsImZpbmFsRGF0YSIsInJlYXNvbiIsInVuZGVmaW5lZCIsImxlbmd0aCIsInBhcnNlZERhdGFTZXQiLCJwYXJzZWRSZWNvcmQiLCJpIiwiZGF0YUl0ZW0iLCJkZXBhcnR1cmVfdGltZSIsImFpcmxpbmUiLCJuYW1lIiwiZmxpZ2h0X251bWJlciIsIl9nZXRDaXJjbGVOYW1lIiwic2VjdG9yX25hbWUiLCJyZXN1bHQiLCJkZXBhcnR1cmVfYXQiLCJfZ2V0RGF0ZSIsImlkIiwiY2lyY2xlIiwiZGF0ZSIsImVwb2NoX2RhdGUiLCJ0cmF2ZWxfY2xhc3MiLCJhdmFpbGFibGVfc2VhdHMiLCJwcmljZSIsImZsaWdodCIsImRlcGFydHVyZSIsImFycml2YWwiLCJ0aWNrZXRfdHlwZSIsImF2YWlsYWJpbGl0eSIsImZsaWdodF9pZCIsInJ1bmlkIiwicmVjaWQiLCJwdXNoIiwiSlNPTiIsInN0cmluZ2lmeSIsImluZGV4IiwiZGVsaW1ldGVycyIsImNpcmNsZU5hbWUiLCJpZHgiLCJkZWxpbWV0ZXIiLCJpbmRleE9mIiwiY2lyY2xlcyIsInNwbGl0IiwidHJpbSIsInRvTG93ZXJDYXNlIiwic3RyRGF0ZSIsInN0clRpbWUiLCJkdCIsIkRhdGUiLCJub3ciLCJwYXJzZSIsImUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0EsSUFBTUEsSUFBSSxHQUFHQyxPQUFPLENBQUMsV0FBRCxDQUFwQjs7QUFDQSxJQUFNQyxPQUFPLEdBQUdELE9BQU8sQ0FBQyxTQUFELENBQXZCOztBQUNBLElBQU1FLEVBQUUsR0FBR0YsT0FBTyxDQUFDLElBQUQsQ0FBbEI7O0FBRUEsSUFBTUcsTUFBTSxHQUFHSCxPQUFPLENBQUMsU0FBRCxDQUF0Qjs7QUFDQSxJQUFNSSxLQUFLLEdBQUdKLE9BQU8sQ0FBQyxPQUFELENBQXJCOztBQUNBLElBQU1LLE1BQU0sR0FBR0wsT0FBTyxDQUFDLFFBQUQsQ0FBdEI7O0FBQ0EsSUFBTU0sS0FBSyxHQUFHTixPQUFPLENBQUMsa0JBQUQsQ0FBckIsQyxDQUVBO0FBQ0E7OztJQUVhTyxNOzs7Ozs7Ozs7d0JBQ0VDLEksRUFBTUMsTyxFQUFTO0FBQ3RCLGNBQVFELElBQVI7QUFDSSxhQUFLLE1BQUw7QUFDQUQsVUFBQUEsTUFBTSxDQUFDRyxNQUFQLENBQWNDLFNBQWQ7O0FBQ0k7O0FBQ0osYUFBSyxTQUFMO0FBQ0lKLFVBQUFBLE1BQU0sQ0FBQ0csTUFBUCxDQUFjQyxTQUFkOztBQUNBOztBQUNKLGFBQUssT0FBTDtBQUNJSixVQUFBQSxNQUFNLENBQUNHLE1BQVAsQ0FBY0MsU0FBZDs7QUFDQTs7QUFDSjtBQUNJO0FBWFI7QUFhSDs7OzJCQUVhSCxJLEVBQU07QUFDaEIsVUFBSUksSUFBSSxHQUFHUCxNQUFNLEdBQUdRLE1BQVQsQ0FBZ0IsY0FBaEIsQ0FBWCxDQURnQixDQUVoQjs7QUFDQSxVQUFJQyxJQUFJLEdBQUdDLEtBQUssQ0FBQ0MsSUFBTixDQUFXTCxTQUFTLENBQUMsQ0FBRCxDQUFwQixDQUFYO0FBQ0FILE1BQUFBLElBQUksR0FBR00sSUFBSSxDQUFDLENBQUQsQ0FBWDtBQUNBQSxNQUFBQSxJQUFJLENBQUNHLE1BQUwsQ0FBWSxDQUFaLEVBQWMsQ0FBZDtBQUVBSCxNQUFBQSxJQUFJLENBQUNJLE9BQUwsQ0FBYU4sSUFBYjtBQUNBRSxNQUFBQSxJQUFJLENBQUNJLE9BQUwsQ0FBYVYsSUFBSSxDQUFDVyxXQUFMLEVBQWI7QUFDQUMsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlDLEtBQVosQ0FBa0JGLE9BQWxCLEVBQTJCTixJQUEzQjtBQUNIOzs7Ozs7O0lBR1FTLFU7OztBQUNULHNCQUFZQyxPQUFaLEVBQXFCO0FBQUE7QUFDakIsU0FBS0EsT0FBTCxHQUFlQSxPQUFPLElBQUk7QUFBQ0MsTUFBQUEsR0FBRyxFQUFFLEVBQU47QUFBVUMsTUFBQUEsTUFBTSxFQUFFLE1BQWxCO0FBQTBCQyxNQUFBQSxLQUFLLEVBQUU7QUFBakMsS0FBMUI7QUFDSDs7Ozs4QkFFNEU7QUFBQTs7QUFBQSxVQUFyRUMsWUFBcUUsdUVBQXhEO0FBQUNILFFBQUFBLEdBQUcsRUFBRSxFQUFOO0FBQVVJLFFBQUFBLElBQUksRUFBRTtBQUFDQyxVQUFBQSxLQUFLLEVBQUUsR0FBUjtBQUFhQyxVQUFBQSxPQUFPLEVBQUU7QUFBdEIsU0FBaEI7QUFBNENKLFFBQUFBLEtBQUssRUFBRTtBQUFuRCxPQUF3RDtBQUN6RTtBQUNBLFVBQUlLLFNBQVMsR0FBRztBQUNaQyxRQUFBQSxNQUFNLEVBQUUsS0FESTtBQUNHO0FBQ2ZDLFFBQUFBLElBQUksRUFBRSxNQUZNO0FBRUU7QUFDZEMsUUFBQUEsS0FBSyxFQUFFLFVBSEs7QUFHTztBQUNuQkMsUUFBQUEsV0FBVyxFQUFFLGFBSkQ7QUFJZ0I7QUFDNUJDLFFBQUFBLE9BQU87QUFDSCxvQkFBVSxnREFEUDtBQUVILDBCQUFnQixrQkFGYjtBQUdILDJCQUFpQixxRUFIZDtBQUlILHdCQUFjLG9IQUpYO0FBS0gscUJBQVcsOENBTFI7QUFNSCw2QkFBbUIsbUJBTmhCO0FBT0gsb0JBQVU7QUFQUCxxQkFRTyxxUkFSUCxDQUxLO0FBZ0JaQyxRQUFBQSxRQUFRLEVBQUUsUUFoQkU7QUFnQlE7QUFDcEJDLFFBQUFBLFFBQVEsRUFBRSxhQWpCRSxDQWlCYTs7QUFqQmIsT0FBaEI7QUFvQkEsYUFBT2pDLEtBQUssQ0FBQ3NCLFlBQVksQ0FBQ0gsR0FBZCxFQUFtQk8sU0FBbkIsQ0FBTCxDQUNOUSxJQURNO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQ0FDRCxpQkFBTUMsUUFBTjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0ZsQyxrQkFBQUEsTUFBTSxDQUFDYyxHQUFQLENBQVcsTUFBWCxFQUFtQixtQkFBbkI7QUFERTtBQUFBLHlCQUVnQm9CLFFBQVEsQ0FBQ0MsSUFBVCxFQUZoQjs7QUFBQTtBQUVGLGtCQUFBLEtBQUksQ0FBQ2IsSUFGSDtBQUFBO0FBQUEseUJBR3FCLEtBQUksQ0FBQ2MsYUFBTCxDQUFtQixLQUFJLENBQUNkLElBQXhCLENBSHJCOztBQUFBO0FBR0Ysa0JBQUEsS0FBSSxDQUFDZSxTQUhIO0FBQUEsbURBSUssS0FBSSxDQUFDZixJQUpWOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBREM7O0FBQUE7QUFBQTtBQUFBO0FBQUEsb0JBT0EsVUFBQWdCLE1BQU0sRUFBSTtBQUNidEMsUUFBQUEsTUFBTSxDQUFDYyxHQUFQLENBQVcsT0FBWCxFQUFvQndCLE1BQXBCO0FBQ0EsY0FBTUEsTUFBTjtBQUNILE9BVk0sQ0FBUCxDQXRCeUUsQ0FnQ3JFO0FBQ1A7Ozs7OztxREFFbUJoQixJOzs7Ozs7c0JBQ2JBLElBQUksS0FBRyxJQUFQLElBQWVBLElBQUksS0FBR2lCLFNBQXRCLElBQW1DakIsSUFBSSxDQUFDa0IsTUFBTCxLQUFjLEM7Ozs7Ozs7O0FBRWhEQyxnQkFBQUEsYSxHQUFnQixFO0FBQ2hCQyxnQkFBQUEsWSxHQUFlLEU7QUFDbkJwQixnQkFBQUEsSUFBSSxHQUFHQSxJQUFQO0FBRVFxQixnQkFBQUEsQyxHQUFFLEM7OztzQkFBR0EsQ0FBQyxHQUFDckIsSUFBSSxDQUFDa0IsTTs7Ozs7O0FBR1JJLGdCQUFBQSxRLEdBQVd0QixJQUFJLENBQUNxQixDQUFELEM7O0FBQ25CLG9CQUFHQyxRQUFRLENBQUNDLGNBQVQsS0FBNEIsSUFBL0IsRUFBcUM7QUFDakNELGtCQUFBQSxRQUFRLENBQUNDLGNBQVQsR0FBMEIsT0FBMUI7QUFDSDs7K0JBRVdELFFBQVEsQ0FBQ0UsT0FBVCxDQUFpQkMsSTsrQkFDVkgsUUFBUSxDQUFDSSxhOytCQUVoQixDQUFDLEM7O3VCQUNTLEtBQUtDLGNBQUwsQ0FBb0JMLFFBQVEsQ0FBQ00sV0FBN0IsRUFBMEMsQ0FBMUMsRUFBNkMsQ0FBQyxHQUFELEVBQUssR0FBTCxFQUFVLElBQVYsQ0FBN0MsRUFBOERqQixJQUE5RCxDQUFtRSxVQUFBa0IsTUFBTTtBQUFBLHlCQUFJQSxNQUFKO0FBQUEsaUJBQXpFLFdBQTJGLFVBQUFiLE1BQU07QUFBQSx5QkFBSXRDLE1BQU0sQ0FBQ2MsR0FBUCxDQUFXLE9BQVgsRUFBb0J3QixNQUFwQixDQUFKO0FBQUEsaUJBQWpHLEM7Ozs7K0JBQ1JNLFFBQVEsQ0FBQ0MsYzsrQkFDVC9DLE1BQU0sQ0FBQzhDLFFBQVEsQ0FBQ1EsWUFBVixDQUFOLENBQThCOUMsTUFBOUIsQ0FBcUMsWUFBckMsQzs7dUJBQ1ksS0FBSytDLFFBQUwsQ0FBY3ZELE1BQU0sQ0FBQzhDLFFBQVEsQ0FBQ1EsWUFBVixDQUFOLENBQThCOUMsTUFBOUIsQ0FBcUMsWUFBckMsQ0FBZCxFQUFrRXNDLFFBQVEsQ0FBQ0MsY0FBM0UsRUFBMkZaLElBQTNGLENBQWdHLFVBQUFrQixNQUFNO0FBQUEseUJBQUlBLE1BQUo7QUFBQSxpQkFBdEcsV0FBd0gsVUFBQWIsTUFBTTtBQUFBLHlCQUFJdEMsTUFBTSxDQUFDYyxHQUFQLENBQVcsT0FBWCxFQUFvQndCLE1BQXBCLENBQUo7QUFBQSxpQkFBOUgsQzs7Ozs7QUFKbEJnQixrQkFBQUEsRTtBQUNBQyxrQkFBQUEsTTtBQUNBbEQsa0JBQUFBLEk7QUFDQW1ELGtCQUFBQSxJO0FBQ0FDLGtCQUFBQSxVOzsrQkFHSSxDQUFDLEM7O3VCQUNTLEtBQUtSLGNBQUwsQ0FBb0JMLFFBQVEsQ0FBQ00sV0FBN0IsRUFBMEMsQ0FBMUMsRUFBNkMsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLElBQVgsQ0FBN0MsRUFBK0RqQixJQUEvRCxDQUFvRSxVQUFBa0IsTUFBTTtBQUFBLHlCQUFJQSxNQUFKO0FBQUEsaUJBQTFFLFdBQTRGLFVBQUFiLE1BQU07QUFBQSx5QkFBSXRDLE1BQU0sQ0FBQ2MsR0FBUCxDQUFXLE9BQVgsRUFBb0J3QixNQUFwQixDQUFKO0FBQUEsaUJBQWxHLEM7Ozs7Z0NBQ1JNLFFBQVEsQ0FBQ0MsYztnQ0FDVC9DLE1BQU0sQ0FBQzhDLFFBQVEsQ0FBQ1EsWUFBVixDQUFOLENBQThCOUMsTUFBOUIsQ0FBcUMsWUFBckMsQzs7dUJBQ1ksS0FBSytDLFFBQUwsQ0FBY3ZELE1BQU0sQ0FBQzhDLFFBQVEsQ0FBQ1EsWUFBVixDQUFOLENBQThCOUMsTUFBOUIsQ0FBcUMsWUFBckMsQ0FBZCxFQUFrRXNDLFFBQVEsQ0FBQ0MsY0FBM0UsRUFBMkZaLElBQTNGLENBQWdHLFVBQUFrQixNQUFNO0FBQUEseUJBQUlBLE1BQUo7QUFBQSxpQkFBdEcsV0FBd0gsVUFBQWIsTUFBTTtBQUFBLHlCQUFJdEMsTUFBTSxDQUFDYyxHQUFQLENBQVcsT0FBWCxFQUFvQndCLE1BQXBCLENBQUo7QUFBQSxpQkFBOUgsQzs7Ozs7QUFKbEJnQixrQkFBQUEsRTtBQUNBQyxrQkFBQUEsTTtBQUNBbEQsa0JBQUFBLEk7QUFDQW1ELGtCQUFBQSxJO0FBQ0FDLGtCQUFBQSxVOztnQ0FHU2IsUUFBUSxDQUFDYyxZO2dDQUNSZCxRQUFRLENBQUNlLGU7Z0NBQ2ZmLFFBQVEsQ0FBQ2dCLEs7Z0NBR1ZoQixRQUFRLENBQUNVLEU7QUF2QnBCWixnQkFBQUEsWTtBQUNJbUIsa0JBQUFBLE07QUFDQWIsa0JBQUFBLGE7QUFDQWMsa0JBQUFBLFM7QUFPQUMsa0JBQUFBLE87QUFRQUMsa0JBQUFBLFc7QUFDQUMsa0JBQUFBLFk7QUFDQUwsa0JBQUFBLEs7QUFDQU0sa0JBQUFBLFMsRUFBVyxDO0FBQ1hDLGtCQUFBQSxLLEVBQU8sRTtBQUNQQyxrQkFBQUEsSzs7QUFHSjNCLGdCQUFBQSxhQUFhLENBQUM0QixJQUFkLENBQW1CM0IsWUFBbkI7QUFDQTFDLGdCQUFBQSxNQUFNLENBQUNjLEdBQVAsQ0FBVyxNQUFYLEVBQW1CLE1BQW5CLEVBQTJCd0QsSUFBSSxDQUFDQyxTQUFMLENBQWU3QixZQUFmLENBQTNCOzs7Ozs7O0FBR0ExQyxnQkFBQUEsTUFBTSxDQUFDYyxHQUFQLENBQVcsT0FBWDs7O0FBckNvQjZCLGdCQUFBQSxDQUFDLEU7Ozs7O2tEQXlDdEJGLGE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxREFHVWMsTSxFQUFRaUIsSzs7Ozs7Ozs7Ozs7QUFBT0MsZ0JBQUFBLFUsOERBQVcsQ0FBQyxHQUFELEVBQUssR0FBTCxFQUFTLElBQVQsQztBQUN2Q0MsZ0JBQUFBLFUsR0FBYSxFO0FBRVJDLGdCQUFBQSxHLEdBQU0sQzs7O3NCQUFHQSxHQUFHLEdBQUdGLFVBQVUsQ0FBQ2pDLE07Ozs7O0FBQ3pCb0MsZ0JBQUFBLFMsR0FBWUgsVUFBVSxDQUFDRSxHQUFELEM7O3NCQUN6QnBCLE1BQU0sS0FBRyxJQUFULElBQWlCQSxNQUFNLEtBQUdoQixTQUExQixJQUF1Q2dCLE1BQU0sQ0FBQ3NCLE9BQVAsQ0FBZUQsU0FBZixJQUEwQixDQUFDLEM7Ozs7O0FBQzdERSxnQkFBQUEsTyxHQUFVdkIsTUFBTSxDQUFDd0IsS0FBUCxDQUFhSCxTQUFiLEM7O3NCQUNYRSxPQUFPLENBQUN0QyxNQUFSLEdBQWUsQzs7Ozs7QUFDZGtDLGdCQUFBQSxVQUFVLEdBQUdJLE9BQU8sQ0FBQ04sS0FBRCxDQUFQLENBQWVRLElBQWYsRUFBYjs7OztBQUwrQkwsZ0JBQUFBLEdBQUcsRTs7Ozs7QUFXOUMsb0JBQUdELFVBQVUsQ0FBQ08sV0FBWCxHQUF5QkosT0FBekIsQ0FBaUMsV0FBakMsSUFBOEMsQ0FBQyxDQUFsRCxFQUNJSCxVQUFVLEdBQUcsV0FBYjtrREFFR0EsVTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FEQUdJUSxPLEVBQVNDLE87Ozs7OztBQUNoQkMsZ0JBQUFBLEUsR0FBS0MsSUFBSSxDQUFDQyxHQUFMLEU7O0FBQ1Qsb0JBQUc7QUFDQ0Ysa0JBQUFBLEVBQUUsR0FBR0MsSUFBSSxDQUFDRSxLQUFMLFdBQWNMLE9BQWQsY0FBeUJDLE9BQXpCLEVBQUw7QUFDSCxpQkFGRCxDQUdBLE9BQU1LLENBQU4sRUFBUztBQUNMeEYsa0JBQUFBLE1BQU0sQ0FBQ2MsR0FBUCxDQUFXLE9BQVgsRUFBb0IwRSxDQUFwQjtBQUNIOztrREFFTUosRTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBSWYiLCJzb3VyY2VzQ29udGVudCI6WyIvL2pzaGludCBlc3ZlcnNpb246IDZcclxuLy9qc2hpbnQgaWdub3JlOnN0YXJ0XHJcbmNvbnN0IGNyb24gPSByZXF1aXJlKFwibm9kZS1jcm9uXCIpO1xyXG5jb25zdCBleHByZXNzID0gcmVxdWlyZShcImV4cHJlc3NcIik7XHJcbmNvbnN0IGZzID0gcmVxdWlyZShcImZzXCIpO1xyXG5cclxuY29uc3QgdXVpZHY0ID0gcmVxdWlyZSgndXVpZC92NCcpO1xyXG5jb25zdCBkZWxheSA9IHJlcXVpcmUoJ2RlbGF5Jyk7XHJcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG5jb25zdCBmZXRjaCA9IHJlcXVpcmUoJ2lzb21vcnBoaWMtZmV0Y2gnKTtcclxuXHJcbi8vaW1wb3J0IG1vbWVudCBmcm9tIFwibW9tZW50XCI7XHJcbi8vIGltcG9ydCBcImlzb21vcnBoaWMtZmV0Y2hcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2dnZXIge1xyXG4gICAgc3RhdGljIGxvZyh0eXBlLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpbmZvXCI6XHJcbiAgICAgICAgICAgIExvZ2dlci5fd3JpdGUoYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwid2FybmluZ1wiOlxyXG4gICAgICAgICAgICAgICAgTG9nZ2VyLl93cml0ZShhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJlcnJvclwiOlxyXG4gICAgICAgICAgICAgICAgTG9nZ2VyLl93cml0ZShhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIF93cml0ZSh0eXBlKSB7XHJcbiAgICAgICAgdmFyIHRpbWUgPSBtb21lbnQoKS5mb3JtYXQoXCJISDptbTpzcy5TU1NcIik7XHJcbiAgICAgICAgLy9hcmd1bWVudHMuc3BsaWNlKDApXHJcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5mcm9tKGFyZ3VtZW50c1swXSk7XHJcbiAgICAgICAgdHlwZSA9IGFyZ3NbMF07XHJcbiAgICAgICAgYXJncy5zcGxpY2UoMCwxKTtcclxuICAgIFxyXG4gICAgICAgIGFyZ3MudW5zaGlmdCh0aW1lKTtcclxuICAgICAgICBhcmdzLnVuc2hpZnQodHlwZS50b1VwcGVyQ2FzZSgpKTtcclxuICAgICAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmdzKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1QVENyYXdsZXIge1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge3VybDogJycsIG91dHB1dDogJ2pzb24nLCB0b2tlbjogJyd9O1xyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGEoc2VhcmNoT3B0aW9uPXt1cmw6ICcnLCBkYXRhOiB7dXNySWQ6IDEwOSwgdXNyVHlwZTogJ04nfSwgdG9rZW46ICcnfSkge1xyXG4gICAgICAgIC8vIERlZmF1bHQgb3B0aW9ucyBhcmUgbWFya2VkIHdpdGggKlxyXG4gICAgICAgIGxldCBqc29uX3Bvc3QgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIiwgLy8gKkdFVCwgUE9TVCwgUFVULCBERUxFVEUsIGV0Yy5cclxuICAgICAgICAgICAgbW9kZTogXCJjb3JzXCIsIC8vIG5vLWNvcnMsIGNvcnMsICpzYW1lLW9yaWdpblxyXG4gICAgICAgICAgICBjYWNoZTogXCJuby1jYWNoZVwiLCAvLyAqZGVmYXVsdCwgbm8tY2FjaGUsIHJlbG9hZCwgZm9yY2UtY2FjaGUsIG9ubHktaWYtY2FjaGVkXHJcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIC8vIGluY2x1ZGUsICpzYW1lLW9yaWdpbiwgb21pdFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb24sIHRleHQvamF2YXNjcmlwdCwgKi8qOyBxPTAuMDFcIixcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgXCJBdXRob3JpemF0aW9uXCI6ICdCZWFyZXIgajhlZGc1M3N3dHRpdGR6ellpSjFpTkRmN3pnM29VZGFoaHdhM0VDM3hSb2cwOEFOYUVKWXc3NHNDdkFhJyxcclxuICAgICAgICAgICAgICAgIFwiVXNlci1BZ2VudFwiOiBcIk1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDYuMTsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzc0LjAuMzcyOS4xMzEgU2FmYXJpLzUzNy4zNlwiLFxyXG4gICAgICAgICAgICAgICAgXCJSZWZlcmVyXCI6IFwiaHR0cHM6Ly9mZC5tZXRyb3BvbGl0YW50cmF2ZWxzLmNvbS9kYXNoYm9hcmRcIixcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0LUVuY29kaW5nXCI6IFwiZ3ppcCwgZGVmbGF0ZSwgYnJcIixcclxuICAgICAgICAgICAgICAgIFwiQ29va2llXCI6IFwiX2dhPUdBMS4yLjEwNzY1OTE0MzEuMTU1NzQ3MDAxMzsgX2dpZD1HQTEuMi4xODUxNDU5MDgzLjE1NTc0NzAwMTM7IHJlbWVtYmVyX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkPWV5SnBkaUk2SW5wV01IRlZRV3RCVjNwcVpYVklhRnd2U0N0Y0wxSnhVVDA5SWl3aWRtRnNkV1VpT2lKTmRrRlZaeXRxTTNsak9IQTVOaXQ1UjFVeWNXdFJkVWRVSzJsbVozRlBhelpOYUc5NVExd3ZkakFyYlVSR2VYRlpWblIyWkZWeGQyczBSVlk0ZFd0Q2QyZzVRV1ExV25oclpHeHhaV3R6Y2tRd05GUkpVV0ZwVFhCRlpXUmFVM0phYkZ3dlRtOWxPVXhRYzNsU2NtaHRYQzlDZEc1UUsyUklVM0JRWjB0TWFsWnplQ3RrY0ZWRlVYTnFXamx1U0hObk5sUXphRVIyT1N0cVJWVkNSbkZ6VG1WNVdrUjFkV2s0UVhCSGMxRTlJaXdpYldGaklqb2lOakJqTVRnMVpHTXpZamM0TURZeU1UWTFPREEyT0RaalkySXhNREJtTnpoaU9EbGtaalpsTWpnNE16Tm1ZVGN6TURFNFpXUm1aak5qTUdRM04yVTBPQ0o5OyBYU1JGLVRPS0VOPWV5SnBkaUk2SWpKSVJraGpRVEYyUjI0NFdFdHRSWFZrU0hKamVYYzlQU0lzSW5aaGJIVmxJam9pUzF3dlpFMVhaR3RvV1hsdGFDdHFUVmRHVEdsc00zTm9jRVJEWVVwM1ltTk9aVGxzYVcxWFFteGlNbkk1VEZwdE0wdG1UREZFTUhaRFdVYzNWVkJqT0VNaUxDSnRZV01pT2lKaU56STFNMk15TVdWaE1XVmtaRFl5TmprNVltWXdPRGxqWkdWaU1UWTFOV0pqWm1FNVl6a3dNR1UyTmpZellUa3haRGhsWldWaFptRmhOemd5TUdOa0luMCUzRDtcIixcclxuICAgICAgICAgICAgICAgIFwiQ29va2llXCI6IFwibWV0cm9wb2xpdGFuX3RyYXZlbHNfc2Vzc2lvbj1leUpwZGlJNklreGhSRTlQWkhSbVdrNHllbWxUUkU1eFR6UkRZMUU5UFNJc0luWmhiSFZsSWpvaVlWcEliWFk1VGxVNWFrUm5hVGRTY205VVZrRnZNWEpRZVRoV1kzbEpOMHBaT0RWbU5XOUhXRXBuUXpZNVYyOXdkRXB1UVhBeWNUUkdaMWRwYW1WUVhDOGlMQ0p0WVdNaU9pSm1OVFV6TkRCaFpUTXhNbVUyT1RBMVl6Tm1ZbVk0TURBMFl6bGlNVEk0WldReU56QTJOR0ZoWVRFMlpXUXhOV1k0WVdGbVpqZGpPVE5rWXpsak9UZzNJbjAlM0RcIlxyXG4gICAgICAgICAgICAgICAgLy8gXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmVkaXJlY3Q6IFwiZm9sbG93XCIsIC8vIG1hbnVhbCwgKmZvbGxvdywgZXJyb3JcclxuICAgICAgICAgICAgcmVmZXJyZXI6IFwibm8tcmVmZXJyZXJcIiwgLy8gbm8tcmVmZXJyZXIsICpjbGllbnRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2goc2VhcmNoT3B0aW9uLnVybCwganNvbl9wb3N0KVxyXG4gICAgICAgIC50aGVuKGFzeW5jIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgTG9nZ2VyLmxvZyhcImluZm9cIiwgXCJSZXNwb25zZSByZWNlaXZlZFwiKTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgICAgICB0aGlzLmZpbmFsRGF0YSA9IGF3YWl0IHRoaXMudHJhbnNmb3JtRGF0YSh0aGlzLmRhdGEpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlYXNvbiA9PiB7XHJcbiAgICAgICAgICAgIExvZ2dlci5sb2coXCJlcnJvclwiLCByZWFzb24pO1xyXG4gICAgICAgICAgICB0aHJvdyByZWFzb247XHJcbiAgICAgICAgfSk7IC8vIHBhcnNlcyBKU09OIHJlc3BvbnNlIGludG8gbmF0aXZlIEphdmFzY3JpcHQgb2JqZWN0cyBcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyB0cmFuc2Zvcm1EYXRhKGRhdGEpIHtcclxuICAgICAgICBpZihkYXRhPT09bnVsbCB8fCBkYXRhPT09dW5kZWZpbmVkIHx8IGRhdGEubGVuZ3RoPT09MCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgcGFyc2VkRGF0YVNldCA9IFtdO1xyXG4gICAgICAgIGxldCBwYXJzZWRSZWNvcmQgPSB7fTtcclxuICAgICAgICBkYXRhID0gZGF0YTtcclxuXHJcbiAgICAgICAgZm9yKHZhciBpPTA7IGk8ZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IGRhdGFJdGVtID0gZGF0YVtpXTtcclxuICAgICAgICAgICAgICAgIGlmKGRhdGFJdGVtLmRlcGFydHVyZV90aW1lID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YUl0ZW0uZGVwYXJ0dXJlX3RpbWUgPSBcIjAwOjAwXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwYXJzZWRSZWNvcmQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxpZ2h0OiBkYXRhSXRlbS5haXJsaW5lLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZmxpZ2h0X251bWJlcjogZGF0YUl0ZW0uZmxpZ2h0X251bWJlcixcclxuICAgICAgICAgICAgICAgICAgICBkZXBhcnR1cmU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IC0xLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaXJjbGU6IGF3YWl0IHRoaXMuX2dldENpcmNsZU5hbWUoZGF0YUl0ZW0uc2VjdG9yX25hbWUsIDAsIFsnLScsJyAnLCAndG8nXSkudGhlbihyZXN1bHQgPT4gcmVzdWx0KS5jYXRjaChyZWFzb24gPT4gTG9nZ2VyLmxvZygnZXJyb3InLCByZWFzb24pKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZTogZGF0YUl0ZW0uZGVwYXJ0dXJlX3RpbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG1vbWVudChkYXRhSXRlbS5kZXBhcnR1cmVfYXQpLmZvcm1hdChcIllZWVktTU0tRERcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVwb2NoX2RhdGU6IGF3YWl0IHRoaXMuX2dldERhdGUobW9tZW50KGRhdGFJdGVtLmRlcGFydHVyZV9hdCkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSwgZGF0YUl0ZW0uZGVwYXJ0dXJlX3RpbWUpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdCkuY2F0Y2gocmVhc29uID0+IExvZ2dlci5sb2coJ2Vycm9yJywgcmVhc29uKSlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGFycml2YWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IC0xLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaXJjbGU6IGF3YWl0IHRoaXMuX2dldENpcmNsZU5hbWUoZGF0YUl0ZW0uc2VjdG9yX25hbWUsIDEsIFsnLScsICcgJywgJ3RvJ10pLnRoZW4ocmVzdWx0ID0+IHJlc3VsdCkuY2F0Y2gocmVhc29uID0+IExvZ2dlci5sb2coJ2Vycm9yJywgcmVhc29uKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6IGRhdGFJdGVtLmRlcGFydHVyZV90aW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBtb21lbnQoZGF0YUl0ZW0uZGVwYXJ0dXJlX2F0KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcG9jaF9kYXRlOiBhd2FpdCB0aGlzLl9nZXREYXRlKG1vbWVudChkYXRhSXRlbS5kZXBhcnR1cmVfYXQpLmZvcm1hdChcIllZWVktTU0tRERcIiksIGRhdGFJdGVtLmRlcGFydHVyZV90aW1lKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpLmNhdGNoKHJlYXNvbiA9PiBMb2dnZXIubG9nKCdlcnJvcicsIHJlYXNvbikpXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGlja2V0X3R5cGU6IGRhdGFJdGVtLnRyYXZlbF9jbGFzcyxcclxuICAgICAgICAgICAgICAgICAgICBhdmFpbGFiaWxpdHk6IGRhdGFJdGVtLmF2YWlsYWJsZV9zZWF0cyxcclxuICAgICAgICAgICAgICAgICAgICBwcmljZTogKGRhdGFJdGVtLnByaWNlKSxcclxuICAgICAgICAgICAgICAgICAgICBmbGlnaHRfaWQ6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgcnVuaWQ6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY2lkOiBkYXRhSXRlbS5pZFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBwYXJzZWREYXRhU2V0LnB1c2gocGFyc2VkUmVjb3JkKTtcclxuICAgICAgICAgICAgICAgIExvZ2dlci5sb2coJ2luZm8nLCAnRGF0YScsIEpTT04uc3RyaW5naWZ5KHBhcnNlZFJlY29yZCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgICAgIExvZ2dlci5sb2coJ2Vycm9yJywgZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJzZWREYXRhU2V0O1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIF9nZXRDaXJjbGVOYW1lKGNpcmNsZSwgaW5kZXgsIGRlbGltZXRlcnM9WyctJywnICcsJ3RvJ10pIHtcclxuICAgICAgICBsZXQgY2lyY2xlTmFtZSA9ICcnO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCBkZWxpbWV0ZXJzLmxlbmd0aDsgaWR4KyspIHtcclxuICAgICAgICAgICAgY29uc3QgZGVsaW1ldGVyID0gZGVsaW1ldGVyc1tpZHhdO1xyXG4gICAgICAgICAgICBpZihjaXJjbGUhPT1udWxsICYmIGNpcmNsZSE9PXVuZGVmaW5lZCAmJiBjaXJjbGUuaW5kZXhPZihkZWxpbWV0ZXIpPi0xKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2lyY2xlcyA9IGNpcmNsZS5zcGxpdChkZWxpbWV0ZXIpO1xyXG4gICAgICAgICAgICAgICAgaWYoY2lyY2xlcy5sZW5ndGg+MCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNpcmNsZU5hbWUgPSBjaXJjbGVzW2luZGV4XS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGNpcmNsZU5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdiZW5nYWx1cnUnKT4tMSlcclxuICAgICAgICAgICAgY2lyY2xlTmFtZSA9ICdCYW5nYWxvcmUnO1xyXG5cclxuICAgICAgICByZXR1cm4gY2lyY2xlTmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBfZ2V0RGF0ZShzdHJEYXRlLCBzdHJUaW1lKSB7XHJcbiAgICAgICAgbGV0IGR0ID0gRGF0ZS5ub3coKTtcclxuICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgIGR0ID0gRGF0ZS5wYXJzZShgJHtzdHJEYXRlfSAke3N0clRpbWV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgTG9nZ2VyLmxvZygnZXJyb3InLCBlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkdDtcclxuICAgIH1cclxufVxyXG5cclxuLy9qc2hpbnQgaWdub3JlOmVuZCJdfQ==