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
          Logger._write("info", message);

          break;

        case "warning":
          Logger._write("warning", message);

          break;

        case "error":
          Logger._write("error", message);

          break;

        default:
          break;
      }
    }
  }, {
    key: "_write",
    value: function _write(type) {
      var time = moment().format("HH:mm:ss.SSS"); //arguments.splice(0)

      var args = Array.from(arguments); //args.splice(0);

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

      }).then(function (response) {
        Logger.log("info", "Response received");
        _this.data = response.json();
        _this.finalData = _this.transformData(_this.data);
        return response.json();
      }).catch(function (reason) {
        Logger.log("error", reason);
        throw reason;
      }); // parses JSON response into native Javascript objects 
    }
  }, {
    key: "transformData",
    value: function transformData(data) {
      if (data === null || data === undefined || data.length === 0) return;
      var parsedDataSet = [];
      var parsedRecord = {};

      for (var i = 0; i < data.length; i++) {
        try {
          var dataItem = data[i];
          parsedRecord = {
            flight: dataItem.airlns_name,
            flight_number: dataItem.flight_no,
            departure: {
              id: -1,
              circle: _getCircleName(dataItem.destn, 0).then(function (result) {
                return result;
              }).catch(function (reason) {
                return Logger.log('error', reason);
              }),
              time: dataItem.travel_time,
              date: dataItem.travel_date,
              epoch_date: _getDate(dataItem.travel_date, dataItem.travel_time).then(function (result) {
                return result;
              }).catch(function (reason) {
                return Logger.log('error', reason);
              })
            },
            arrival: {
              id: -1,
              circle: _getCircleName(dataItem.destn, 1).then(function (result) {
                return result;
              }).catch(function (reason) {
                return Logger.log('error', reason);
              }),
              time: dataItem.arrival_time,
              date: dataItem.arrival_date,
              epoch_date: _getDate(dataItem.arrival_date, dataItem.arrival_time).then(function (result) {
                return result;
              }).catch(function (reason) {
                return Logger.log('error', reason);
              })
            },
            ticket_type: 'Economy',
            availability: dataItem.seat,
            price: dataItem.fare + dataItem.srv_tax + dataItem.gst,
            flight_id: 1,
            runid: '',
            recid: dataItem.id
          };
          parsedDataSet.push(parsedRecord);
          Logger.log('info', 'Data', JSON.stringify(parsedRecord));
        } catch (e) {
          Logger.log('error', e);
        }
      }

      return parsedDataSet;
    }
  }, {
    key: "_getCircleName",
    value: function () {
      var _getCircleName2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(circle, index) {
        var circleName, circles;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                circleName = '';

                if (circle !== null && circle !== undefined && circle.indexOf('to') > -1) {
                  circles = circle.split('to');

                  if (circles.length > 0) {
                    circleName = circles[index];
                  }
                }

                return _context.abrupt("return", circleName);

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function _getCircleName(_x, _x2) {
        return _getCircleName2.apply(this, arguments);
      }

      return _getCircleName;
    }()
  }, {
    key: "_getDate",
    value: function () {
      var _getDate2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(strDate, strTime) {
        var dt;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                dt = Date.now();

                try {
                  dt = new Date("".concat(strDate, " ").concat(strTime));
                } catch (e) {
                  Logger.log('error', e);
                }

                return _context2.abrupt("return", dt);

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function _getDate(_x3, _x4) {
        return _getDate2.apply(this, arguments);
      }

      return _getDate;
    }()
  }]);
  return E2FCrawler;
}(); //jshint ignore:end


