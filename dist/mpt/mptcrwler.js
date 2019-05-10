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
                _context2.t0 = dataItem.airline_name;
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

                return _context3.abrupt("return", circleName);

              case 4:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tcHQvbXB0Y3J3bGVyLmpzIl0sIm5hbWVzIjpbImNyb24iLCJyZXF1aXJlIiwiZXhwcmVzcyIsImZzIiwidXVpZHY0IiwiZGVsYXkiLCJtb21lbnQiLCJmZXRjaCIsIkxvZ2dlciIsInR5cGUiLCJtZXNzYWdlIiwiX3dyaXRlIiwiYXJndW1lbnRzIiwidGltZSIsImZvcm1hdCIsImFyZ3MiLCJBcnJheSIsImZyb20iLCJzcGxpY2UiLCJ1bnNoaWZ0IiwidG9VcHBlckNhc2UiLCJjb25zb2xlIiwibG9nIiwiYXBwbHkiLCJNUFRDcmF3bGVyIiwib3B0aW9ucyIsInVybCIsIm91dHB1dCIsInRva2VuIiwic2VhcmNoT3B0aW9uIiwiZGF0YSIsInVzcklkIiwidXNyVHlwZSIsImpzb25fcG9zdCIsIm1ldGhvZCIsIm1vZGUiLCJjYWNoZSIsImNyZWRlbnRpYWxzIiwiaGVhZGVycyIsInJlZGlyZWN0IiwicmVmZXJyZXIiLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwidHJhbnNmb3JtRGF0YSIsImZpbmFsRGF0YSIsImNhdGNoIiwicmVhc29uIiwidW5kZWZpbmVkIiwibGVuZ3RoIiwicGFyc2VkRGF0YVNldCIsInBhcnNlZFJlY29yZCIsImkiLCJkYXRhSXRlbSIsImFpcmxpbmVfbmFtZSIsImZsaWdodF9udW1iZXIiLCJfZ2V0Q2lyY2xlTmFtZSIsInNlY3Rvcl9uYW1lIiwicmVzdWx0IiwiZGVwYXJ0dXJlX3RpbWUiLCJkZXBhcnR1cmVfYXQiLCJfZ2V0RGF0ZSIsImlkIiwiY2lyY2xlIiwiZGF0ZSIsImVwb2NoX2RhdGUiLCJ0cmF2ZWxfY2xhc3MiLCJhdmFpbGFibGVfc2VhdHMiLCJwcmljZSIsImZsaWdodCIsImRlcGFydHVyZSIsImFycml2YWwiLCJ0aWNrZXRfdHlwZSIsImF2YWlsYWJpbGl0eSIsImZsaWdodF9pZCIsInJ1bmlkIiwicmVjaWQiLCJwdXNoIiwiSlNPTiIsInN0cmluZ2lmeSIsImluZGV4IiwiZGVsaW1ldGVyIiwiY2lyY2xlTmFtZSIsImluZGV4T2YiLCJjaXJjbGVzIiwic3BsaXQiLCJ0cmltIiwic3RyRGF0ZSIsInN0clRpbWUiLCJkdCIsIkRhdGUiLCJub3ciLCJwYXJzZSIsImUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0EsSUFBTUEsSUFBSSxHQUFHQyxPQUFPLENBQUMsV0FBRCxDQUFwQjs7QUFDQSxJQUFNQyxPQUFPLEdBQUdELE9BQU8sQ0FBQyxTQUFELENBQXZCOztBQUNBLElBQU1FLEVBQUUsR0FBR0YsT0FBTyxDQUFDLElBQUQsQ0FBbEI7O0FBRUEsSUFBTUcsTUFBTSxHQUFHSCxPQUFPLENBQUMsU0FBRCxDQUF0Qjs7QUFDQSxJQUFNSSxLQUFLLEdBQUdKLE9BQU8sQ0FBQyxPQUFELENBQXJCOztBQUNBLElBQU1LLE1BQU0sR0FBR0wsT0FBTyxDQUFDLFFBQUQsQ0FBdEI7O0FBQ0EsSUFBTU0sS0FBSyxHQUFHTixPQUFPLENBQUMsa0JBQUQsQ0FBckIsQyxDQUVBO0FBQ0E7OztJQUVhTyxNOzs7Ozs7Ozs7d0JBQ0VDLEksRUFBTUMsTyxFQUFTO0FBQ3RCLGNBQVFELElBQVI7QUFDSSxhQUFLLE1BQUw7QUFDQUQsVUFBQUEsTUFBTSxDQUFDRyxNQUFQLENBQWNDLFNBQWQ7O0FBQ0k7O0FBQ0osYUFBSyxTQUFMO0FBQ0lKLFVBQUFBLE1BQU0sQ0FBQ0csTUFBUCxDQUFjQyxTQUFkOztBQUNBOztBQUNKLGFBQUssT0FBTDtBQUNJSixVQUFBQSxNQUFNLENBQUNHLE1BQVAsQ0FBY0MsU0FBZDs7QUFDQTs7QUFDSjtBQUNJO0FBWFI7QUFhSDs7OzJCQUVhSCxJLEVBQU07QUFDaEIsVUFBSUksSUFBSSxHQUFHUCxNQUFNLEdBQUdRLE1BQVQsQ0FBZ0IsY0FBaEIsQ0FBWCxDQURnQixDQUVoQjs7QUFDQSxVQUFJQyxJQUFJLEdBQUdDLEtBQUssQ0FBQ0MsSUFBTixDQUFXTCxTQUFTLENBQUMsQ0FBRCxDQUFwQixDQUFYO0FBQ0FILE1BQUFBLElBQUksR0FBR00sSUFB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L2pzaGludCBpZ25vcmU6c3RhcnRcclxuY29uc3QgY3JvbiA9IHJlcXVpcmUoXCJub2RlLWNyb25cIik7XHJcbmNvbnN0IGV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcclxuY29uc3QgZnMgPSByZXF1aXJlKFwiZnNcIik7XHJcblxyXG5jb25zdCB1dWlkdjQgPSByZXF1aXJlKCd1dWlkL3Y0Jyk7XHJcbmNvbnN0IGRlbGF5ID0gcmVxdWlyZSgnZGVsYXknKTtcclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcbmNvbnN0IGZldGNoID0gcmVxdWlyZSgnaXNvbW9ycGhpYy1mZXRjaCcpO1xyXG5cclxuLy9pbXBvcnQgbW9tZW50IGZyb20gXCJtb21lbnRcIjtcclxuLy8gaW1wb3J0IFwiaXNvbW9ycGhpYy1mZXRjaFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvZ2dlciB7XHJcbiAgICBzdGF0aWMgbG9nKHR5cGUsIG1lc3NhZ2UpIHtcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImluZm9cIjpcclxuICAgICAgICAgICAgTG9nZ2VyLl93cml0ZShhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ3YXJuaW5nXCI6XHJcbiAgICAgICAgICAgICAgICBMb2dnZXIuX3dyaXRlKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImVycm9yXCI6XHJcbiAgICAgICAgICAgICAgICBMb2dnZXIuX3dyaXRlKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgX3dyaXRlKHR5cGUpIHtcclxuICAgICAgICB2YXIgdGltZSA9IG1vbWVudCgpLmZvcm1hdChcIkhIOm1tOnNzLlNTU1wiKTtcclxuICAgICAgICAvL2FyZ3VtZW50cy5zcGxpY2UoMClcclxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LmZyb20oYXJndW1lbnRzWzBdKTtcclxuICAgICAgICB0eXBlID0gYXJnc1swXTtcclxuICAgICAgICBhcmdzLnNwbGljZSgwLDEpO1xyXG4gICAgXHJcbiAgICAgICAgYXJncy51bnNoaWZ0KHRpbWUpO1xyXG4gICAgICAgIGFyZ3MudW5zaGlmdCh0eXBlLnRvVXBwZXJDYXNlKCkpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3MpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTVBUQ3Jhd2xlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7dXJsOiAnJywgb3V0cHV0OiAnanNvbicsIHRva2VuOiAnJ307XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGF0YShzZWFyY2hPcHRpb249e3VybDogJycsIGRhdGE6IHt1c3JJZDogMTA5LCB1c3JUeXBlOiAnTid9LCB0b2tlbjogJyd9KSB7XHJcbiAgICAgICAgLy8gRGVmYXVsdCBvcHRpb25zIGFyZSBtYXJrZWQgd2l0aCAqXHJcbiAgICAgICAgbGV0IGpzb25fcG9zdCA9IHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLCAvLyAqR0VULCBQT1NULCBQVVQsIERFTEVURSwgZXRjLlxyXG4gICAgICAgICAgICBtb2RlOiBcImNvcnNcIiwgLy8gbm8tY29ycywgY29ycywgKnNhbWUtb3JpZ2luXHJcbiAgICAgICAgICAgIGNhY2hlOiBcIm5vLWNhY2hlXCIsIC8vICpkZWZhdWx0LCBuby1jYWNoZSwgcmVsb2FkLCBmb3JjZS1jYWNoZSwgb25seS1pZi1jYWNoZWRcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiwgLy8gaW5jbHVkZSwgKnNhbWUtb3JpZ2luLCBvbWl0XHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvbiwgdGV4dC9qYXZhc2NyaXB0LCAqLyo7IHE9MC4wMVwiLFxyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogJ0JlYXJlciBqOGVkZzUzc3d0dGl0ZHp6WWlKMWlORGY3emczb1VkYWhod2EzRUMzeFJvZzA4QU5hRUpZdzc0c0N2QWEnLFxyXG4gICAgICAgICAgICAgICAgXCJVc2VyLUFnZW50XCI6IFwiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgNi4xOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvNzQuMC4zNzI5LjEzMSBTYWZhcmkvNTM3LjM2XCIsXHJcbiAgICAgICAgICAgICAgICBcIlJlZmVyZXJcIjogXCJodHRwczovL2ZkLm1ldHJvcG9saXRhbnRyYXZlbHMuY29tL2Rhc2hib2FyZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHQtRW5jb2RpbmdcIjogXCJnemlwLCBkZWZsYXRlLCBiclwiLFxyXG4gICAgICAgICAgICAgICAgXCJDb29raWVcIjogXCJfZ2E9R0ExLjIuMTA3NjU5MTQzMS4xNTU3NDcwMDEzOyBfZ2lkPUdBMS4yLjE4NTE0NTkwODMuMTU1NzQ3MDAxMzsgcmVtZW1iZXJfd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQ9ZXlKcGRpSTZJbnBXTUhGVlFXdEJWM3BxWlhWSWFGd3ZTQ3RjTDFKeFVUMDlJaXdpZG1Gc2RXVWlPaUpOZGtGVlp5dHFNM2xqT0hBNU5pdDVSMVV5Y1d0UmRVZFVLMmxtWjNGUGF6Wk5hRzk1UTF3dmRqQXJiVVJHZVhGWlZuUjJaRlZ4ZDJzMFJWWTRkV3RDZDJnNVFXUTFXbmhyWkd4eFpXdHpja1F3TkZSSlVXRnBUWEJGWldSYVUzSmFiRnd2VG05bE9VeFFjM2xTY21odFhDOUNkRzVRSzJSSVUzQlFaMHRNYWxaemVDdGtjRlZGVVhOcVdqbHVTSE5uTmxRemFFUjJPU3RxUlZWQ1JuRnpUbVY1V2tSMWRXazRRWEJIYzFFOUlpd2liV0ZqSWpvaU5qQmpNVGcxWkdNellqYzRNRFl5TVRZMU9EQTJPRFpqWTJJeE1EQm1OemhpT0Rsa1pqWmxNamc0TXpObVlUY3pNREU0WldSbVpqTmpNR1EzTjJVME9DSjk7IFhTUkYtVE9LRU49ZXlKcGRpSTZJakpJUmtoalFURjJSMjQ0V0V0dFJYVmtTSEpqZVhjOVBTSXNJblpoYkhWbElqb2lTMXd2WkUxWFpHdG9XWGx0YUN0cVRWZEdUR2xzTTNOb2NFUkRZVXAzWW1OT1pUbHNhVzFYUW14aU1uSTVURnB0TTB0bVRERkVNSFpEV1VjM1ZWQmpPRU1pTENKdFlXTWlPaUppTnpJMU0yTXlNV1ZoTVdWa1pEWXlOams1WW1Zd09EbGpaR1ZpTVRZMU5XSmpabUU1WXprd01HVTJOall6WVRreFpEaGxaV1ZoWm1GaE56Z3lNR05rSW4wJTNEO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJDb29raWVcIjogXCJtZXRyb3BvbGl0YW5fdHJhdmVsc19zZXNzaW9uPWV5SnBkaUk2SWt4aFJFOVBaSFJtV2s0eWVtbFRSRTV4VHpSRFkxRTlQU0lzSW5aaGJIVmxJam9pWVZwSWJYWTVUbFU1YWtSbmFUZFNjbTlVVmtGdk1YSlFlVGhXWTNsSk4wcFpPRFZtTlc5SFdFcG5Relk1VjI5d2RFcHVRWEF5Y1RSR1oxZHBhbVZRWEM4aUxDSnRZV01pT2lKbU5UVXpOREJoWlRNeE1tVTJPVEExWXpObVltWTRNREEwWXpsaU1USTRaV1F5TnpBMk5HRmhZVEUyWldReE5XWTRZV0ZtWmpkak9UTmtZemxqT1RnM0luMCUzRFwiXHJcbiAgICAgICAgICAgICAgICAvLyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZWRpcmVjdDogXCJmb2xsb3dcIiwgLy8gbWFudWFsLCAqZm9sbG93LCBlcnJvclxyXG4gICAgICAgICAgICByZWZlcnJlcjogXCJuby1yZWZlcnJlclwiLCAvLyBuby1yZWZlcnJlciwgKmNsaWVudFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaChzZWFyY2hPcHRpb24udXJsLCBqc29uX3Bvc3QpXHJcbiAgICAgICAgLnRoZW4oYXN5bmMgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBMb2dnZXIubG9nKFwiaW5mb1wiLCBcIlJlc3BvbnNlIHJlY2VpdmVkXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZmluYWxEYXRhID0gYXdhaXQgdGhpcy50cmFuc2Zvcm1EYXRhKHRoaXMuZGF0YSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGE7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVhc29uID0+IHtcclxuICAgICAgICAgICAgTG9nZ2VyLmxvZyhcImVycm9yXCIsIHJlYXNvbik7XHJcbiAgICAgICAgICAgIHRocm93IHJlYXNvbjtcclxuICAgICAgICB9KTsgLy8gcGFyc2VzIEpTT04gcmVzcG9uc2UgaW50byBuYXRpdmUgSmF2YXNjcmlwdCBvYmplY3RzIFxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHRyYW5zZm9ybURhdGEoZGF0YSkge1xyXG4gICAgICAgIGlmKGRhdGE9PT1udWxsIHx8IGRhdGE9PT11bmRlZmluZWQgfHwgZGF0YS5sZW5ndGg9PT0wKSByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBwYXJzZWREYXRhU2V0ID0gW107XHJcbiAgICAgICAgbGV0IHBhcnNlZFJlY29yZCA9IHt9O1xyXG4gICAgICAgIGRhdGEgPSBkYXRhO1xyXG5cclxuICAgICAgICBmb3IodmFyIGk9MDsgaTxkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YUl0ZW0gPSBkYXRhW2ldO1xyXG4gICAgICAgICAgICAgICAgcGFyc2VkUmVjb3JkID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZsaWdodDogZGF0YUl0ZW0uYWlybGluZV9uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGZsaWdodF9udW1iZXI6IGRhdGFJdGVtLmZsaWdodF9udW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVwYXJ0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2lyY2xlOiBhd2FpdCB0aGlzLl9nZXRDaXJjbGVOYW1lKGRhdGFJdGVtLnNlY3Rvcl9uYW1lLCAwLCAnLScpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdCkuY2F0Y2gocmVhc29uID0+IExvZ2dlci5sb2coJ2Vycm9yJywgcmVhc29uKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6IGRhdGFJdGVtLmRlcGFydHVyZV90aW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBtb21lbnQoZGF0YUl0ZW0uZGVwYXJ0dXJlX2F0KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcG9jaF9kYXRlOiBhd2FpdCB0aGlzLl9nZXREYXRlKG1vbWVudChkYXRhSXRlbS5kZXBhcnR1cmVfYXQpLmZvcm1hdChcIllZWVktTU0tRERcIiksIGRhdGFJdGVtLmRlcGFydHVyZV90aW1lKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpLmNhdGNoKHJlYXNvbiA9PiBMb2dnZXIubG9nKCdlcnJvcicsIHJlYXNvbikpXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBhcnJpdmFsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2lyY2xlOiBhd2FpdCB0aGlzLl9nZXRDaXJjbGVOYW1lKGRhdGFJdGVtLnNlY3Rvcl9uYW1lLCAxLCAnLScpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdCkuY2F0Y2gocmVhc29uID0+IExvZ2dlci5sb2coJ2Vycm9yJywgcmVhc29uKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6IGRhdGFJdGVtLmRlcGFydHVyZV90aW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBtb21lbnQoZGF0YUl0ZW0uZGVwYXJ0dXJlX2F0KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcG9jaF9kYXRlOiBhd2FpdCB0aGlzLl9nZXREYXRlKG1vbWVudChkYXRhSXRlbS5kZXBhcnR1cmVfYXQpLmZvcm1hdChcIllZWVktTU0tRERcIiksIGRhdGFJdGVtLmRlcGFydHVyZV90aW1lKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpLmNhdGNoKHJlYXNvbiA9PiBMb2dnZXIubG9nKCdlcnJvcicsIHJlYXNvbikpXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGlja2V0X3R5cGU6IGRhdGFJdGVtLnRyYXZlbF9jbGFzcyxcclxuICAgICAgICAgICAgICAgICAgICBhdmFpbGFiaWxpdHk6IGRhdGFJdGVtLmF2YWlsYWJsZV9zZWF0cyxcclxuICAgICAgICAgICAgICAgICAgICBwcmljZTogKGRhdGFJdGVtLnByaWNlKSxcclxuICAgICAgICAgICAgICAgICAgICBmbGlnaHRfaWQ6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgcnVuaWQ6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY2lkOiBkYXRhSXRlbS5pZFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBwYXJzZWREYXRhU2V0LnB1c2gocGFyc2VkUmVjb3JkKTtcclxuICAgICAgICAgICAgICAgIExvZ2dlci5sb2coJ2luZm8nLCAnRGF0YScsIEpTT04uc3RyaW5naWZ5KHBhcnNlZFJlY29yZCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgICAgIExvZ2dlci5sb2coJ2Vycm9yJywgZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJzZWREYXRhU2V0O1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIF9nZXRDaXJjbGVOYW1lKGNpcmNsZSwgaW5kZXgsIGRlbGltZXRlcj0ndG8nKSB7XHJcbiAgICAgICAgbGV0IGNpcmNsZU5hbWUgPSAnJztcclxuICAgICAgICBpZihjaXJjbGUhPT1udWxsICYmIGNpcmNsZSE9PXVuZGVmaW5lZCAmJiBjaXJjbGUuaW5kZXhPZihkZWxpbWV0ZXIpPi0xKSB7XHJcbiAgICAgICAgICAgIGxldCBjaXJjbGVzID0gY2lyY2xlLnNwbGl0KGRlbGltZXRlcik7XHJcbiAgICAgICAgICAgIGlmKGNpcmNsZXMubGVuZ3RoPjApIHtcclxuICAgICAgICAgICAgICAgIGNpcmNsZU5hbWUgPSBjaXJjbGVzW2luZGV4XS50cmltKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjaXJjbGVOYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIF9nZXREYXRlKHN0ckRhdGUsIHN0clRpbWUpIHtcclxuICAgICAgICBsZXQgZHQgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIHRyeXtcclxuICAgICAgICAgICAgZHQgPSBEYXRlLnBhcnNlKGAke3N0ckRhdGV9ICR7c3RyVGltZX1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2goZSkge1xyXG4gICAgICAgICAgICBMb2dnZXIubG9nKCdlcnJvcicsIGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGR0O1xyXG4gICAgfVxyXG59XHJcblxyXG4vL2pzaGludCBpZ25vcmU6ZW5kIl19