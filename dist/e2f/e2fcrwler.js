"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.E2FCrawler = exports.Logger = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//jshint esversion: 6
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
    _classCallCheck(this, Logger);
  }

  _createClass(Logger, null, [{
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
    _classCallCheck(this, E2FCrawler);

    this.options = options || {
      url: '',
      output: 'json'
    };
  }

  _createClass(E2FCrawler, [{
    key: "postData",
    value: function postData() {
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
        return response.json();
      }).catch(function (reason) {
        Logger.log("error", reason);
      }); // parses JSON response into native Javascript objects 
    }
  }]);

  return E2FCrawler;
}(); // function postData(searchOption={url: '', data: {usrId: 109, usrType: 'N'}}) {
//     // Default options are marked with *
//     return fetch(searchOption.url, {
//         method: "POST", // *GET, POST, PUT, DELETE, etc.
//         mode: "cors", // no-cors, cors, *same-origin
//         cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//         credentials: "include", // include, *same-origin, omit
//         headers: {
//             "Content-Type": "application/json",
//             // "Content-Type": "application/x-www-form-urlencoded",
//         },
//         redirect: "follow", // manual, *follow, error
//         referrer: "client", // no-referrer, *client
//         body: JSON.stringify(searchOption.data), // body data type must match "Content-Type" header
//     })
//     .then(response => {
//         console.log("info", "Response received");
//         return response.json();
//     })
//     .catch(reason => {
//         console.log("error", reason);
//     }); // parses JSON response into native Javascript objects 
// }
// let resp = postData({url: 'https://expressdev.ease2fly.com/api/destinations/get-destinations-list', data: {
//     usrId: 109,
//     usrType: "N"
// }})
// .then(data => {
//     //console.log(JSON.stringify(data.result));
//     return data.result;
// })
// .catch(error => {
//     console.log(error);
// });
// console.log(resp);


