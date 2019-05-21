"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _goibibocrawler = require("./goibibocrawler");

//jshint esversion: 6
var cron = require("node-cron");

var express = require("express");

var fs = require("fs");

var datastore = require('../../radharani/goibibodatastore'); //require("babel-core/register");
//require("babel-polyfill");


var uuidv4 = require('uuid/v4');

var moment = require('moment');

var SCAN_DAYS = 45;
//import { loggers } from 'winston';
var app = express();
var app_key = '012f84558a572cb4ccc4b4c84a15d523';
var app_id = 'f8803086';
var url = "http://developer.goibibo.com/api/search/?app_id=f8803086&app_key=012f84558a572cb4ccc4b4c84a15d523&format=json&source=CCU&destination=DEL&dateofdeparture=20190520&seatingclass=E&adults=1&children=0&infants=0&counter=100";

function startProcess() {
  return _startProcess.apply(this, arguments);
}

function _startProcess() {
  _startProcess = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var token, circleCrawlableData, airlineMasterData, goibibocrawler, index, circleData, dt, dt1, circleData4FullPeriod;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _goibibocrawler.Logger.log('info', "Starting process ...");

            token = '';
            _context.next = 4;
            return datastore.getCirclesWithDeptDates();

          case 4:
            circleCrawlableData = _context.sent;
            _context.next = 7;
            return datastore.getAirlineMasterData();

          case 7:
            airlineMasterData = _context.sent;
            goibibocrawler = new _goibibocrawler.GOIBIBOCrawler({
              url: '',
              output: 'json',
              token: token,
              airlines: airlineMasterData
            });

            if (!(circleCrawlableData !== null && circleCrawlableData !== undefined && circleCrawlableData.length > 0)) {
              _context.next = 25;
              break;
            }

            index = 0;

          case 11:
            if (!(index < circleCrawlableData.length)) {
              _context.next = 25;
              break;
            }

            circleData = circleCrawlableData[index];
            dt = new Date();
            dt1 = new Date();
            dt1.setDate(dt1.getDate() + SCAN_DAYS);
            _context.next = 18;
            return datastore.cleanCircleLiveTicketData(circleData, {
              startdate: dt,
              enddate: dt1,
              app_id: app_id,
              app_key: app_key,
              harddelete: false
            }).catch(function (reason) {
              //console.log(`Error1 : ${reason}`);
              _goibibocrawler.Logger.log('Error 1', reason);
            });

          case 18:
            _context.next = 20;
            return goibibocrawler.processCircleData(circleData, {
              startdate: dt,
              enddate: dt1,
              app_id: app_id,
              app_key: app_key
            }).catch(function (reason) {
              //console.log(`Error2 : ${reason}`);
              _goibibocrawler.Logger.log('Error 2', reason);
            });

          case 20:
            circleData4FullPeriod = _context.sent;

            if (circleData4FullPeriod !== null && circleData4FullPeriod !== undefined && circleData4FullPeriod.length > 0) {
              //now time to insert into DB live_tickets_tbl;
              _goibibocrawler.Logger.log("One circle completed ".concat(circleData.source_city_id, " - ").concat(circleData.destination_city_id));
            }

          case 22:
            index++;
            _context.next = 11;
            break;

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _startProcess.apply(this, arguments);
}

var excutionStarted = false; // cron.schedule("*/10 * * * *", function() {
//     Logger.log("info", "Cron started");
//     if(excutionStarted) {
//         Logger.log("info", 'Previous process still running ...');
//         return false;
//     }

