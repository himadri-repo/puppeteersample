"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DoshiCrawler = exports.Logger = void 0;

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

var moment = require('moment'); //const momenttz = require('moment-timezone');


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

var DoshiCrawler =
/*#__PURE__*/
function () {
  function DoshiCrawler(options) {
    (0, _classCallCheck2.default)(this, DoshiCrawler);
    this.options = options || {
      url: '',
      output: 'json',
      cities: [],
      airlines: []
    };
    this.cities = this.options.cities;
    this.airlines = this.options.airlines;
  }

  (0, _createClass2.default)(DoshiCrawler, [{
    key: "postData",
    value: function postData() {
      var _this = this;

      var searchOption = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        url: '',
        data: {}
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
        referrer: "https://doshitravels.com/home",
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
        var parsedDataSet, parsedRecord, i, dataItem, source, destination;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(data === null || data === undefined || !data.success || data.tickets.length === 0)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                parsedDataSet = [];
                parsedRecord = {};
                data = data.tickets;
                i = 0;

              case 6:
                if (!(i < data.length)) {
                  _context2.next = 51;
                  break;
                }

                _context2.prev = 7;
                dataItem = data[i];
                source = dataItem.route.name.split('-')[0];
                destination = dataItem.route.name.split('-')[1];

                if (!(source === null || source === undefined || source.trim() === "" || destination === null || destination === undefined || destination.trim() === "")) {
                  _context2.next = 13;
                  break;
                }

                return _context2.abrupt("continue", 48);

              case 13:
                _context2.t0 = dataItem.airLine;
                _context2.t1 = dataItem.flightNumber;
                _context2.t2 = -1;
                _context2.next = 18;
                return this._getCircleName(dataItem.route.name, 0).then(function (result) {
                  return result;
                }).catch(function (reason) {
                  return Logger.log('error', reason);
                });

              case 18:
                _context2.t3 = _context2.sent;
                _context2.t4 = moment(dataItem.departure, 'YYYY-MM-DDTHH:mm:ss.SSSZ').utcOffset("+00:00").format("HH:mm");
                _context2.t5 = moment(dataItem.departure, 'YYYY-MM-DDTHH:mm:ss.SSSZ').utcOffset("+00:00").format("YYYY-MM-DD");
                _context2.next = 23;
                return this._getDate(moment(dataItem.departure, 'YYYY-MM-DDTHH:mm:ss.SSSZ').utcOffset("+00:00").format("YYYY-MM-DD"), moment(dataItem.departure, 'YYYY-MM-DDTHH:mm:ss.SSSZ').utcOffset("+00:00").format("HH:mm")).then(function (result) {
                  return result;
                }).catch(function (reason) {
                  return Logger.log('error', reason);
                });

              case 23:
                _context2.t6 = _context2.sent;
                _context2.t7 = {
                  id: _context2.t2,
                  circle: _context2.t3,
                  time: _context2.t4,
                  date: _context2.t5,
                  epoch_date: _context2.t6
                };
                _context2.t8 = -1;
                _context2.next = 28;
                return this._getCircleName(dataItem.route.name, 1).then(function (result) {
                  return result;
                }).catch(function (reason) {
                  return Logger.log('error', reason);
                });

              case 28:
                _context2.t9 = _context2.sent;
                _context2.t10 = moment(dataItem.arrival, 'YYYY-MM-DDTHH:mm:ss.SSSZ').utcOffset("+05:30").format("HH:mm");
                _context2.t11 = moment(dataItem.arrival, 'YYYY-MM-DDTHH:mm:ss.SSSZ').utcOffset("+05:30").format("YYYY-MM-DD");
                _context2.next = 33;
                return this._getDate(moment(dataItem.arrival, 'YYYY-MM-DDTHH:mm:ss.SSSZ').utcOffset("+05:30").format("YYYY-MM-DD"), moment(dataItem.arrival, 'YYYY-MM-DDTHH:mm:ss.SSSZ').utcOffset("+05:30").format("HH:mm")).then(function (result) {
                  return result;
                }).catch(function (reason) {
                  return Logger.log('error', reason);
                });

              case 33:
                _context2.t12 = _context2.sent;
                _context2.t13 = {
                  id: _context2.t8,
                  circle: _context2.t9,
                  time: _context2.t10,
                  date: _context2.t11,
                  epoch_date: _context2.t12
                };
                _context2.t14 = dataItem.flightClass;
                _context2.t15 = dataItem.PNR[0];
                _context2.t16 = dataItem.quantity;
                _context2.t17 = dataItem.price.total;
                _context2.t18 = dataItem._id;
                parsedRecord = {
                  flight: _context2.t0,
                  flight_number: _context2.t1,
                  departure: _context2.t7,
                  arrival: _context2.t13,
                  ticket_type: _context2.t14,
                  pnr: _context2.t15,
                  availability: _context2.t16,
                  price: _context2.t17,
                  flight_id: 1,
                  runid: '',
                  recid: _context2.t18
                };
                parsedDataSet.push(parsedRecord);
                Logger.log('info', 'Data', JSON.stringify(parsedRecord));
                _context2.next = 48;
                break;

              case 45:
                _context2.prev = 45;
                _context2.t19 = _context2["catch"](7);
                Logger.log('error', _context2.t19);

              case 48:
                i++;
                _context2.next = 6;
                break;

              case 51:
                return _context2.abrupt("return", parsedDataSet);

              case 52:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[7, 45]]);
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

                if (circle !== null && circle !== undefined && circle.indexOf('-') > -1) {
                  circles = circle.split('-');

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
  return DoshiCrawler;
}(); //jshint ignore:end


exports.DoshiCrawler = DoshiCrawler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kb3NoaS9kb3NoaWNyd2xlci5qcyJdLCJuYW1lcyI6WyJjcm9uIiwicmVxdWlyZSIsImV4cHJlc3MiLCJmcyIsInV1aWR2NCIsImRlbGF5IiwibW9tZW50IiwiZmV0Y2giLCJMb2dnZXIiLCJ0eXBlIiwibWVzc2FnZSIsIl93cml0ZSIsImFyZ3VtZW50cyIsInRpbWUiLCJmb3JtYXQiLCJhcmdzIiwiQXJyYXkiLCJmcm9tIiwic3BsaWNlIiwidW5zaGlmdCIsInRvVXBwZXJDYXNlIiwiY29uc29sZSIsImxvZyIsImFwcGx5IiwiRG9zaGlDcmF3bGVyIiwib3B0aW9ucyIsInVybCIsIm91dHB1dCIsImNpdGllcyIsImFpcmxpbmVzIiwic2VhcmNoT3B0aW9uIiwiZGF0YSIsIm1ldGhvZCIsIm1vZGUiLCJjYWNoZSIsImNyZWRlbnRpYWxzIiwiaGVhZGVycyIsInJlZGlyZWN0IiwicmVmZXJyZXIiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsInRoZW4iLCJyZXNwb25zZSIsImpzb24iLCJ0cmFuc2Zvcm1EYXRhIiwiZmluYWxEYXRhIiwiY2F0Y2giLCJyZWFzb24iLCJ1bmRlZmluZWQiLCJzdWNjZXNzIiwidGlja2V0cyIsImxlbmd0aCIsInBhcnNlZERhdGFTZXQiLCJwYXJzZWRSZWNvcmQiLCJpIiwiZGF0YUl0ZW0iLCJzb3VyY2UiLCJyb3V0ZSIsIm5hbWUiLCJzcGxpdCIsImRlc3RpbmF0aW9uIiwidHJpbSIsImFpckxpbmUiLCJmbGlnaHROdW1iZXIiLCJfZ2V0Q2lyY2xlTmFtZSIsInJlc3VsdCIsImRlcGFydHVyZSIsInV0Y09mZnNldCIsIl9nZXREYXRlIiwiaWQiLCJjaXJjbGUiLCJkYXRlIiwiZXBvY2hfZGF0ZSIsImFycml2YWwiLCJmbGlnaHRDbGFzcyIsIlBOUiIsInF1YW50aXR5IiwicHJpY2UiLCJ0b3RhbCIsIl9pZCIsImZsaWdodCIsImZsaWdodF9udW1iZXIiLCJ0aWNrZXRfdHlwZSIsInBuciIsImF2YWlsYWJpbGl0eSIsImZsaWdodF9pZCIsInJ1bmlkIiwicmVjaWQiLCJwdXNoIiwiaW5kZXgiLCJjaXJjbGVOYW1lIiwiaW5kZXhPZiIsImNpcmNsZXMiLCJzdHJEYXRlIiwic3RyVGltZSIsImR0IiwiRGF0ZSIsIm5vdyIsInBhcnNlIiwiZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0EsSUFBTUEsSUFBSSxHQUFHQyxPQUFPLENBQUMsV0FBRCxDQUFwQjs7QUFDQSxJQUFNQyxPQUFPLEdBQUdELE9BQU8sQ0FBQyxTQUFELENBQXZCOztBQUNBLElBQU1FLEVBQUUsR0FBR0YsT0FBTyxDQUFDLElBQUQsQ0FBbEI7O0FBRUEsSUFBTUcsTUFBTSxHQUFHSCxPQUFPLENBQUMsU0FBRCxDQUF0Qjs7QUFDQSxJQUFNSSxLQUFLLEdBQUdKLE9BQU8sQ0FBQyxPQUFELENBQXJCOztBQUNBLElBQU1LLE1BQU0sR0FBR0wsT0FBTyxDQUFDLFFBQUQsQ0FBdEIsQyxDQUNBOzs7QUFDQSxJQUFNTSxLQUFLLEdBQUdOLE9BQU8sQ0FBQyxrQkFBRCxDQUFyQixDLENBRUE7QUFDQTs7O0lBRWFPLE07Ozs7Ozs7Ozt3QkFDRUMsSSxFQUFNQyxPLEVBQVM7QUFDdEIsY0FBUUQsSUFBUjtBQUNJLGFBQUssTUFBTDtBQUNBRCxVQUFBQSxNQUFNLENBQUNHLE1BQVAsQ0FBY0MsU0FBZDs7QUFDSTs7QUFDSixhQUFLLFNBQUw7QUFDSUosVUFBQUEsTUFBTSxDQUFDRyxNQUFQLENBQWNDLFNBQWQ7O0FBQ0E7O0FBQ0osYUFBSyxPQUFMO0FBQ0lKLFVBQUFBLE1BQU0sQ0FBQ0csTUFBUCxDQUFjQyxTQUFkOztBQUNBOztBQUNKO0FBQ0k7QUFYUjtBQWFIOzs7MkJBRWFILEksRUFBTTtBQUNoQixVQUFJSSxJQUFJLEdBQUdQLE1BQU0sR0FBR1EsTUFBVCxDQUFnQixjQUFoQixDQUFYLENBRGdCLENBRWhCOztBQUNBLFVBQUlDLElBQUksR0FBR0MsS0FBSyxDQUFDQyxJQUFOLENBQVdMLFNBQVMsQ0FBQyxD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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FJZiIsInNvdXJjZXNDb250ZW50IjpbIi8vanNoaW50IGVzdmVyc2lvbjogNlxyXG4vL2pzaGludCBpZ25vcmU6c3RhcnRcclxuY29uc3QgY3JvbiA9IHJlcXVpcmUoXCJub2RlLWNyb25cIik7XHJcbmNvbnN0IGV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcclxuY29uc3QgZnMgPSByZXF1aXJlKFwiZnNcIik7XHJcblxyXG5jb25zdCB1dWlkdjQgPSByZXF1aXJlKCd1dWlkL3Y0Jyk7XHJcbmNvbnN0IGRlbGF5ID0gcmVxdWlyZSgnZGVsYXknKTtcclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcbi8vY29uc3QgbW9tZW50dHogPSByZXF1aXJlKCdtb21lbnQtdGltZXpvbmUnKTtcclxuY29uc3QgZmV0Y2ggPSByZXF1aXJlKCdpc29tb3JwaGljLWZldGNoJyk7XHJcblxyXG4vL2ltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xyXG4vLyBpbXBvcnQgXCJpc29tb3JwaGljLWZldGNoXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9nZ2VyIHtcclxuICAgIHN0YXRpYyBsb2codHlwZSwgbWVzc2FnZSkge1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiaW5mb1wiOlxyXG4gICAgICAgICAgICBMb2dnZXIuX3dyaXRlKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIndhcm5pbmdcIjpcclxuICAgICAgICAgICAgICAgIExvZ2dlci5fd3JpdGUoYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiZXJyb3JcIjpcclxuICAgICAgICAgICAgICAgIExvZ2dlci5fd3JpdGUoYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBfd3JpdGUodHlwZSkge1xyXG4gICAgICAgIHZhciB0aW1lID0gbW9tZW50KCkuZm9ybWF0KFwiSEg6bW06c3MuU1NTXCIpO1xyXG4gICAgICAgIC8vYXJndW1lbnRzLnNwbGljZSgwKVxyXG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkuZnJvbShhcmd1bWVudHNbMF0pO1xyXG4gICAgICAgIHR5cGUgPSBhcmdzWzBdO1xyXG4gICAgICAgIGFyZ3Muc3BsaWNlKDAsMSk7XHJcbiAgICBcclxuICAgICAgICBhcmdzLnVuc2hpZnQodGltZSk7XHJcbiAgICAgICAgYXJncy51bnNoaWZ0KHR5cGUudG9VcHBlckNhc2UoKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJncyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBEb3NoaUNyYXdsZXIge1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge3VybDogJycsIG91dHB1dDogJ2pzb24nLCBjaXRpZXM6IFtdLCBhaXJsaW5lczogW119O1xyXG5cclxuICAgICAgICB0aGlzLmNpdGllcyA9IHRoaXMub3B0aW9ucy5jaXRpZXM7XHJcbiAgICAgICAgdGhpcy5haXJsaW5lcyA9IHRoaXMub3B0aW9ucy5haXJsaW5lcztcclxuICAgIH1cclxuXHJcbiAgICBwb3N0RGF0YShzZWFyY2hPcHRpb249e3VybDogJycsIGRhdGE6IHt9fSkge1xyXG4gICAgICAgIC8vIERlZmF1bHQgb3B0aW9ucyBhcmUgbWFya2VkIHdpdGggKlxyXG4gICAgICAgIHJldHVybiBmZXRjaChzZWFyY2hPcHRpb24udXJsLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsIC8vICpHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBldGMuXHJcbiAgICAgICAgICAgIG1vZGU6IFwiY29yc1wiLCAvLyBuby1jb3JzLCBjb3JzLCAqc2FtZS1vcmlnaW5cclxuICAgICAgICAgICAgY2FjaGU6IFwibm8tY2FjaGVcIiwgLy8gKmRlZmF1bHQsIG5vLWNhY2hlLCByZWxvYWQsIGZvcmNlLWNhY2hlLCBvbmx5LWlmLWNhY2hlZFxyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCAvLyBpbmNsdWRlLCAqc2FtZS1vcmlnaW4sIG9taXRcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICAvLyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZWRpcmVjdDogXCJmb2xsb3dcIiwgLy8gbWFudWFsLCAqZm9sbG93LCBlcnJvclxyXG4gICAgICAgICAgICByZWZlcnJlcjogXCJodHRwczovL2Rvc2hpdHJhdmVscy5jb20vaG9tZVwiLCAvLyBuby1yZWZlcnJlciwgKmNsaWVudFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShzZWFyY2hPcHRpb24uZGF0YSksIC8vIGJvZHkgZGF0YSB0eXBlIG11c3QgbWF0Y2ggXCJDb250ZW50LVR5cGVcIiBoZWFkZXJcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKGFzeW5jIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgTG9nZ2VyLmxvZyhcImluZm9cIiwgXCJSZXNwb25zZSByZWNlaXZlZFwiKTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgICAgICB0aGlzLmZpbmFsRGF0YSA9IGF3YWl0IHRoaXMudHJhbnNmb3JtRGF0YSh0aGlzLmRhdGEpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlYXNvbiA9PiB7XHJcbiAgICAgICAgICAgIExvZ2dlci5sb2coXCJlcnJvclwiLCByZWFzb24pO1xyXG4gICAgICAgICAgICB0aHJvdyByZWFzb247XHJcbiAgICAgICAgfSk7IC8vIHBhcnNlcyBKU09OIHJlc3BvbnNlIGludG8gbmF0aXZlIEphdmFzY3JpcHQgb2JqZWN0cyBcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyB0cmFuc2Zvcm1EYXRhKGRhdGEpIHtcclxuICAgICAgICBpZihkYXRhPT09bnVsbCB8fCBkYXRhPT09dW5kZWZpbmVkIHx8ICFkYXRhLnN1Y2Nlc3MgfHwgZGF0YS50aWNrZXRzLmxlbmd0aD09PTApIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IHBhcnNlZERhdGFTZXQgPSBbXTtcclxuICAgICAgICBsZXQgcGFyc2VkUmVjb3JkID0ge307XHJcbiAgICAgICAgZGF0YSA9IGRhdGEudGlja2V0cztcclxuXHJcbiAgICAgICAgZm9yKHZhciBpPTA7IGk8ZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IGRhdGFJdGVtID0gZGF0YVtpXTtcclxuICAgICAgICAgICAgICAgIGxldCBzb3VyY2UgPSBkYXRhSXRlbS5yb3V0ZS5uYW1lLnNwbGl0KCctJylbMF07XHJcbiAgICAgICAgICAgICAgICBsZXQgZGVzdGluYXRpb24gPSBkYXRhSXRlbS5yb3V0ZS5uYW1lLnNwbGl0KCctJylbMV07XHJcbiAgICAgICAgICAgICAgICBpZigoc291cmNlPT09bnVsbCB8fCBzb3VyY2U9PT11bmRlZmluZWQgfHwgc291cmNlLnRyaW0oKT09PVwiXCIpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgKGRlc3RpbmF0aW9uPT09bnVsbCB8fCBkZXN0aW5hdGlvbj09PXVuZGVmaW5lZCB8fCBkZXN0aW5hdGlvbi50cmltKCk9PT1cIlwiKSkgXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcGFyc2VkUmVjb3JkID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZsaWdodDogZGF0YUl0ZW0uYWlyTGluZSxcclxuICAgICAgICAgICAgICAgICAgICBmbGlnaHRfbnVtYmVyOiBkYXRhSXRlbS5mbGlnaHROdW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVwYXJ0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2lyY2xlOiBhd2FpdCB0aGlzLl9nZXRDaXJjbGVOYW1lKGRhdGFJdGVtLnJvdXRlLm5hbWUsIDApLnRoZW4ocmVzdWx0ID0+IHJlc3VsdCkuY2F0Y2gocmVhc29uID0+IExvZ2dlci5sb2coJ2Vycm9yJywgcmVhc29uKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6IG1vbWVudChkYXRhSXRlbS5kZXBhcnR1cmUsICdZWVlZLU1NLUREVEhIOm1tOnNzLlNTU1onKS51dGNPZmZzZXQoXCIrMDA6MDBcIikuZm9ybWF0KFwiSEg6bW1cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IG1vbWVudChkYXRhSXRlbS5kZXBhcnR1cmUsICdZWVlZLU1NLUREVEhIOm1tOnNzLlNTU1onKS51dGNPZmZzZXQoXCIrMDA6MDBcIikuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXBvY2hfZGF0ZTogYXdhaXQgdGhpcy5fZ2V0RGF0ZShtb21lbnQoZGF0YUl0ZW0uZGVwYXJ0dXJlLCAnWVlZWS1NTS1ERFRISDptbTpzcy5TU1NaJykudXRjT2Zmc2V0KFwiKzAwOjAwXCIpLmZvcm1hdChcIllZWVktTU0tRERcIiksIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9tZW50KGRhdGFJdGVtLmRlcGFydHVyZSwgJ1lZWVktTU0tRERUSEg6bW06c3MuU1NTWicpLnV0Y09mZnNldChcIiswMDowMFwiKS5mb3JtYXQoXCJISDptbVwiKSkudGhlbihyZXN1bHQgPT4gcmVzdWx0KS5jYXRjaChyZWFzb24gPT4gTG9nZ2VyLmxvZygnZXJyb3InLCByZWFzb24pKVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgYXJyaXZhbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogLTEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNpcmNsZTogYXdhaXQgdGhpcy5fZ2V0Q2lyY2xlTmFtZShkYXRhSXRlbS5yb3V0ZS5uYW1lLCAxKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpLmNhdGNoKHJlYXNvbiA9PiBMb2dnZXIubG9nKCdlcnJvcicsIHJlYXNvbikpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lOiBtb21lbnQoZGF0YUl0ZW0uYXJyaXZhbCwgJ1lZWVktTU0tRERUSEg6bW06c3MuU1NTWicpLnV0Y09mZnNldChcIiswNTozMFwiKS5mb3JtYXQoXCJISDptbVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbW9tZW50KGRhdGFJdGVtLmFycml2YWwsICdZWVlZLU1NLUREVEhIOm1tOnNzLlNTU1onKS51dGNPZmZzZXQoXCIrMDU6MzBcIikuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXBvY2hfZGF0ZTogYXdhaXQgdGhpcy5fZ2V0RGF0ZShtb21lbnQoZGF0YUl0ZW0uYXJyaXZhbCwgJ1lZWVktTU0tRERUSEg6bW06c3MuU1NTWicpLnV0Y09mZnNldChcIiswNTozMFwiKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vbWVudChkYXRhSXRlbS5hcnJpdmFsLCAnWVlZWS1NTS1ERFRISDptbTpzcy5TU1NaJykudXRjT2Zmc2V0KFwiKzA1OjMwXCIpLmZvcm1hdChcIkhIOm1tXCIpKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpLmNhdGNoKHJlYXNvbiA9PiBMb2dnZXIubG9nKCdlcnJvcicsIHJlYXNvbikpXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGlja2V0X3R5cGU6IGRhdGFJdGVtLmZsaWdodENsYXNzLFxyXG4gICAgICAgICAgICAgICAgICAgIHBucjogZGF0YUl0ZW0uUE5SWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGF2YWlsYWJpbGl0eTogZGF0YUl0ZW0ucXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IChkYXRhSXRlbS5wcmljZS50b3RhbCksXHJcbiAgICAgICAgICAgICAgICAgICAgZmxpZ2h0X2lkOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHJ1bmlkOiAnJyxcclxuICAgICAgICAgICAgICAgICAgICByZWNpZDogZGF0YUl0ZW0uX2lkXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHBhcnNlZERhdGFTZXQucHVzaChwYXJzZWRSZWNvcmQpO1xyXG4gICAgICAgICAgICAgICAgTG9nZ2VyLmxvZygnaW5mbycsICdEYXRhJywgSlNPTi5zdHJpbmdpZnkocGFyc2VkUmVjb3JkKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2goZSkge1xyXG4gICAgICAgICAgICAgICAgTG9nZ2VyLmxvZygnZXJyb3InLCBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBhcnNlZERhdGFTZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgX2dldENpcmNsZU5hbWUoY2lyY2xlLCBpbmRleCkge1xyXG4gICAgICAgIGxldCBjaXJjbGVOYW1lID0gJyc7XHJcbiAgICAgICAgaWYoY2lyY2xlIT09bnVsbCAmJiBjaXJjbGUhPT11bmRlZmluZWQgJiYgY2lyY2xlLmluZGV4T2YoJy0nKT4tMSkge1xyXG4gICAgICAgICAgICBsZXQgY2lyY2xlcyA9IGNpcmNsZS5zcGxpdCgnLScpO1xyXG4gICAgICAgICAgICBpZihjaXJjbGVzLmxlbmd0aD4wKSB7XHJcbiAgICAgICAgICAgICAgICBjaXJjbGVOYW1lID0gY2lyY2xlc1tpbmRleF0udHJpbSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY2lyY2xlTmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBfZ2V0RGF0ZShzdHJEYXRlLCBzdHJUaW1lKSB7XHJcbiAgICAgICAgbGV0IGR0ID0gRGF0ZS5ub3coKTtcclxuICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgIGR0ID0gRGF0ZS5wYXJzZShgJHtzdHJEYXRlfSAke3N0clRpbWV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgTG9nZ2VyLmxvZygnZXJyb3InLCBlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkdDtcclxuICAgIH1cclxufVxyXG5cclxuLy9qc2hpbnQgaWdub3JlOmVuZCJdfQ==