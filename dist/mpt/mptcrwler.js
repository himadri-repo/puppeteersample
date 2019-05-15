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
    (0, _classCallCheck2.default)(this, Logger);
  }

  (0, _createClass2.default)(Logger, null, [{
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
    (0, _classCallCheck2.default)(this, MPTCrawler);
    this.options = options || {
      url: '',
      output: 'json',
      token: ''
    };
  }

  (0, _createClass2.default)(MPTCrawler, [{
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
        headers: (0, _defineProperty2.default)({
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
        var _ref = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee(response) {
          return _regenerator.default.wrap(function _callee$(_context) {
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
      }()).catch(function (reason) {
        Logger.log("error", reason);
        throw reason;
      }); // parses JSON response into native Javascript objects 
    }
  }, {
    key: "transformData",
    value: function () {
      var _transformData = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(data) {
        var parsedDataSet, parsedRecord, i, dataItem;
        return _regenerator.default.wrap(function _callee2$(_context2) {
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
                  _context2.next = 46;
                  break;
                }

                _context2.prev = 7;
                dataItem = data[i];
                _context2.t0 = dataItem.airline.name;
                _context2.t1 = dataItem.flight_number;
                _context2.t2 = -1;
                _context2.next = 14;
                return this._getCircleName(dataItem.sector_name, 0, '-').then(function (result) {
                  return result;
                }).catch(function (reason) {
                  return Logger.log('error', reason);
                });

              case 14:
                _context2.t3 = _context2.sent;
                _context2.t4 = dataItem.departure_time;
                _context2.t5 = moment(dataItem.departure_at).format("YYYY-MM-DD");
                _context2.next = 19;
                return this._getDate(moment(dataItem.departure_at).format("YYYY-MM-DD"), dataItem.departure_time).then(function (result) {
                  return result;
                }).catch(function (reason) {
                  return Logger.log('error', reason);
                });

              case 19:
                _context2.t6 = _context2.sent;
                _context2.t7 = {
                  id: _context2.t2,
                  circle: _context2.t3,
                  time: _context2.t4,
                  date: _context2.t5,
                  epoch_date: _context2.t6
                };
                _context2.t8 = -1;
                _context2.next = 24;
                return this._getCircleName(dataItem.sector_name, 1, '-').then(function (result) {
                  return result;
                }).catch(function (reason) {
                  return Logger.log('error', reason);
                });

              case 24:
                _context2.t9 = _context2.sent;
                _context2.t10 = dataItem.departure_time;
                _context2.t11 = moment(dataItem.departure_at).format("YYYY-MM-DD");
                _context2.next = 29;
                return this._getDate(moment(dataItem.departure_at).format("YYYY-MM-DD"), dataItem.departure_time).then(function (result) {
                  return result;
                }).catch(function (reason) {
                  return Logger.log('error', reason);
                });

              case 29:
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
                _context2.next = 43;
                break;

              case 40:
                _context2.prev = 40;
                _context2.t18 = _context2["catch"](7);
                Logger.log('error', _context2.t18);

              case 43:
                i++;
                _context2.next = 6;
                break;

              case 46:
                return _context2.abrupt("return", parsedDataSet);

              case 47:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[7, 40]]);
      }));

      function transformData(_x2) {
        return _transformData.apply(this, arguments);
      }

      return transformData;
    }()
  }, {
    key: "_getCircleName",
    value: function () {
      var _getCircleName2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee3(circle, index) {
        var delimeter,
            circleName,
            circles,
            _args3 = arguments;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                delimeter = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : 'to';
                circleName = '';

                if (circle !== null && circle !== undefined && circle.indexOf(delimeter) > -1) {
                  circles = circle.split(delimeter);

                  if (circles.length > 0) {
                    circleName = circles[index].trim();
                  }
                }

                if (circleName.toLowerCase().indexOf('bengaluru') > -1) circleName = 'Bangalore';
                return _context3.abrupt("return", circleName);

              case 5:
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
      var _getDate2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee4(strDate, strTime) {
        var dt;
        return _regenerator.default.wrap(function _callee4$(_context4) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tcHQvbXB0Y3J3bGVyLmpzIl0sIm5hbWVzIjpbImNyb24iLCJyZXF1aXJlIiwiZXhwcmVzcyIsImZzIiwidXVpZHY0IiwiZGVsYXkiLCJtb21lbnQiLCJmZXRjaCIsIkxvZ2dlciIsInR5cGUiLCJtZXNzYWdlIiwiX3dyaXRlIiwiYXJndW1lbnRzIiwidGltZSIsImZvcm1hdCIsImFyZ3MiLCJBcnJheSIsImZyb20iLCJzcGxpY2UiLCJ1bnNoaWZ0IiwidG9VcHBlckNhc2UiLCJjb25zb2xlIiwibG9nIiwiYXBwbHkiLCJNUFRDcmF3bGVyIiwib3B0aW9ucyIsInVybCIsIm91dHB1dCIsInRva2VuIiwic2VhcmNoT3B0aW9uIiwiZGF0YSIsInVzcklkIiwidXNyVHlwZSIsImpzb25fcG9zdCIsIm1ldGhvZCIsIm1vZGUiLCJjYWNoZSIsImNyZWRlbnRpYWxzIiwiaGVhZGVycyIsInJlZGlyZWN0IiwicmVmZXJyZXIiLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwidHJhbnNmb3JtRGF0YSIsImZpbmFsRGF0YSIsImNhdGNoIiwicmVhc29uIiwidW5kZWZpbmVkIiwibGVuZ3RoIiwicGFyc2VkRGF0YVNldCIsInBhcnNlZFJlY29yZCIsImkiLCJkYXRhSXRlbSIsImFpcmxpbmUiLCJuYW1lIiwiZmxpZ2h0X251bWJlciIsIl9nZXRDaXJjbGVOYW1lIiwic2VjdG9yX25hbWUiLCJyZXN1bHQiLCJkZXBhcnR1cmVfdGltZSIsImRlcGFydHVyZV9hdCIsIl9nZXREYXRlIiwiaWQiLCJjaXJjbGUiLCJkYXRlIiwiZXBvY2hfZGF0ZSIsInRyYXZlbF9jbGFzcyIsImF2YWlsYWJsZV9zZWF0cyIsInByaWNlIiwiZmxpZ2h0IiwiZGVwYXJ0dXJlIiwiYXJyaXZhbCIsInRpY2tldF90eXBlIiwiYXZhaWxhYmlsaXR5IiwiZmxpZ2h0X2lkIiwicnVuaWQiLCJyZWNpZCIsInB1c2giLCJKU09OIiwic3RyaW5naWZ5IiwiaW5kZXgiLCJkZWxpbWV0ZXIiLCJjaXJjbGVOYW1lIiwiaW5kZXhPZiIsImNpcmNsZXMiLCJzcGxpdCIsInRyaW0iLCJ0b0xvd2VyQ2FzZSIsInN0ckRhdGUiLCJzdHJUaW1lIiwiZHQiLCJEYXRlIiwibm93IiwicGFyc2UiLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBLElBQU1BLElBQUksR0FBR0MsT0FBTyxDQUFDLFdBQUQsQ0FBcEI7O0FBQ0EsSUFBTUMsT0FBTyxHQUFHRCxPQUFPLENBQUMsU0FBRCxDQUF2Qjs7QUFDQSxJQUFNRSxFQUFFLEdBQUdGLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUVBLElBQU1HLE1BQU0sR0FBR0gsT0FBTyxDQUFDLFNBQUQsQ0FBdEI7O0FBQ0EsSUFBTUksS0FBSyxHQUFHSixPQUFPLENBQUMsT0FBRCxDQUFyQjs7QUFDQSxJQUFNSyxNQUFNLEdBQUdMLE9BQU8sQ0FBQyxRQUFELENBQXRCOztBQUNBLElBQU1NLEtBQUssR0FBR04sT0FBTyxDQUFDLGtCQUFELENBQXJCLEMsQ0FFQTtBQUNBOzs7SUFFYU8sTTs7Ozs7Ozs7O3dCQUNFQyxJLEVBQU1DLE8sRUFBUztBQUN0QixjQUFRRCxJQUFSO0FBQ0ksYUFBSyxNQUFMO0FBQ0FELFVBQUFBLE1BQU0sQ0FBQ0csTUFBUCxDQUFjQyxTQUFkOztBQUNJOztBQUNKLGFBQUssU0FBTDtBQUNJSixVQUFBQSxNQUFNLENBQUNHLE1BQVAsQ0FBY0MsU0FBZDs7QUFDQTs7QUFDSixhQUFLLE9BQUw7QUFDSUosVUFBQUEsTUFBTSxDQUFDRyxNQUFQLENBQWNDLFNBQWQ7O0FBQ0E7O0FBQ0o7QUFDSTtBQVhSO0FBYUg7OzsyQkFFYUgsSSxFQUFNO0FBQ2hCLFVBQUlJLElBQUksR0FBR1AsTUFBTSxHQUFHUSxNQUFULENBQWdCLGNBQWhCLENBQVgsQ0FEZ0IsQ0FFaEI7O0FBQ0EsVUFBSUMsSUFBSSxHQUFHQyxLQUFLLENBQUNDLElBQU4sQ0FBV0wsU0FBUyxDQUFDLENBQUQsQ0FBcEIsQ0FBWDtBQUNBSCxNQUFB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QSxNQUFNLENBQUNjLEdBQVAsQ0FBVyxPQUFYLEVBQW9CeUUsQ0FBcEI7QUFDSDs7a0RBRU1KLEU7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQUlmIiwic291cmNlc0NvbnRlbnQiOlsiLy9qc2hpbnQgZXN2ZXJzaW9uOiA2XHJcbi8vanNoaW50IGlnbm9yZTpzdGFydFxyXG5jb25zdCBjcm9uID0gcmVxdWlyZShcIm5vZGUtY3JvblwiKTtcclxuY29uc3QgZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xyXG5jb25zdCBmcyA9IHJlcXVpcmUoXCJmc1wiKTtcclxuXHJcbmNvbnN0IHV1aWR2NCA9IHJlcXVpcmUoJ3V1aWQvdjQnKTtcclxuY29uc3QgZGVsYXkgPSByZXF1aXJlKCdkZWxheScpO1xyXG5jb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxuY29uc3QgZmV0Y2ggPSByZXF1aXJlKCdpc29tb3JwaGljLWZldGNoJyk7XHJcblxyXG4vL2ltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xyXG4vLyBpbXBvcnQgXCJpc29tb3JwaGljLWZldGNoXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9nZ2VyIHtcclxuICAgIHN0YXRpYyBsb2codHlwZSwgbWVzc2FnZSkge1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiaW5mb1wiOlxyXG4gICAgICAgICAgICBMb2dnZXIuX3dyaXRlKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIndhcm5pbmdcIjpcclxuICAgICAgICAgICAgICAgIExvZ2dlci5fd3JpdGUoYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiZXJyb3JcIjpcclxuICAgICAgICAgICAgICAgIExvZ2dlci5fd3JpdGUoYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBfd3JpdGUodHlwZSkge1xyXG4gICAgICAgIHZhciB0aW1lID0gbW9tZW50KCkuZm9ybWF0KFwiSEg6bW06c3MuU1NTXCIpO1xyXG4gICAgICAgIC8vYXJndW1lbnRzLnNwbGljZSgwKVxyXG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkuZnJvbShhcmd1bWVudHNbMF0pO1xyXG4gICAgICAgIHR5cGUgPSBhcmdzWzBdO1xyXG4gICAgICAgIGFyZ3Muc3BsaWNlKDAsMSk7XHJcbiAgICBcclxuICAgICAgICBhcmdzLnVuc2hpZnQodGltZSk7XHJcbiAgICAgICAgYXJncy51bnNoaWZ0KHR5cGUudG9VcHBlckNhc2UoKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJncyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNUFRDcmF3bGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt1cmw6ICcnLCBvdXRwdXQ6ICdqc29uJywgdG9rZW46ICcnfTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREYXRhKHNlYXJjaE9wdGlvbj17dXJsOiAnJywgZGF0YToge3VzcklkOiAxMDksIHVzclR5cGU6ICdOJ30sIHRva2VuOiAnJ30pIHtcclxuICAgICAgICAvLyBEZWZhdWx0IG9wdGlvbnMgYXJlIG1hcmtlZCB3aXRoICpcclxuICAgICAgICBsZXQganNvbl9wb3N0ID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIC8vICpHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBldGMuXHJcbiAgICAgICAgICAgIG1vZGU6IFwiY29yc1wiLCAvLyBuby1jb3JzLCBjb3JzLCAqc2FtZS1vcmlnaW5cclxuICAgICAgICAgICAgY2FjaGU6IFwibm8tY2FjaGVcIiwgLy8gKmRlZmF1bHQsIG5vLWNhY2hlLCByZWxvYWQsIGZvcmNlLWNhY2hlLCBvbmx5LWlmLWNhY2hlZFxyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCAvLyBpbmNsdWRlLCAqc2FtZS1vcmlnaW4sIG9taXRcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L2phdmFzY3JpcHQsICovKjsgcT0wLjAxXCIsXHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIFwiQXV0aG9yaXphdGlvblwiOiAnQmVhcmVyIGo4ZWRnNTNzd3R0aXRkenpZaUoxaU5EZjd6ZzNvVWRhaGh3YTNFQzN4Um9nMDhBTmFFSll3NzRzQ3ZBYScsXHJcbiAgICAgICAgICAgICAgICBcIlVzZXItQWdlbnRcIjogXCJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCA2LjE7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS83NC4wLjM3MjkuMTMxIFNhZmFyaS81MzcuMzZcIixcclxuICAgICAgICAgICAgICAgIFwiUmVmZXJlclwiOiBcImh0dHBzOi8vZmQubWV0cm9wb2xpdGFudHJhdmVscy5jb20vZGFzaGJvYXJkXCIsXHJcbiAgICAgICAgICAgICAgICBcIkFjY2VwdC1FbmNvZGluZ1wiOiBcImd6aXAsIGRlZmxhdGUsIGJyXCIsXHJcbiAgICAgICAgICAgICAgICBcIkNvb2tpZVwiOiBcIl9nYT1HQTEuMi4xMDc2NTkxNDMxLjE1NTc0NzAwMTM7IF9naWQ9R0ExLjIuMTg1MTQ1OTA4My4xNTU3NDcwMDEzOyByZW1lbWJlcl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZD1leUpwZGlJNklucFdNSEZWUVd0QlYzcHFaWFZJYUZ3dlNDdGNMMUp4VVQwOUlpd2lkbUZzZFdVaU9pSk5ka0ZWWnl0cU0zbGpPSEE1Tml0NVIxVXljV3RSZFVkVUsybG1aM0ZQYXpaTmFHOTVRMXd2ZGpBcmJVUkdlWEZaVm5SMlpGVnhkMnMwUlZZNGRXdENkMmc1UVdRMVduaHJaR3h4Wld0emNrUXdORlJKVVdGcFRYQkZaV1JhVTNKYWJGd3ZUbTlsT1V4UWMzbFNjbWh0WEM5Q2RHNVFLMlJJVTNCUVowdE1hbFp6ZUN0a2NGVkZVWE5xV2psdVNITm5ObFF6YUVSMk9TdHFSVlZDUm5GelRtVjVXa1IxZFdrNFFYQkhjMUU5SWl3aWJXRmpJam9pTmpCak1UZzFaR016WWpjNE1EWXlNVFkxT0RBMk9EWmpZMkl4TURCbU56aGlPRGxrWmpabE1qZzRNek5tWVRjek1ERTRaV1JtWmpOak1HUTNOMlUwT0NKOTsgWFNSRi1UT0tFTj1leUpwZGlJNklqSklSa2hqUVRGMlIyNDRXRXR0UlhWa1NISmplWGM5UFNJc0luWmhiSFZsSWpvaVMxd3ZaRTFYWkd0b1dYbHRhQ3RxVFZkR1RHbHNNM05vY0VSRFlVcDNZbU5PWlRsc2FXMVhRbXhpTW5JNVRGcHRNMHRtVERGRU1IWkRXVWMzVlZCak9FTWlMQ0p0WVdNaU9pSmlOekkxTTJNeU1XVmhNV1ZrWkRZeU5qazVZbVl3T0RsalpHVmlNVFkxTldKalptRTVZemt3TUdVMk5qWXpZVGt4WkRobFpXVmhabUZoTnpneU1HTmtJbjAlM0Q7XCIsXHJcbiAgICAgICAgICAgICAgICBcIkNvb2tpZVwiOiBcIm1ldHJvcG9saXRhbl90cmF2ZWxzX3Nlc3Npb249ZXlKcGRpSTZJa3hoUkU5UFpIUm1XazR5ZW1sVFJFNXhUelJEWTFFOVBTSXNJblpoYkhWbElqb2lZVnBJYlhZNVRsVTVha1JuYVRkU2NtOVVWa0Z2TVhKUWVUaFdZM2xKTjBwWk9EVm1OVzlIV0VwblF6WTVWMjl3ZEVwdVFYQXljVFJHWjFkcGFtVlFYQzhpTENKdFlXTWlPaUptTlRVek5EQmhaVE14TW1VMk9UQTFZek5tWW1ZNE1EQTBZemxpTVRJNFpXUXlOekEyTkdGaFlURTJaV1F4TldZNFlXRm1aamRqT1ROa1l6bGpPVGczSW4wJTNEXCJcclxuICAgICAgICAgICAgICAgIC8vIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlZGlyZWN0OiBcImZvbGxvd1wiLCAvLyBtYW51YWwsICpmb2xsb3csIGVycm9yXHJcbiAgICAgICAgICAgIHJlZmVycmVyOiBcIm5vLXJlZmVycmVyXCIsIC8vIG5vLXJlZmVycmVyLCAqY2xpZW50XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHNlYXJjaE9wdGlvbi51cmwsIGpzb25fcG9zdClcclxuICAgICAgICAudGhlbihhc3luYyByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIExvZ2dlci5sb2coXCJpbmZvXCIsIFwiUmVzcG9uc2UgcmVjZWl2ZWRcIik7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICAgICAgdGhpcy5maW5hbERhdGEgPSBhd2FpdCB0aGlzLnRyYW5zZm9ybURhdGEodGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWFzb24gPT4ge1xyXG4gICAgICAgICAgICBMb2dnZXIubG9nKFwiZXJyb3JcIiwgcmVhc29uKTtcclxuICAgICAgICAgICAgdGhyb3cgcmVhc29uO1xyXG4gICAgICAgIH0pOyAvLyBwYXJzZXMgSlNPTiByZXNwb25zZSBpbnRvIG5hdGl2ZSBKYXZhc2NyaXB0IG9iamVjdHMgXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgdHJhbnNmb3JtRGF0YShkYXRhKSB7XHJcbiAgICAgICAgaWYoZGF0YT09PW51bGwgfHwgZGF0YT09PXVuZGVmaW5lZCB8fCBkYXRhLmxlbmd0aD09PTApIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IHBhcnNlZERhdGFTZXQgPSBbXTtcclxuICAgICAgICBsZXQgcGFyc2VkUmVjb3JkID0ge307XHJcbiAgICAgICAgZGF0YSA9IGRhdGE7XHJcblxyXG4gICAgICAgIGZvcih2YXIgaT0wOyBpPGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCBkYXRhSXRlbSA9IGRhdGFbaV07XHJcbiAgICAgICAgICAgICAgICBwYXJzZWRSZWNvcmQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxpZ2h0OiBkYXRhSXRlbS5haXJsaW5lLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZmxpZ2h0X251bWJlcjogZGF0YUl0ZW0uZmxpZ2h0X251bWJlcixcclxuICAgICAgICAgICAgICAgICAgICBkZXBhcnR1cmU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IC0xLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaXJjbGU6IGF3YWl0IHRoaXMuX2dldENpcmNsZU5hbWUoZGF0YUl0ZW0uc2VjdG9yX25hbWUsIDAsICctJykudGhlbihyZXN1bHQgPT4gcmVzdWx0KS5jYXRjaChyZWFzb24gPT4gTG9nZ2VyLmxvZygnZXJyb3InLCByZWFzb24pKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZTogZGF0YUl0ZW0uZGVwYXJ0dXJlX3RpbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG1vbWVudChkYXRhSXRlbS5kZXBhcnR1cmVfYXQpLmZvcm1hdChcIllZWVktTU0tRERcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVwb2NoX2RhdGU6IGF3YWl0IHRoaXMuX2dldERhdGUobW9tZW50KGRhdGFJdGVtLmRlcGFydHVyZV9hdCkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSwgZGF0YUl0ZW0uZGVwYXJ0dXJlX3RpbWUpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdCkuY2F0Y2gocmVhc29uID0+IExvZ2dlci5sb2coJ2Vycm9yJywgcmVhc29uKSlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGFycml2YWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IC0xLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaXJjbGU6IGF3YWl0IHRoaXMuX2dldENpcmNsZU5hbWUoZGF0YUl0ZW0uc2VjdG9yX25hbWUsIDEsICctJykudGhlbihyZXN1bHQgPT4gcmVzdWx0KS5jYXRjaChyZWFzb24gPT4gTG9nZ2VyLmxvZygnZXJyb3InLCByZWFzb24pKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZTogZGF0YUl0ZW0uZGVwYXJ0dXJlX3RpbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG1vbWVudChkYXRhSXRlbS5kZXBhcnR1cmVfYXQpLmZvcm1hdChcIllZWVktTU0tRERcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVwb2NoX2RhdGU6IGF3YWl0IHRoaXMuX2dldERhdGUobW9tZW50KGRhdGFJdGVtLmRlcGFydHVyZV9hdCkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSwgZGF0YUl0ZW0uZGVwYXJ0dXJlX3RpbWUpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdCkuY2F0Y2gocmVhc29uID0+IExvZ2dlci5sb2coJ2Vycm9yJywgcmVhc29uKSlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aWNrZXRfdHlwZTogZGF0YUl0ZW0udHJhdmVsX2NsYXNzLFxyXG4gICAgICAgICAgICAgICAgICAgIGF2YWlsYWJpbGl0eTogZGF0YUl0ZW0uYXZhaWxhYmxlX3NlYXRzLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaWNlOiAoZGF0YUl0ZW0ucHJpY2UpLFxyXG4gICAgICAgICAgICAgICAgICAgIGZsaWdodF9pZDogMSxcclxuICAgICAgICAgICAgICAgICAgICBydW5pZDogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVjaWQ6IGRhdGFJdGVtLmlkXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHBhcnNlZERhdGFTZXQucHVzaChwYXJzZWRSZWNvcmQpO1xyXG4gICAgICAgICAgICAgICAgTG9nZ2VyLmxvZygnaW5mbycsICdEYXRhJywgSlNPTi5zdHJpbmdpZnkocGFyc2VkUmVjb3JkKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2goZSkge1xyXG4gICAgICAgICAgICAgICAgTG9nZ2VyLmxvZygnZXJyb3InLCBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBhcnNlZERhdGFTZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgX2dldENpcmNsZU5hbWUoY2lyY2xlLCBpbmRleCwgZGVsaW1ldGVyPSd0bycpIHtcclxuICAgICAgICBsZXQgY2lyY2xlTmFtZSA9ICcnO1xyXG4gICAgICAgIGlmKGNpcmNsZSE9PW51bGwgJiYgY2lyY2xlIT09dW5kZWZpbmVkICYmIGNpcmNsZS5pbmRleE9mKGRlbGltZXRlcik+LTEpIHtcclxuICAgICAgICAgICAgbGV0IGNpcmNsZXMgPSBjaXJjbGUuc3BsaXQoZGVsaW1ldGVyKTtcclxuICAgICAgICAgICAgaWYoY2lyY2xlcy5sZW5ndGg+MCkge1xyXG4gICAgICAgICAgICAgICAgY2lyY2xlTmFtZSA9IGNpcmNsZXNbaW5kZXhdLnRyaW0oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoY2lyY2xlTmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2JlbmdhbHVydScpPi0xKVxyXG4gICAgICAgICAgICBjaXJjbGVOYW1lID0gJ0JhbmdhbG9yZSc7XHJcblxyXG4gICAgICAgIHJldHVybiBjaXJjbGVOYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIF9nZXREYXRlKHN0ckRhdGUsIHN0clRpbWUpIHtcclxuICAgICAgICBsZXQgZHQgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIHRyeXtcclxuICAgICAgICAgICAgZHQgPSBEYXRlLnBhcnNlKGAke3N0ckRhdGV9ICR7c3RyVGltZX1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2goZSkge1xyXG4gICAgICAgICAgICBMb2dnZXIubG9nKCdlcnJvcicsIGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGR0O1xyXG4gICAgfVxyXG59XHJcblxyXG4vL2pzaGludCBpZ25vcmU6ZW5kIl19