try {
  excutionStarted = true;
  process.on('unhandledRejection', function (reason, promise) {
    _goibibocrawler.Logger.log('info', 'Unhandled Rejection at:', reason);
  });
  startProcess();
  process.removeAllListeners("unhandledRejection");
  process.removeAllListeners('exit');
  process.removeAllListeners();
} catch (e) {
  _goibibocrawler.Logger.log('error', e);
} finally {
  excutionStarted = false;
} // });
// app.listen("3238");
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9nb2liaWJvL2luZGV4Z29pYmliby5qcyJdLCJuYW1lcyI6WyJjcm9uIiwicmVxdWlyZSIsImV4cHJlc3MiLCJmcyIsImRhdGFzdG9yZSIsInV1aWR2NCIsIm1vbWVudCIsIlNDQU5fREFZUyIsImFwcCIsImFwcF9rZXkiLCJhcHBfaWQiLCJ1cmwiLCJzdGFydFByb2Nlc3MiLCJMb2dnZXIiLCJsb2ciLCJ0b2tlbiIsImdldENpcmNsZXNXaXRoRGVwdERhdGVzIiwiY2lyY2xlQ3Jhd2xhYmxlRGF0YSIsImdldEFpcmxpbmVNYXN0ZXJEYXRhIiwiYWlybGluZU1hc3RlckRhdGEiLCJnb2liaWJvY3Jhd2xlciIsIkdPSUJJQk9DcmF3bGVyIiwib3V0cHV0IiwiYWlybGluZXMiLCJ1bmRlZmluZWQiLCJsZW5ndGgiLCJpbmRleCIsImNpcmNsZURhdGEiLCJkdCIsIkRhdGUiLCJkdDEiLCJzZXREYXRlIiwiZ2V0RGF0ZSIsImNsZWFuQ2lyY2xlTGl2ZVRpY2tldERhdGEiLCJzdGFydGRhdGUiLCJlbmRkYXRlIiwiaGFyZGRlbGV0ZSIsImNhdGNoIiwicmVhc29uIiwicHJvY2Vzc0NpcmNsZURhdGEiLCJjaXJjbGVEYXRhNEZ1bGxQZXJpb2QiLCJzb3VyY2VfY2l0eV9pZCIsImRlc3RpbmF0aW9uX2NpdHlfaWQiLCJleGN1dGlvblN0YXJ0ZWQiLCJwcm9jZXNzIiwib24iLCJwcm9taXNlIiwicmVtb3ZlQWxsTGlzdGVuZXJzIiwiZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFhQTs7QUFiQTtBQUNBLElBQU1BLElBQUksR0FBR0MsT0FBTyxDQUFDLFdBQUQsQ0FBcEI7O0FBQ0EsSUFBTUMsT0FBTyxHQUFHRCxPQUFPLENBQUMsU0FBRCxDQUF2Qjs7QUFDQSxJQUFNRSxFQUFFLEdBQUdGLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUNBLElBQU1HLFNBQVMsR0FBR0gsT0FBTyxDQUFDLGtDQUFELENBQXpCLEMsQ0FDQTtBQUNBOzs7QUFFQSxJQUFN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QW1DYSxVQUFVLENBQUNjLGNBQTlDLGdCQUFrRWQsVUFBVSxDQUFDZSxtQkFBN0U7QUFDSDs7QUE3QmI7QUFVZ0VoQixZQUFBQSxLQUFLLEVBVnJFO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHOzs7O0FBNERBLElBQUlpQixlQUFlLEdBQUcsS0FBdEIsQyxDQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFSSxJQUNBO0FBQ0lBLEVBQUFBLGVBQWUsR0FBRyxJQUFsQjtBQUNBQyxFQUFBQSxPQUFPLENBQUNDLEVBQVIsQ0FBVyxvQkFBWCxFQUFpQyxVQUFDUCxNQUFELEVBQVNRLE9BQVQsRUFBcUI7QUFDbERqQywyQkFBT0MsR0FBUCxDQUFXLE1BQVgsRUFBa0IseUJBQWxCLEVBQTZDd0IsTUFBN0M7QUFDSCxHQUZEO0FBR0ExQixFQUFBQSxZQUFZO0FBQ1pnQyxFQUFBQSxPQUFPLENBQUNHLGtCQUFSLENBQTJCLG9CQUEzQjtBQUNBSCxFQUFBQSxPQUFPLENBQUNHLGtCQUFSLENBQTJCLE1BQTNCO0FBQ0FILEVBQUFBLE9BQU8sQ0FBQ0csa0JBQVI7QUFDSCxDQVZELENBV0EsT0FBTUMsQ0FBTixFQUFTO0FBQ0xuQyx5QkFBT0MsR0FBUCxDQUFXLE9BQVgsRUFBb0JrQyxDQUFwQjtBQUNILENBYkQsU0FjUTtBQUNKTCxFQUFBQSxlQUFlLEdBQUcsS0FBbEI7QUFDSCxDLENBQ0w7QUFFQSIsInNvdXJjZXNDb250ZW50IjpbIi8vanNoaW50IGVzdmVyc2lvbjogNlxuY29uc3QgY3JvbiA9IHJlcXVpcmUoXCJub2RlLWNyb25cIik7XG5jb25zdCBleHByZXNzID0gcmVxdWlyZShcImV4cHJlc3NcIik7XG5jb25zdCBmcyA9IHJlcXVpcmUoXCJmc1wiKTtcbmNvbnN0IGRhdGFzdG9yZSA9IHJlcXVpcmUoJy4uLy4uL3JhZGhhcmFuaS9nb2liaWJvZGF0YXN0b3JlJyk7XG4vL3JlcXVpcmUoXCJiYWJlbC1jb3JlL3JlZ2lzdGVyXCIpO1xuLy9yZXF1aXJlKFwiYmFiZWwtcG9seWZpbGxcIik7XG5cbmNvbnN0IHV1aWR2NCA9IHJlcXVpcmUoJ3V1aWQvdjQnKTtcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xuXG5jb25zdCBTQ0FOX0RBWVMgPSA0NTtcblxuaW1wb3J0IHtMb2dnZXIsIEdPSUJJQk9DcmF3bGVyfSBmcm9tICcuL2dvaWJpYm9jcmF3bGVyJztcbi8vaW1wb3J0IHsgbG9nZ2VycyB9IGZyb20gJ3dpbnN0b24nO1xuXG5sZXQgYXBwID0gZXhwcmVzcygpO1xuXG5sZXQgYXBwX2tleSA9ICcwMTJmODQ1NThhNTcyY2I0Y2NjNGI0Yzg0YTE1ZDUyMyc7XG5sZXQgYXBwX2lkID0gJ2Y4ODAzMDg2JztcbmxldCB1cmwgPSBgaHR0cDovL2RldmVsb3Blci5nb2liaWJvLmNvbS9hcGkvc2VhcmNoLz9hcHBfaWQ9Zjg4MDMwODYmYXBwX2tleT0wMTJmODQ1NThhNTcyY2I0Y2NjNGI0Yzg0YTE1ZDUyMyZmb3JtYXQ9anNvbiZzb3VyY2U9Q0NVJmRlc3RpbmF0aW9uPURFTCZkYXRlb2ZkZXBhcnR1cmU9MjAxOTA1MjAmc2VhdGluZ2NsYXNzPUUmYWR1bHRzPTEmY2hpbGRyZW49MCZpbmZhbnRzPTAmY291bnRlcj0xMDBgO1xuXG5hc3luYyBmdW5jdGlvbiBzdGFydFByb2Nlc3MoKSB7XG4gICAgTG9nZ2VyLmxvZygnaW5mbycsIFwiU3RhcnRpbmcgcHJvY2VzcyAuLi5cIik7XG4gICAgbGV0IHRva2VuID0gJyc7XG5cbiAgICBsZXQgY2lyY2xlQ3Jhd2xhYmxlRGF0YSA9IGF3YWl0IGRhdGFzdG9yZS5nZXRDaXJjbGVzV2l0aERlcHREYXRlcygpO1xuICAgIGxldCBhaXJsaW5lTWFzdGVyRGF0YSA9IGF3YWl0IGRhdGFzdG9yZS5nZXRBaXJsaW5lTWFzdGVyRGF0YSgpO1xuICAgIGxldCBnb2liaWJvY3Jhd2xlciA9IG5ldyBHT0lCSUJPQ3Jhd2xlcih7dXJsOiAnJywgb3V0cHV0OiAnanNvbicsIHRva2VuOiB0b2tlbiwgYWlybGluZXM6IGFpcmxpbmVNYXN0ZXJEYXRhfSk7XG5cbiAgICBpZihjaXJjbGVDcmF3bGFibGVEYXRhICE9PSBudWxsICYmIGNpcmNsZUNyYXdsYWJsZURhdGEgIT09IHVuZGVmaW5lZCAmJiBjaXJjbGVDcmF3bGFibGVEYXRhLmxlbmd0aD4wKSB7XG4gICAgICAgIC8vY2lyY2xlQ3Jhd2xhYmxlRGF0YS5mb3JFYWNoKGNpcmNsZURhdGEgPT4ge1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgY2lyY2xlQ3Jhd2xhYmxlRGF0YS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IGNpcmNsZURhdGEgPSBjaXJjbGVDcmF3bGFibGVEYXRhW2luZGV4XTtcbiAgICAgICAgICAgIGxldCBkdCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBsZXQgZHQxID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGR0MS5zZXREYXRlKGR0MS5nZXREYXRlKCkrU0NBTl9EQVlTKTtcbiAgICAgICAgICAgIGF3YWl0IGRhdGFzdG9yZS5jbGVhbkNpcmNsZUxpdmVUaWNrZXREYXRhKGNpcmNsZURhdGEsIHtzdGFydGRhdGU6IGR0LCBlbmRkYXRlOiBkdDEsIGFwcF9pZDogYXBwX2lkLCBhcHBfa2V5OiBhcHBfa2V5LCBoYXJkZGVsZXRlOiBmYWxzZX0pLmNhdGNoKHJlYXNvbiA9PiB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhgRXJyb3IxIDogJHtyZWFzb259YCk7XG4gICAgICAgICAgICAgICAgTG9nZ2VyLmxvZygnRXJyb3IgMScsIHJlYXNvbik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGV0IGNpcmNsZURhdGE0RnVsbFBlcmlvZCA9IGF3YWl0IGdvaWJpYm9jcmF3bGVyLnByb2Nlc3NDaXJjbGVEYXRhKGNpcmNsZURhdGEsIHtzdGFydGRhdGU6IGR0LCBlbmRkYXRlOiBkdDEsIGFwcF9pZDogYXBwX2lkLCBhcHBfa2V5OiBhcHBfa2V5fSkuY2F0Y2gocmVhc29uID0+IHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGBFcnJvcjIgOiAke3JlYXNvbn1gKTtcbiAgICAgICAgICAgICAgICBMb2dnZXIubG9nKCdFcnJvciAyJywgcmVhc29uKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZihjaXJjbGVEYXRhNEZ1bGxQZXJpb2QhPT1udWxsICYmIGNpcmNsZURhdGE0RnVsbFBlcmlvZCE9PXVuZGVmaW5lZCAmJiBjaXJjbGVEYXRhNEZ1bGxQZXJpb2QubGVuZ3RoPjApIHtcbiAgICAgICAgICAgICAgICAvL25vdyB0aW1lIHRvIGluc2VydCBpbnRvIERCIGxpdmVfdGlja2V0c190Ymw7XG4gICAgICAgICAgICAgICAgTG9nZ2VyLmxvZyhgT25lIGNpcmNsZSBjb21wbGV0ZWQgJHtjaXJjbGVEYXRhLnNvdXJjZV9jaXR5X2lkfSAtICR7Y2lyY2xlRGF0YS5kZXN0aW5hdGlvbl9jaXR5X2lkfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gbGV0IHJlc3BvbnNlID0gZTJmY3Jhd2xlci5wb3N0RGF0YSh7dXJsOiAnaHR0cHM6Ly9leHByZXNzZGV2LmVhc2UyZmx5LmNvbS9hcGkvZGVzdGluYXRpb25zL2dldC1kZXN0aW5hdGlvbnMtbGlzdCcsIGRhdGE6IHtcbiAgICAvLyAgICAgdXNySWQ6IDEwOSxcbiAgICAvLyAgICAgdXNyVHlwZTogXCJOXCJcbiAgICAvLyB9LCB0b2tlbjogdG9rZW59KTtcblxuICAgIC8vIHJlc3BvbnNlLnRoZW4oZGF0YSA9PiB7XG4gICAgLy8gICAgIExvZ2dlci5sb2coXCJpbmZvXCIsIEpTT04uc3RyaW5naWZ5KGRhdGEucmVzdWx0KSk7XG5cbiAgICAvLyAgICAgTG9nZ2VyLmxvZygnaW5mbycsIEpTT04uc3RyaW5naWZ5KGUyZmNyYXdsZXIuZmluYWxEYXRhKSk7XG5cbiAgICAvLyAgICAgbGV0IHJ1bmlkID0gYCR7dXVpZHY0KCl9XyR7bW9tZW50KCkuZm9ybWF0KFwiREQtTU1NLVlZWVkgSEg6bW06c3MuU1NTXCIpfWA7XG4gICAgLy8gICAgIGRhdHN0b3JlLnNhdmVDaXJjbGVCYXRjaERhdGEocnVuaWQsIGUyZmNyYXdsZXIuZmluYWxEYXRhLCBcIlwiLCBmdW5jdGlvbihycmlkKSB7XG4gICAgLy8gICAgICAgICBkYXRzdG9yZS5maW5hbGl6YXRpb24ocnJpZCwgKCkgPT4ge1xuICAgIC8vICAgICAgICAgICAgIExvZ2dlci5sb2coJ2luZm8nLCAnRmluaXNoZWQnKTtcblxuICAgIC8vICAgICAgICAgICAgIHByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzKFwidW5oYW5kbGVkUmVqZWN0aW9uXCIpO1xuICAgIC8vICAgICAgICAgICAgIHByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzKCdleGl0Jyk7XG4gICAgLy8gICAgICAgICAgICAgcHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICAvLyAgICAgICAgICAgICByZXR1cm47XG4gICAgLy8gICAgICAgICB9KTtcbiAgICAvLyAgICAgICAgIHJldHVybjtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgIC8vICAgICBMb2dnZXIubG9nKFwiZXJyb3JcIiwgZXJyb3IpO1xuICAgIC8vIH0pO1xufVxuXG52YXIgZXhjdXRpb25TdGFydGVkID0gZmFsc2U7XG4vLyBjcm9uLnNjaGVkdWxlKFwiKi8xMCAqICogKiAqXCIsIGZ1bmN0aW9uKCkge1xuLy8gICAgIExvZ2dlci5sb2coXCJpbmZvXCIsIFwiQ3JvbiBzdGFydGVkXCIpO1xuLy8gICAgIGlmKGV4Y3V0aW9uU3RhcnRlZCkge1xuLy8gICAgICAgICBMb2dnZXIubG9nKFwiaW5mb1wiLCAnUHJldmlvdXMgcHJvY2VzcyBzdGlsbCBydW5uaW5nIC4uLicpO1xuLy8gICAgICAgICByZXR1cm4gZmFsc2U7XG4vLyAgICAgfVxuXG4gICAgdHJ5XG4gICAge1xuICAgICAgICBleGN1dGlvblN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICBwcm9jZXNzLm9uKCd1bmhhbmRsZWRSZWplY3Rpb24nLCAocmVhc29uLCBwcm9taXNlKSA9PiB7XG4gICAgICAgICAgICBMb2dnZXIubG9nKCdpbmZvJywnVW5oYW5kbGVkIFJlamVjdGlvbiBhdDonLCByZWFzb24pO1xuICAgICAgICB9KTtcbiAgICAgICAgc3RhcnRQcm9jZXNzKCk7XG4gICAgICAgIHByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzKFwidW5oYW5kbGVkUmVqZWN0aW9uXCIpO1xuICAgICAgICBwcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycygnZXhpdCcpO1xuICAgICAgICBwcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICAgIH1cbiAgICBjYXRjaChlKSB7XG4gICAgICAgIExvZ2dlci5sb2coJ2Vycm9yJywgZSk7XG4gICAgfVxuICAgIGZpbmFsbHkge1xuICAgICAgICBleGN1dGlvblN0YXJ0ZWQgPSBmYWxzZTtcbiAgICB9XG4vLyB9KTtcblxuLy8gYXBwLmxpc3RlbihcIjMyMzhcIik7XG4iXX0=