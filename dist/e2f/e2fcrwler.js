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

var E2FCrawler =
/*#__PURE__*/
function () {
  function E2FCrawler(options) {
    (0, _classCallCheck2["default"])(this, E2FCrawler);
    this.options = options || {
      url: '',
      output: 'json',
      token: ''
    };
  }

  (0, _createClass2["default"])(E2FCrawler, [{
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
                  _context2.next = 46;
                  break;
                }

                _context2.prev = 7;
                dataItem = data[i];

                if (!(dataItem.seat > 0)) {
                  _context2.next = 37;
                  break;
                }

                _context2.t0 = dataItem.airlns_name;
                _context2.t1 = dataItem.flight_no;
                _context2.t2 = -1;
                _context2.next = 15;
                return this._getCircleName(dataItem.destn, 0).then(function (result) {
                  return result;
                })["catch"](function (reason) {
                  return Logger.log('error', reason);
                });

              case 15:
                _context2.t3 = _context2.sent;
                _context2.t4 = dataItem.travel_time;
                _context2.t5 = dataItem.travel_date;
                _context2.next = 20;
                return this._getDate(dataItem.travel_date, dataItem.travel_time).then(function (result) {
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
                return this._getCircleName(dataItem.destn, 1).then(function (result) {
                  return result;
                })["catch"](function (reason) {
                  return Logger.log('error', reason);
                });

              case 25:
                _context2.t9 = _context2.sent;
                _context2.t10 = dataItem.arrival_time;
                _context2.t11 = dataItem.arrival_date;
                _context2.next = 30;
                return this._getDate(dataItem.arrival_date, dataItem.arrival_time).then(function (result) {
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

              case 37:
                Logger.log('info', 'Data', JSON.stringify(parsedRecord));
                _context2.next = 43;
                break;

              case 40:
                _context2.prev = 40;
                _context2.t17 = _context2["catch"](7);
                Logger.log('error', _context2.t17);

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
      var _getCircleName2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(circle, index) {
        var circleName, circles;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
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
  return E2FCrawler;
}(); //jshint ignore:end


exports.E2FCrawler = E2FCrawler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lMmYvZTJmY3J3bGVyLmpzIl0sIm5hbWVzIjpbImNyb24iLCJyZXF1aXJlIiwiZXhwcmVzcyIsImZzIiwidXVpZHY0IiwiZGVsYXkiLCJtb21lbnQiLCJmZXRjaCIsIkxvZ2dlciIsInR5cGUiLCJtZXNzYWdlIiwiX3dyaXRlIiwiYXJndW1lbnRzIiwidGltZSIsImZvcm1hdCIsImFyZ3MiLCJBcnJheSIsImZyb20iLCJzcGxpY2UiLCJ1bnNoaWZ0IiwidG9VcHBlckNhc2UiLCJjb25zb2xlIiwibG9nIiwiYXBwbHkiLCJFMkZDcmF3bGVyIiwib3B0aW9ucyIsInVybCIsIm91dHB1dCIsInRva2VuIiwic2VhcmNoT3B0aW9uIiwiZGF0YSIsInVzcklkIiwidXNyVHlwZSIsImpzb25fcG9zdCIsIm1ldGhvZCIsIm1vZGUiLCJjYWNoZSIsImNyZWRlbnRpYWxzIiwiaGVhZGVycyIsInJlZGlyZWN0IiwicmVmZXJyZXIiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsInRoZW4iLCJyZXNwb25zZSIsImpzb24iLCJ0cmFuc2Zvcm1EYXRhIiwiZmluYWxEYXRhIiwicmVhc29uIiwidW5kZWZpbmVkIiwic3RhdHVzIiwicmVzdWx0IiwibGVuZ3RoIiwicGFyc2VkRGF0YVNldCIsInBhcnNlZFJlY29yZCIsImkiLCJkYXRhSXRlbSIsInNlYXQiLCJhaXJsbnNfbmFtZSIsImZsaWdodF9ubyIsIl9nZXRDaXJjbGVOYW1lIiwiZGVzdG4iLCJ0cmF2ZWxfdGltZSIsInRyYXZlbF9kYXRlIiwiX2dldERhdGUiLCJpZCIsImNpcmNsZSIsImRhdGUiLCJlcG9jaF9kYXRlIiwiYXJyaXZhbF90aW1lIiwiYXJyaXZhbF9kYXRlIiwiZmFyZSIsInNydl90YXgiLCJnc3QiLCJmbGlnaHQiLCJmbGlnaHRfbnVtYmVyIiwiZGVwYXJ0dXJlIiwiYXJyaXZhbCIsInRpY2tldF90eXBlIiwiYXZhaWxhYmlsaXR5IiwicHJpY2UiLCJmbGlnaHRfaWQiLCJydW5pZCIsInJlY2lkIiwicHVzaCIsImluZGV4IiwiY2lyY2xlTmFtZSIsImluZGV4T2YiLCJjaXJjbGVzIiwic3BsaXQiLCJ0cmltIiwic3RyRGF0ZSIsInN0clRpbWUiLCJkdCIsIkRhdGUiLCJub3ciLCJwYXJzZSIsImUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBLElBQU1BLElBQUksR0FBR0MsT0FBTyxDQUFDLFdBQUQsQ0FBcEI7O0FBQ0EsSUFBTUMsT0FBTyxHQUFHRCxPQUFPLENBQUMsU0FBRCxDQUF2Qjs7QUFDQSxJQUFNRSxFQUFFLEdBQUdGLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUVBLElBQU1HLE1BQU0sR0FBR0gsT0FBTyxDQUFDLFNBQUQsQ0FBdEI7O0FBQ0EsSUFBTUksS0FBSyxHQUFHSixPQUFPLENBQUMsT0FBRCxDQUFyQjs7QUFDQSxJQUFNSyxNQUFNLEdBQUdMLE9BQU8sQ0FBQyxRQUFELENBQXRCOztBQUNBLElBQU1NLEtBQUssR0FBR04sT0FBTyxDQUFDLGtCQUFELENBQXJCLEMsQ0FFQTtBQUNBOzs7SUFFYU8sTTs7Ozs7Ozs7O3dCQUNFQyxJLEVBQU1DLE8sRUFBUztBQUN0QixjQUFRRCxJQUFSO0FBQ0ksYUFBSyxNQUFMO0FBQ0FELFVBQUFBLE1BQU0sQ0FBQ0csTUFBUCxDQUFjQyxTQUFkOztBQUNJOztBQUNKLGFBQUssU0FBTDtBQUNJSixVQUFBQSxNQUFNLENBQUNHLE1BQVAsQ0FBY0MsU0FBZDs7QUFDQTs7QUFDSixhQUFLLE9BQUw7QUFDSUosVUFBQUEsTUFBTSxDQUFDRyxNQUFQLENBQWNDLFNBQWQ7O0FBQ0E7O0FBQ0o7QUFDSTtBQVhSO0FBYUg7OzsyQkFFYUgsSSxFQUFNO0FBQ2hCLFVBQUlJLElBQUksR0FBR1AsTUFBTSxHQUFHUSxNQUFULENBQWdCLGNBQWhCLENBQVgsQ0FEZ0IsQ0FFaEI7O0FBQ0EsVUFBSUMsSUFBSSxHQUFHQyxLQUFLLENBQUNDLElBQU4sQ0FBV0wsU0FBUyxDQUFDLENBQUQsQ0FBcEIsQ0FBWDtBQUNB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Q0FBVyxPQUFYOzs7QUFwQ29Ca0MsZ0JBQUFBLENBQUMsRTs7Ozs7a0RBd0N0QkYsYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FEQUdVYSxNLEVBQVFtQixLOzs7Ozs7QUFDckJDLGdCQUFBQSxVLEdBQWEsRTs7QUFDakIsb0JBQUdwQixNQUFNLEtBQUcsSUFBVCxJQUFpQkEsTUFBTSxLQUFHakIsU0FBMUIsSUFBdUNpQixNQUFNLENBQUNxQixPQUFQLENBQWUsSUFBZixJQUFxQixDQUFDLENBQWhFLEVBQW1FO0FBQzNEQyxrQkFBQUEsT0FEMkQsR0FDakR0QixNQUFNLENBQUN1QixLQUFQLENBQWEsSUFBYixDQURpRDs7QUFFL0Qsc0JBQUdELE9BQU8sQ0FBQ3BDLE1BQVIsR0FBZSxDQUFsQixFQUFxQjtBQUNqQmtDLG9CQUFBQSxVQUFVLEdBQUdFLE9BQU8sQ0FBQ0gsS0FBRCxDQUFQLENBQWVLLElBQWYsRUFBYjtBQUNIO0FBQ0o7O2tEQUVNSixVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cURBR0lLLE8sRUFBU0MsTzs7Ozs7O0FBQ2hCQyxnQkFBQUEsRSxHQUFLQyxJQUFJLENBQUNDLEdBQUwsRTs7QUFDVCxvQkFBRztBQUNDRixrQkFBQUEsRUFBRSxHQUFHQyxJQUFJLENBQUNFLEtBQUwsV0FBY0wsT0FBZCxjQUF5QkMsT0FBekIsRUFBTDtBQUNILGlCQUZELENBR0EsT0FBTUssQ0FBTixFQUFTO0FBQ0wxRixrQkFBQUEsTUFBTSxDQUFDYyxHQUFQLENBQVcsT0FBWCxFQUFvQjRFLENBQXBCO0FBQ0g7O2tEQUVNSixFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FJZiIsInNvdXJjZXNDb250ZW50IjpbIi8vanNoaW50IGVzdmVyc2lvbjogNlxyXG4vL2pzaGludCBpZ25vcmU6c3RhcnRcclxuY29uc3QgY3JvbiA9IHJlcXVpcmUoXCJub2RlLWNyb25cIik7XHJcbmNvbnN0IGV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcclxuY29uc3QgZnMgPSByZXF1aXJlKFwiZnNcIik7XHJcblxyXG5jb25zdCB1dWlkdjQgPSByZXF1aXJlKCd1dWlkL3Y0Jyk7XHJcbmNvbnN0IGRlbGF5ID0gcmVxdWlyZSgnZGVsYXknKTtcclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcbmNvbnN0IGZldGNoID0gcmVxdWlyZSgnaXNvbW9ycGhpYy1mZXRjaCcpO1xyXG5cclxuLy9pbXBvcnQgbW9tZW50IGZyb20gXCJtb21lbnRcIjtcclxuLy8gaW1wb3J0IFwiaXNvbW9ycGhpYy1mZXRjaFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvZ2dlciB7XHJcbiAgICBzdGF0aWMgbG9nKHR5cGUsIG1lc3NhZ2UpIHsgXHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpbmZvXCI6XHJcbiAgICAgICAgICAgIExvZ2dlci5fd3JpdGUoYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwid2FybmluZ1wiOlxyXG4gICAgICAgICAgICAgICAgTG9nZ2VyLl93cml0ZShhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJlcnJvclwiOlxyXG4gICAgICAgICAgICAgICAgTG9nZ2VyLl93cml0ZShhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIF93cml0ZSh0eXBlKSB7XHJcbiAgICAgICAgdmFyIHRpbWUgPSBtb21lbnQoKS5mb3JtYXQoXCJISDptbTpzcy5TU1NcIik7XHJcbiAgICAgICAgLy9hcmd1bWVudHMuc3BsaWNlKDApXHJcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5mcm9tKGFyZ3VtZW50c1swXSk7XHJcbiAgICAgICAgdHlwZSA9IGFyZ3NbMF07XHJcbiAgICAgICAgYXJncy5zcGxpY2UoMCwxKTtcclxuICAgIFxyXG4gICAgICAgIGFyZ3MudW5zaGlmdCh0aW1lKTtcclxuICAgICAgICBhcmdzLnVuc2hpZnQodHlwZS50b1VwcGVyQ2FzZSgpKTtcclxuICAgICAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmdzKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEUyRkNyYXdsZXIge1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge3VybDogJycsIG91dHB1dDogJ2pzb24nLCB0b2tlbjogJyd9O1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3REYXRhKHNlYXJjaE9wdGlvbj17dXJsOiAnJywgZGF0YToge3VzcklkOiAxMDksIHVzclR5cGU6ICdOJ30sIHRva2VuOiAnJ30pIHtcclxuICAgICAgICAvLyBEZWZhdWx0IG9wdGlvbnMgYXJlIG1hcmtlZCB3aXRoICpcclxuICAgICAgICBsZXQganNvbl9wb3N0ID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLCAvLyAqR0VULCBQT1NULCBQVVQsIERFTEVURSwgZXRjLlxyXG4gICAgICAgICAgICBtb2RlOiBcImNvcnNcIiwgLy8gbm8tY29ycywgY29ycywgKnNhbWUtb3JpZ2luXHJcbiAgICAgICAgICAgIGNhY2hlOiBcIm5vLWNhY2hlXCIsIC8vICpkZWZhdWx0LCBuby1jYWNoZSwgcmVsb2FkLCBmb3JjZS1jYWNoZSwgb25seS1pZi1jYWNoZWRcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiwgLy8gaW5jbHVkZSwgKnNhbWUtb3JpZ2luLCBvbWl0XHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgXCJBdXRob3JpemF0aW9uXCI6IGBCZWFyZXIgJHt0aGlzLm9wdGlvbnMudG9rZW59YCxcclxuICAgICAgICAgICAgICAgIC8vIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlZGlyZWN0OiBcImZvbGxvd1wiLCAvLyBtYW51YWwsICpmb2xsb3csIGVycm9yXHJcbiAgICAgICAgICAgIHJlZmVycmVyOiBcIm5vLXJlZmVycmVyXCIsIC8vIG5vLXJlZmVycmVyLCAqY2xpZW50XHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHNlYXJjaE9wdGlvbi5kYXRhKSwgLy8gYm9keSBkYXRhIHR5cGUgbXVzdCBtYXRjaCBcIkNvbnRlbnQtVHlwZVwiIGhlYWRlclxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaChzZWFyY2hPcHRpb24udXJsLCBqc29uX3Bvc3QpXHJcbiAgICAgICAgLnRoZW4oYXN5bmMgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBMb2dnZXIubG9nKFwiaW5mb1wiLCBcIlJlc3BvbnNlIHJlY2VpdmVkXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZmluYWxEYXRhID0gYXdhaXQgdGhpcy50cmFuc2Zvcm1EYXRhKHRoaXMuZGF0YSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGE7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVhc29uID0+IHtcclxuICAgICAgICAgICAgTG9nZ2VyLmxvZyhcImVycm9yXCIsIHJlYXNvbik7XHJcbiAgICAgICAgICAgIHRocm93IHJlYXNvbjtcclxuICAgICAgICB9KTsgLy8gcGFyc2VzIEpTT04gcmVzcG9uc2UgaW50byBuYXRpdmUgSmF2YXNjcmlwdCBvYmplY3RzIFxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHRyYW5zZm9ybURhdGEoZGF0YSkge1xyXG4gICAgICAgIGlmKGRhdGE9PT1udWxsIHx8IGRhdGE9PT11bmRlZmluZWQgfHwgIWRhdGEuc3RhdHVzIHx8IGRhdGEucmVzdWx0Lmxlbmd0aD09PTApIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IHBhcnNlZERhdGFTZXQgPSBbXTtcclxuICAgICAgICBsZXQgcGFyc2VkUmVjb3JkID0ge307XHJcbiAgICAgICAgZGF0YSA9IGRhdGEucmVzdWx0O1xyXG5cclxuICAgICAgICBmb3IodmFyIGk9MDsgaTxkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YUl0ZW0gPSBkYXRhW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYoZGF0YUl0ZW0uc2VhdD4wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VkUmVjb3JkID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGlnaHQ6IGRhdGFJdGVtLmFpcmxuc19uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGlnaHRfbnVtYmVyOiBkYXRhSXRlbS5mbGlnaHRfbm8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcGFydHVyZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IC0xLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2lyY2xlOiBhd2FpdCB0aGlzLl9nZXRDaXJjbGVOYW1lKGRhdGFJdGVtLmRlc3RuLCAwKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpLmNhdGNoKHJlYXNvbiA9PiBMb2dnZXIubG9nKCdlcnJvcicsIHJlYXNvbikpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZTogZGF0YUl0ZW0udHJhdmVsX3RpbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBkYXRhSXRlbS50cmF2ZWxfZGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVwb2NoX2RhdGU6IGF3YWl0IHRoaXMuX2dldERhdGUoZGF0YUl0ZW0udHJhdmVsX2RhdGUsIGRhdGFJdGVtLnRyYXZlbF90aW1lKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpLmNhdGNoKHJlYXNvbiA9PiBMb2dnZXIubG9nKCdlcnJvcicsIHJlYXNvbikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycml2YWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNpcmNsZTogYXdhaXQgdGhpcy5fZ2V0Q2lyY2xlTmFtZShkYXRhSXRlbS5kZXN0biwgMSkudGhlbihyZXN1bHQgPT4gcmVzdWx0KS5jYXRjaChyZWFzb24gPT4gTG9nZ2VyLmxvZygnZXJyb3InLCByZWFzb24pKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6IGRhdGFJdGVtLmFycml2YWxfdGltZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IGRhdGFJdGVtLmFycml2YWxfZGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVwb2NoX2RhdGU6IGF3YWl0IHRoaXMuX2dldERhdGUoZGF0YUl0ZW0uYXJyaXZhbF9kYXRlLCBkYXRhSXRlbS5hcnJpdmFsX3RpbWUpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdCkuY2F0Y2gocmVhc29uID0+IExvZ2dlci5sb2coJ2Vycm9yJywgcmVhc29uKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpY2tldF90eXBlOiAnRWNvbm9teScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJpbGl0eTogZGF0YUl0ZW0uc2VhdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IChkYXRhSXRlbS5mYXJlK2RhdGFJdGVtLnNydl90YXgrZGF0YUl0ZW0uZ3N0KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxpZ2h0X2lkOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBydW5pZDogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY2lkOiBkYXRhSXRlbS5pZFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlZERhdGFTZXQucHVzaChwYXJzZWRSZWNvcmQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgTG9nZ2VyLmxvZygnaW5mbycsICdEYXRhJywgSlNPTi5zdHJpbmdpZnkocGFyc2VkUmVjb3JkKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2goZSkge1xyXG4gICAgICAgICAgICAgICAgTG9nZ2VyLmxvZygnZXJyb3InLCBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBhcnNlZERhdGFTZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgX2dldENpcmNsZU5hbWUoY2lyY2xlLCBpbmRleCkge1xyXG4gICAgICAgIGxldCBjaXJjbGVOYW1lID0gJyc7XHJcbiAgICAgICAgaWYoY2lyY2xlIT09bnVsbCAmJiBjaXJjbGUhPT11bmRlZmluZWQgJiYgY2lyY2xlLmluZGV4T2YoJ3RvJyk+LTEpIHtcclxuICAgICAgICAgICAgbGV0IGNpcmNsZXMgPSBjaXJjbGUuc3BsaXQoJ3RvJyk7XHJcbiAgICAgICAgICAgIGlmKGNpcmNsZXMubGVuZ3RoPjApIHtcclxuICAgICAgICAgICAgICAgIGNpcmNsZU5hbWUgPSBjaXJjbGVzW2luZGV4XS50cmltKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjaXJjbGVOYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIF9nZXREYXRlKHN0ckRhdGUsIHN0clRpbWUpIHtcclxuICAgICAgICBsZXQgZHQgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIHRyeXtcclxuICAgICAgICAgICAgZHQgPSBEYXRlLnBhcnNlKGAke3N0ckRhdGV9ICR7c3RyVGltZX1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2goZSkge1xyXG4gICAgICAgICAgICBMb2dnZXIubG9nKCdlcnJvcicsIGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGR0O1xyXG4gICAgfVxyXG59XHJcblxyXG4vL2pzaGludCBpZ25vcmU6ZW5kIl19