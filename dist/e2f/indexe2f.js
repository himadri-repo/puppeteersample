"use strict";

var _e2fcrwler = require("./e2fcrwler");

//jshint esversion: 6
var cron = require("node-cron");

var express = require("express");

var fs = require("fs");

var datstore = require('../../radharani/e2fdatastore'); //require("babel-core/register");
//require("babel-polyfill");


var uuidv4 = require('uuid/v4');

var moment = require('moment');

//import { loggers } from 'winston';
var app = express();

function login() {
  _e2fcrwler.Logger.log('info', "Logging in ...");

  var e2fcrawler = new _e2fcrwler.E2FCrawler({
    url: '',
    output: 'json'
  });
  var response = e2fcrawler.postData({
    url: 'https://eflyapi.ease2fly.com/api/auth/login',
    data: {
      email: "info@oxytra.com",
      pwd: "Sumit@12356"
    }
  });
  response.then(function (data) {
    _e2fcrwler.Logger.log("info", JSON.stringify(data.result));

    _e2fcrwler.Logger.log('info', JSON.stringify(e2fcrawler.finalData));

    var token = data.result.token;
    startProcess(token); //let runid = `${uuidv4()}_${moment().format("DD-MMM-YYYY HH:mm:ss.SSS")}`;
  })["catch"](function (error) {
    _e2fcrwler.Logger.log("error", error);
  });
}

function startProcess(token) {
  _e2fcrwler.Logger.log('info', "Starting process ...");

  var e2fcrawler = new _e2fcrwler.E2FCrawler({
    url: '',
    output: 'json',
    token: token
  });
  var response = e2fcrawler.postData({
    url: 'https://eflyapi.ease2fly.com/api/destinations/get-destinations-list',
    data: {
      usrId: 109,
      usrType: "N"
    },
    token: token
  });
  response.then(function (data) {
    _e2fcrwler.Logger.log("info", JSON.stringify(data.result));

    _e2fcrwler.Logger.log('info', JSON.stringify(e2fcrawler.finalData));

    var runid = "".concat(uuidv4(), "_").concat(moment().format("DD-MMM-YYYY HH:mm:ss.SSS"));
    datstore.saveCircleBatchData(runid, e2fcrawler.finalData, "", function (rrid) {
      datstore.finalization(rrid, function () {
        _e2fcrwler.Logger.log('info', 'Finished');

        process.removeAllListeners("unhandledRejection");
        process.removeAllListeners('exit');
        process.removeAllListeners();
        return;
      });
      return;
    });
  })["catch"](function (error) {
    _e2fcrwler.Logger.log("error", error);
  });
}

