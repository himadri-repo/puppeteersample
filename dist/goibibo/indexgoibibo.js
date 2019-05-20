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

//import { loggers } from 'winston';
var app = express();
var app_key = '012f84558a572cb4ccc4b4c84a15d523';
var app_id = 'f8803086';
var url = "http://developer.goibibo.com/api/search/?app_id=f8803086&app_key=012f84558a572cb4ccc4b4c84a15d523&format=json&source=CCU&destination=DEL&dateofdeparture=20190520&seatingclass=E&adults=1&children=1&infants=1&counter=100";

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
              _context.next = 23;
              break;
            }

            index = 0;

          case 11:
            if (!(index < circleCrawlableData.length)) {
              _context.next = 23;
              break;
            }

            circleData = circleCrawlableData[index];
            dt = new Date();
            dt1 = new Date();
            dt1.setDate(dt1.getDate() + 45);
            _context.next = 18;
            return goibibocrawler.processCircleData(circleData, {
              startdate: dt,
              enddate: dt1,
              app_id: app_id,
              app_key: app_key
            }).catch(function (reason) {
              console.log(reason);
            });

          case 18:
            circleData4FullPeriod = _context.sent;

            if (circleData4FullPeriod !== null && circleData4FullPeriod !== undefined && circleData4FullPeriod.length > 0) {//now time to insert into DB live_tickets_tbl;
            }

          case 20:
            index++;
            _context.next = 11;
            break;

          case 23:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9nb2liaWJvL2luZGV4Z29pYmliby5qcyJdLCJuYW1lcyI6WyJjcm9uIiwicmVxdWlyZSIsImV4cHJlc3MiLCJmcyIsImRhdGFzdG9yZSIsInV1aWR2NCIsIm1vbWVudCIsImFwcCIsImFwcF9rZXkiLCJhcHBfaWQiLCJ1cmwiLCJzdGFydFByb2Nlc3MiLCJMb2dnZXIiLCJsb2ciLCJ0b2tlbiIsImdldENpcmNsZXNXaXRoRGVwdERhdGVzIiwiY2lyY2xlQ3Jhd2xhYmxlRGF0YSIsImdldEFpcmxpbmVNYXN0ZXJEYXRhIiwiYWlybGluZU1hc3RlckRhdGEiLCJnb2liaWJvY3Jhd2xlciIsIkdPSUJJQk9DcmF3bGVyIiwib3V0cHV0IiwiYWlybGluZXMiLCJ1bmRlZmluZWQiLCJsZW5ndGgiLCJpbmRleCIsImNpcmNsZURhdGEiLCJkdCIsIkRhdGUiLCJkdDEiLCJzZXREYXRlIiwiZ2V0RGF0ZSIsInByb2Nlc3NDaXJjbGVEYXRhIiwic3RhcnRkYXRlIiwiZW5kZGF0ZSIsImNhdGNoIiwicmVhc29uIiwiY29uc29sZSIsImNpcmNsZURhdGE0RnVsbFBlcmlvZCIsImV4Y3V0aW9uU3RhcnRlZCIsInByb2Nlc3MiLCJvbiIsInByb21pc2UiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQVdBOztBQVhBO0FBQ0EsSUFBTUEsSUFBSSxHQUFHQyxPQUFPLENBQUMsV0FBRCxDQUFwQjs7QUFDQSxJQUFNQyxPQUFPLEdBQUdELE9BQU8sQ0FBQyxTQUFELENBQXZCOztBQUNBLElBQU1FLEVBQUUsR0FBR0YsT0FBTyxDQUFDLElBQUQsQ0FBbEI7O0FBQ0EsSUFBTUcsU0FBUyxHQUFHSCxPQUFPLENBQUMsa0NBQUQsQ0FBekIsQyxDQUNBO0FBQ0E7OztBQUVBLElBQU1JLE1BQU0sR0FBR0osT0FBTyxDQUFDLFNBQUQsQ0FBdEI7O0FBQ0EsSUFBTUssTUFBTSxHQUFHTCxPQUFPLENBQUMsUUFBRCxDQUF0Qjs7QUFH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LENBVkQsQ0FXQSxPQUFNQyxDQUFOLEVBQVM7QUFDTGhDLHlCQUFPQyxHQUFQLENBQVcsT0FBWCxFQUFvQitCLENBQXBCO0FBQ0gsQ0FiRCxTQWNRO0FBQ0pMLEVBQUFBLGVBQWUsR0FBRyxLQUFsQjtBQUNILEMsQ0FDTDtBQUVBIiwic291cmNlc0NvbnRlbnQiOlsiLy9qc2hpbnQgZXN2ZXJzaW9uOiA2XG5jb25zdCBjcm9uID0gcmVxdWlyZShcIm5vZGUtY3JvblwiKTtcbmNvbnN0IGV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcbmNvbnN0IGZzID0gcmVxdWlyZShcImZzXCIpO1xuY29uc3QgZGF0YXN0b3JlID0gcmVxdWlyZSgnLi4vLi4vcmFkaGFyYW5pL2dvaWJpYm9kYXRhc3RvcmUnKTtcbi8vcmVxdWlyZShcImJhYmVsLWNvcmUvcmVnaXN0ZXJcIik7XG4vL3JlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcblxuY29uc3QgdXVpZHY0ID0gcmVxdWlyZSgndXVpZC92NCcpO1xuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XG5cbmltcG9ydCB7TG9nZ2VyLCBHT0lCSUJPQ3Jhd2xlcn0gZnJvbSAnLi9nb2liaWJvY3Jhd2xlcic7XG4vL2ltcG9ydCB7IGxvZ2dlcnMgfSBmcm9tICd3aW5zdG9uJztcblxubGV0IGFwcCA9IGV4cHJlc3MoKTtcblxubGV0IGFwcF9rZXkgPSAnMDEyZjg0NTU4YTU3MmNiNGNjYzRiNGM4NGExNWQ1MjMnO1xubGV0IGFwcF9pZCA9ICdmODgwMzA4Nic7XG5sZXQgdXJsID0gYGh0dHA6Ly9kZXZlbG9wZXIuZ29pYmliby5jb20vYXBpL3NlYXJjaC8/YXBwX2lkPWY4ODAzMDg2JmFwcF9rZXk9MDEyZjg0NTU4YTU3MmNiNGNjYzRiNGM4NGExNWQ1MjMmZm9ybWF0PWpzb24mc291cmNlPUNDVSZkZXN0aW5hdGlvbj1ERUwmZGF0ZW9mZGVwYXJ0dXJlPTIwMTkwNTIwJnNlYXRpbmdjbGFzcz1FJmFkdWx0cz0xJmNoaWxkcmVuPTEmaW5mYW50cz0xJmNvdW50ZXI9MTAwYDtcblxuYXN5bmMgZnVuY3Rpb24gc3RhcnRQcm9jZXNzKCkge1xuICAgIExvZ2dlci5sb2coJ2luZm8nLCBcIlN0YXJ0aW5nIHByb2Nlc3MgLi4uXCIpO1xuICAgIGxldCB0b2tlbiA9ICcnO1xuXG4gICAgbGV0IGNpcmNsZUNyYXdsYWJsZURhdGEgPSBhd2FpdCBkYXRhc3RvcmUuZ2V0Q2lyY2xlc1dpdGhEZXB0RGF0ZXMoKTtcbiAgICBsZXQgYWlybGluZU1hc3RlckRhdGEgPSBhd2FpdCBkYXRhc3RvcmUuZ2V0QWlybGluZU1hc3RlckRhdGEoKTtcbiAgICBsZXQgZ29pYmlib2NyYXdsZXIgPSBuZXcgR09JQklCT0NyYXdsZXIoe3VybDogJycsIG91dHB1dDogJ2pzb24nLCB0b2tlbjogdG9rZW4sIGFpcmxpbmVzOiBhaXJsaW5lTWFzdGVyRGF0YX0pO1xuXG4gICAgaWYoY2lyY2xlQ3Jhd2xhYmxlRGF0YSAhPT0gbnVsbCAmJiBjaXJjbGVDcmF3bGFibGVEYXRhICE9PSB1bmRlZmluZWQgJiYgY2lyY2xlQ3Jhd2xhYmxlRGF0YS5sZW5ndGg+MCkge1xuICAgICAgICAvL2NpcmNsZUNyYXdsYWJsZURhdGEuZm9yRWFjaChjaXJjbGVEYXRhID0+IHtcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGNpcmNsZUNyYXdsYWJsZURhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxldCBjaXJjbGVEYXRhID0gY2lyY2xlQ3Jhd2xhYmxlRGF0YVtpbmRleF07XG4gICAgICAgICAgICBsZXQgZHQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgbGV0IGR0MSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBkdDEuc2V0RGF0ZShkdDEuZ2V0RGF0ZSgpKzQ1KTtcbiAgICAgICAgICAgIGxldCBjaXJjbGVEYXRhNEZ1bGxQZXJpb2QgPSBhd2FpdCBnb2liaWJvY3Jhd2xlci5wcm9jZXNzQ2lyY2xlRGF0YShjaXJjbGVEYXRhLCB7c3RhcnRkYXRlOiBkdCwgZW5kZGF0ZTogZHQxLCBhcHBfaWQ6IGFwcF9pZCwgYXBwX2tleTogYXBwX2tleX0pLmNhdGNoKHJlYXNvbiA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVhc29uKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZihjaXJjbGVEYXRhNEZ1bGxQZXJpb2QhPT1udWxsICYmIGNpcmNsZURhdGE0RnVsbFBlcmlvZCE9PXVuZGVmaW5lZCAmJiBjaXJjbGVEYXRhNEZ1bGxQZXJpb2QubGVuZ3RoPjApIHtcbiAgICAgICAgICAgICAgICAvL25vdyB0aW1lIHRvIGluc2VydCBpbnRvIERCIGxpdmVfdGlja2V0c190Ymw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBsZXQgcmVzcG9uc2UgPSBlMmZjcmF3bGVyLnBvc3REYXRhKHt1cmw6ICdodHRwczovL2V4cHJlc3NkZXYuZWFzZTJmbHkuY29tL2FwaS9kZXN0aW5hdGlvbnMvZ2V0LWRlc3RpbmF0aW9ucy1saXN0JywgZGF0YToge1xuICAgIC8vICAgICB1c3JJZDogMTA5LFxuICAgIC8vICAgICB1c3JUeXBlOiBcIk5cIlxuICAgIC8vIH0sIHRva2VuOiB0b2tlbn0pO1xuXG4gICAgLy8gcmVzcG9uc2UudGhlbihkYXRhID0+IHtcbiAgICAvLyAgICAgTG9nZ2VyLmxvZyhcImluZm9cIiwgSlNPTi5zdHJpbmdpZnkoZGF0YS5yZXN1bHQpKTtcblxuICAgIC8vICAgICBMb2dnZXIubG9nKCdpbmZvJywgSlNPTi5zdHJpbmdpZnkoZTJmY3Jhd2xlci5maW5hbERhdGEpKTtcblxuICAgIC8vICAgICBsZXQgcnVuaWQgPSBgJHt1dWlkdjQoKX1fJHttb21lbnQoKS5mb3JtYXQoXCJERC1NTU0tWVlZWSBISDptbTpzcy5TU1NcIil9YDtcbiAgICAvLyAgICAgZGF0c3RvcmUuc2F2ZUNpcmNsZUJhdGNoRGF0YShydW5pZCwgZTJmY3Jhd2xlci5maW5hbERhdGEsIFwiXCIsIGZ1bmN0aW9uKHJyaWQpIHtcbiAgICAvLyAgICAgICAgIGRhdHN0b3JlLmZpbmFsaXphdGlvbihycmlkLCAoKSA9PiB7XG4gICAgLy8gICAgICAgICAgICAgTG9nZ2VyLmxvZygnaW5mbycsICdGaW5pc2hlZCcpO1xuXG4gICAgLy8gICAgICAgICAgICAgcHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMoXCJ1bmhhbmRsZWRSZWplY3Rpb25cIik7XG4gICAgLy8gICAgICAgICAgICAgcHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ2V4aXQnKTtcbiAgICAvLyAgICAgICAgICAgICBwcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICAgIC8vICAgICAgICAgICAgIHJldHVybjtcbiAgICAvLyAgICAgICAgIH0pO1xuICAgIC8vICAgICAgICAgcmV0dXJuO1xuICAgIC8vICAgICB9KTtcbiAgICAvLyB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgLy8gICAgIExvZ2dlci5sb2coXCJlcnJvclwiLCBlcnJvcik7XG4gICAgLy8gfSk7XG59XG5cbnZhciBleGN1dGlvblN0YXJ0ZWQgPSBmYWxzZTtcbi8vIGNyb24uc2NoZWR1bGUoXCIqLzEwICogKiAqICpcIiwgZnVuY3Rpb24oKSB7XG4vLyAgICAgTG9nZ2VyLmxvZyhcImluZm9cIiwgXCJDcm9uIHN0YXJ0ZWRcIik7XG4vLyAgICAgaWYoZXhjdXRpb25TdGFydGVkKSB7XG4vLyAgICAgICAgIExvZ2dlci5sb2coXCJpbmZvXCIsICdQcmV2aW91cyBwcm9jZXNzIHN0aWxsIHJ1bm5pbmcgLi4uJyk7XG4vLyAgICAgICAgIHJldHVybiBmYWxzZTtcbi8vICAgICB9XG5cbiAgICB0cnlcbiAgICB7XG4gICAgICAgIGV4Y3V0aW9uU3RhcnRlZCA9IHRydWU7XG4gICAgICAgIHByb2Nlc3Mub24oJ3VuaGFuZGxlZFJlamVjdGlvbicsIChyZWFzb24sIHByb21pc2UpID0+IHtcbiAgICAgICAgICAgIExvZ2dlci5sb2coJ2luZm8nLCdVbmhhbmRsZWQgUmVqZWN0aW9uIGF0OicsIHJlYXNvbik7XG4gICAgICAgIH0pO1xuICAgICAgICBzdGFydFByb2Nlc3MoKTtcbiAgICAgICAgcHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMoXCJ1bmhhbmRsZWRSZWplY3Rpb25cIik7XG4gICAgICAgIHByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzKCdleGl0Jyk7XG4gICAgICAgIHByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gICAgfVxuICAgIGNhdGNoKGUpIHtcbiAgICAgICAgTG9nZ2VyLmxvZygnZXJyb3InLCBlKTtcbiAgICB9XG4gICAgZmluYWxseSB7XG4gICAgICAgIGV4Y3V0aW9uU3RhcnRlZCA9IGZhbHNlO1xuICAgIH1cbi8vIH0pO1xuXG4vLyBhcHAubGlzdGVuKFwiMzIzOFwiKTtcbiJdfQ==