exports.E2FCrawler = E2FCrawler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lMmYvZTJmY3J3bGVyLmpzIl0sIm5hbWVzIjpbImNyb24iLCJyZXF1aXJlIiwiZXhwcmVzcyIsImZzIiwidXVpZHY0IiwiZGVsYXkiLCJtb21lbnQiLCJmZXRjaCIsIkxvZ2dlciIsInR5cGUiLCJtZXNzYWdlIiwiX3dyaXRlIiwidGltZSIsImZvcm1hdCIsImFyZ3MiLCJBcnJheSIsImZyb20iLCJhcmd1bWVudHMiLCJ1bnNoaWZ0IiwidG9VcHBlckNhc2UiLCJjb25zb2xlIiwibG9nIiwiYXBwbHkiLCJFMkZDcmF3bGVyIiwib3B0aW9ucyIsInVybCIsIm91dHB1dCIsInNlYXJjaE9wdGlvbiIsImRhdGEiLCJ1c3JJZCIsInVzclR5cGUiLCJtZXRob2QiLCJtb2RlIiwiY2FjaGUiLCJjcmVkZW50aWFscyIsImhlYWRlcnMiLCJyZWRpcmVjdCIsInJlZmVycmVyIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwiY2F0Y2giLCJyZWFzb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBLElBQU1BLElBQUksR0FBR0MsT0FBTyxDQUFDLFdBQUQsQ0FBcEI7O0FBQ0EsSUFBTUMsT0FBTyxHQUFHRCxPQUFPLENBQUMsU0FBRCxDQUF2Qjs7QUFDQSxJQUFNRSxFQUFFLEdBQUdGLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUVBLElBQU1HLE1BQU0sR0FBR0gsT0FBTyxDQUFDLFNBQUQsQ0FBdEI7O0FBQ0EsSUFBTUksS0FBSyxHQUFHSixPQUFPLENBQUMsT0FBRCxDQUFyQjs7QUFDQSxJQUFNSyxNQUFNLEdBQUdMLE9BQU8sQ0FBQyxRQUFELENBQXRCOztBQUNBLElBQU1NLEtBQUssR0FBR04sT0FBTyxDQUFDLGtCQUFELENBQXJCLEMsQ0FFQTtBQUNBOzs7SUFFYU8sTTs7Ozs7Ozs7O3dCQUNFQyxJLEVBQU1DLE8sRUFBUztBQUN0QixjQUFRRCxJQUFSO0FBQ0ksYUFBSyxNQUFMO0FBQ0FELFVBQUFBLE1BQU0sQ0FBQ0csTUFBUCxDQUFjLE1BQWQsRUFBcUJELE9BQXJCOztBQUNJOztBQUNKLGFBQUssU0FBTDtBQUNJRixVQUFBQSxNQUFNLENBQUNHLE1BQVAsQ0FBYyxTQUFkLEVBQXdCRCxPQUF4Qjs7QUFDQTs7QUFDSixhQUFLLE9BQUw7QUFDSUYsVUFBQUEsTUFBTSxDQUFDRyxNQUFQLENBQWMsT0FBZCxFQUFzQkQsT0FBdEI7O0FBQ0E7O0FBQ0o7QUFDSTtBQVhSO0FBYUg7OzsyQkFFYUQsSSxFQUFNO0FBQ2hCLFVBQUlHLElBQUksR0FBR04sTUFBTSxHQUFHTyxNQUFULENBQWdCLGNBQWhCLENBQVgsQ0FEZ0IsQ0FFaEI7O0FBQ0EsVUFBSUMsSUFBSSxHQUFHQyxLQUFLLENBQUNDLElBQU4sQ0FBV0MsU0FBWCxDQUFYLENBSGdCLENBSWhCOztBQUVBSCxNQUFBQSxJQUFJLENBQUNJLE9BQUwsQ0FBYU4sSUFBYjtBQUNBRSxNQUFBQSxJQUFJLENBQUNJLE9BQUwsQ0FBYVQsSUFBSSxDQUFDVSxXQUFMLEVBQWI7QUFDQUMsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlDLEtBQVosQ0FBa0JGLE9BQWxCLEVBQTJCTixJQUEzQjtBQUNIOzs7Ozs7OztJQUdRUyxVOzs7QUFDVCxzQkFBWUMsT0FBWixFQUFxQjtBQUFBOztBQUNqQixTQUFLQSxPQUFMLEdBQWVBLE9BQU8sSUFBSTtBQUFDQyxNQUFBQSxHQUFHLEVBQUUsRUFBTjtBQUFVQyxNQUFBQSxNQUFNLEVBQUU7QUFBbEIsS0FBMUI7QUFDSDs7OzsrQkFFa0U7QUFBQSxVQUExREMsWUFBMEQsdUVBQTdDO0FBQUNGLFFBQUFBLEdBQUcsRUFBRSxFQUFOO0FBQVVHLFFBQUFBLElBQUksRUFBRTtBQUFDQyxVQUFBQSxLQUFLLEVBQUUsR0FBUjtBQUFhQyxVQUFBQSxPQUFPLEVBQUU7QUFBdEI7QUFBaEIsT0FBNkM7QUFDL0Q7QUFDQSxhQUFPdkIsS0FBSyxDQUFDb0IsWUFBWSxDQUFDRixHQUFkLEVBQW1CO0FBQzNCTSxRQUFBQSxNQUFNLEVBQUUsTUFEbUI7QUFDWDtBQUNoQkMsUUFBQUEsSUFBSSxFQUFFLE1BRnFCO0FBRWI7QUFDZEMsUUFBQUEsS0FBSyxFQUFFLFVBSG9CO0FBR1I7QUFDbkJDLFFBQUFBLFdBQVcsRUFBRSxhQUpjO0FBSUM7QUFDNUJDLFFBQUFBLE9BQU8sRUFBRTtBQUNMLDBCQUFnQixrQkFEWCxDQUVMOztBQUZLLFNBTGtCO0FBUzNCQyxRQUFBQSxRQUFRLEVBQUUsUUFUaUI7QUFTUDtBQUNwQkMsUUFBQUEsUUFBUSxFQUFFLGFBVmlCO0FBVUY7QUFDekJDLFFBQUFBLElBQUksRUFBRUMsSUFBSSxDQUFDQyxTQUFMLENBQWViLFlBQVksQ0FBQ0MsSUFBNUIsQ0FYcUIsQ0FXYzs7QUFYZCxPQUFuQixDQUFMLENBYU5hLElBYk0sQ0FhRCxVQUFBQyxRQUFRLEVBQUk7QUFDZGxDLFFBQUFBLE1BQU0sQ0FBQ2EsR0FBUCxDQUFXLE1BQVgsRUFBbUIsbUJBQW5CO0FBQ0EsZUFBT3FCLFFBQVEsQ0FBQ0MsSUFBVCxFQUFQO0FBQ0gsT0FoQk0sRUFpQk5DLEtBakJNLENBaUJBLFVBQUFDLE1BQU0sRUFBSTtBQUNickMsUUFBQUEsTUFBTSxDQUFDYSxHQUFQLENBQVcsT0FBWCxFQUFvQndCLE1BQXBCO0FBQ0gsT0FuQk0sQ0FBUCxDQUYrRCxDQXFCM0Q7QUFDUDs7OztLQUdMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEiLCJzb3VyY2VzQ29udGVudCI6WyIvL2pzaGludCBlc3ZlcnNpb246IDZcclxuY29uc3QgY3JvbiA9IHJlcXVpcmUoXCJub2RlLWNyb25cIik7XHJcbmNvbnN0IGV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcclxuY29uc3QgZnMgPSByZXF1aXJlKFwiZnNcIik7XHJcblxyXG5jb25zdCB1dWlkdjQgPSByZXF1aXJlKCd1dWlkL3Y0Jyk7XHJcbmNvbnN0IGRlbGF5ID0gcmVxdWlyZSgnZGVsYXknKTtcclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcbmNvbnN0IGZldGNoID0gcmVxdWlyZSgnaXNvbW9ycGhpYy1mZXRjaCcpO1xyXG5cclxuLy9pbXBvcnQgbW9tZW50IGZyb20gXCJtb21lbnRcIjtcclxuLy8gaW1wb3J0IFwiaXNvbW9ycGhpYy1mZXRjaFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvZ2dlciB7XHJcbiAgICBzdGF0aWMgbG9nKHR5cGUsIG1lc3NhZ2UpIHtcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImluZm9cIjpcclxuICAgICAgICAgICAgTG9nZ2VyLl93cml0ZShcImluZm9cIixtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwid2FybmluZ1wiOlxyXG4gICAgICAgICAgICAgICAgTG9nZ2VyLl93cml0ZShcIndhcm5pbmdcIixtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiZXJyb3JcIjpcclxuICAgICAgICAgICAgICAgIExvZ2dlci5fd3JpdGUoXCJlcnJvclwiLG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIF93cml0ZSh0eXBlKSB7XHJcbiAgICAgICAgdmFyIHRpbWUgPSBtb21lbnQoKS5mb3JtYXQoXCJISDptbTpzcy5TU1NcIik7XHJcbiAgICAgICAgLy9hcmd1bWVudHMuc3BsaWNlKDApXHJcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5mcm9tKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgLy9hcmdzLnNwbGljZSgwKTtcclxuICAgIFxyXG4gICAgICAgIGFyZ3MudW5zaGlmdCh0aW1lKTtcclxuICAgICAgICBhcmdzLnVuc2hpZnQodHlwZS50b1VwcGVyQ2FzZSgpKTtcclxuICAgICAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmdzKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEUyRkNyYXdsZXIge1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge3VybDogJycsIG91dHB1dDogJ2pzb24nfTtcclxuICAgIH1cclxuXHJcbiAgICBwb3N0RGF0YShzZWFyY2hPcHRpb249e3VybDogJycsIGRhdGE6IHt1c3JJZDogMTA5LCB1c3JUeXBlOiAnTid9fSkge1xyXG4gICAgICAgIC8vIERlZmF1bHQgb3B0aW9ucyBhcmUgbWFya2VkIHdpdGggKlxyXG4gICAgICAgIHJldHVybiBmZXRjaChzZWFyY2hPcHRpb24udXJsLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsIC8vICpHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBldGMuXHJcbiAgICAgICAgICAgIG1vZGU6IFwiY29yc1wiLCAvLyBuby1jb3JzLCBjb3JzLCAqc2FtZS1vcmlnaW5cclxuICAgICAgICAgICAgY2FjaGU6IFwibm8tY2FjaGVcIiwgLy8gKmRlZmF1bHQsIG5vLWNhY2hlLCByZWxvYWQsIGZvcmNlLWNhY2hlLCBvbmx5LWlmLWNhY2hlZFxyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCAvLyBpbmNsdWRlLCAqc2FtZS1vcmlnaW4sIG9taXRcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICAvLyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZWRpcmVjdDogXCJmb2xsb3dcIiwgLy8gbWFudWFsLCAqZm9sbG93LCBlcnJvclxyXG4gICAgICAgICAgICByZWZlcnJlcjogXCJuby1yZWZlcnJlclwiLCAvLyBuby1yZWZlcnJlciwgKmNsaWVudFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShzZWFyY2hPcHRpb24uZGF0YSksIC8vIGJvZHkgZGF0YSB0eXBlIG11c3QgbWF0Y2ggXCJDb250ZW50LVR5cGVcIiBoZWFkZXJcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgTG9nZ2VyLmxvZyhcImluZm9cIiwgXCJSZXNwb25zZSByZWNlaXZlZFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChyZWFzb24gPT4ge1xyXG4gICAgICAgICAgICBMb2dnZXIubG9nKFwiZXJyb3JcIiwgcmVhc29uKTtcclxuICAgICAgICB9KTsgLy8gcGFyc2VzIEpTT04gcmVzcG9uc2UgaW50byBuYXRpdmUgSmF2YXNjcmlwdCBvYmplY3RzIFxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBmdW5jdGlvbiBwb3N0RGF0YShzZWFyY2hPcHRpb249e3VybDogJycsIGRhdGE6IHt1c3JJZDogMTA5LCB1c3JUeXBlOiAnTid9fSkge1xyXG4vLyAgICAgLy8gRGVmYXVsdCBvcHRpb25zIGFyZSBtYXJrZWQgd2l0aCAqXHJcbi8vICAgICByZXR1cm4gZmV0Y2goc2VhcmNoT3B0aW9uLnVybCwge1xyXG4vLyAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsIC8vICpHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBldGMuXHJcbi8vICAgICAgICAgbW9kZTogXCJjb3JzXCIsIC8vIG5vLWNvcnMsIGNvcnMsICpzYW1lLW9yaWdpblxyXG4vLyAgICAgICAgIGNhY2hlOiBcIm5vLWNhY2hlXCIsIC8vICpkZWZhdWx0LCBuby1jYWNoZSwgcmVsb2FkLCBmb3JjZS1jYWNoZSwgb25seS1pZi1jYWNoZWRcclxuLy8gICAgICAgICBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIsIC8vIGluY2x1ZGUsICpzYW1lLW9yaWdpbiwgb21pdFxyXG4vLyAgICAgICAgIGhlYWRlcnM6IHtcclxuLy8gICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbi8vICAgICAgICAgICAgIC8vIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIsXHJcbi8vICAgICAgICAgfSxcclxuLy8gICAgICAgICByZWRpcmVjdDogXCJmb2xsb3dcIiwgLy8gbWFudWFsLCAqZm9sbG93LCBlcnJvclxyXG4vLyAgICAgICAgIHJlZmVycmVyOiBcImNsaWVudFwiLCAvLyBuby1yZWZlcnJlciwgKmNsaWVudFxyXG4vLyAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHNlYXJjaE9wdGlvbi5kYXRhKSwgLy8gYm9keSBkYXRhIHR5cGUgbXVzdCBtYXRjaCBcIkNvbnRlbnQtVHlwZVwiIGhlYWRlclxyXG4vLyAgICAgfSlcclxuLy8gICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuLy8gICAgICAgICBjb25zb2xlLmxvZyhcImluZm9cIiwgXCJSZXNwb25zZSByZWNlaXZlZFwiKTtcclxuLy8gICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG4vLyAgICAgfSlcclxuLy8gICAgIC5jYXRjaChyZWFzb24gPT4ge1xyXG4vLyAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3JcIiwgcmVhc29uKTtcclxuLy8gICAgIH0pOyAvLyBwYXJzZXMgSlNPTiByZXNwb25zZSBpbnRvIG5hdGl2ZSBKYXZhc2NyaXB0IG9iamVjdHMgXHJcbi8vIH1cclxuXHJcbi8vIGxldCByZXNwID0gcG9zdERhdGEoe3VybDogJ2h0dHBzOi8vZXhwcmVzc2Rldi5lYXNlMmZseS5jb20vYXBpL2Rlc3RpbmF0aW9ucy9nZXQtZGVzdGluYXRpb25zLWxpc3QnLCBkYXRhOiB7XHJcbi8vICAgICB1c3JJZDogMTA5LFxyXG4vLyAgICAgdXNyVHlwZTogXCJOXCJcclxuLy8gfX0pXHJcbi8vIC50aGVuKGRhdGEgPT4ge1xyXG4vLyAgICAgLy9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShkYXRhLnJlc3VsdCkpO1xyXG4vLyAgICAgcmV0dXJuIGRhdGEucmVzdWx0O1xyXG4vLyB9KVxyXG4vLyAuY2F0Y2goZXJyb3IgPT4ge1xyXG4vLyAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4vLyB9KTtcclxuXHJcbi8vIGNvbnNvbGUubG9nKHJlc3ApOyJdfQ==