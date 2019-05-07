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
      output: 'json',
      token: ''
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
        },
        token: ''
      };
      // Default options are marked with *
      var json_post = {
        method: "POST",
        // *GET, POST, PUT, DELETE, etc.
        mode: "cors",
        // no-cors, cors, *same-origin
        cache: "no-cache",
        // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin",
        // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer ".concat(this.options.token) // "Content-Type": "application/x-www-form-urlencoded",

        },
        redirect: "follow",
        // manual, *follow, error
        referrer: "no-referrer",
        // no-referrer, *client
        body: JSON.stringify(searchOption.data) // body data type must match "Content-Type" header

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lMmYvZTJmY3J3bGVyLmpzIl0sIm5hbWVzIjpbImNyb24iLCJyZXF1aXJlIiwiZXhwcmVzcyIsImZzIiwidXVpZHY0IiwiZGVsYXkiLCJtb21lbnQiLCJmZXRjaCIsIkxvZ2dlciIsInR5cGUiLCJtZXNzYWdlIiwiX3dyaXRlIiwiYXJndW1lbnRzIiwidGltZSIsImZvcm1hdCIsImFyZ3MiLCJBcnJheSIsImZyb20iLCJzcGxpY2UiLCJ1bnNoaWZ0IiwidG9VcHBlckNhc2UiLCJjb25zb2xlIiwibG9nIiwiYXBwbHkiLCJFMkZDcmF3bGVyIiwib3B0aW9ucyIsInVybCIsIm91dHB1dCIsInRva2VuIiwic2VhcmNoT3B0aW9uIiwiZGF0YSIsInVzcklkIiwidXNyVHlwZSIsImpzb25fcG9zdCIsIm1ldGhvZCIsIm1vZGUiLCJjYWNoZSIsImNyZWRlbnRpYWxzIiwiaGVhZGVycyIsInJlZGlyZWN0IiwicmVmZXJyZXIiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsInRoZW4iLCJyZXNwb25zZSIsImpzb24iLCJ0cmFuc2Zvcm1EYXRhIiwiZmluYWxEYXRhIiwiY2F0Y2giLCJyZWFzb24iLCJ1bmRlZmluZWQiLCJzdGF0dXMiLCJyZXN1bHQiLCJsZW5ndGgiLCJwYXJzZWREYXRhU2V0IiwicGFyc2VkUmVjb3JkIiwiaSIsImRhdGFJdGVtIiwiYWlybG5zX25hbWUiLCJmbGlnaHRfbm8iLCJfZ2V0Q2lyY2xlTmFtZSIsImRlc3RuIiwidHJhdmVsX3RpbWUiLCJ0cmF2ZWxfZGF0ZSIsIl9nZXREYXRlIiwiaWQiLCJjaXJjbGUiLCJkYXRlIiwiZXBvY2hfZGF0ZSIsImFycml2YWxfdGltZSIsImFycml2YWxfZGF0ZSIsInNlYXQiLCJmYXJlIiwic3J2X3RheCIsImdzdCIsImZsaWdodCIsImZsaWdodF9udW1iZXIiLCJkZXBhcnR1cmUiLCJhcnJpdmFsIiwidGlja2V0X3R5cGUiLCJhdmFpbGFiaWxpdHkiLCJwcmljZSIsImZsaWdodF9pZCIsInJ1bmlkIiwicmVjaWQiLCJwdXNoIiwiaW5kZXgiLCJjaXJjbGVOYW1lIiwiaW5kZXhPZiIsImNpcmNsZXMiLCJzcGxpdCIsInRyaW0iLCJzdHJEYXRlIiwic3RyVGltZSIsImR0IiwiRGF0ZSIsIm5vdyIsInBhcnNlIiwiZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0EsSUFBTUEsSUFBSSxHQUFHQyxPQUFPLENBQUMsV0FBRCxDQUFwQjs7QUFDQSxJQUFNQyxPQUFPLEdBQUdELE9BQU8sQ0FBQyxTQUFELENBQXZCOztBQUNBLElBQU1FLEVBQUUsR0FBR0YsT0FBTyxDQUFDLElBQUQsQ0FBbEI7O0FBRUEsSUFBTUcsTUFBTSxHQUFHSCxPQUFPLENBQUMsU0FBRCxDQUF0Qjs7QUFDQSxJQUFNSSxLQUFLLEdBQUdKLE9BQU8sQ0FBQyxPQUFELENBQXJCOztBQUNBLElBQU1LLE1BQU0sR0FBR0wsT0FBTyxDQUFDLFFBQUQsQ0FBdEI7O0FBQ0EsSUFBTU0sS0FBSyxHQUFHTixPQUFPLENBQUMsa0JBQUQsQ0FBckIsQyxDQUVBO0FBQ0E7OztJQUVhTyxNOzs7Ozs7Ozs7d0JBQ0VDLEksRUFBTUMsTyxFQUFTO0FBQ3RCLGNBQVFELElBQVI7QUFDSSxhQUFLLE1BQUw7QUFDQUQsVUFBQUEsTUFBTSxDQUFDRyxNQUFQLENBQWNDLFNBQWQ7O0FBQ0k7O0FBQ0osYUFBSyxTQUFMO0FBQ0lKLFVBQUFBLE1BQU0sQ0FBQ0csTUFBUCxDQUFjQyxTQUFkOztBQUNBOztBQUNKLGFBQUssT0FBTDtBQUNJSixVQUFBQSxNQUFNLENBQUNHLE1BQVAsQ0FBY0MsU0FBZDs7QUFDQTs7QUFDSjtBQUNJO0FBWFI7QUFhSDs7OzJCQUVhSCxJLEVBQU07QUFDaEIsVUFBSUksSUFBSSxHQUFHUCxNQUFNLEdBQUdRLE1BQVQsQ0FBZ0IsY0FBaEIsQ0FBWCxDQURnQixDQUVoQjs7QUFDQSxVQUFJQyxJQUFJLEdBQUdDLEtBQUssQ0FBQ0MsSUFBTixDQUFXTCxTQUFTLENBQUMsQ0FBRCxDQUFwQixD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OztBQUdBaEQsZ0JBQUFBLE1BQU0sQ0FBQ2MsR0FBUCxDQUFXLE9BQVg7OztBQWxDb0JtQyxnQkFBQUEsQ0FBQyxFOzs7OztrREFzQ3RCRixhOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0RBR1VZLE0sRUFBUW9CLEs7Ozs7OztBQUNyQkMsZ0JBQUFBLFUsR0FBYSxFOztBQUNqQixvQkFBR3JCLE1BQU0sS0FBRyxJQUFULElBQWlCQSxNQUFNLEtBQUdoQixTQUExQixJQUF1Q2dCLE1BQU0sQ0FBQ3NCLE9BQVAsQ0FBZSxJQUFmLElBQXFCLENBQUMsQ0FBaEUsRUFBbUU7QUFDM0RDLGtCQUFBQSxPQUQyRCxHQUNqRHZCLE1BQU0sQ0FBQ3dCLEtBQVAsQ0FBYSxJQUFiLENBRGlEOztBQUUvRCxzQkFBR0QsT0FBTyxDQUFDcEMsTUFBUixHQUFlLENBQWxCLEVBQXFCO0FBQ2pCa0Msb0JBQUFBLFVBQVUsR0FBR0UsT0FBTyxDQUFDSCxLQUFELENBQVAsQ0FBZUssSUFBZixFQUFiO0FBQ0g7QUFDSjs7a0RBRU1KLFU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrREFHSUssTyxFQUFTQyxPOzs7Ozs7QUFDaEJDLGdCQUFBQSxFLEdBQUtDLElBQUksQ0FBQ0MsR0FBTCxFOztBQUNULG9CQUFHO0FBQ0NGLGtCQUFBQSxFQUFFLEdBQUdDLElBQUksQ0FBQ0UsS0FBTCxXQUFjTCxPQUFkLGNBQXlCQyxPQUF6QixFQUFMO0FBQ0gsaUJBRkQsQ0FHQSxPQUFNSyxDQUFOLEVBQVM7QUFDTDNGLGtCQUFBQSxNQUFNLENBQUNjLEdBQVAsQ0FBVyxPQUFYLEVBQW9CNkUsQ0FBcEI7QUFDSDs7a0RBRU1KLEU7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQUlmIiwic291cmNlc0NvbnRlbnQiOlsiLy9qc2hpbnQgZXN2ZXJzaW9uOiA2XHJcbi8vanNoaW50IGlnbm9yZTpzdGFydFxyXG5jb25zdCBjcm9uID0gcmVxdWlyZShcIm5vZGUtY3JvblwiKTtcclxuY29uc3QgZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xyXG5jb25zdCBmcyA9IHJlcXVpcmUoXCJmc1wiKTtcclxuXHJcbmNvbnN0IHV1aWR2NCA9IHJlcXVpcmUoJ3V1aWQvdjQnKTtcclxuY29uc3QgZGVsYXkgPSByZXF1aXJlKCdkZWxheScpO1xyXG5jb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxuY29uc3QgZmV0Y2ggPSByZXF1aXJlKCdpc29tb3JwaGljLWZldGNoJyk7XHJcblxyXG4vL2ltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xyXG4vLyBpbXBvcnQgXCJpc29tb3JwaGljLWZldGNoXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9nZ2VyIHtcclxuICAgIHN0YXRpYyBsb2codHlwZSwgbWVzc2FnZSkge1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiaW5mb1wiOlxyXG4gICAgICAgICAgICBMb2dnZXIuX3dyaXRlKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIndhcm5pbmdcIjpcclxuICAgICAgICAgICAgICAgIExvZ2dlci5fd3JpdGUoYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiZXJyb3JcIjpcclxuICAgICAgICAgICAgICAgIExvZ2dlci5fd3JpdGUoYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBfd3JpdGUodHlwZSkge1xyXG4gICAgICAgIHZhciB0aW1lID0gbW9tZW50KCkuZm9ybWF0KFwiSEg6bW06c3MuU1NTXCIpO1xyXG4gICAgICAgIC8vYXJndW1lbnRzLnNwbGljZSgwKVxyXG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkuZnJvbShhcmd1bWVudHNbMF0pO1xyXG4gICAgICAgIHR5cGUgPSBhcmdzWzBdO1xyXG4gICAgICAgIGFyZ3Muc3BsaWNlKDAsMSk7XHJcbiAgICBcclxuICAgICAgICBhcmdzLnVuc2hpZnQodGltZSk7XHJcbiAgICAgICAgYXJncy51bnNoaWZ0KHR5cGUudG9VcHBlckNhc2UoKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJncyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFMkZDcmF3bGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt1cmw6ICcnLCBvdXRwdXQ6ICdqc29uJywgdG9rZW46ICcnfTtcclxuICAgIH1cclxuXHJcbiAgICBwb3N0RGF0YShzZWFyY2hPcHRpb249e3VybDogJycsIGRhdGE6IHt1c3JJZDogMTA5LCB1c3JUeXBlOiAnTid9LCB0b2tlbjogJyd9KSB7XHJcbiAgICAgICAgLy8gRGVmYXVsdCBvcHRpb25zIGFyZSBtYXJrZWQgd2l0aCAqXHJcbiAgICAgICAgbGV0IGpzb25fcG9zdCA9IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIiwgLy8gKkdFVCwgUE9TVCwgUFVULCBERUxFVEUsIGV0Yy5cclxuICAgICAgICAgICAgbW9kZTogXCJjb3JzXCIsIC8vIG5vLWNvcnMsIGNvcnMsICpzYW1lLW9yaWdpblxyXG4gICAgICAgICAgICBjYWNoZTogXCJuby1jYWNoZVwiLCAvLyAqZGVmYXVsdCwgbm8tY2FjaGUsIHJlbG9hZCwgZm9yY2UtY2FjaGUsIG9ubHktaWYtY2FjaGVkXHJcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIC8vIGluY2x1ZGUsICpzYW1lLW9yaWdpbiwgb21pdFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIFwiQXV0aG9yaXphdGlvblwiOiBgQmVhcmVyICR7dGhpcy5vcHRpb25zLnRva2VufWAsXHJcbiAgICAgICAgICAgICAgICAvLyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZWRpcmVjdDogXCJmb2xsb3dcIiwgLy8gbWFudWFsLCAqZm9sbG93LCBlcnJvclxyXG4gICAgICAgICAgICByZWZlcnJlcjogXCJuby1yZWZlcnJlclwiLCAvLyBuby1yZWZlcnJlciwgKmNsaWVudFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShzZWFyY2hPcHRpb24uZGF0YSksIC8vIGJvZHkgZGF0YSB0eXBlIG11c3QgbWF0Y2ggXCJDb250ZW50LVR5cGVcIiBoZWFkZXJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2goc2VhcmNoT3B0aW9uLnVybCwganNvbl9wb3N0KVxyXG4gICAgICAgIC50aGVuKGFzeW5jIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgTG9nZ2VyLmxvZyhcImluZm9cIiwgXCJSZXNwb25zZSByZWNlaXZlZFwiKTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgICAgICB0aGlzLmZpbmFsRGF0YSA9IGF3YWl0IHRoaXMudHJhbnNmb3JtRGF0YSh0aGlzLmRhdGEpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlYXNvbiA9PiB7XHJcbiAgICAgICAgICAgIExvZ2dlci5sb2coXCJlcnJvclwiLCByZWFzb24pO1xyXG4gICAgICAgICAgICB0aHJvdyByZWFzb247XHJcbiAgICAgICAgfSk7IC8vIHBhcnNlcyBKU09OIHJlc3BvbnNlIGludG8gbmF0aXZlIEphdmFzY3JpcHQgb2JqZWN0cyBcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyB0cmFuc2Zvcm1EYXRhKGRhdGEpIHtcclxuICAgICAgICBpZihkYXRhPT09bnVsbCB8fCBkYXRhPT09dW5kZWZpbmVkIHx8ICFkYXRhLnN0YXR1cyB8fCBkYXRhLnJlc3VsdC5sZW5ndGg9PT0wKSByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBwYXJzZWREYXRhU2V0ID0gW107XHJcbiAgICAgICAgbGV0IHBhcnNlZFJlY29yZCA9IHt9O1xyXG4gICAgICAgIGRhdGEgPSBkYXRhLnJlc3VsdDtcclxuXHJcbiAgICAgICAgZm9yKHZhciBpPTA7IGk8ZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IGRhdGFJdGVtID0gZGF0YVtpXTtcclxuICAgICAgICAgICAgICAgIHBhcnNlZFJlY29yZCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBmbGlnaHQ6IGRhdGFJdGVtLmFpcmxuc19uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGZsaWdodF9udW1iZXI6IGRhdGFJdGVtLmZsaWdodF9ubyxcclxuICAgICAgICAgICAgICAgICAgICBkZXBhcnR1cmU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IC0xLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaXJjbGU6IGF3YWl0IHRoaXMuX2dldENpcmNsZU5hbWUoZGF0YUl0ZW0uZGVzdG4sIDApLnRoZW4ocmVzdWx0ID0+IHJlc3VsdCkuY2F0Y2gocmVhc29uID0+IExvZ2dlci5sb2coJ2Vycm9yJywgcmVhc29uKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6IGRhdGFJdGVtLnRyYXZlbF90aW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBkYXRhSXRlbS50cmF2ZWxfZGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXBvY2hfZGF0ZTogYXdhaXQgdGhpcy5fZ2V0RGF0ZShkYXRhSXRlbS50cmF2ZWxfZGF0ZSwgZGF0YUl0ZW0udHJhdmVsX3RpbWUpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdCkuY2F0Y2gocmVhc29uID0+IExvZ2dlci5sb2coJ2Vycm9yJywgcmVhc29uKSlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGFycml2YWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IC0xLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaXJjbGU6IGF3YWl0IHRoaXMuX2dldENpcmNsZU5hbWUoZGF0YUl0ZW0uZGVzdG4sIDEpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdCkuY2F0Y2gocmVhc29uID0+IExvZ2dlci5sb2coJ2Vycm9yJywgcmVhc29uKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6IGRhdGFJdGVtLmFycml2YWxfdGltZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogZGF0YUl0ZW0uYXJyaXZhbF9kYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcG9jaF9kYXRlOiBhd2FpdCB0aGlzLl9nZXREYXRlKGRhdGFJdGVtLmFycml2YWxfZGF0ZSwgZGF0YUl0ZW0uYXJyaXZhbF90aW1lKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpLmNhdGNoKHJlYXNvbiA9PiBMb2dnZXIubG9nKCdlcnJvcicsIHJlYXNvbikpXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGlja2V0X3R5cGU6ICdFY29ub215JyxcclxuICAgICAgICAgICAgICAgICAgICBhdmFpbGFiaWxpdHk6IGRhdGFJdGVtLnNlYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IChkYXRhSXRlbS5mYXJlK2RhdGFJdGVtLnNydl90YXgrZGF0YUl0ZW0uZ3N0KSxcclxuICAgICAgICAgICAgICAgICAgICBmbGlnaHRfaWQ6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgcnVuaWQ6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY2lkOiBkYXRhSXRlbS5pZFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBwYXJzZWREYXRhU2V0LnB1c2gocGFyc2VkUmVjb3JkKTtcclxuICAgICAgICAgICAgICAgIExvZ2dlci5sb2coJ2luZm8nLCAnRGF0YScsIEpTT04uc3RyaW5naWZ5KHBhcnNlZFJlY29yZCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgICAgIExvZ2dlci5sb2coJ2Vycm9yJywgZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJzZWREYXRhU2V0O1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIF9nZXRDaXJjbGVOYW1lKGNpcmNsZSwgaW5kZXgpIHtcclxuICAgICAgICBsZXQgY2lyY2xlTmFtZSA9ICcnO1xyXG4gICAgICAgIGlmKGNpcmNsZSE9PW51bGwgJiYgY2lyY2xlIT09dW5kZWZpbmVkICYmIGNpcmNsZS5pbmRleE9mKCd0bycpPi0xKSB7XHJcbiAgICAgICAgICAgIGxldCBjaXJjbGVzID0gY2lyY2xlLnNwbGl0KCd0bycpO1xyXG4gICAgICAgICAgICBpZihjaXJjbGVzLmxlbmd0aD4wKSB7XHJcbiAgICAgICAgICAgICAgICBjaXJjbGVOYW1lID0gY2lyY2xlc1tpbmRleF0udHJpbSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY2lyY2xlTmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBfZ2V0RGF0ZShzdHJEYXRlLCBzdHJUaW1lKSB7XHJcbiAgICAgICAgbGV0IGR0ID0gRGF0ZS5ub3coKTtcclxuICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgIGR0ID0gRGF0ZS5wYXJzZShgJHtzdHJEYXRlfSAke3N0clRpbWV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgTG9nZ2VyLmxvZygnZXJyb3InLCBlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkdDtcclxuICAgIH1cclxufVxyXG5cclxuLy9qc2hpbnQgaWdub3JlOmVuZCJdfQ==