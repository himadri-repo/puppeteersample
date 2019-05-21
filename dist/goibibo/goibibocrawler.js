"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GOIBIBOCrawler = exports.Logger = void 0;

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

var fetch = require('isomorphic-fetch');

var datastore = require('../../radharani/goibibodatastore'); //import moment from "moment";
// import "isomorphic-fetch";
//let url = `http://developer.goibibo.com/api/search/?app_id=f8803086&app_key=012f84558a572cb4ccc4b4c84a15d523&format=json&source=CCU&destination=DEL&dateofdeparture=20190520&seatingclass=E&adults=1&children=1&infants=1&counter=100`;


var GOIBIBO_URL = 'http://developer.goibibo.com/api/search/?';

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

var GOIBIBOCrawler =
/*#__PURE__*/
function () {
  function GOIBIBOCrawler(options) {
    (0, _classCallCheck2.default)(this, GOIBIBOCrawler);
    this.options = options || {
      url: '',
      output: 'json',
      token: '',
      airlines: []
    };
  }

  (0, _createClass2.default)(GOIBIBOCrawler, [{
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
                  _context.next = 2;
                  return response.json();

                case 2:
                  _this.data = _context.sent;
                  _context.next = 5;
                  return _this.transformData(_this.data);

                case 5:
                  _this.finalData = _context.sent;
                  return _context.abrupt("return", _this.data);

                case 7:
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
    key: "getData",
    value: function getData() {
      var _this2 = this;

      var searchOption = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        url: '',
        src_id: 0,
        dst_id: 0,
        data: {}
      };
      return new Promise(function (resolve, reject) {
        try {
          var json_get = {
            method: "GET",
            // *GET, POST, PUT, DELETE, etc.
            headers: {
              "Content-Type": "application/json"
            }
          };
          fetch(searchOption.url, json_get).then(function (response) {
            //Logger.log("info", "Response received");
            response.json().then(function (responseData) {
              var finalData = _this2.transformData(responseData, searchOption.src_id, searchOption.dst_id);

              resolve(finalData);
            }).catch(function (reason) {
              Logger.log(reason);
              reject(reason);
            });
          }).catch(function (reason) {
            Logger.log("error", reason);
            reject(reason);
          }); // parses JSON response into native Javascript objects     
        } catch (ex) {
          Logger.log('error', ex);
          reject(ex);
        }
      });
    }
  }, {
    key: "transformData",
    value: function transformData(data, src_id, dst_id) {
      var _this3 = this;

      if (data === null || data === undefined || !data.data || !data.data.onwardflights || data.data.onwardflights.length === 0) return;
      var parsedDataSet = [];
      var parsedRecord = {};
      data = data.data.onwardflights;

      for (var i = 0; i < data.length; i++) {
        try {
          (function () {
            var dataItem = data[i];

            if (parseInt(dataItem.seatsavailable) > 0 && parseInt(dataItem.stops) === 0) {
              var dept_date = new Date(dataItem.depdate.split('t')[0] + ' ' + dataItem.deptime);
              var arrv_date = new Date(dataItem.arrdate.split('t')[0] + ' ' + dataItem.arrtime);
              var airlineid = -1;

              var airline = _this3.options.airlines.find(function (obj) {
                return obj.aircode.toLowerCase() === dataItem.carrierid.toLowerCase();
              });

              if (airline !== null && airline !== undefined) {
                airlineid = airline.id;
              } else {//we should insert new airline here and update the airline code
              }

              parsedRecord = {
                source: src_id,
                origin: dataItem.origin,
                target: dataItem.destination,
                destination: dst_id,
                stop: parseInt(dataItem.stops),
                flight: dataItem.airline,
                flight_no: dataItem.flightno,
                departure_date_time: dept_date,
                arrival_date_time: arrv_date,
                class: 'Economy',
                departure_terminal: dataItem.depterminal,
                arrival_terminal: dataItem.arrterminal,
                no_of_seats: parseInt(dataItem.seatsavailable),
                bookingclass: dataItem.bookingclass,
                airline: airlineid,
                aircraft_type: dataItem.aircraftType,
                carrierid: dataItem.carrierid,
                adultbasefare: parseInt('0' + dataItem.fare.adultbasefare),
                childbasefare: parseInt('0' + dataItem.fare.childbasefare),
                infantbasefare: parseInt('0' + dataItem.fare.infantbasefare),
                adult_tax_fees: parseInt('0' + dataItem.fare.adulttotalfare) - parseInt('0' + dataItem.fare.adultbasefare),
                child_tax_fees: parseInt('0' + dataItem.fare.childtotalfare) - parseInt('0' + dataItem.fare.childbasefare),
                infant_tax_fees: parseInt('0' + dataItem.fare.infanttotalfare) - parseInt('0' + dataItem.fare.infantbasefare),
                warning: dataItem.warnings,
                created_by: 104,
                created_on: new Date()
              };
              parsedDataSet.push(parsedRecord);
              Logger.log('info', 'Data', JSON.stringify(parsedRecord));
            }
          })();
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
      _regenerator.default.mark(function _callee2(circle, index) {
        var circleName, circles;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                circleName = '';

                if (circle !== null && circle !== undefined && circle.indexOf('to') > -1) {
                  circles = circle.split('to');

                  if (circles.length > 0) {
                    circleName = circles[index].trim();
                  }
                }

                return _context2.abrupt("return", circleName);

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function _getCircleName(_x2, _x3) {
        return _getCircleName2.apply(this, arguments);
      }

      return _getCircleName;
    }()
  }, {
    key: "_getDate",
    value: function () {
      var _getDate2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee3(strDate, strTime) {
        var dt;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                dt = Date.now();

                try {
                  dt = Date.parse("".concat(strDate, " ").concat(strTime));
                } catch (e) {
                  Logger.log('error', e);
                }

                return _context3.abrupt("return", dt);

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function _getDate(_x4, _x5) {
        return _getDate2.apply(this, arguments);
      }

      return _getDate;
    }()
  }, {
    key: "processCircleData",
    value: function () {
      var _processCircleData = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee4(circleData, options) {
        var live_tickets, startDate, currentDate, endDate, app_id, app_key, source, destination, url, days, date, ticket_data;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                live_tickets = [];
                startDate = options.startdate;
                currentDate = options.startdate;
                endDate = options.enddate;
                app_id = options.app_id;
                app_key = options.app_key;
                source = circleData.source_city_code;
                destination = circleData.destination_city_code;
                url = '';
                days = 1;

              case 10:
                if (!(currentDate <= endDate)) {
                  _context4.next = 26;
                  break;
                }

                date = moment(currentDate).format('YYYYMMDD');
                url = "".concat(GOIBIBO_URL, "app_id=").concat(app_id, "&app_key=").concat(app_key, "&format=json&source=").concat(source, "&destination=").concat(destination, "&dateofdeparture=").concat(date, "&seatingclass=E&adult=1&children=0&infant=0&counter=100");
                console.log("Index : ".concat(days));
                ticket_data = {};
                _context4.next = 17;
                return this.getData({
                  url: url,
                  src_id: circleData.source_city_id,
                  dst_id: circleData.destination_city_id
                }).then(function (value) {
                  if (value) {
                    //Logger.log('info', 'received tickets are null ?', (value===null || value===undefined));
                    ticket_data = value;
                  }
                }).catch(function (reason) {
                  //console.log(reason);
                  Logger.log('error', reason);
                });

              case 17:
                currentDate.setDate(currentDate.getDate() + 1);

                if (!(ticket_data !== null && ticket_data !== undefined)) {
                  _context4.next = 22;
                  break;
                }

                _context4.next = 21;
                return this.save_live_ticket(ticket_data).then(function (value) {}).catch(function (reason) {
                  Logger.log('error', reason);
                });

              case 21:
                live_tickets.push(ticket_data); // Logger.log('info', 'Added to collection');

              case 22:
                days++;
                this.freeze(1500);
                _context4.next = 10;
                break;

              case 26:
                return _context4.abrupt("return", live_tickets);

              case 27:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function processCircleData(_x6, _x7) {
        return _processCircleData.apply(this, arguments);
      }

      return processCircleData;
    }()
  }, {
    key: "freeze",
    value: function freeze(time) {
      var stop = new Date().getTime() + time;

      while (new Date().getTime() < stop) {
        ;
      }
    }
  }, {
    key: "save_live_ticket",
    value: function () {
      var _save_live_ticket = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee5(tickets) {
        var index, ticket, dept_date_time, key;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(tickets === null || tickets === undefined || tickets.length === 0)) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt("return", 0);

              case 2:
                _context5.prev = 2;
                index = 0;

              case 4:
                if (!(index < tickets.length)) {
                  _context5.next = 15;
                  break;
                }

                ticket = tickets[index];
                dept_date_time = moment(ticket.departure_date_time).format('YYYYMMDDHHmmss');
                key = "".concat(ticket.origin).concat(ticket.target).concat(dept_date_time).concat(ticket.bookingclass).concat(ticket.carrierid);
                Logger.log('info', index + 1, key);
                ticket.runid = key;
                _context5.next = 12;
                return datastore.save_live_ticket(ticket).then(function (value) {}).catch(function (reason) {
                  Logger.log('error', reason);
                });

              case 12:
                index++;
                _context5.next = 4;
                break;

              case 15:
                _context5.next = 20;
                break;

              case 17:
                _context5.prev = 17;
                _context5.t0 = _context5["catch"](2);
                Logger.log('error', _context5.t0);

              case 20:
                if (tickets && tickets.length >= 0) Logger.log('info', "Tickets count : ".concat(tickets.length));
                return _context5.abrupt("return", 1);

              case 22:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[2, 17]]);
      }));

      function save_live_ticket(_x8) {
        return _save_live_ticket.apply(this, arguments);
      }

      return save_live_ticket;
    }()
  }]);
  return GOIBIBOCrawler;
}(); //jshint ignore:end