exports.E2FCrawler = E2FCrawler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lMmYvZTJmY3J3bGVyLmpzIl0sIm5hbWVzIjpbImNyb24iLCJyZXF1aXJlIiwiZXhwcmVzcyIsImZzIiwidXVpZHY0IiwiZGVsYXkiLCJtb21lbnQiLCJmZXRjaCIsIkxvZ2dlciIsInR5cGUiLCJtZXNzYWdlIiwiX3dyaXRlIiwidGltZSIsImZvcm1hdCIsImFyZ3MiLCJBcnJheSIsImZyb20iLCJhcmd1bWVudHMiLCJ1bnNoaWZ0IiwidG9VcHBlckNhc2UiLCJjb25zb2xlIiwibG9nIiwiYXBwbHkiLCJFMkZDcmF3bGVyIiwib3B0aW9ucyIsInVybCIsIm91dHB1dCIsInNlYXJjaE9wdGlvbiIsImRhdGEiLCJ1c3JJZCIsInVzclR5cGUiLCJtZXRob2QiLCJtb2RlIiwiY2FjaGUiLCJjcmVkZW50aWFscyIsImhlYWRlcnMiLCJyZWRpcmVjdCIsInJlZmVycmVyIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwiZmluYWxEYXRhIiwidHJhbnNmb3JtRGF0YSIsImNhdGNoIiwicmVhc29uIiwidW5kZWZpbmVkIiwibGVuZ3RoIiwicGFyc2VkRGF0YVNldCIsInBhcnNlZFJlY29yZCIsImkiLCJkYXRhSXRlbSIsImZsaWdodCIsImFpcmxuc19uYW1lIiwiZmxpZ2h0X251bWJlciIsImZsaWdodF9ubyIsImRlcGFydHVyZSIsImlkIiwiY2lyY2xlIiwiX2dldENpcmNsZU5hbWUiLCJkZXN0biIsInJlc3VsdCIsInRyYXZlbF90aW1lIiwiZGF0ZSIsInRyYXZlbF9kYXRlIiwiZXBvY2hfZGF0ZSIsIl9nZXREYXRlIiwiYXJyaXZhbCIsImFycml2YWxfdGltZSIsImFycml2YWxfZGF0ZSIsInRpY2tldF90eXBlIiwiYXZhaWxhYmlsaXR5Iiwic2VhdCIsInByaWNlIiwiZmFyZSIsInNydl90YXgiLCJnc3QiLCJmbGlnaHRfaWQiLCJydW5pZCIsInJlY2lkIiwicHVzaCIsImUiLCJpbmRleCIsImNpcmNsZU5hbWUiLCJpbmRleE9mIiwiY2lyY2xlcyIsInNwbGl0Iiwic3RyRGF0ZSIsInN0clRpbWUiLCJkdCIsIkRhdGUiLCJub3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBLElBQU1BLElBQUksR0FBR0MsT0FBTyxDQUFDLFdBQUQsQ0FBcEI7O0FBQ0EsSUFBTUMsT0FBTyxHQUFHRCxPQUFPLENBQUMsU0FBRCxDQUF2Qjs7QUFDQSxJQUFNRSxFQUFFLEdBQUdGLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUVBLElBQU1HLE1BQU0sR0FBR0gsT0FBTyxDQUFDLFNBQUQsQ0FBdEI7O0FBQ0EsSUFBTUksS0FBSyxHQUFHSixPQUFPLENBQUMsT0FBRCxDQUFyQjs7QUFDQSxJQUFNSyxNQUFNLEdBQUdMLE9BQU8sQ0FBQyxRQUFELENBQXRCOztBQUNBLElBQU1NLEtBQUssR0FBR04sT0FBTyxDQUFDLGtCQUFELENBQXJCLEMsQ0FFQTtBQUNBOzs7SUFFYU8sTTs7Ozs7Ozs7O3dCQUNFQyxJLEVBQU1DLE8sRUFBUztBQUN0QixjQUFRRCxJQUFSO0FBQ0ksYUFBSyxNQUFMO0FBQ0FELFVBQUFBLE1BQU0sQ0FBQ0csTUFBUCxDQUFjLE1BQWQsRUFBcUJELE9BQXJCOztBQUNJOztBQUNKLGFBQUssU0FBTDtBQUNJRixVQUFBQSxNQUFNLENBQUNHLE1BQVAsQ0FBYyxTQUFkLEVBQXdCRCxPQUF4Qjs7QUFDQTs7QUFDSixhQUFLLE9BQUw7QUFDSUYsVUFBQUEsTUFBTSxDQUFDRyxNQUFQLENBQWMsT0FBZCxFQUFzQkQsT0FBdEI7O0FBQ0E7O0FBQ0o7QUFDSTtBQVhSO0FBYUg7OzsyQkFFYUQsSSxFQUFNO0FBQ2hCLFVBQUlHLElBQUksR0FBR04sTUFBTSxHQUFHTyxNQUFULENBQWdCLGNBQWhCLENBQVgsQ0FEZ0IsQ0FFaEI7O0FBQ0EsVUFBSUMsSUFBSSxHQUFHQyxLQUFLLENBQUNDLElBQU4sQ0FBV0MsU0FBWCxDQUFYLENBSGdCLENBSWhCOztBQUVBSCxNQUFBQSxJQUFJLENBQUNJLE9BQUwsQ0FBYU4sSUFBYjtBQUNBRSxNQUFBQSxJQUFJLENBQUNJLE9BQUwsQ0FBYVQsSUFBSSxDQUFDVSxXQUFMLEVBQWI7QUFDQUMsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlDLEtBQVosQ0FBa0JGLE9BQWxCLEVBQTJCTixJQUEzQjtBQUNIOzs7Ozs7O0lBR1FTLFU7OztBQUNULHNCQUFZQyxPQUFaLEVBQXFCO0FBQUE7QUFDakIsU0FBS0EsT0FBTCxHQUFlQSxPQUFPLElBQUk7QUFBQ0MsTUFBQUEsR0FBRyxFQUFFLEVBQU47QUFBVUMsTUFBQUEsTUFBTSxFQUFFO0FBQWxCLEtBQTFCO0FBQ0g7Ozs7K0JBRWtFO0FBQUE7O0FBQUEsVUFBMURDLFlBQTBELHVFQUE3QztBQUFDRixRQUFBQSxHQUFHLEVBQUUsRUFBTjtBQUFVRyxRQUFBQSxJQUFJLEVBQUU7QUFBQ0MsVUFBQUEsS0FBSyxFQUFFLEdBQVI7QUFBYUMsVUFBQUEsT0FBTyxFQUFFO0FBQXRCO0FBQWhCLE9BQTZDO0FBQy9EO0FBQ0EsYUFBT3ZCLEtBQUssQ0FBQ29CLFlBQVksQ0FBQ0YsR0FBZCxFQUFtQjtBQUMzQk0sUUFBQUEsTUFBTSxFQUFFLE1BRG1CO0FBQ1g7QUFDaEJDLFFBQUFBLElBQUksRUFBRSxNQUZxQjtBQUViO0FBQ2RDLFFBQUFBLEtBQUssRUFBRSxVQUhvQjtBQUdSO0FBQ25CQyxRQUFBQSxXQUFXLEVBQUUsYUFKYztBQUlDO0FBQzVCQyxRQUFBQSxPQUFPLEVBQUU7QUFDTCwwQkFBZ0Isa0JBRFgsQ0FFTDs7QUFGSyxTQUxrQjtBQVMzQkMsUUFBQUEsUUFBUSxFQUFFLFFBVGlCO0FBU1A7QUFDcEJDLFFBQUFBLFFBQVEsRUFBRSxhQVZpQjtBQVVGO0FBQ3pCQyxRQUFBQSxJQUFJLEVBQUVDLElBQUksQ0FBQ0MsU0FBTCxDQUFlYixZQUFZLENBQUNDLElBQTVCLENBWHFCLENBV2M7O0FBWGQsT0FBbkIsQ0FBTCxDQWFOYSxJQWJNLENBYUQsVUFBQUMsUUFBUSxFQUFJO0FBQ2RsQyxRQUFBQSxNQUFNLENBQUNhLEdBQVAsQ0FBVyxNQUFYLEVBQW1CLG1CQUFuQjtBQUNBLFFBQUEsS0FBSSxDQUFDTyxJQUFMLEdBQVljLFFBQVEsQ0FBQ0MsSUFBVCxFQUFaO0FBQ0EsUUFBQSxLQUFJLENBQUNDLFNBQUwsR0FBaUIsS0FBSSxDQUFDQyxhQUFMLENBQW1CLEtBQUksQ0FBQ2pCLElBQXhCLENBQWpCO0FBQ0EsZUFBT2MsUUFBUSxDQUFDQyxJQUFULEVBQVA7QUFDSCxPQWxCTSxFQW1CTkcsS0FuQk0sQ0FtQkEsVUFBQUMsTUFBTSxFQUFJO0FBQ2J2QyxRQUFBQSxNQUFNLENBQUNhLEdBQVAsQ0FBVyxPQUFYLEVBQW9CMEIsTUFBcEI7QUFDQSxjQUFNQSxNQUFOO0FBQ0gsT0F0Qk0sQ0FBUCxDQUYrRCxDQXdCM0Q7QUFDUDs7O2tDQUVhbkIsSSxFQUFNO0FBQ2hCLFVBQUdBLElBQUksS0FBRyxJQUFQLElBQWVBLElBQUksS0FBR29CLFNBQXRCLElBQW1DcEIsSUFBSSxDQUFDcUIsTUFBTCxLQUFjLENBQXBELEVBQXVEO0FBRXZELFVBQUlDLGFBQWEsR0FBRyxFQUFwQjtBQUNBLFVBQUlDLFlBQVksR0FBRyxFQUFuQjs7QUFFQSxXQUFJLElBQUlDLENBQUMsR0FBQyxDQUFWLEVBQWFBLENBQUMsR0FBQ3hCLElBQUksQ0FBQ3FCLE1BQXBCLEVBQTRCRyxDQUFDLEVBQTdCLEVBQWlDO0FBQzdCLFlBQ0E7QUFDSSxjQUFJQyxRQUFRLEdBQUd6QixJQUFJLENBQUN3QixDQUFELENBQW5CO0FBQ0FELFVBQUFBLFlBQVksR0FBRztBQUNYRyxZQUFBQSxNQUFNLEVBQUVELFFBQVEsQ0FBQ0UsV0FETjtBQUVYQyxZQUFBQSxhQUFhLEVBQUVILFFBQVEsQ0FBQ0ksU0FGYjtBQUdYQyxZQUFBQSxTQUFTLEVBQUU7QUFDUEMsY0FBQUEsRUFBRSxFQUFFLENBQUMsQ0FERTtBQUVQQyxjQUFBQSxNQUFNLEVBQUVDLGNBQWMsQ0FBQ1IsUUFBUSxDQUFDUyxLQUFWLEVBQWlCLENBQWpCLENBQWQsQ0FBa0NyQixJQUFsQyxDQUF1QyxVQUFBc0IsTUFBTTtBQUFBLHVCQUFJQSxNQUFKO0FBQUEsZUFBN0MsRUFBeURqQixLQUF6RCxDQUErRCxVQUFBQyxNQUFNO0FBQUEsdUJBQUl2QyxNQUFNLENBQUNhLEdBQVAsQ0FBVyxPQUFYLEVBQW9CMEIsTUFBcEIsQ0FBSjtBQUFBLGVBQXJFLENBRkQ7QUFHUG5DLGNBQUFBLElBQUksRUFBRXlDLFFBQVEsQ0FBQ1csV0FIUjtBQUlQQyxjQUFBQSxJQUFJLEVBQUVaLFFBQVEsQ0FBQ2EsV0FKUjtBQUtQQyxjQUFBQSxVQUFVLEVBQUVDLFFBQVEsQ0FBQ2YsUUFBUSxDQUFDYSxXQUFWLEVBQXVCYixRQUFRLENBQUNXLFdBQWhDLENBQVIsQ0FBcUR2QixJQUFyRCxDQUEwRCxVQUFBc0IsTUFBTTtBQUFBLHVCQUFJQSxNQUFKO0FBQUEsZUFBaEUsRUFBNEVqQixLQUE1RSxDQUFrRixVQUFBQyxNQUFNO0FBQUEsdUJBQUl2QyxNQUFNLENBQUNhLEdBQVAsQ0FBVyxPQUFYLEVBQW9CMEIsTUFBcEIsQ0FBSjtBQUFBLGVBQXhGO0FBTEwsYUFIQTtBQVVYc0IsWUFBQUEsT0FBTyxFQUFFO0FBQ0xWLGNBQUFBLEVBQUUsRUFBRSxDQUFDLENBREE7QUFFTEMsY0FBQUEsTUFBTSxFQUFFQyxjQUFjLENBQUNSLFFBQVEsQ0FBQ1MsS0FBVixFQUFpQixDQUFqQixDQUFkLENBQWtDckIsSUFBbEMsQ0FBdUMsVUFBQXNCLE1BQU07QUFBQSx1QkFBSUEsTUFBSjtBQUFBLGVBQTdDLEVBQXlEakIsS0FBekQsQ0FBK0QsVUFBQUMsTUFBTTtBQUFBLHVCQUFJdkMsTUFBTSxDQUFDYSxHQUFQLENBQVcsT0FBWCxFQUFvQjBCLE1BQXBCLENBQUo7QUFBQSxlQUFyRSxDQUZIO0FBR0xuQyxjQUFBQSxJQUFJLEVBQUV5QyxRQUFRLENBQUNpQixZQUhWO0FBSUxMLGNBQUFBLElBQUksRUFBRVosUUFBUSxDQUFDa0IsWUFKVjtBQUtMSixjQUFBQSxVQUFVLEVBQUVDLFFBQVEsQ0FBQ2YsUUFBUSxDQUFDa0IsWUFBVixFQUF3QmxCLFFBQVEsQ0FBQ2lCLFlBQWpDLENBQVIsQ0FBdUQ3QixJQUF2RCxDQUE0RCxVQUFBc0IsTUFBTTtBQUFBLHVCQUFJQSxNQUFKO0FBQUEsZUFBbEUsRUFBOEVqQixLQUE5RSxDQUFvRixVQUFBQyxNQUFNO0FBQUEsdUJBQUl2QyxNQUFNLENBQUNhLEdBQVAsQ0FBVyxPQUFYLEVBQW9CMEIsTUFBcEIsQ0FBSjtBQUFBLGVBQTFGO0FBTFAsYUFWRTtBQWtCWHlCLFlBQUFBLFdBQVcsRUFBRSxTQWxCRjtBQW1CWEMsWUFBQUEsWUFBWSxFQUFFcEIsUUFBUSxDQUFDcUIsSUFuQlo7QUFvQlhDLFlBQUFBLEtBQUssRUFBR3RCLFFBQVEsQ0FBQ3VCLElBQVQsR0FBY3ZCLFFBQVEsQ0FBQ3dCLE9BQXZCLEdBQStCeEIsUUFBUSxDQUFDeUIsR0FwQnJDO0FBcUJYQyxZQUFBQSxTQUFTLEVBQUUsQ0FyQkE7QUFzQlhDLFlBQUFBLEtBQUssRUFBRSxFQXRCSTtBQXVCWEMsWUFBQUEsS0FBSyxFQUFFNUIsUUFBUSxDQUFDTTtBQXZCTCxXQUFmO0FBMEJBVCxVQUFBQSxhQUFhLENBQUNnQyxJQUFkLENBQW1CL0IsWUFBbkI7QUFDQTNDLFVBQUFBLE1BQU0sQ0FBQ2EsR0FBUCxDQUFXLE1BQVgsRUFBbUIsTUFBbkIsRUFBMkJrQixJQUFJLENBQUNDLFNBQUwsQ0FBZVcsWUFBZixDQUEzQjtBQUNILFNBL0JELENBZ0NBLE9BQU1nQyxDQUFOLEVBQVM7QUFDTDNFLFVBQUFBLE1BQU0sQ0FBQ2EsR0FBUCxDQUFXLE9BQVgsRUFBb0I4RCxDQUFwQjtBQUNIO0FBQ0o7O0FBRUQsYUFBT2pDLGFBQVA7QUFDSDs7Ozs7O2lEQUVvQlUsTSxFQUFRd0IsSzs7Ozs7O0FBQ3JCQyxnQkFBQUEsVSxHQUFhLEU7O0FBQ2pCLG9CQUFHekIsTUFBTSxLQUFHLElBQVQsSUFBaUJBLE1BQU0sS0FBR1osU0FBMUIsSUFBdUNZLE1BQU0sQ0FBQzBCLE9BQVAsQ0FBZSxJQUFmLElBQXFCLENBQUMsQ0FBaEUsRUFBbUU7QUFDM0RDLGtCQUFBQSxPQUQyRCxHQUNqRDNCLE1BQU0sQ0FBQzRCLEtBQVAsQ0FBYSxJQUFiLENBRGlEOztBQUUvRCxzQkFBR0QsT0FBTyxDQUFDdEMsTUFBUixHQUFlLENBQWxCLEVBQXFCO0FBQ2pCb0Msb0JBQUFBLFVBQVUsR0FBR0UsT0FBTyxDQUFDSCxLQUFELENBQXBCO0FBQ0g7QUFDSjs7aURBRU1DLFU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrREFHSUksTyxFQUFTQyxPOzs7Ozs7QUFDaEJDLGdCQUFBQSxFLEdBQUtDLElBQUksQ0FBQ0MsR0FBTCxFOztBQUNULG9CQUFHO0FBQ0NGLGtCQUFBQSxFQUFFLEdBQUcsSUFBSUMsSUFBSixXQUFZSCxPQUFaLGNBQXVCQyxPQUF2QixFQUFMO0FBQ0gsaUJBRkQsQ0FHQSxPQUFNUCxDQUFOLEVBQVM7QUFDTDNFLGtCQUFBQSxNQUFNLENBQUNhLEdBQVAsQ0FBVyxPQUFYLEVBQW9COEQsQ0FBcEI7QUFDSDs7a0RBRU1RLEU7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQUlmIiwic291cmNlc0NvbnRlbnQiOlsiLy9qc2hpbnQgZXN2ZXJzaW9uOiA2XHJcbi8vanNoaW50IGlnbm9yZTpzdGFydFxyXG5jb25zdCBjcm9uID0gcmVxdWlyZShcIm5vZGUtY3JvblwiKTtcclxuY29uc3QgZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xyXG5jb25zdCBmcyA9IHJlcXVpcmUoXCJmc1wiKTtcclxuXHJcbmNvbnN0IHV1aWR2NCA9IHJlcXVpcmUoJ3V1aWQvdjQnKTtcclxuY29uc3QgZGVsYXkgPSByZXF1aXJlKCdkZWxheScpO1xyXG5jb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxuY29uc3QgZmV0Y2ggPSByZXF1aXJlKCdpc29tb3JwaGljLWZldGNoJyk7XHJcblxyXG4vL2ltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xyXG4vLyBpbXBvcnQgXCJpc29tb3JwaGljLWZldGNoXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9nZ2VyIHtcclxuICAgIHN0YXRpYyBsb2codHlwZSwgbWVzc2FnZSkge1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiaW5mb1wiOlxyXG4gICAgICAgICAgICBMb2dnZXIuX3dyaXRlKFwiaW5mb1wiLG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ3YXJuaW5nXCI6XHJcbiAgICAgICAgICAgICAgICBMb2dnZXIuX3dyaXRlKFwid2FybmluZ1wiLG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJlcnJvclwiOlxyXG4gICAgICAgICAgICAgICAgTG9nZ2VyLl93cml0ZShcImVycm9yXCIsbWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgX3dyaXRlKHR5cGUpIHtcclxuICAgICAgICB2YXIgdGltZSA9IG1vbWVudCgpLmZvcm1hdChcIkhIOm1tOnNzLlNTU1wiKTtcclxuICAgICAgICAvL2FyZ3VtZW50cy5zcGxpY2UoMClcclxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LmZyb20oYXJndW1lbnRzKTtcclxuICAgICAgICAvL2FyZ3Muc3BsaWNlKDApO1xyXG4gICAgXHJcbiAgICAgICAgYXJncy51bnNoaWZ0KHRpbWUpO1xyXG4gICAgICAgIGFyZ3MudW5zaGlmdCh0eXBlLnRvVXBwZXJDYXNlKCkpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3MpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRTJGQ3Jhd2xlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7dXJsOiAnJywgb3V0cHV0OiAnanNvbid9O1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3REYXRhKHNlYXJjaE9wdGlvbj17dXJsOiAnJywgZGF0YToge3VzcklkOiAxMDksIHVzclR5cGU6ICdOJ319KSB7XHJcbiAgICAgICAgLy8gRGVmYXVsdCBvcHRpb25zIGFyZSBtYXJrZWQgd2l0aCAqXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHNlYXJjaE9wdGlvbi51cmwsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIiwgLy8gKkdFVCwgUE9TVCwgUFVULCBERUxFVEUsIGV0Yy5cclxuICAgICAgICAgICAgbW9kZTogXCJjb3JzXCIsIC8vIG5vLWNvcnMsIGNvcnMsICpzYW1lLW9yaWdpblxyXG4gICAgICAgICAgICBjYWNoZTogXCJuby1jYWNoZVwiLCAvLyAqZGVmYXVsdCwgbm8tY2FjaGUsIHJlbG9hZCwgZm9yY2UtY2FjaGUsIG9ubHktaWYtY2FjaGVkXHJcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIC8vIGluY2x1ZGUsICpzYW1lLW9yaWdpbiwgb21pdFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIC8vIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlZGlyZWN0OiBcImZvbGxvd1wiLCAvLyBtYW51YWwsICpmb2xsb3csIGVycm9yXHJcbiAgICAgICAgICAgIHJlZmVycmVyOiBcIm5vLXJlZmVycmVyXCIsIC8vIG5vLXJlZmVycmVyLCAqY2xpZW50XHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHNlYXJjaE9wdGlvbi5kYXRhKSwgLy8gYm9keSBkYXRhIHR5cGUgbXVzdCBtYXRjaCBcIkNvbnRlbnQtVHlwZVwiIGhlYWRlclxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBMb2dnZXIubG9nKFwiaW5mb1wiLCBcIlJlc3BvbnNlIHJlY2VpdmVkXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZmluYWxEYXRhID0gdGhpcy50cmFuc2Zvcm1EYXRhKHRoaXMuZGF0YSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2gocmVhc29uID0+IHtcclxuICAgICAgICAgICAgTG9nZ2VyLmxvZyhcImVycm9yXCIsIHJlYXNvbik7XHJcbiAgICAgICAgICAgIHRocm93IHJlYXNvbjtcclxuICAgICAgICB9KTsgLy8gcGFyc2VzIEpTT04gcmVzcG9uc2UgaW50byBuYXRpdmUgSmF2YXNjcmlwdCBvYmplY3RzIFxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybURhdGEoZGF0YSkge1xyXG4gICAgICAgIGlmKGRhdGE9PT1udWxsIHx8IGRhdGE9PT11bmRlZmluZWQgfHwgZGF0YS5sZW5ndGg9PT0wKSByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBwYXJzZWREYXRhU2V0ID0gW107XHJcbiAgICAgICAgbGV0IHBhcnNlZFJlY29yZCA9IHt9O1xyXG5cclxuICAgICAgICBmb3IodmFyIGk9MDsgaTxkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YUl0ZW0gPSBkYXRhW2ldO1xyXG4gICAgICAgICAgICAgICAgcGFyc2VkUmVjb3JkID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZsaWdodDogZGF0YUl0ZW0uYWlybG5zX25hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZmxpZ2h0X251bWJlcjogZGF0YUl0ZW0uZmxpZ2h0X25vLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlcGFydHVyZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogLTEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNpcmNsZTogX2dldENpcmNsZU5hbWUoZGF0YUl0ZW0uZGVzdG4sIDApLnRoZW4ocmVzdWx0ID0+IHJlc3VsdCkuY2F0Y2gocmVhc29uID0+IExvZ2dlci5sb2coJ2Vycm9yJywgcmVhc29uKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6IGRhdGFJdGVtLnRyYXZlbF90aW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBkYXRhSXRlbS50cmF2ZWxfZGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXBvY2hfZGF0ZTogX2dldERhdGUoZGF0YUl0ZW0udHJhdmVsX2RhdGUsIGRhdGFJdGVtLnRyYXZlbF90aW1lKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpLmNhdGNoKHJlYXNvbiA9PiBMb2dnZXIubG9nKCdlcnJvcicsIHJlYXNvbikpXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBhcnJpdmFsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2lyY2xlOiBfZ2V0Q2lyY2xlTmFtZShkYXRhSXRlbS5kZXN0biwgMSkudGhlbihyZXN1bHQgPT4gcmVzdWx0KS5jYXRjaChyZWFzb24gPT4gTG9nZ2VyLmxvZygnZXJyb3InLCByZWFzb24pKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZTogZGF0YUl0ZW0uYXJyaXZhbF90aW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBkYXRhSXRlbS5hcnJpdmFsX2RhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVwb2NoX2RhdGU6IF9nZXREYXRlKGRhdGFJdGVtLmFycml2YWxfZGF0ZSwgZGF0YUl0ZW0uYXJyaXZhbF90aW1lKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpLmNhdGNoKHJlYXNvbiA9PiBMb2dnZXIubG9nKCdlcnJvcicsIHJlYXNvbikpXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGlja2V0X3R5cGU6ICdFY29ub215JyxcclxuICAgICAgICAgICAgICAgICAgICBhdmFpbGFiaWxpdHk6IGRhdGFJdGVtLnNlYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IChkYXRhSXRlbS5mYXJlK2RhdGFJdGVtLnNydl90YXgrZGF0YUl0ZW0uZ3N0KSxcclxuICAgICAgICAgICAgICAgICAgICBmbGlnaHRfaWQ6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgcnVuaWQ6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY2lkOiBkYXRhSXRlbS5pZFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBwYXJzZWREYXRhU2V0LnB1c2gocGFyc2VkUmVjb3JkKTtcclxuICAgICAgICAgICAgICAgIExvZ2dlci5sb2coJ2luZm8nLCAnRGF0YScsIEpTT04uc3RyaW5naWZ5KHBhcnNlZFJlY29yZCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgICAgIExvZ2dlci5sb2coJ2Vycm9yJywgZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJzZWREYXRhU2V0O1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIF9nZXRDaXJjbGVOYW1lKGNpcmNsZSwgaW5kZXgpIHtcclxuICAgICAgICBsZXQgY2lyY2xlTmFtZSA9ICcnO1xyXG4gICAgICAgIGlmKGNpcmNsZSE9PW51bGwgJiYgY2lyY2xlIT09dW5kZWZpbmVkICYmIGNpcmNsZS5pbmRleE9mKCd0bycpPi0xKSB7XHJcbiAgICAgICAgICAgIGxldCBjaXJjbGVzID0gY2lyY2xlLnNwbGl0KCd0bycpO1xyXG4gICAgICAgICAgICBpZihjaXJjbGVzLmxlbmd0aD4wKSB7XHJcbiAgICAgICAgICAgICAgICBjaXJjbGVOYW1lID0gY2lyY2xlc1tpbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjaXJjbGVOYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIF9nZXREYXRlKHN0ckRhdGUsIHN0clRpbWUpIHtcclxuICAgICAgICBsZXQgZHQgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIHRyeXtcclxuICAgICAgICAgICAgZHQgPSBuZXcgRGF0ZShgJHtzdHJEYXRlfSAke3N0clRpbWV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgTG9nZ2VyLmxvZygnZXJyb3InLCBlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkdDtcclxuICAgIH1cclxufVxyXG5cclxuLy9qc2hpbnQgaWdub3JlOmVuZCJdfQ==