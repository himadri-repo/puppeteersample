"use strict";

var _mptcrwler = require("./mptcrwler");

//jshint esversion: 6
var cron = require("node-cron");

var express = require("express");

var fs = require("fs");

var datstore = require('../../radharani/mptdatastore'); //require("babel-core/register");
//require("babel-polyfill");


var uuidv4 = require('uuid/v4');

var moment = require('moment');

//import { loggers } from 'winston';
var app = express();

function login() {
  _mptcrwler.Logger.log('info', "Logging in ...");

  var mptcrawler = new _mptcrwler.MPTCrawler({
    url: '',
    output: 'json'
  });
  var response = mptcrawler.getData({
    url: 'https://fd.metropolitantravels.com/api/flights?_=1557470967694',
    data: {
      email: "radharaniholidays@gmail.com",
      pwd: "Sumit@12356"
    }
  });
  response.then(function (data) {
    _mptcrwler.Logger.log("info", JSON.stringify(data.result));

    _mptcrwler.Logger.log('info', JSON.stringify(mptcrawler.finalData));

    var token = data.result.token;
    startProcess(token); //let runid = `${uuidv4()}_${moment().format("DD-MMM-YYYY HH:mm:ss.SSS")}`;
  })["catch"](function (error) {
    _mptcrwler.Logger.log("error", error);
  });
}

function startProcess(token) {
  _mptcrwler.Logger.log('info', "Starting process ...");

  var mptcrawler = new _mptcrwler.MPTCrawler({
    url: '',
    output: 'json',
    token: token
  });
  var response = mptcrawler.getData({
    url: 'https://fd.metropolitantravels.com/api/flights?_=1557470967694',
    data: {
      usrId: 109,
      usrType: "N"
    },
    token: token
  });
  response.then(function (data) {
    _mptcrwler.Logger.log("info", JSON.stringify(data.result));

    _mptcrwler.Logger.log('info', JSON.stringify(mptcrawler.finalData));

    var runid = "".concat(uuidv4(), "_").concat(moment().format("DD-MMM-YYYY HH:mm:ss.SSS"));
    datstore.saveCircleBatchData(runid, mptcrawler.finalData, "", function (rrid) {
      datstore.finalization(rrid, function () {
        _mptcrwler.Logger.log('info', 'Finished');

        process.removeAllListeners("unhandledRejection");
        process.removeAllListeners('exit');
        process.removeAllListeners();
        return;
      });
      return;
    });
  })["catch"](function (error) {
    _mptcrwler.Logger.log("error", error);
  });
}

