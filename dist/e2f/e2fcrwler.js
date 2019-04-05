"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.E2FCrawler = exports.Logger = void 0;

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

var E2FCrawler =
/*#__PURE__*/
function () {
  function E2FCrawler(options) {
    (0, _classCallCheck2.default)(this, E2FCrawler);
    this.options = options || {
      url: '',
      output: 'json'
    };
  }

  (0, _createClass2.default)(E2FCrawler, [{
    key: "postData",
    value: function postData() {
      var _this = this;

      var searchOption = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        url: '',
        data: {
          usrId: 109,
          usrType: 'N'
        }
      };
      // Default options are marked with *
      return fetch(searchOption.url, {
        method: "POST",
        // *GET, POST, PUT, DELETE, etc.
        mode: "cors",
        // no-cors, cors, *same-origin
        cache: "no-cache",
        // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin",
        // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json" // "Content-Type": "application/x-www-form-urlencoded",

        },
        redirect: "follow",
        // manual, *follow, error
        referrer: "no-referrer",
        // no-referrer, *client
        body: JSON.stringify(searchOption.data) // body data type must match "Content-Type" header

      }).then(
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
                if (!(data === null || data === undefined || !data.status || data.result.length === 0)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                parsedDataSet = [];
                parsedRecord = {};
                data = data.result;
                i = 0;

              case 6:
                if (!(i < data.length)) {
                  _context2.next = 45;
                  break;
                }

                _context2.prev = 7;
                dataItem = data[i];
                _context2.t0 = dataItem.airlns_name;
                _context2.t1 = dataItem.flight_no;
                _context2.t2 = -1;
                _context2.next = 14;
                return this._getCircleName(dataItem.destn, 0).then(function (result) {
                  return result;
                }).catch(function (reason) {
                  return Logger.log('error', reason);
                });

              case 14:
                _context2.t3 = _context2.sent;
                _context2.t4 = dataItem.travel_time;
                _context2.t5 = dataItem.travel_date;
                _context2.next = 19;
                return this._getDate(dataItem.travel_date, dataItem.travel_time).then(function (result) {
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
                return this._getCircleName(dataItem.destn, 1).then(function (result) {
                  return result;
                }).catch(function (reason) {
                  return Logger.log('error', reason);
                });

              case 24:
                _context2.t9 = _context2.sent;
                _context2.t10 = dataItem.arrival_time;
                _context2.t11 = dataItem.arrival_date;
                _context2.next = 29;
                return this._getDate(dataItem.arrival_date, dataItem.arrival_time).then(function (result) {
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
                _context2.t14 = dataItem.seat;
                _context2.t15 = dataItem.fare + dataItem.srv_tax + dataItem.gst;
                _context2.t16 = dataItem.id;
                parsedRecord = {
                  flight: _context2.t0,
                  flight_number: _context2.t1,
                  departure: _context2.t7,
                  arrival: _context2.t13,
                  ticket_type: 'Economy',
                  availability: _context2.t14,
                  price: _context2.t15,
                  flight_id: 1,
                  runid: '',
                  recid: _context2.t16
                };
                parsedDataSet.push(parsedRecord);
                Logger.log('info', 'Data', JSON.stringify(parsedRecord));
                _context2.next = 42;
                break;

              case 39:
                _context2.prev = 39;
                _context2.t17 = _context2["catch"](7);
                Logger.log('error', _context2.t17);

              case 42:
                i++;
                _context2.next = 6;
                break;

              case 45:
                return _context2.abrupt("return", parsedDataSet);

              case 46:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[7, 39]]);
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
        var circleName, circles;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                circleName = '';

                if (circle !== null && circle !== undefined && circle.indexOf('to') > -1) {
                  circles = circle.split('to');

                  if (circles.length > 0) {
                    circleName = circles[index].trim();
                  }
                }

                return _context3.abrupt("return", circleName);

              case 3:
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
  return E2FCrawler;
}(); //jshint ignore:end


exports.E2FCrawler = E2FCrawler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lMmYvZTJmY3J3bGVyLmpzIl0sIm5hbWVzIjpbImNyb24iLCJyZXF1aXJlIiwiZXhwcmVzcyIsImZzIiwidXVpZHY0IiwiZGVsYXkiLCJtb21lbnQiLCJmZXRjaCIsIkxvZ2dlciIsInR5cGUiLCJtZXNzYWdlIiwiX3dyaXRlIiwiYXJndW1lbnRzIiwidGltZSIsImZvcm1hdCIsImFyZ3MiLCJBcnJheSIsImZyb20iLCJzcGxpY2UiLCJ1bnNoaWZ0IiwidG9VcHBlckNhc2UiLCJjb25zb2xlIiwibG9nIiwiYXBwbHkiLCJFMkZDcmF3bGVyIiwib3B0aW9ucyIsInVybCIsIm91dHB1dCIsInNlYXJjaE9wdGlvbiIsImRhdGEiLCJ1c3JJZCIsInVzclR5cGUiLCJtZXRob2QiLCJtb2RlIiwiY2FjaGUiLCJjcmVkZW50aWFscyIsImhlYWRlcnMiLCJyZWRpcmVjdCIsInJlZmVycmVyIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwidHJhbnNmb3JtRGF0YSIsImZpbmFsRGF0YSIsImNhdGNoIiwicmVhc29uIiwidW5kZWZpbmVkIiwic3RhdHVzIiwicmVzdWx0IiwibGVuZ3RoIiwicGFyc2VkRGF0YVNldCIsInBhcnNlZFJlY29yZCIsImkiLCJkYXRhSXRlbSIsImFpcmxuc19uYW1lIiwiZmxpZ2h0X25vIiwiX2dldENpcmNsZU5hbWUiLCJkZXN0biIsInRyYXZlbF90aW1lIiwidHJhdmVsX2RhdGUiLCJfZ2V0RGF0ZSIsImlkIiwiY2lyY2xlIiwiZGF0ZSIsImVwb2NoX2RhdGUiLCJhcnJpdmFsX3RpbWUiLCJhcnJpdmFsX2RhdGUiLCJzZWF0IiwiZmFyZSIsInNydl90YXgiLCJnc3QiLCJmbGlnaHQiLCJmbGlnaHRfbnVtYmVyIiwiZGVwYXJ0dXJlIiwiYXJyaXZhbCIsInRpY2tldF90eXBlIiwiYXZhaWxhYmlsaXR5IiwicHJpY2UiLCJmbGlnaHRfaWQiLCJydW5pZCIsInJlY2lkIiwicHVzaCIsImluZGV4IiwiY2lyY2xlTmFtZSIsImluZGV4T2YiLCJjaXJjbGVzIiwic3BsaXQiLCJ0cmltIiwic3RyRGF0ZSIsInN0clRpbWUiLCJkdCIsIkRhdGUiLCJub3ciLCJwYXJzZSIsImUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBLElBQU1BLElBQUksR0FBR0MsT0FBTyxDQUFDLFdBQUQsQ0FBcEI7O0FBQ0EsSUFBTUMsT0FBTyxHQUFHRCxPQUFPLENBQUMsU0FBRCxDQUF2Qjs7QUFDQSxJQUFNRSxFQUFFLEdBQUdGLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUVBLElBQU1HLE1BQU0sR0FBR0gsT0FBTyxDQUFDLFNBQUQsQ0FBdEI7O0FBQ0EsSUFBTUksS0FBSyxHQUFHSixPQUFPLENBQUMsT0FBRCxDQUFyQjs7QUFDQSxJQUFNSyxNQUFNLEdBQUdMLE9BQU8sQ0FBQyxRQUFELENBQXRCOztBQUNBLElBQU1NLEtBQUssR0FBR04sT0FBTyxDQUFDLGtCQUFELENBQXJCLEMsQ0FFQTtBQUNBOzs7SUFFYU8sTTs7Ozs7Ozs7O3dCQUNFQyxJLEVBQU1DLE8sRUFBUztBQUN0QixjQUFRRCxJQUFSO0FBQ0ksYUFBSyxNQUFMO0FBQ0FELFVBQUFBLE1BQU0sQ0FBQ0csTUFBUCxDQUFjQyxTQUFkOztBQUNJOztBQUNKLGFBQUssU0FBTDtBQUNJSixVQUFBQSxNQUFNLENBQUNHLE1BQVAsQ0FBY0MsU0FBZDs7QUFDQTs7QUFDSixhQUFLLE9BQUw7QUFDSUosVUFBQUEsTUFBTSxDQUFDRyxNQUFQLENBQWNDLFNBQWQ7O0FBQ0E7O0FBQ0o7QUFDSTtBQVhSO0FBYUg7OzsyQkFFYUgsSSxFQUFNO0FBQ2hCLFVBQUlJLElBQUksR0FBR1AsTUFBTSxHQUFHUSxNQUFULENBQWdCLGNBQWhCLENBQVgsQ0FEZ0IsQ0FFaEI7O0FBQ0EsVUFBSUMsSUFBSSxHQUFHQyxLQUFLLENBQUNDLElBQU4sQ0FBV0wsU0FBUyxDQUFDLENBQUQsQ0FBcEIsQ0FBWDtBQUNBSCxNQUFBQSxJQUFJ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LFUsR0FBYSxFOztBQUNqQixvQkFBR3JCLE1BQU0sS0FBRyxJQUFULElBQWlCQSxNQUFNLEtBQUdoQixTQUExQixJQUF1Q2dCLE1BQU0sQ0FBQ3NCLE9BQVAsQ0FBZSxJQUFmLElBQXFCLENBQUMsQ0FBaEUsRUFBbUU7QUFDM0RDLGtCQUFBQSxPQUQyRCxHQUNqRHZCLE1BQU0sQ0FBQ3dCLEtBQVAsQ0FBYSxJQUFiLENBRGlEOztBQUUvRCxzQkFBR0QsT0FBTyxDQUFDcEMsTUFBUixHQUFlLENBQWxCLEVBQXFCO0FBQ2pCa0Msb0JBQUFBLFVBQVUsR0FBR0UsT0FBTyxDQUFDSCxLQUFELENBQVAsQ0FBZUssSUFBZixFQUFiO0FBQ0g7QUFDSjs7a0RBRU1KLFU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrREFHSUssTyxFQUFTQyxPOzs7Ozs7QUFDaEJDLGdCQUFBQSxFLEdBQUtDLElBQUksQ0FBQ0MsR0FBTCxFOztBQUNULG9CQUFHO0FBQ0NGLGtCQUFBQSxFQUFFLEdBQUdDLElBQUksQ0FBQ0UsS0FBTCxXQUFjTCxPQUFkLGNBQXlCQyxPQUF6QixFQUFMO0FBQ0gsaUJBRkQsQ0FHQSxPQUFNSyxDQUFOLEVBQVM7QUFDTHpGLGtCQUFBQSxNQUFNLENBQUNjLEdBQVAsQ0FBVyxPQUFYLEVBQW9CMkUsQ0FBcEI7QUFDSDs7a0RBRU1KLEU7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQUlmIiwic291cmNlc0NvbnRlbnQiOlsiLy9qc2hpbnQgZXN2ZXJzaW9uOiA2XHJcbi8vanNoaW50IGlnbm9yZTpzdGFydFxyXG5jb25zdCBjcm9uID0gcmVxdWlyZShcIm5vZGUtY3JvblwiKTtcclxuY29uc3QgZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xyXG5jb25zdCBmcyA9IHJlcXVpcmUoXCJmc1wiKTtcclxuXHJcbmNvbnN0IHV1aWR2NCA9IHJlcXVpcmUoJ3V1aWQvdjQnKTtcclxuY29uc3QgZGVsYXkgPSByZXF1aXJlKCdkZWxheScpO1xyXG5jb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxuY29uc3QgZmV0Y2ggPSByZXF1aXJlKCdpc29tb3JwaGljLWZldGNoJyk7XHJcblxyXG4vL2ltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xyXG4vLyBpbXBvcnQgXCJpc29tb3JwaGljLWZldGNoXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9nZ2VyIHtcclxuICAgIHN0YXRpYyBsb2codHlwZSwgbWVzc2FnZSkge1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiaW5mb1wiOlxyXG4gICAgICAgICAgICBMb2dnZXIuX3dyaXRlKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIndhcm5pbmdcIjpcclxuICAgICAgICAgICAgICAgIExvZ2dlci5fd3JpdGUoYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiZXJyb3JcIjpcclxuICAgICAgICAgICAgICAgIExvZ2dlci5fd3JpdGUoYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBfd3JpdGUodHlwZSkge1xyXG4gICAgICAgIHZhciB0aW1lID0gbW9tZW50KCkuZm9ybWF0KFwiSEg6bW06c3MuU1NTXCIpO1xyXG4gICAgICAgIC8vYXJndW1lbnRzLnNwbGljZSgwKVxyXG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkuZnJvbShhcmd1bWVudHNbMF0pO1xyXG4gICAgICAgIHR5cGUgPSBhcmdzWzBdO1xyXG4gICAgICAgIGFyZ3Muc3BsaWNlKDAsMSk7XHJcbiAgICBcclxuICAgICAgICBhcmdzLnVuc2hpZnQodGltZSk7XHJcbiAgICAgICAgYXJncy51bnNoaWZ0KHR5cGUudG9VcHBlckNhc2UoKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJncyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFMkZDcmF3bGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt1cmw6ICcnLCBvdXRwdXQ6ICdqc29uJ307XHJcbiAgICB9XHJcblxyXG4gICAgcG9zdERhdGEoc2VhcmNoT3B0aW9uPXt1cmw6ICcnLCBkYXRhOiB7dXNySWQ6IDEwOSwgdXNyVHlwZTogJ04nfX0pIHtcclxuICAgICAgICAvLyBEZWZhdWx0IG9wdGlvbnMgYXJlIG1hcmtlZCB3aXRoICpcclxuICAgICAgICByZXR1cm4gZmV0Y2goc2VhcmNoT3B0aW9uLnVybCwge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLCAvLyAqR0VULCBQT1NULCBQVVQsIERFTEVURSwgZXRjLlxyXG4gICAgICAgICAgICBtb2RlOiBcImNvcnNcIiwgLy8gbm8tY29ycywgY29ycywgKnNhbWUtb3JpZ2luXHJcbiAgICAgICAgICAgIGNhY2hlOiBcIm5vLWNhY2hlXCIsIC8vICpkZWZhdWx0LCBuby1jYWNoZSwgcmVsb2FkLCBmb3JjZS1jYWNoZSwgb25seS1pZi1jYWNoZWRcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiwgLy8gaW5jbHVkZSwgKnNhbWUtb3JpZ2luLCBvbWl0XHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgLy8gXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmVkaXJlY3Q6IFwiZm9sbG93XCIsIC8vIG1hbnVhbCwgKmZvbGxvdywgZXJyb3JcclxuICAgICAgICAgICAgcmVmZXJyZXI6IFwibm8tcmVmZXJyZXJcIiwgLy8gbm8tcmVmZXJyZXIsICpjbGllbnRcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoc2VhcmNoT3B0aW9uLmRhdGEpLCAvLyBib2R5IGRhdGEgdHlwZSBtdXN0IG1hdGNoIFwiQ29udGVudC1UeXBlXCIgaGVhZGVyXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihhc3luYyByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIExvZ2dlci5sb2coXCJpbmZvXCIsIFwiUmVzcG9uc2UgcmVjZWl2ZWRcIik7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICAgICAgdGhpcy5maW5hbERhdGEgPSBhd2FpdCB0aGlzLnRyYW5zZm9ybURhdGEodGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWFzb24gPT4ge1xyXG4gICAgICAgICAgICBMb2dnZXIubG9nKFwiZXJyb3JcIiwgcmVhc29uKTtcclxuICAgICAgICAgICAgdGhyb3cgcmVhc29uO1xyXG4gICAgICAgIH0pOyAvLyBwYXJzZXMgSlNPTiByZXNwb25zZSBpbnRvIG5hdGl2ZSBKYXZhc2NyaXB0IG9iamVjdHMgXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgdHJhbnNmb3JtRGF0YShkYXRhKSB7XHJcbiAgICAgICAgaWYoZGF0YT09PW51bGwgfHwgZGF0YT09PXVuZGVmaW5lZCB8fCAhZGF0YS5zdGF0dXMgfHwgZGF0YS5yZXN1bHQubGVuZ3RoPT09MCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgcGFyc2VkRGF0YVNldCA9IFtdO1xyXG4gICAgICAgIGxldCBwYXJzZWRSZWNvcmQgPSB7fTtcclxuICAgICAgICBkYXRhID0gZGF0YS5yZXN1bHQ7XHJcblxyXG4gICAgICAgIGZvcih2YXIgaT0wOyBpPGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCBkYXRhSXRlbSA9IGRhdGFbaV07XHJcbiAgICAgICAgICAgICAgICBwYXJzZWRSZWNvcmQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxpZ2h0OiBkYXRhSXRlbS5haXJsbnNfbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBmbGlnaHRfbnVtYmVyOiBkYXRhSXRlbS5mbGlnaHRfbm8sXHJcbiAgICAgICAgICAgICAgICAgICAgZGVwYXJ0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2lyY2xlOiBhd2FpdCB0aGlzLl9nZXRDaXJjbGVOYW1lKGRhdGFJdGVtLmRlc3RuLCAwKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpLmNhdGNoKHJlYXNvbiA9PiBMb2dnZXIubG9nKCdlcnJvcicsIHJlYXNvbikpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lOiBkYXRhSXRlbS50cmF2ZWxfdGltZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogZGF0YUl0ZW0udHJhdmVsX2RhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVwb2NoX2RhdGU6IGF3YWl0IHRoaXMuX2dldERhdGUoZGF0YUl0ZW0udHJhdmVsX2RhdGUsIGRhdGFJdGVtLnRyYXZlbF90aW1lKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpLmNhdGNoKHJlYXNvbiA9PiBMb2dnZXIubG9nKCdlcnJvcicsIHJlYXNvbikpXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBhcnJpdmFsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2lyY2xlOiBhd2FpdCB0aGlzLl9nZXRDaXJjbGVOYW1lKGRhdGFJdGVtLmRlc3RuLCAxKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpLmNhdGNoKHJlYXNvbiA9PiBMb2dnZXIubG9nKCdlcnJvcicsIHJlYXNvbikpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lOiBkYXRhSXRlbS5hcnJpdmFsX3RpbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IGRhdGFJdGVtLmFycml2YWxfZGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXBvY2hfZGF0ZTogYXdhaXQgdGhpcy5fZ2V0RGF0ZShkYXRhSXRlbS5hcnJpdmFsX2RhdGUsIGRhdGFJdGVtLmFycml2YWxfdGltZSkudGhlbihyZXN1bHQgPT4gcmVzdWx0KS5jYXRjaChyZWFzb24gPT4gTG9nZ2VyLmxvZygnZXJyb3InLCByZWFzb24pKVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRpY2tldF90eXBlOiAnRWNvbm9teScsXHJcbiAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmlsaXR5OiBkYXRhSXRlbS5zZWF0LFxyXG4gICAgICAgICAgICAgICAgICAgIHByaWNlOiAoZGF0YUl0ZW0uZmFyZStkYXRhSXRlbS5zcnZfdGF4K2RhdGFJdGVtLmdzdCksXHJcbiAgICAgICAgICAgICAgICAgICAgZmxpZ2h0X2lkOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHJ1bmlkOiAnJyxcclxuICAgICAgICAgICAgICAgICAgICByZWNpZDogZGF0YUl0ZW0uaWRcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgcGFyc2VkRGF0YVNldC5wdXNoKHBhcnNlZFJlY29yZCk7XHJcbiAgICAgICAgICAgICAgICBMb2dnZXIubG9nKCdpbmZvJywgJ0RhdGEnLCBKU09OLnN0cmluZ2lmeShwYXJzZWRSZWNvcmQpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaChlKSB7XHJcbiAgICAgICAgICAgICAgICBMb2dnZXIubG9nKCdlcnJvcicsIGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcGFyc2VkRGF0YVNldDtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBfZ2V0Q2lyY2xlTmFtZShjaXJjbGUsIGluZGV4KSB7XHJcbiAgICAgICAgbGV0IGNpcmNsZU5hbWUgPSAnJztcclxuICAgICAgICBpZihjaXJjbGUhPT1udWxsICYmIGNpcmNsZSE9PXVuZGVmaW5lZCAmJiBjaXJjbGUuaW5kZXhPZigndG8nKT4tMSkge1xyXG4gICAgICAgICAgICBsZXQgY2lyY2xlcyA9IGNpcmNsZS5zcGxpdCgndG8nKTtcclxuICAgICAgICAgICAgaWYoY2lyY2xlcy5sZW5ndGg+MCkge1xyXG4gICAgICAgICAgICAgICAgY2lyY2xlTmFtZSA9IGNpcmNsZXNbaW5kZXhdLnRyaW0oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNpcmNsZU5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgX2dldERhdGUoc3RyRGF0ZSwgc3RyVGltZSkge1xyXG4gICAgICAgIGxldCBkdCA9IERhdGUubm93KCk7XHJcbiAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICBkdCA9IERhdGUucGFyc2UoYCR7c3RyRGF0ZX0gJHtzdHJUaW1lfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaChlKSB7XHJcbiAgICAgICAgICAgIExvZ2dlci5sb2coJ2Vycm9yJywgZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZHQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vanNoaW50IGlnbm9yZTplbmQiXX0=