exports.GOIBIBOCrawler = GOIBIBOCrawler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9nb2liaWJvL2dvaWJpYm9jcmF3bGVyLmpzIl0sIm5hbWVzIjpbImNyb24iLCJyZXF1aXJlIiwiZXhwcmVzcyIsImZzIiwidXVpZHY0IiwiZGVsYXkiLCJtb21lbnQiLCJmZXRjaCIsImRhdGFzdG9yZSIsIkdPSUJJQk9fVVJMIiwiTG9nZ2VyIiwidHlwZSIsIm1lc3NhZ2UiLCJfd3JpdGUiLCJhcmd1bWVudHMiLCJ0aW1lIiwiZm9ybWF0IiwiYXJncyIsIkFycmF5IiwiZnJvbSIsInNwbGljZSIsInVuc2hpZnQiLCJ0b1VwcGVyQ2FzZSIsImNvbnNvbGUiLCJsb2ciLCJhcHBseSIsIkdPSUJJQk9DcmF3bGVyIiwib3B0aW9ucyIsInVybCIsIm91dHB1dCIsInRva2VuIiwiYWlybGluZXMiLCJzZWFyY2hPcHRpb24iLCJkYXRhIiwidXNySWQiLCJ1c3JUeXBlIiwianNvbl9wb3N0IiwibWV0aG9kIiwibW9kZSIsImNhY2hlIiwiY3JlZGVudGlhbHMiLCJoZWFkZXJzIiwicmVkaXJlY3QiLCJyZWZlcnJlciIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5IiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsInRyYW5zZm9ybURhdGEiLCJmaW5hbERhdGEiLCJjYXRjaCIsInJlYXNvbiIsInNyY19pZCIsImRzdF9pZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwianNvbl9nZXQiLCJyZXNwb25zZURhdGEiLCJleCIsInVuZGVmaW5lZCIsIm9ud2FyZGZsaWdodHMiLCJsZW5ndGgiLCJwYXJzZWREYXRhU2V0IiwicGFyc2VkUmVjb3JkIiwiaSIsImRhdGFJdGVtIiwicGFyc2VJbnQiLCJzZWF0c2F2YWlsYWJsZSIsInN0b3BzIiwiZGVwdF9kYXRlIiwiRGF0ZSIsImRlcGRhdGUiLCJzcGxpdCIsImRlcHRpbWUiLCJhcnJ2X2RhdGUiLCJhcnJkYXRlIiwiYXJydGltZSIsImFpcmxpbmVpZCIsImFpcmxpbmUiLCJmaW5kIiwib2JqIiwiYWlyY29kZSIsInRvTG93ZXJDYXNlIiwiY2FycmllcmlkIiwiaWQiLCJzb3VyY2UiLCJvcmlnaW4iLCJ0YXJnZXQiLCJkZXN0aW5hdGlvbiIsInN0b3AiLCJmbGlnaHQiLCJmbGlnaHRfbm8iLCJmbGlnaHRubyIsImRlcGFydHVyZV9kYXRlX3RpbWUiLCJhcnJpdmFsX2RhdGVfdGltZSIsImNsYXNzIiwiZGVwYXJ0dXJlX3Rlcm1pbmFsIiwiZGVwdGVybWluYWwiLCJhcnJpdmFsX3Rlcm1pbmFsIiwiYXJydGVybWluYWwiLCJub19vZl9zZWF0cyIsImJvb2tpbmdjbGFzcyIsImFpcmNyYWZ0X3R5cGUiLCJhaXJjcmFmdFR5cGUiLCJhZHVsdGJhc2VmYXJlIiwiZmFyZSIsImNoaWxkYmFzZWZhcmUiLCJpbmZhbnRiYXNlZmFyZSIsImFkdWx0X3RheF9mZWVzIiwiYWR1bHR0b3RhbGZhcmUiLCJjaGlsZF90YXhfZmVlcyIsImNoaWxkdG90YWxmYXJlIiwiaW5mYW50X3RheF9mZWVzIiwiaW5mYW50dG90YWxmYXJlIiwid2FybmluZyIsIndhcm5pbmdzIiwiY3JlYXRlZF9ieSIsImNyZWF0ZWRfb24iLCJwdXNoIiwiZSIsImNpcmNsZSIsImluZGV4IiwiY2lyY2xlTmFtZSIsImluZGV4T2YiLCJjaXJjbGVzIiwidHJpbSIsInN0ckRhdGUiLCJzdHJUaW1lIiwiZHQiLCJub3ciLCJwYXJzZSIsImNpcmNsZURhdGEiLCJsaXZlX3RpY2tldHMiLCJzdGFydERhdGUiLCJzdGFydGRhdGUiLCJjdXJyZW50RGF0ZSIsImVuZERhdGUiLCJlbmRkYXRlIiwiYXBwX2lkIiwiYXBwX2tleSIsInNvdXJjZV9jaXR5X2NvZGUiLCJkZXN0aW5hdGlvbl9jaXR5X2NvZGUiLCJkYXlzIiwiZGF0ZSIsInRpY2tldF9kYXRhIiwiZ2V0RGF0YSIsInNvdXJjZV9jaXR5X2lkIiwiZGVzdGluYXRpb25fY2l0eV9pZCIsInZhbHVlIiwic2V0RGF0ZSIsImdldERhdGUiLCJzYXZlX2xpdmVfdGlja2V0IiwiZnJlZXplIiwiZ2V0VGltZSIs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QTBDLGdCQUExQyxDO0FBQ2pCZ0osZ0JBQUFBLEcsYUFBU0YsTUFBTSxDQUFDckUsTSxTQUFTcUUsTUFBTSxDQUFDcEUsTSxTQUFTcUUsYyxTQUFpQkQsTUFBTSxDQUFDdEQsWSxTQUFlc0QsTUFBTSxDQUFDeEUsUztBQUMzRjVFLGdCQUFBQSxNQUFNLENBQUNjLEdBQVAsQ0FBVyxNQUFYLEVBQW1Cb0csS0FBSyxHQUFDLENBQXpCLEVBQTRCb0MsR0FBNUI7QUFDQUYsZ0JBQUFBLE1BQU0sQ0FBQ0csS0FBUCxHQUFlRCxHQUFmOzt1QkFDTXhKLFNBQVMsQ0FBQ2tKLGdCQUFWLENBQTJCSSxNQUEzQixFQUFtQy9HLElBQW5DLENBQXdDLFVBQUF3RyxLQUFLLEVBQUksQ0FFdEQsQ0FGSyxFQUVIbkcsS0FGRyxDQUVHLFVBQUFDLE1BQU0sRUFBSTtBQUNmM0Msa0JBQUFBLE1BQU0sQ0FBQ2MsR0FBUCxDQUFXLE9BQVgsRUFBb0I2QixNQUFwQjtBQUNILGlCQUpLLEM7OztBQU5rQ3VFLGdCQUFBQSxLQUFLLEU7Ozs7Ozs7Ozs7O0FBY2pEbEgsZ0JBQUFBLE1BQU0sQ0FBQ2MsR0FBUCxDQUFXLE9BQVg7OztBQUVKLG9CQUFHcUksT0FBTyxJQUFJQSxPQUFPLENBQUM3RixNQUFSLElBQWdCLENBQTlCLEVBQ0l0RCxNQUFNLENBQUNjLEdBQVAsQ0FBVyxNQUFYLDRCQUFzQ3FJLE9BQU8sQ0FBQzdGLE1BQTlDO2tEQUVHLEM7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQUlmIiwic291cmNlc0NvbnRlbnQiOlsiLy9qc2hpbnQgZXN2ZXJzaW9uOiA2XHJcbi8vanNoaW50IGlnbm9yZTpzdGFydFxyXG5jb25zdCBjcm9uID0gcmVxdWlyZShcIm5vZGUtY3JvblwiKTtcclxuY29uc3QgZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xyXG5jb25zdCBmcyA9IHJlcXVpcmUoXCJmc1wiKTtcclxuXHJcbmNvbnN0IHV1aWR2NCA9IHJlcXVpcmUoJ3V1aWQvdjQnKTtcclxuY29uc3QgZGVsYXkgPSByZXF1aXJlKCdkZWxheScpO1xyXG5jb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxuY29uc3QgZmV0Y2ggPSByZXF1aXJlKCdpc29tb3JwaGljLWZldGNoJyk7XHJcbmNvbnN0IGRhdGFzdG9yZSA9IHJlcXVpcmUoJy4uLy4uL3JhZGhhcmFuaS9nb2liaWJvZGF0YXN0b3JlJyk7XHJcblxyXG5cclxuLy9pbXBvcnQgbW9tZW50IGZyb20gXCJtb21lbnRcIjtcclxuLy8gaW1wb3J0IFwiaXNvbW9ycGhpYy1mZXRjaFwiO1xyXG4vL2xldCB1cmwgPSBgaHR0cDovL2RldmVsb3Blci5nb2liaWJvLmNvbS9hcGkvc2VhcmNoLz9hcHBfaWQ9Zjg4MDMwODYmYXBwX2tleT0wMTJmODQ1NThhNTcyY2I0Y2NjNGI0Yzg0YTE1ZDUyMyZmb3JtYXQ9anNvbiZzb3VyY2U9Q0NVJmRlc3RpbmF0aW9uPURFTCZkYXRlb2ZkZXBhcnR1cmU9MjAxOTA1MjAmc2VhdGluZ2NsYXNzPUUmYWR1bHRzPTEmY2hpbGRyZW49MSZpbmZhbnRzPTEmY291bnRlcj0xMDBgO1xyXG5jb25zdCBHT0lCSUJPX1VSTCA9ICdodHRwOi8vZGV2ZWxvcGVyLmdvaWJpYm8uY29tL2FwaS9zZWFyY2gvPyc7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9nZ2VyIHtcclxuICAgIHN0YXRpYyBsb2codHlwZSwgbWVzc2FnZSkgeyBcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImluZm9cIjpcclxuICAgICAgICAgICAgTG9nZ2VyLl93cml0ZShhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ3YXJuaW5nXCI6XHJcbiAgICAgICAgICAgICAgICBMb2dnZXIuX3dyaXRlKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImVycm9yXCI6XHJcbiAgICAgICAgICAgICAgICBMb2dnZXIuX3dyaXRlKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgX3dyaXRlKHR5cGUpIHtcclxuICAgICAgICB2YXIgdGltZSA9IG1vbWVudCgpLmZvcm1hdChcIkhIOm1tOnNzLlNTU1wiKTtcclxuICAgICAgICAvL2FyZ3VtZW50cy5zcGxpY2UoMClcclxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LmZyb20oYXJndW1lbnRzWzBdKTtcclxuICAgICAgICB0eXBlID0gYXJnc1swXTtcclxuICAgICAgICBhcmdzLnNwbGljZSgwLDEpO1xyXG4gICAgXHJcbiAgICAgICAgYXJncy51bnNoaWZ0KHRpbWUpO1xyXG4gICAgICAgIGFyZ3MudW5zaGlmdCh0eXBlLnRvVXBwZXJDYXNlKCkpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3MpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgR09JQklCT0NyYXdsZXIge1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge3VybDogJycsIG91dHB1dDogJ2pzb24nLCB0b2tlbjogJycsIGFpcmxpbmVzOiBbXX07XHJcbiAgICB9XHJcblxyXG4gICAgcG9zdERhdGEoc2VhcmNoT3B0aW9uPXt1cmw6ICcnLCBkYXRhOiB7dXNySWQ6IDEwOSwgdXNyVHlwZTogJ04nfSwgdG9rZW46ICcnfSkge1xyXG4gICAgICAgIC8vIERlZmF1bHQgb3B0aW9ucyBhcmUgbWFya2VkIHdpdGggKlxyXG4gICAgICAgIGxldCBqc29uX3Bvc3QgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsIC8vICpHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBldGMuXHJcbiAgICAgICAgICAgIG1vZGU6IFwiY29yc1wiLCAvLyBuby1jb3JzLCBjb3JzLCAqc2FtZS1vcmlnaW5cclxuICAgICAgICAgICAgY2FjaGU6IFwibm8tY2FjaGVcIiwgLy8gKmRlZmF1bHQsIG5vLWNhY2hlLCByZWxvYWQsIGZvcmNlLWNhY2hlLCBvbmx5LWlmLWNhY2hlZFxyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCAvLyBpbmNsdWRlLCAqc2FtZS1vcmlnaW4sIG9taXRcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogYEJlYXJlciAke3RoaXMub3B0aW9ucy50b2tlbn1gLFxyXG4gICAgICAgICAgICAgICAgLy8gXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmVkaXJlY3Q6IFwiZm9sbG93XCIsIC8vIG1hbnVhbCwgKmZvbGxvdywgZXJyb3JcclxuICAgICAgICAgICAgcmVmZXJyZXI6IFwibm8tcmVmZXJyZXJcIiwgLy8gbm8tcmVmZXJyZXIsICpjbGllbnRcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoc2VhcmNoT3B0aW9uLmRhdGEpLCAvLyBib2R5IGRhdGEgdHlwZSBtdXN0IG1hdGNoIFwiQ29udGVudC1UeXBlXCIgaGVhZGVyXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHNlYXJjaE9wdGlvbi51cmwsIGpzb25fcG9zdClcclxuICAgICAgICAudGhlbihhc3luYyByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIC8vTG9nZ2VyLmxvZyhcImluZm9cIiwgXCJSZXNwb25zZSByZWNlaXZlZFwiKTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgICAgICB0aGlzLmZpbmFsRGF0YSA9IGF3YWl0IHRoaXMudHJhbnNmb3JtRGF0YSh0aGlzLmRhdGEpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHJlYXNvbiA9PiB7XHJcbiAgICAgICAgICAgIExvZ2dlci5sb2coXCJlcnJvclwiLCByZWFzb24pO1xyXG4gICAgICAgICAgICB0aHJvdyByZWFzb247XHJcbiAgICAgICAgfSk7IC8vIHBhcnNlcyBKU09OIHJlc3BvbnNlIGludG8gbmF0aXZlIEphdmFzY3JpcHQgb2JqZWN0cyBcclxuICAgIH1cclxuXHJcbiAgICBnZXREYXRhKHNlYXJjaE9wdGlvbj17dXJsOiAnJywgc3JjX2lkOiAwLCBkc3RfaWQ6IDAsIGRhdGE6IHt9fSkge1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IGpzb25fZ2V0ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIiwgLy8gKkdFVCwgUE9TVCwgUFVULCBERUxFVEUsIGV0Yy5cclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgZmV0Y2goc2VhcmNoT3B0aW9uLnVybCwganNvbl9nZXQpXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9Mb2dnZXIubG9nKFwiaW5mb1wiLCBcIlJlc3BvbnNlIHJlY2VpdmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmpzb24oKS50aGVuKHJlc3BvbnNlRGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaW5hbERhdGEgPSB0aGlzLnRyYW5zZm9ybURhdGEocmVzcG9uc2VEYXRhLCBzZWFyY2hPcHRpb24uc3JjX2lkLCBzZWFyY2hPcHRpb24uZHN0X2lkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmaW5hbERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKHJlYXNvbiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIExvZ2dlci5sb2cocmVhc29uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKHJlYXNvbiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgTG9nZ2VyLmxvZyhcImVycm9yXCIsIHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9KTsgLy8gcGFyc2VzIEpTT04gcmVzcG9uc2UgaW50byBuYXRpdmUgSmF2YXNjcmlwdCBvYmplY3RzICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaChleCkge1xyXG4gICAgICAgICAgICAgICAgTG9nZ2VyLmxvZygnZXJyb3InLCBleCk7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtRGF0YShkYXRhLCBzcmNfaWQsIGRzdF9pZCkge1xyXG4gICAgICAgIGlmKGRhdGE9PT1udWxsIHx8IGRhdGE9PT11bmRlZmluZWQgfHwgIWRhdGEuZGF0YSB8fCAhZGF0YS5kYXRhLm9ud2FyZGZsaWdodHMgfHwgZGF0YS5kYXRhLm9ud2FyZGZsaWdodHMubGVuZ3RoPT09MCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgcGFyc2VkRGF0YVNldCA9IFtdO1xyXG4gICAgICAgIGxldCBwYXJzZWRSZWNvcmQgPSB7fTtcclxuICAgICAgICBkYXRhID0gZGF0YS5kYXRhLm9ud2FyZGZsaWdodHM7XHJcblxyXG4gICAgICAgIGZvcih2YXIgaT0wOyBpPGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCBkYXRhSXRlbSA9IGRhdGFbaV07XHJcbiAgICAgICAgICAgICAgICBpZihwYXJzZUludChkYXRhSXRlbS5zZWF0c2F2YWlsYWJsZSk+MCAmJiBwYXJzZUludChkYXRhSXRlbS5zdG9wcyk9PT0wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRlcHRfZGF0ZSA9IG5ldyBEYXRlKGRhdGFJdGVtLmRlcGRhdGUuc3BsaXQoJ3QnKVswXSsnICcgKyBkYXRhSXRlbS5kZXB0aW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYXJydl9kYXRlID0gbmV3IERhdGUoZGF0YUl0ZW0uYXJyZGF0ZS5zcGxpdCgndCcpWzBdKycgJyArIGRhdGFJdGVtLmFycnRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhaXJsaW5laWQgPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYWlybGluZSA9IHRoaXMub3B0aW9ucy5haXJsaW5lcy5maW5kKChvYmopID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iai5haXJjb2RlLnRvTG93ZXJDYXNlKCk9PT1kYXRhSXRlbS5jYXJyaWVyaWQudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZihhaXJsaW5lIT09bnVsbCAmJiBhaXJsaW5lIT09dW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFpcmxpbmVpZCA9IGFpcmxpbmUuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3dlIHNob3VsZCBpbnNlcnQgbmV3IGFpcmxpbmUgaGVyZSBhbmQgdXBkYXRlIHRoZSBhaXJsaW5lIGNvZGVcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlZFJlY29yZCA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiBzcmNfaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbjogZGF0YUl0ZW0ub3JpZ2luLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IGRhdGFJdGVtLmRlc3RpbmF0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbjogZHN0X2lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wOiBwYXJzZUludChkYXRhSXRlbS5zdG9wcyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodDogZGF0YUl0ZW0uYWlybGluZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxpZ2h0X25vOiBkYXRhSXRlbS5mbGlnaHRubyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwYXJ0dXJlX2RhdGVfdGltZTogZGVwdF9kYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJpdmFsX2RhdGVfdGltZTogYXJydl9kYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ0Vjb25vbXknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXBhcnR1cmVfdGVybWluYWw6IGRhdGFJdGVtLmRlcHRlcm1pbmFsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJpdmFsX3Rlcm1pbmFsOiBkYXRhSXRlbS5hcnJ0ZXJtaW5hbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9fb2Zfc2VhdHM6IHBhcnNlSW50KGRhdGFJdGVtLnNlYXRzYXZhaWxhYmxlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZ2NsYXNzOiBkYXRhSXRlbS5ib29raW5nY2xhc3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFpcmxpbmU6IGFpcmxpbmVpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWlyY3JhZnRfdHlwZTogZGF0YUl0ZW0uYWlyY3JhZnRUeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJyaWVyaWQ6IGRhdGFJdGVtLmNhcnJpZXJpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWR1bHRiYXNlZmFyZTogcGFyc2VJbnQoJzAnK2RhdGFJdGVtLmZhcmUuYWR1bHRiYXNlZmFyZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkYmFzZWZhcmU6IHBhcnNlSW50KCcwJytkYXRhSXRlbS5mYXJlLmNoaWxkYmFzZWZhcmUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZhbnRiYXNlZmFyZTogcGFyc2VJbnQoJzAnK2RhdGFJdGVtLmZhcmUuaW5mYW50YmFzZWZhcmUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZHVsdF90YXhfZmVlczogcGFyc2VJbnQoJzAnK2RhdGFJdGVtLmZhcmUuYWR1bHR0b3RhbGZhcmUpIC0gcGFyc2VJbnQoJzAnK2RhdGFJdGVtLmZhcmUuYWR1bHRiYXNlZmFyZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkX3RheF9mZWVzOiBwYXJzZUludCgnMCcrZGF0YUl0ZW0uZmFyZS5jaGlsZHRvdGFsZmFyZSkgLSBwYXJzZUludCgnMCcrZGF0YUl0ZW0uZmFyZS5jaGlsZGJhc2VmYXJlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5mYW50X3RheF9mZWVzOiBwYXJzZUludCgnMCcrZGF0YUl0ZW0uZmFyZS5pbmZhbnR0b3RhbGZhcmUpIC0gcGFyc2VJbnQoJzAnK2RhdGFJdGVtLmZhcmUuaW5mYW50YmFzZWZhcmUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3YXJuaW5nOiBkYXRhSXRlbS53YXJuaW5ncyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlZF9ieTogMTA0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVkX29uOiBuZXcgRGF0ZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlZERhdGFTZXQucHVzaChwYXJzZWRSZWNvcmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIExvZ2dlci5sb2coJ2luZm8nLCAnRGF0YScsIEpTT04uc3RyaW5naWZ5KHBhcnNlZFJlY29yZCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgICAgIExvZ2dlci5sb2coJ2Vycm9yJywgZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJzZWREYXRhU2V0O1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIF9nZXRDaXJjbGVOYW1lKGNpcmNsZSwgaW5kZXgpIHtcclxuICAgICAgICBsZXQgY2lyY2xlTmFtZSA9ICcnO1xyXG4gICAgICAgIGlmKGNpcmNsZSE9PW51bGwgJiYgY2lyY2xlIT09dW5kZWZpbmVkICYmIGNpcmNsZS5pbmRleE9mKCd0bycpPi0xKSB7XHJcbiAgICAgICAgICAgIGxldCBjaXJjbGVzID0gY2lyY2xlLnNwbGl0KCd0bycpO1xyXG4gICAgICAgICAgICBpZihjaXJjbGVzLmxlbmd0aD4wKSB7XHJcbiAgICAgICAgICAgICAgICBjaXJjbGVOYW1lID0gY2lyY2xlc1tpbmRleF0udHJpbSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY2lyY2xlTmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBfZ2V0RGF0ZShzdHJEYXRlLCBzdHJUaW1lKSB7XHJcbiAgICAgICAgbGV0IGR0ID0gRGF0ZS5ub3coKTtcclxuICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgIGR0ID0gRGF0ZS5wYXJzZShgJHtzdHJEYXRlfSAke3N0clRpbWV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgTG9nZ2VyLmxvZygnZXJyb3InLCBlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkdDtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBwcm9jZXNzQ2lyY2xlRGF0YShjaXJjbGVEYXRhLCBvcHRpb25zKSB7XHJcbiAgICAgICAgbGV0IGxpdmVfdGlja2V0cyA9IFtdO1xyXG4gICAgICAgIGxldCBzdGFydERhdGUgPSBvcHRpb25zLnN0YXJ0ZGF0ZTtcclxuICAgICAgICBsZXQgY3VycmVudERhdGUgPSBvcHRpb25zLnN0YXJ0ZGF0ZTtcclxuICAgICAgICBsZXQgZW5kRGF0ZSA9IG9wdGlvbnMuZW5kZGF0ZTtcclxuICAgICAgICBsZXQgYXBwX2lkID0gb3B0aW9ucy5hcHBfaWQ7XHJcbiAgICAgICAgbGV0IGFwcF9rZXkgPSBvcHRpb25zLmFwcF9rZXk7XHJcbiAgICAgICAgbGV0IHNvdXJjZSA9IGNpcmNsZURhdGEuc291cmNlX2NpdHlfY29kZTtcclxuICAgICAgICBsZXQgZGVzdGluYXRpb24gPSBjaXJjbGVEYXRhLmRlc3RpbmF0aW9uX2NpdHlfY29kZTtcclxuICAgICAgICBsZXQgdXJsID0gJyc7XHJcblxyXG4gICAgICAgIGxldCBkYXlzID0gMTtcclxuICAgICAgICB3aGlsZShjdXJyZW50RGF0ZTw9ZW5kRGF0ZSkge1xyXG4gICAgICAgICAgICBsZXQgZGF0ZSA9IG1vbWVudChjdXJyZW50RGF0ZSkuZm9ybWF0KCdZWVlZTU1ERCcpO1xyXG4gICAgICAgICAgICB1cmwgPSBgJHtHT0lCSUJPX1VSTH1hcHBfaWQ9JHthcHBfaWR9JmFwcF9rZXk9JHthcHBfa2V5fSZmb3JtYXQ9anNvbiZzb3VyY2U9JHtzb3VyY2V9JmRlc3RpbmF0aW9uPSR7ZGVzdGluYXRpb259JmRhdGVvZmRlcGFydHVyZT0ke2RhdGV9JnNlYXRpbmdjbGFzcz1FJmFkdWx0PTEmY2hpbGRyZW49MCZpbmZhbnQ9MCZjb3VudGVyPTEwMGA7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgSW5kZXggOiAke2RheXN9YCk7XHJcbiAgICAgICAgICAgIGxldCB0aWNrZXRfZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmdldERhdGEoe3VybDogdXJsLCBzcmNfaWQ6IGNpcmNsZURhdGEuc291cmNlX2NpdHlfaWQsIGRzdF9pZDogY2lyY2xlRGF0YS5kZXN0aW5hdGlvbl9jaXR5X2lkfSlcclxuICAgICAgICAgICAgLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL0xvZ2dlci5sb2coJ2luZm8nLCAncmVjZWl2ZWQgdGlja2V0cyBhcmUgbnVsbCA/JywgKHZhbHVlPT09bnVsbCB8fCB2YWx1ZT09PXVuZGVmaW5lZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpY2tldF9kYXRhID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChyZWFzb24gPT4ge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgTG9nZ2VyLmxvZygnZXJyb3InLCByZWFzb24pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY3VycmVudERhdGUuc2V0RGF0ZShjdXJyZW50RGF0ZS5nZXREYXRlKCkgKyAxKTtcclxuICAgICAgICAgICAgaWYodGlja2V0X2RhdGEhPT1udWxsICYmIHRpY2tldF9kYXRhIT09dW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAvL0xvZ2dlci5sb2coJ2luZm8nLCAnR29pbmcgdG8gc2F2ZSBkYXRhJyk7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnNhdmVfbGl2ZV90aWNrZXQodGlja2V0X2RhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9Mb2dnZXIubG9nKCdpbmZvJywgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChyZWFzb24gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIExvZ2dlci5sb2coJ2Vycm9yJywgcmVhc29uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgbGl2ZV90aWNrZXRzLnB1c2godGlja2V0X2RhdGEpO1xyXG4gICAgICAgICAgICAgICAgLy8gTG9nZ2VyLmxvZygnaW5mbycsICdBZGRlZCB0byBjb2xsZWN0aW9uJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGRheXMrKztcclxuICAgICAgICAgICAgdGhpcy5mcmVlemUoMTUwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbGl2ZV90aWNrZXRzO1xyXG4gICAgfVxyXG5cclxuICAgIGZyZWV6ZSh0aW1lKSB7XHJcbiAgICAgICAgY29uc3Qgc3RvcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgdGltZTtcclxuICAgICAgICB3aGlsZShuZXcgRGF0ZSgpLmdldFRpbWUoKSA8IHN0b3ApOyAgICAgICBcclxuICAgIH0gICAgXHJcblxyXG4gICAgYXN5bmMgc2F2ZV9saXZlX3RpY2tldCh0aWNrZXRzKSB7XHJcbiAgICAgICAgaWYodGlja2V0cz09PW51bGwgfHwgdGlja2V0cz09PXVuZGVmaW5lZCB8fCB0aWNrZXRzLmxlbmd0aD09PTApIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cnlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aWNrZXRzLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGlja2V0ID0gdGlja2V0c1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICBsZXQgZGVwdF9kYXRlX3RpbWUgPSBtb21lbnQodGlja2V0LmRlcGFydHVyZV9kYXRlX3RpbWUpLmZvcm1hdCgnWVlZWU1NRERISG1tc3MnKTtcclxuICAgICAgICAgICAgICAgIGxldCBrZXkgPSBgJHt0aWNrZXQub3JpZ2lufSR7dGlja2V0LnRhcmdldH0ke2RlcHRfZGF0ZV90aW1lfSR7dGlja2V0LmJvb2tpbmdjbGFzc30ke3RpY2tldC5jYXJyaWVyaWR9YFxyXG4gICAgICAgICAgICAgICAgTG9nZ2VyLmxvZygnaW5mbycsIGluZGV4KzEsIGtleSk7XHJcbiAgICAgICAgICAgICAgICB0aWNrZXQucnVuaWQgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBkYXRhc3RvcmUuc2F2ZV9saXZlX3RpY2tldCh0aWNrZXQpLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vTG9nZ2VyLmxvZygnaW5mbycsICdkYXRhc3RvcmUuc2F2ZV9saXZlX3RpY2tldCcpO1xyXG4gICAgICAgICAgICAgICAgfSkuY2F0Y2gocmVhc29uID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBMb2dnZXIubG9nKCdlcnJvcicsIHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaChleCkge1xyXG4gICAgICAgICAgICBMb2dnZXIubG9nKCdlcnJvcicsIGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGlja2V0cyAmJiB0aWNrZXRzLmxlbmd0aD49MClcclxuICAgICAgICAgICAgTG9nZ2VyLmxvZygnaW5mbycsIGBUaWNrZXRzIGNvdW50IDogJHt0aWNrZXRzLmxlbmd0aH1gKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vanNoaW50IGlnbm9yZTplbmQiXX0=