var excutionStarted = false;
cron.schedule("*/5 * * * *", function () {
  _mptcrwler.Logger.log("info", "Cron started");

  if (excutionStarted) {
    _mptcrwler.Logger.log("info", 'Previous process still running ...');

    return false;
  }

  try {
    excutionStarted = true;
    process.on('unhandledRejection', function (reason, promise) {
      _mptcrwler.Logger.log('info', 'Unhandled Rejection at:', reason);
    });
    startProcess();
    console.log("Process done"); //login();
  } catch (e) {
    _mptcrwler.Logger.log('error', e);
  } finally {
    excutionStarted = false;
  }
});
app.listen("3236");
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tcHQvaW5kZXhtcHQuanMiXSwibmFtZXMiOlsiY3JvbiIsInJlcXVpcmUiLCJleHByZXNzIiwiZnMiLCJkYXRzdG9yZSIsInV1aWR2NCIsIm1vbWVudCIsImFwcCIsImxvZ2luIiwiTG9nZ2VyIiwibG9nIiwibXB0Y3Jhd2xlciIsIk1QVENyYXdsZXIiLCJ1cmwiLCJvdXRwdXQiLCJyZXNwb25zZSIsImdldERhdGEiLCJkYXRhIiwiZW1haWwiLCJwd2QiLCJ0aGVuIiwiSlNPTiIsInN0cmluZ2lmeSIsInJlc3VsdCIsImZpbmFsRGF0YSIsInRva2VuIiwic3RhcnRQcm9jZXNzIiwiZXJyb3IiLCJ1c3JJZCIsInVzclR5cGUiLCJydW5pZCIsImZvcm1hdCIsInNhdmVDaXJjbGVCYXRjaERhdGEiLCJycmlkIiwiZmluYWxpemF0aW9uIiwicHJvY2VzcyIsInJlbW92ZUFsbExpc3RlbmVycyIsImV4Y3V0aW9uU3RhcnRlZCIsInNjaGVkdWxlIiwib24iLCJyZWFzb24iLCJwcm9taXNlIiwiY29uc29sZSIsImUiLCJsaXN0ZW4iXSwibWFwcGluZ3MiOiI7O0FBV0E7O0FBWEE7QUFDQSxJQUFNQSxJQUFJLEdBQUdDLE9BQU8sQ0FBQyxXQUFELENBQXBCOztBQUNBLElBQU1DLE9BQU8sR0FBR0QsT0FBTyxDQUFDLFNBQUQsQ0FBdkI7O0FBQ0EsSUFBTUUsRUFBRSxHQUFHRixPQUFPLENBQUMsSUFBRCxDQUFsQjs7QUFDQSxJQUFNRyxRQUFRLEdBQUdILE9BQU8sQ0FBQyw4QkFBRCxDQUF4QixDLENBQ0E7QUFDQTs7O0FBRUEsSUFBTUksTUFBTSxHQUFHSixPQUFPLENBQUMsU0FBRCxDQUF0Qjs7QUFDQSxJQUFNSyxNQUFNLEdBQUdMLE9BQU8sQ0FBQyxRQUFELENBQXRCOztBQUdBO0FBRUEsSUFBSU0sR0FBRyxHQUFHTCxPQUFPLEVBQWpCOztBQUVBLFNBQVNNLEtBQVQsR0FBaUI7QUFDYkMsb0JBQU9DLEdBQVAsQ0FBVyxNQUFYLEVBQW1CLGdC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QXBCO0FBQ0gsR0FuQkQ7QUFvQkg7O0FBRUQsSUFBSVUsZUFBZSxHQUFHLEtBQXRCO0FBQ0FyQyxJQUFJLENBQUNzQyxRQUFMLENBQWMsYUFBZCxFQUE2QixZQUFXO0FBQ3BDN0Isb0JBQU9DLEdBQVAsQ0FBVyxNQUFYLEVBQW1CLGNBQW5COztBQUNBLE1BQUcyQixlQUFILEVBQW9CO0FBQ2hCNUIsc0JBQU9DLEdBQVAsQ0FBVyxNQUFYLEVBQW1CLG9DQUFuQjs7QUFDQSxXQUFPLEtBQVA7QUFDSDs7QUFFRCxNQUNBO0FBQ0kyQixJQUFBQSxlQUFlLEdBQUcsSUFBbEI7QUFDQUYsSUFBQUEsT0FBTyxDQUFDSSxFQUFSLENBQVcsb0JBQVgsRUFBaUMsVUFBQ0MsTUFBRCxFQUFTQyxPQUFULEVBQXFCO0FBQ2xEaEMsd0JBQU9DLEdBQVAsQ0FBVyxNQUFYLEVBQWtCLHlCQUFsQixFQUE2QzhCLE1BQTdDO0FBQ0gsS0FGRDtBQUdBZCxJQUFBQSxZQUFZO0FBQ1pnQixJQUFBQSxPQUFPLENBQUNoQyxHQUFSLENBQVksY0FBWixFQU5KLENBT0k7QUFDSCxHQVRELENBVUEsT0FBTWlDLENBQU4sRUFBUztBQUNMbEMsc0JBQU9DLEdBQVAsQ0FBVyxPQUFYLEVBQW9CaUMsQ0FBcEI7QUFDSCxHQVpELFNBYVE7QUFDSk4sSUFBQUEsZUFBZSxHQUFHLEtBQWxCO0FBQ0g7QUFDSixDQXZCRDtBQXlCQTlCLEdBQUcsQ0FBQ3FDLE1BQUosQ0FBVyxNQUFYIiwic291cmNlc0NvbnRlbnQiOlsiLy9qc2hpbnQgZXN2ZXJzaW9uOiA2XG5jb25zdCBjcm9uID0gcmVxdWlyZShcIm5vZGUtY3JvblwiKTtcbmNvbnN0IGV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcbmNvbnN0IGZzID0gcmVxdWlyZShcImZzXCIpO1xuY29uc3QgZGF0c3RvcmUgPSByZXF1aXJlKCcuLi8uLi9yYWRoYXJhbmkvbXB0ZGF0YXN0b3JlJyk7XG4vL3JlcXVpcmUoXCJiYWJlbC1jb3JlL3JlZ2lzdGVyXCIpO1xuLy9yZXF1aXJlKFwiYmFiZWwtcG9seWZpbGxcIik7XG5cbmNvbnN0IHV1aWR2NCA9IHJlcXVpcmUoJ3V1aWQvdjQnKTtcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xuXG5pbXBvcnQge0xvZ2dlciwgTVBUQ3Jhd2xlcn0gZnJvbSAnLi9tcHRjcndsZXInO1xuLy9pbXBvcnQgeyBsb2dnZXJzIH0gZnJvbSAnd2luc3Rvbic7XG5cbmxldCBhcHAgPSBleHByZXNzKCk7XG5cbmZ1bmN0aW9uIGxvZ2luKCkge1xuICAgIExvZ2dlci5sb2coJ2luZm8nLCBcIkxvZ2dpbmcgaW4gLi4uXCIpO1xuXG4gICAgbGV0IG1wdGNyYXdsZXIgPSBuZXcgTVBUQ3Jhd2xlcih7dXJsOiAnJywgb3V0cHV0OiAnanNvbid9KTtcbiAgICBsZXQgcmVzcG9uc2UgPSBtcHRjcmF3bGVyLmdldERhdGEoe3VybDogJ2h0dHBzOi8vZmQubWV0cm9wb2xpdGFudHJhdmVscy5jb20vYXBpL2ZsaWdodHM/Xz0xNTU3NDcwOTY3Njk0JywgZGF0YToge1xuICAgICAgICBlbWFpbDpcInJhZGhhcmFuaWhvbGlkYXlzQGdtYWlsLmNvbVwiLFxuICAgICAgICBwd2Q6XCJTdW1pdEAxMjM1NlwiXG4gICAgfX0pO1xuXG4gICAgcmVzcG9uc2UudGhlbihkYXRhID0+IHtcbiAgICAgICAgTG9nZ2VyLmxvZyhcImluZm9cIiwgSlNPTi5zdHJpbmdpZnkoZGF0YS5yZXN1bHQpKTtcbiAgICAgICAgTG9nZ2VyLmxvZygnaW5mbycsIEpTT04uc3RyaW5naWZ5KG1wdGNyYXdsZXIuZmluYWxEYXRhKSk7XG5cbiAgICAgICAgbGV0IHRva2VuID0gZGF0YS5yZXN1bHQudG9rZW47XG4gICAgICAgIHN0YXJ0UHJvY2Vzcyh0b2tlbik7XG4gICAgICAgIC8vbGV0IHJ1bmlkID0gYCR7dXVpZHY0KCl9XyR7bW9tZW50KCkuZm9ybWF0KFwiREQtTU1NLVlZWVkgSEg6bW06c3MuU1NTXCIpfWA7XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBMb2dnZXIubG9nKFwiZXJyb3JcIiwgZXJyb3IpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzdGFydFByb2Nlc3ModG9rZW4pIHtcbiAgICBMb2dnZXIubG9nKCdpbmZvJywgXCJTdGFydGluZyBwcm9jZXNzIC4uLlwiKTtcblxuICAgIGxldCBtcHRjcmF3bGVyID0gbmV3IE1QVENyYXdsZXIoe3VybDogJycsIG91dHB1dDogJ2pzb24nLCB0b2tlbjogdG9rZW59KTtcbiAgICBsZXQgcmVzcG9uc2UgPSBtcHRjcmF3bGVyLmdldERhdGEoe3VybDogJ2h0dHBzOi8vZmQubWV0cm9wb2xpdGFudHJhdmVscy5jb20vYXBpL2ZsaWdodHM/Xz0xNTU3NDcwOTY3Njk0JywgZGF0YToge1xuICAgICAgICB1c3JJZDogMTA5LFxuICAgICAgICB1c3JUeXBlOiBcIk5cIlxuICAgIH0sIHRva2VuOiB0b2tlbn0pO1xuXG4gICAgcmVzcG9uc2UudGhlbihkYXRhID0+IHtcbiAgICAgICAgTG9nZ2VyLmxvZyhcImluZm9cIiwgSlNPTi5zdHJpbmdpZnkoZGF0YS5yZXN1bHQpKTtcblxuICAgICAgICBMb2dnZXIubG9nKCdpbmZvJywgSlNPTi5zdHJpbmdpZnkobXB0Y3Jhd2xlci5maW5hbERhdGEpKTtcblxuICAgICAgICBsZXQgcnVuaWQgPSBgJHt1dWlkdjQoKX1fJHttb21lbnQoKS5mb3JtYXQoXCJERC1NTU0tWVlZWSBISDptbTpzcy5TU1NcIil9YDtcbiAgICAgICAgZGF0c3RvcmUuc2F2ZUNpcmNsZUJhdGNoRGF0YShydW5pZCwgbXB0Y3Jhd2xlci5maW5hbERhdGEsIFwiXCIsIGZ1bmN0aW9uKHJyaWQpIHtcbiAgICAgICAgICAgIGRhdHN0b3JlLmZpbmFsaXphdGlvbihycmlkLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgTG9nZ2VyLmxvZygnaW5mbycsICdGaW5pc2hlZCcpO1xuXG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMoXCJ1bmhhbmRsZWRSZWplY3Rpb25cIik7XG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ2V4aXQnKTtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9KTtcbiAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIExvZ2dlci5sb2coXCJlcnJvclwiLCBlcnJvcik7XG4gICAgfSk7XG59XG5cbnZhciBleGN1dGlvblN0YXJ0ZWQgPSBmYWxzZTtcbmNyb24uc2NoZWR1bGUoXCIqLzUgKiAqICogKlwiLCBmdW5jdGlvbigpIHtcbiAgICBMb2dnZXIubG9nKFwiaW5mb1wiLCBcIkNyb24gc3RhcnRlZFwiKTtcbiAgICBpZihleGN1dGlvblN0YXJ0ZWQpIHtcbiAgICAgICAgTG9nZ2VyLmxvZyhcImluZm9cIiwgJ1ByZXZpb3VzIHByb2Nlc3Mgc3RpbGwgcnVubmluZyAuLi4nKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRyeVxuICAgIHtcbiAgICAgICAgZXhjdXRpb25TdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgcHJvY2Vzcy5vbigndW5oYW5kbGVkUmVqZWN0aW9uJywgKHJlYXNvbiwgcHJvbWlzZSkgPT4ge1xuICAgICAgICAgICAgTG9nZ2VyLmxvZygnaW5mbycsJ1VuaGFuZGxlZCBSZWplY3Rpb24gYXQ6JywgcmVhc29uKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHN0YXJ0UHJvY2VzcygpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlByb2Nlc3MgZG9uZVwiKTtcbiAgICAgICAgLy9sb2dpbigpO1xuICAgIH1cbiAgICBjYXRjaChlKSB7XG4gICAgICAgIExvZ2dlci5sb2coJ2Vycm9yJywgZSk7XG4gICAgfVxuICAgIGZpbmFsbHkge1xuICAgICAgICBleGN1dGlvblN0YXJ0ZWQgPSBmYWxzZTtcbiAgICB9XG59KTtcblxuYXBwLmxpc3RlbihcIjMyMzZcIik7XG4iXX0=