var excutionStarted = false;
cron.schedule("*/20 * * * *", function () {
  _e2fcrwler.Logger.log("info", "Cron started");

  if (excutionStarted) {
    _e2fcrwler.Logger.log("info", 'Previous process still running ...');

    return false;
  }

  try {
    excutionStarted = true;
    process.on('unhandledRejection', function (reason, promise) {
      _e2fcrwler.Logger.log('info', 'Unhandled Rejection at:', reason);
    }); //startProcess();

    login();
  } catch (e) {
    _e2fcrwler.Logger.log('error', e);
  } finally {
    excutionStarted = false;
  }
});
app.listen("3232");
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lMmYvaW5kZXhlMmYuanMiXSwibmFtZXMiOlsiY3JvbiIsInJlcXVpcmUiLCJleHByZXNzIiwiZnMiLCJkYXRzdG9yZSIsInV1aWR2NCIsIm1vbWVudCIsImFwcCIsImxvZ2luIiwiTG9nZ2VyIiwibG9nIiwiZTJmY3Jhd2xlciIsIkUyRkNyYXdsZXIiLCJ1cmwiLCJvdXRwdXQiLCJyZXNwb25zZSIsInBvc3REYXRhIiwiZGF0YSIsImVtYWlsIiwicHdkIiwidGhlbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJyZXN1bHQiLCJmaW5hbERhdGEiLCJ0b2tlbiIsInN0YXJ0UHJvY2VzcyIsImVycm9yIiwidXNySWQiLCJ1c3JUeXBlIiwicnVuaWQiLCJmb3JtYXQiLCJzYXZlQ2lyY2xlQmF0Y2hEYXRhIiwicnJpZCIsImZpbmFsaXphdGlvbiIsInByb2Nlc3MiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJleGN1dGlvblN0YXJ0ZWQiLCJzY2hlZHVsZSIsIm9uIiwicmVhc29uIiwicHJvbWlzZSIsImUiLCJsaXN0ZW4iXSwibWFwcGluZ3MiOiI7O0FBV0E7O0FBWEE7QUFDQSxJQUFNQSxJQUFJLEdBQUdDLE9BQU8sQ0FBQyxXQUFELENBQXBCOztBQUNBLElBQU1DLE9BQU8sR0FBR0QsT0FBTyxDQUFDLFNBQUQsQ0FBdkI7O0FBQ0EsSUFBTUUsRUFBRSxHQUFHRixPQUFPLENBQUMsSUFBRCxDQUFsQjs7QUFDQSxJQUFNRyxRQUFRLEdBQUdILE9BQU8sQ0FBQyw4QkFBRCxDQUF4QixDLENBQ0E7QUFDQTs7O0FBRUEsSUFBTUksTUFBTSxHQUFHSixPQUFPLENBQUMsU0FBRCxDQUF0Qjs7QUFDQSxJQUFNSyxNQUFNLEdBQUdMLE9BQU8sQ0FBQyxRQUFELENBQXRCOztBQUdBO0FBRUEsSUFBSU0sR0FBRyxHQUFHTCxPQUFPLEVBQWpCOztBQUVBLFNBQVNNLEtBQVQsR0FBaUI7QUFDYkMsb0JBQU9DLEdBQVAsQ0FBVyxNQUFYLEVBQW1CLGdCQUFuQjs7QUFF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R0FuQkQ7QUFvQkg7O0FBRUQsSUFBSVUsZUFBZSxHQUFHLEtBQXRCO0FBQ0FyQyxJQUFJLENBQUNzQyxRQUFMLENBQWMsY0FBZCxFQUE4QixZQUFXO0FBQ3JDN0Isb0JBQU9DLEdBQVAsQ0FBVyxNQUFYLEVBQW1CLGNBQW5COztBQUNBLE1BQUcyQixlQUFILEVBQW9CO0FBQ2hCNUIsc0JBQU9DLEdBQVAsQ0FBVyxNQUFYLEVBQW1CLG9DQUFuQjs7QUFDQSxXQUFPLEtBQVA7QUFDSDs7QUFFRCxNQUNBO0FBQ0kyQixJQUFBQSxlQUFlLEdBQUcsSUFBbEI7QUFDQUYsSUFBQUEsT0FBTyxDQUFDSSxFQUFSLENBQVcsb0JBQVgsRUFBaUMsVUFBQ0MsTUFBRCxFQUFTQyxPQUFULEVBQXFCO0FBQ2xEaEMsd0JBQU9DLEdBQVAsQ0FBVyxNQUFYLEVBQWtCLHlCQUFsQixFQUE2QzhCLE1BQTdDO0FBQ0gsS0FGRCxFQUZKLENBS0k7O0FBQ0FoQyxJQUFBQSxLQUFLO0FBQ1IsR0FSRCxDQVNBLE9BQU1rQyxDQUFOLEVBQVM7QUFDTGpDLHNCQUFPQyxHQUFQLENBQVcsT0FBWCxFQUFvQmdDLENBQXBCO0FBQ0gsR0FYRCxTQVlRO0FBQ0pMLElBQUFBLGVBQWUsR0FBRyxLQUFsQjtBQUNIO0FBQ0osQ0F0QkQ7QUF3QkE5QixHQUFHLENBQUNvQyxNQUFKLENBQVcsTUFBWCIsInNvdXJjZXNDb250ZW50IjpbIi8vanNoaW50IGVzdmVyc2lvbjogNlxuY29uc3QgY3JvbiA9IHJlcXVpcmUoXCJub2RlLWNyb25cIik7XG5jb25zdCBleHByZXNzID0gcmVxdWlyZShcImV4cHJlc3NcIik7XG5jb25zdCBmcyA9IHJlcXVpcmUoXCJmc1wiKTtcbmNvbnN0IGRhdHN0b3JlID0gcmVxdWlyZSgnLi4vLi4vcmFkaGFyYW5pL2UyZmRhdGFzdG9yZScpO1xuLy9yZXF1aXJlKFwiYmFiZWwtY29yZS9yZWdpc3RlclwiKTtcbi8vcmVxdWlyZShcImJhYmVsLXBvbHlmaWxsXCIpO1xuXG5jb25zdCB1dWlkdjQgPSByZXF1aXJlKCd1dWlkL3Y0Jyk7XG5jb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcblxuaW1wb3J0IHtMb2dnZXIsIEUyRkNyYXdsZXJ9IGZyb20gJy4vZTJmY3J3bGVyJztcbi8vaW1wb3J0IHsgbG9nZ2VycyB9IGZyb20gJ3dpbnN0b24nO1xuXG5sZXQgYXBwID0gZXhwcmVzcygpO1xuXG5mdW5jdGlvbiBsb2dpbigpIHtcbiAgICBMb2dnZXIubG9nKCdpbmZvJywgXCJMb2dnaW5nIGluIC4uLlwiKTtcblxuICAgIGxldCBlMmZjcmF3bGVyID0gbmV3IEUyRkNyYXdsZXIoe3VybDogJycsIG91dHB1dDogJ2pzb24nfSk7XG4gICAgbGV0IHJlc3BvbnNlID0gZTJmY3Jhd2xlci5wb3N0RGF0YSh7dXJsOiAnaHR0cHM6Ly9lZmx5YXBpLmVhc2UyZmx5LmNvbS9hcGkvYXV0aC9sb2dpbicsIGRhdGE6IHtcbiAgICAgICAgZW1haWw6XCJpbmZvQG94eXRyYS5jb21cIixcbiAgICAgICAgcHdkOlwiU3VtaXRAMTIzNTZcIlxuICAgIH19KTtcblxuICAgIHJlc3BvbnNlLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIExvZ2dlci5sb2coXCJpbmZvXCIsIEpTT04uc3RyaW5naWZ5KGRhdGEucmVzdWx0KSk7XG4gICAgICAgIExvZ2dlci5sb2coJ2luZm8nLCBKU09OLnN0cmluZ2lmeShlMmZjcmF3bGVyLmZpbmFsRGF0YSkpO1xuXG4gICAgICAgIGxldCB0b2tlbiA9IGRhdGEucmVzdWx0LnRva2VuO1xuICAgICAgICBzdGFydFByb2Nlc3ModG9rZW4pO1xuICAgICAgICAvL2xldCBydW5pZCA9IGAke3V1aWR2NCgpfV8ke21vbWVudCgpLmZvcm1hdChcIkRELU1NTS1ZWVlZIEhIOm1tOnNzLlNTU1wiKX1gO1xuICAgIH0pXG4gICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgTG9nZ2VyLmxvZyhcImVycm9yXCIsIGVycm9yKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gc3RhcnRQcm9jZXNzKHRva2VuKSB7XG4gICAgTG9nZ2VyLmxvZygnaW5mbycsIFwiU3RhcnRpbmcgcHJvY2VzcyAuLi5cIik7XG5cbiAgICBsZXQgZTJmY3Jhd2xlciA9IG5ldyBFMkZDcmF3bGVyKHt1cmw6ICcnLCBvdXRwdXQ6ICdqc29uJywgdG9rZW46IHRva2VufSk7XG4gICAgbGV0IHJlc3BvbnNlID0gZTJmY3Jhd2xlci5wb3N0RGF0YSh7dXJsOiAnaHR0cHM6Ly9lZmx5YXBpLmVhc2UyZmx5LmNvbS9hcGkvZGVzdGluYXRpb25zL2dldC1kZXN0aW5hdGlvbnMtbGlzdCcsIGRhdGE6IHtcbiAgICAgICAgdXNySWQ6IDEwOSxcbiAgICAgICAgdXNyVHlwZTogXCJOXCJcbiAgICB9LCB0b2tlbjogdG9rZW59KTtcblxuICAgIHJlc3BvbnNlLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIExvZ2dlci5sb2coXCJpbmZvXCIsIEpTT04uc3RyaW5naWZ5KGRhdGEucmVzdWx0KSk7XG5cbiAgICAgICAgTG9nZ2VyLmxvZygnaW5mbycsIEpTT04uc3RyaW5naWZ5KGUyZmNyYXdsZXIuZmluYWxEYXRhKSk7XG5cbiAgICAgICAgbGV0IHJ1bmlkID0gYCR7dXVpZHY0KCl9XyR7bW9tZW50KCkuZm9ybWF0KFwiREQtTU1NLVlZWVkgSEg6bW06c3MuU1NTXCIpfWA7XG4gICAgICAgIGRhdHN0b3JlLnNhdmVDaXJjbGVCYXRjaERhdGEocnVuaWQsIGUyZmNyYXdsZXIuZmluYWxEYXRhLCBcIlwiLCBmdW5jdGlvbihycmlkKSB7XG4gICAgICAgICAgICBkYXRzdG9yZS5maW5hbGl6YXRpb24ocnJpZCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIExvZ2dlci5sb2coJ2luZm8nLCAnRmluaXNoZWQnKTtcblxuICAgICAgICAgICAgICAgIHByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzKFwidW5oYW5kbGVkUmVqZWN0aW9uXCIpO1xuICAgICAgICAgICAgICAgIHByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzKCdleGl0Jyk7XG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSk7XG4gICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBMb2dnZXIubG9nKFwiZXJyb3JcIiwgZXJyb3IpO1xuICAgIH0pO1xufVxuXG52YXIgZXhjdXRpb25TdGFydGVkID0gZmFsc2U7XG5jcm9uLnNjaGVkdWxlKFwiKi8yMCAqICogKiAqXCIsIGZ1bmN0aW9uKCkge1xuICAgIExvZ2dlci5sb2coXCJpbmZvXCIsIFwiQ3JvbiBzdGFydGVkXCIpO1xuICAgIGlmKGV4Y3V0aW9uU3RhcnRlZCkge1xuICAgICAgICBMb2dnZXIubG9nKFwiaW5mb1wiLCAnUHJldmlvdXMgcHJvY2VzcyBzdGlsbCBydW5uaW5nIC4uLicpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdHJ5XG4gICAge1xuICAgICAgICBleGN1dGlvblN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICBwcm9jZXNzLm9uKCd1bmhhbmRsZWRSZWplY3Rpb24nLCAocmVhc29uLCBwcm9taXNlKSA9PiB7XG4gICAgICAgICAgICBMb2dnZXIubG9nKCdpbmZvJywnVW5oYW5kbGVkIFJlamVjdGlvbiBhdDonLCByZWFzb24pO1xuICAgICAgICB9KTtcbiAgICAgICAgLy9zdGFydFByb2Nlc3MoKTtcbiAgICAgICAgbG9naW4oKTtcbiAgICB9XG4gICAgY2F0Y2goZSkge1xuICAgICAgICBMb2dnZXIubG9nKCdlcnJvcicsIGUpO1xuICAgIH1cbiAgICBmaW5hbGx5IHtcbiAgICAgICAgZXhjdXRpb25TdGFydGVkID0gZmFsc2U7XG4gICAgfVxufSk7XG5cbmFwcC5saXN0ZW4oXCIzMjMyXCIpO1xuIl19