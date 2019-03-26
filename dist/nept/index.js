"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//In this program we will be logging into github and will be downloading specific file.
//jshint esversion:6
//const tty = require('tty');
var cron = require("node-cron");

var express = require("express");

var fs = require("fs");

var uuidv4 = require('uuid/v4');

var puppeteer = require('puppeteer');

var metadata = require('./metadata');

var delay = require('delay');

var moment = require('moment');

var app = express();
var TIMEOUT = 5000;
var browser = null;
var page = null;
var pageConfig = null;
var capturedData = {}; //jshint ignore:start

function getStore() {
  if (capturedData) return capturedData;
  capturedData = {};
  return capturedData;
}

function log() {
  var time = moment().format("HH:mm:ss.SSS");
  var args = Array.from(arguments);
  args.unshift(time);
  console.log.apply(console, args);
}

function navigatePage(_x) {
  return _navigatePage.apply(this, arguments);
}

function _navigatePage() {
  _navigatePage = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(pageName) {
    var pages, response, actionItem, iidx, val, idx;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return puppeteer.launch({
              headless: true,
              ignoreDefaultArgs: ['--enable-automation'],
              args: ['--start-fullscreen'] //slowMo: 100

            }).catch(function (reason) {
              log(reason);
              return;
            });

          case 3:
            browser = _context.sent;
            _context.next = 6;
            return browser.pages();

          case 6:
            pages = _context.sent;

            if (!(pages.length > 0)) {
              _context.next = 11;
              break;
            }

            _context.t0 = pages[0];
            _context.next = 14;
            break;

          case 11:
            _context.next = 13;
            return browser.newPage();

          case 13:
            _context.t0 = _context.sent;

          case 14:
            page = _context.t0;
            _context.next = 17;
            return page.setViewport({
              width: 1366,
              height: 768
            });

          case 17:
            _context.next = 19;
            return page.goto(pageName, {
              waitUntil: 'load',
              timeout: 30000
            });

          case 19:
            response = _context.sent;
            //wait for 10 secs as timeout
            //log(await page.cookies());
            //await page.waitForNavigation();
            //log('after navigation done');
            //assumed page loaded
            pageConfig = metadata.pages.find(function (pg) {
              return response.url().indexOf(pg.name) > -1;
            });
            actionItem = pageConfig.actions[0];
            /* puppeteer issues*/
            // const elementHandle = await page.$('body').catch((reason)=> log(reason));
            // elementHandle.constructor.prototype.boundingBox = async function() {
            //   const box = await this.executionContext().evaluate(element => {
            //     const rect = element.getBoundingClientRect();
            //     const x = Math.max(rect.left, 0);
            //     const width = Math.min(rect.right, window.innerWidth) - x;
            //     const y = Math.max(rect.top, 0);
            //     const height = Math.min(rect.bottom, window.innerHeight) - y;
            //     return { x: x, width: width, y: y, height: height };
            //   }, this);
            //   return box;
            // };
            // elementHandle.dispose();

            /*End of fixes */
            //log(actionItem);

            iidx = 0;

          case 23:
            if (!(iidx < actionItem.userinputs.length)) {
              _context.next = 49;
              break;
            }

            _context.prev = 24;
            val = actionItem.userinputs[iidx];
            idx = iidx; // autoScrollToHight(page, 0);
            // page.waitFor(100);
            //log(JSON.stringify(val) + ' - ' + idx);

            if (!(val.action === 'keyed')) {
              _context.next = 34;
              break;
            }

            _context.next = 30;
            return page.click(val.selector).then(function (val1, val2) {});

          case 30:
            _context.next = 32;
            return page.keyboard.type(val.value).then(function (val1, val2) {});

          case 32:
            _context.next = 40;
            break;

          case 34:
            if (!(val.action === 'click')) {
              _context.next = 40;
              break;
            }

            _context.next = 37;
            return page.click(val.selector);

          case 37:
            if (!(val.checkselector !== '' && val.checkselector !== null)) {
              _context.next = 40;
              break;
            }

            _context.next = 40;
            return page.waitForSelector(val.checkselector, {
              timeout: TIMEOUT
            });

          case 40:
            _context.next = 46;
            break;

          case 42:
            _context.prev = 42;
            _context.t1 = _context["catch"](24);
            log('err1');
            log(_context.t1);

          case 46:
            iidx++;
            _context.next = 23;
            break;

          case 49:
            _context.next = 53;
            break;

          case 51:
            _context.prev = 51;
            _context.t2 = _context["catch"](0);

          case 53:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 51], [24, 42]]);
  }));
  return _navigatePage.apply(this, arguments);
}

function ProcessActivity(_x2) {
  return _ProcessActivity.apply(this, arguments);
}

function _ProcessActivity() {
  _ProcessActivity = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(targetUri) {
    var runid,
        repeatsourceContent,
        repeatsourceData,
        repeatsourceType,
        repeatsource,
        isrepeat,
        type,
        loopCount,
        i,
        repeatsourceDataValue,
        src_dest,
        key,
        storeData,
        iidx,
        userInput,
        action,
        methodName,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            runid = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : uuid5();
            _context2.prev = 1;

            if (!(targetUri === undefined || targetUri === null || targetUri === "")) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt("return");

          case 4:
            _context2.next = 6;
            return navigatePage(targetUri);

          case 6:
            if (!(browser !== null && page !== null)) {
              _context2.next = 100;
              break;
            }

            pageIdx = 1;

          case 8:
            if (!(pageIdx < metadata.pages.length)) {
              _context2.next = 99;
              break;
            }

            pageConfig = metadata.pages[pageIdx]; // pageConfig = metadata.pages.find(pg => {
            //     return page.url().indexOf(pg.name)>-1;
            // });

            repeatsourceContent = null;
            repeatsourceData = null;
            repeatsourceType = null;
            repeatsource = null;
            isrepeat = pageConfig.actions[0].repeat === undefined || pageConfig.actions[0].repeat === null ? false : pageConfig.actions[0].repeat;

            if (!isrepeat) {
              _context2.next = 36;
              break;
            }

            // let ctrlItem = await page.evaluate(() => {
            //     let chatCtrl = document.querySelector('div.meshim_widget_components_chatButton_Button.ltr');
            //     if(chatCtrl!==null) {
            //         chatCtrl.setAttribute('style', 'display:none');
            //     }
            // });
            repeatsource = pageConfig.actions[0].repeatsource;
            repeatsourceType = repeatsource === undefined || repeatsource === null ? null : repeatsource instanceof Array ? 'array' : repeatsource instanceof Number ? 'number' : typeof repeatsource === 'function' ? 'function' : null;

            if (repeatsourceType === 'array' || repeatsourceType === 'number') {
              repeatsourceData = repeatsource;
            } else if (repeatsourceType === 'function') {
              repeatsourceData = repeatsource;
            }

            if (!(pageConfig.actions[0].repeatsourceselector !== undefined && pageConfig.actions[0].repeatsourceselector !== null && isrepeat)) {
              _context2.next = 36;
              break;
            }

            //repeatsourceControl = await objPage.$$(pageConfig.actions[0].repeatsourceselector);
            type = pageConfig.actions[0].repeatsourceContentType === undefined || pageConfig.actions[0].repeatsourceContentType === undefined ? 'html' : pageConfig.actions[0].repeatsourceContentType;

            if (!(type === 'html')) {
              _context2.next = 29;
              break;
            }

            _context2.next = 24;
            return page.waitForSelector(pageConfig.actions[0].repeatsourceselector, {
              timeout: TIMEOUT
            });

          case 24:
            _context2.next = 26;
            return page.$eval(pageConfig.actions[0].repeatsourceselector, function (e) {
              return e.innerHTML;
            });

          case 26:
            repeatsourceContent = _context2.sent;
            _context2.next = 35;
            break;

          case 29:
            if (!(type === 'text')) {
              _context2.next = 35;
              break;
            }

            _context2.next = 32;
            return page.waitForSelector(pageConfig.actions[0].repeatsourceselector, {
              timeout: TIMEOUT
            });

          case 32:
            _context2.next = 34;
            return page.$eval(pageConfig.actions[0].repeatsourceselector, function (e) {
              return e.innerText;
            });

          case 34:
            repeatsourceContent = _context2.sent;

          case 35:
            if (repeatsourceType === 'array' || repeatsourceType === 'number') {
              repeatsourceData = repeatsource;
            } else if (repeatsourceType === 'function') {
              //log('getting repeatSourceData');
              repeatsourceData = repeatsource(repeatsourceContent); //it should return array
              //log('got repeatSourceData');

              if (repeatsourceData instanceof Number) {
                repeatsourceType = 'number';
              } else if (repeatsourceData instanceof Array) {
                repeatsourceType = 'array';
              } else if (repeatsourceData instanceof Object) {
                repeatsourceType = 'object';
              }

              if (repeatsourceData === undefined) {
                repeatsourceData = null;
              }
            }

          case 36:
            if (!(pageConfig !== null)) {
              _context2.next = 96;
              break;
            }

            loopCount = 1;

            if (repeatsourceType === null || repeatsourceType === 'object') {
              loopCount = 1;
            } else if (repeatsourceType === 'number') {
              loopCount = parseInt(repeatsourceData);
            } else if (repeatsourceType === 'array') {
              loopCount = repeatsourceData.length;
            } //for(var i=0; i<loopCount; i++) { //


            i = 0;

          case 40:
            if (!(i < loopCount)) {
              _context2.next = 96;
              break;
            }

            repeatsourceDataValue = repeatsourceType === 'array' ? repeatsourceData[i] : 'NA';
            src_dest = repeatsourceDataValue.match(/\((.*?)\)/gi);
            key = '';

            if (src_dest !== null && src_dest.length > 1) {
              key = src_dest[0].replace('(', '').replace(')', '') + '_' + src_dest[1].replace('(', '').replace(')', '');
              storeData = getStore();
              storeData[key] = [];
            }

            log("".concat(i, " - ").concat(repeatsourceDataValue)); //remove false from here, this is just for testing.

            if (!(pageConfig.actions[0].userinputs.length > 0)) {
              _context2.next = 80;
              break;
            }

            //for(var iidx=0; iidx<pageConfig.actions[0].userinputs.length; iidx++) {
            iidx = 0;

          case 48:
            if (!(iidx < pageConfig.actions[0].userinputs.length)) {
              _context2.next = 78;
              break;
            }

            userInput = pageConfig.actions[0].userinputs[iidx]; //this is the place we need to use repeat functionality

            if (!(repeatsourceType === null)) {
              _context2.next = 55;
              break;
            }

            _context2.next = 53;
            return performUserOperation(page, userInput, i, runid);

          case 53:
            _context2.next = 75;
            break;

          case 55:
            if (!(repeatsourceType === 'number')) {
              _context2.next = 60;
              break;
            }

            _context2.next = 58;
            return performUserOperation(page, userInput, i, runid);

          case 58:
            _context2.next = 75;
            break;

          case 60:
            if (!(repeatsourceType === 'array')) {
              _context2.next = 74;
              break;
            }

            _context2.prev = 61;
            _context2.next = 64;
            return performUserOperation(page, userInput, repeatsourceData[i], i, runid);

          case 64:
            _context2.next = 72;
            break;

          case 66:
            _context2.prev = 66;
            _context2.t0 = _context2["catch"](61);
            log(_context2.t0); //if(e.toLowerCase()==='control missing') {

            log('Retrying once again.');
            iidx = pageConfig.actions[0].userinputs.length - 2;
            i--; //break;
            //}

          case 72:
            _context2.next = 75;
            break;

          case 74:
            if (repeatsourceType === 'object') {//no idea what to do here
            }

          case 75:
            iidx++;
            _context2.next = 48;
            break;

          case 78:
            _context2.next = 93;
            break;

          case 80:
            _context2.prev = 80;
            action = pageConfig.actions[0];

            if (!(action.type === 'code' && action.methodname !== undefined && action.methodname !== null)) {
              _context2.next = 88;
              break;
            }

            methodName = action.methodname;

            if (!(methodName !== undefined && methodName !== null)) {
              _context2.next = 88;
              break;
            }

            _context2.next = 87;
            return action[methodName].call(action, runid);

          case 87:
            log("".concat(methodName, " finished"));

          case 88:
            _context2.next = 93;
            break;

          case 90:
            _context2.prev = 90;
            _context2.t1 = _context2["catch"](80);
            log(_context2.t1);

          case 93:
            i++; //log(`Next operation ${i} starting`);

            _context2.next = 40;
            break;

          case 96:
            pageIdx++;
            _context2.next = 8;
            break;

          case 99:
            log('Operation completed');

          case 100:
            _context2.next = 105;
            break;

          case 102:
            _context2.prev = 102;
            _context2.t2 = _context2["catch"](1);
            log(_context2.t2);

          case 105:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 102], [61, 66], [80, 90]]);
  }));
  return _ProcessActivity.apply(this, arguments);
}

function transformData(textValue, providedData) {
  var value = textValue;

  try {
    var variables = [];
    var varStarted = false;
    var varEnd = false;
    var variable = "";

    for (var i = 0; i < textValue.length; i++) {
      var chr = textValue.charAt(i);

      if (chr === '$') {
        varStarted = true;
        variable += chr;
      } else if (chr === '{') {
        //varStarted = varStarted?true:false;
        if (varStarted) {
          variable += chr;
        }
      } else if (chr === '}') {
        if (varStarted) {
          varEnd = true;
          variable += chr;
        }

        if (varStarted && varEnd) {
          variables.push(variable);
          varStarted = false;
          varEnd = false;
          variable = "";
        }
      } else {
        if (varStarted) {
          variable += chr;
        }
      }
    }

    for (var i = 0; i < variables.length; i++) {
      value = value.replace(variables[i], providedData);
    }
  } catch (e) {
    log(e);
  }

  return value;
}

function performUserOperation(_x3, _x4, _x5, _x6, _x7, _x8) {
  return _performUserOperation.apply(this, arguments);
}
/*helper method */


function _performUserOperation() {
  _performUserOperation = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(objPage, userInput, data, ndx, runid, callback) {
    var onError, _inputControl, keyedValue, _inputControl2, eventType, delayValue, keyValue, inputControl, _position, _position2, idx, innerText, jsonValue, ctrl, i, tsk, targetElement, returnValue;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            onError = false; //log(`performUserOperation ${userInput.action} starting`, userInput);

            _context3.t0 = userInput.action;
            _context3.next = _context3.t0 === 'keyed' ? 5 : _context3.t0 === 'click' ? 57 : 206;
            break;

          case 5:
            if (!(typeof userInput.value === "string")) {
              _context3.next = 19;
              break;
            }

            if (!userInput.selector) {
              _context3.next = 11;
              break;
            }

            _context3.next = 9;
            return objPage.$(userInput.selector).catch(function (reason) {
              return log(reason);
            });

          case 9:
            _inputControl = _context3.sent;

            if (_inputControl && _inputControl.click) {
              _inputControl.click();
            }

          case 11:
            keyedValue = userInput.value;

            if (userInput.value.indexOf('${') > -1) {
              keyedValue = transformData(userInput.value, data);
            }

            _context3.next = 15;
            return page.keyboard.type(keyedValue);

          case 15:
            _context3.next = 17;
            return page.waitFor(400);

          case 17:
            _context3.next = 56;
            break;

          case 19:
            if (!(_typeof(userInput.value) === "object")) {
              _context3.next = 56;
              break;
            }

            if (!userInput.selector) {
              _context3.next = 33;
              break;
            }

            _context3.next = 23;
            return objPage.$(userInput.selector).catch(function (reason) {
              return log(reason);
            });

          case 23:
            _inputControl2 = _context3.sent;

            if (!(_inputControl2 && _inputControl2.click)) {
              _context3.next = 33;
              break;
            }

            _inputControl2.click();

            if (!(userInput.checkselector !== '' && userInput.checkselector !== null)) {
              _context3.next = 31;
              break;
            }

            _context3.next = 29;
            return objPage.waitForSelector(userInput.checkselector, {
              timeout: TIMEOUT
            });

          case 29:
            _context3.next = 33;
            break;

          case 31:
            _context3.next = 33;
            return delay(200);

          case 33:
            eventType = userInput.value.eventtype;
            delayValue = parseInt(userInput.value.delay);
            ndx = 0;

          case 36:
            if (!(ndx < userInput.value.keys.length)) {
              _context3.next = 56;
              break;
            }

            keyValue = userInput.value.keys[ndx];
            overrideEventType = eventType;

            if (keyValue.indexOf('^') > -1) {
              if (keyValue.split('^')[1] !== "") overrideEventType = keyValue.split('^')[1];
            }

            keyValue = keyValue.split('^')[0];

            if (!(keyValue !== null && keyValue !== "")) {
              _context3.next = 50;
              break;
            }

            if (!(overrideEventType === "keydown" || overrideEventType === "down")) {
              _context3.next = 47;
              break;
            }

            _context3.next = 45;
            return objPage.keyboard.down(keyValue);

          case 45:
            _context3.next = 50;
            break;

          case 47:
            if (!(overrideEventType === "keyup" || overrideEventType === "up")) {
              _context3.next = 50;
              break;
            }

            _context3.next = 50;
            return objPage.keyboard.up(keyValue);

          case 50:
            if (!(delayValue > 0)) {
              _context3.next = 53;
              break;
            }

            _context3.next = 53;
            return delay(delayValue);

          case 53:
            ndx++;
            _context3.next = 36;
            break;

          case 56:
            return _context3.abrupt("break", 207);

          case 57:
            //objPage.$(//*[@id="04c6e90faac2675aa89e2176d2eec7d8-4ea1851c99601c376d6e040dd01aedc5dd40213b"])
            inputControl = null;
            _context3.prev = 58;

            if (!(userInput.checkcontent !== null && userInput.checkcontent !== "")) {
              _context3.next = 82;
              break;
            }

            _context3.prev = 60;
            _position = 0; // let values = await objPage.evaluate((sel) => {
            //     let controlItem = (await document.getElementsByClassName(sel)) || 
            //         (await document.getElementById(sel));
            //     if(controlItem.text===userInput.checkcontent) {
            //         inputControl = 
            //     }
            // }, userInput.selector);

            if (!(userInput.controlid !== "" && userInput.controlid !== null)) {
              _context3.next = 69;
              break;
            }

            //log('3', userInput.controlid);
            _position = 4;
            _context3.next = 66;
            return objPage.$$(userInput.controlid).catch(function (reason) {
              return log("1 - ".concat(reason));
            });

          case 66:
            inputControl = _context3.sent;
            _context3.next = 74;
            break;

          case 69:
            if (!(userInput.selector !== "" && userInput.selector !== null)) {
              _context3.next = 74;
              break;
            }

            //log('4', userInput.selector);
            _position = 5;
            _context3.next = 73;
            return objPage.$$(userInput.selector).catch(function (reason) {
              return log("2 - ".concat(reason));
            });

          case 73:
            inputControl = _context3.sent;

          case 74:
            _context3.next = 80;
            break;

          case 76:
            _context3.prev = 76;
            _context3.t1 = _context3["catch"](60);
            log("en1 - ".concat(position));
            log(_context3.t1);

          case 80:
            _context3.next = 109;
            break;

          case 82:
            _context3.prev = 82;
            _position2 = 0;

            if (!(userInput.controlid !== "" && userInput.controlid !== null)) {
              _context3.next = 91;
              break;
            }

            //log('5', userInput.controlid);
            _position2 = 1;
            _context3.next = 88;
            return objPage.$(userInput.controlid).catch(function (reason) {
              return log("3 - ".concat(reason));
            });

          case 88:
            inputControl = _context3.sent;
            _context3.next = 103;
            break;

          case 91:
            if (!(userInput.selector !== "" && userInput.selector !== null)) {
              _context3.next = 103;
              break;
            }

            if (!(userInput.isarray != null && userInput.isarray)) {
              _context3.next = 99;
              break;
            }

            //log('6', userInput.selector);
            _position2 = 2;
            _context3.next = 96;
            return objPage.$$(userInput.selector).catch(function (reason) {
              return log("4 - ".concat(reason));
            });

          case 96:
            inputControl = _context3.sent;
            _context3.next = 103;
            break;

          case 99:
            //log('7', userInput.selector);
            _position2 = 3;
            _context3.next = 102;
            return objPage.$(userInput.selector).catch(function (reason) {
              return log("5 - ".concat(reason));
            });

          case 102:
            inputControl = _context3.sent;

          case 103:
            _context3.next = 109;
            break;

          case 105:
            _context3.prev = 105;
            _context3.t2 = _context3["catch"](82);
            log("en2 - ".concat(position));
            log(_context3.t2);

          case 109:
            if (!(userInput.checkcontent !== null && userInput.checkcontent !== "" && inputControl instanceof Array)) {
              _context3.next = 129;
              break;
            }

            idx = 0;

          case 111:
            if (!(idx < inputControl.length)) {
              _context3.next = 129;
              break;
            }

            _context3.next = 114;
            return inputControl[idx].getProperty('text');

          case 114:
            innerText = _context3.sent;
            innerText = innerText._remoteObject.value;
            _context3.next = 118;
            return inputControl[idx].jsonValue();

          case 118:
            jsonValue = _context3.sent;

            if (!(userInput.checkcontent !== null && userInput.checkcontent !== "" && innerText === userInput.checkcontent)) {
              _context3.next = 124;
              break;
            }

            inputControl = inputControl[idx];
            return _context3.abrupt("break", 129);

          case 124:
            inputControl = inputControl[0];
            return _context3.abrupt("break", 129);

          case 126:
            idx++;
            _context3.next = 111;
            break;

          case 129:
            _context3.next = 135;
            break;

          case 131:
            _context3.prev = 131;
            _context3.t3 = _context3["catch"](58);
            log('err');
            log(_context3.t3);

          case 135:
            if (!(inputControl != null)) {
              _context3.next = 205;
              break;
            }

            if (inputControl instanceof Array) {
              _context3.next = 163;
              break;
            }

            _context3.prev = 137;
            _context3.next = 140;
            return setProprtyItem(page, 'body > div:nth-child(1)', 'style', 'display:none');

          case 140:
            _context3.next = 146;
            break;

          case 142:
            _context3.prev = 142;
            _context3.t4 = _context3["catch"](137);
            log('zopim Error');
            log(_context3.t4);

          case 146:
            _context3.next = 148;
            return page.click(userInput.selector);

          case 148:
            _context3.next = 150;
            return page.waitFor(300);

          case 150:
            if (!(userInput.checkselector !== '' && userInput.checkselector !== null)) {
              _context3.next = 161;
              break;
            }

            _context3.prev = 151;
            _context3.next = 154;
            return page.waitForSelector(userInput.checkselector, {
              timeout: TIMEOUT
            });

          case 154:
            _context3.next = 161;
            break;

          case 156:
            _context3.prev = 156;
            _context3.t5 = _context3["catch"](151);
            log('e2');
            log(_context3.t5);
            return _context3.abrupt("return");

          case 161:
            _context3.next = 205;
            break;

          case 163:
            idx = 0;

          case 164:
            if (!(idx < inputControl.length)) {
              _context3.next = 204;
              break;
            }

            ctrl = inputControl[idx]; //log(`Perform ${userInput.tasks.length} tasks`, `On ${inputControl.length} controls`, ctrl);

            if (!(userInput.tasks !== null && userInput.tasks.length > 0)) {
              _context3.next = 200;
              break;
            }

            //userInput.tasks.forEach((tsk, i) => {
            //log("Array inputControl", idx, ctrl);
            //noprotect
            onError = false;
            i = 0;

          case 169:
            if (!(i < userInput.tasks.length)) {
              _context3.next = 197;
              break;
            }

            tsk = userInput.tasks[i];
            targetElement = ctrl;

            if (!(tsk.selector !== undefined && tsk.selector !== null && tsk.selector !== "")) {
              _context3.next = 189;
              break;
            }

            if (!(tsk.selector !== '' && tsk.selector !== null)) {
              _context3.next = 186;
              break;
            }

            onError = false;
            _context3.prev = 175;
            _context3.next = 178;
            return page.waitForSelector(tsk.selector, {
              timeout: TIMEOUT
            });

          case 178:
            _context3.next = 186;
            break;

          case 180:
            _context3.prev = 180;
            _context3.t6 = _context3["catch"](175);
            log('e1');
            log(_context3.t6); //await page.screenshot({path: `${tsk.selector}_${moment(new Date()).format('DD-MMM-YYY_HH_mm_ss')}.png`});

            onError = true;
            throw 'control missing';

          case 186:
            _context3.next = 188;
            return objPage.$(tsk.selector).catch(function (reason) {
              return log(reason);
            });

          case 188:
            targetElement = _context3.sent;

          case 189:
            _context3.next = 191;
            return performTask(objPage, userInput, inputControl, targetElement, tsk, i, runid);

          case 191:
            returnValue = _context3.sent;
            _context3.next = 194;
            return page.waitFor(400);

          case 194:
            i++;
            _context3.next = 169;
            break;

          case 197:
            ;
            _context3.next = 201;
            break;

          case 200:
            if (userInput.action && userInput.action === 'click') {//log('not sure what to click');
            }

          case 201:
            idx++;
            _context3.next = 164;
            break;

          case 204:
            ;

          case 205:
            return _context3.abrupt("break", 207);

          case 206:
            return _context3.abrupt("break", 207);

          case 207:
            _context3.next = 213;
            break;

          case 209:
            _context3.prev = 209;
            _context3.t7 = _context3["catch"](0);
            log(_context3.t7);
            throw _context3.t7;

          case 213:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 209], [58, 131], [60, 76], [82, 105], [137, 142], [151, 156], [175, 180]]);
  }));
  return _performUserOperation.apply(this, arguments);
}

function autoScroll(_x9) {
  return _autoScroll.apply(this, arguments);
}

function _autoScroll() {
  _autoScroll = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(page) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return page.evaluate(
            /*#__PURE__*/
            _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee4() {
              return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.next = 2;
                      return new Promise(function (resolve, reject) {
                        var totalHeight = 0;
                        var distance = 100;
                        var timer = setInterval(function () {
                          var scrollHeight = document.body.scrollHeight;
                          window.scrollBy(0, distance);
                          totalHeight += distance;

                          if (totalHeight >= scrollHeight) {
                            clearInterval(timer);
                            resolve();
                          }
                        }, 100);
                      });

                    case 2:
                    case "end":
                      return _context4.stop();
                  }
                }
              }, _callee4);
            })));

          case 2:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _autoScroll.apply(this, arguments);
}

function autoScrollToHight(_x10, _x11) {
  return _autoScrollToHight.apply(this, arguments);
}

function _autoScrollToHight() {
  _autoScrollToHight = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(page, hightPercentage) {
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return page.evaluate(
            /*#__PURE__*/
            function () {
              var _ref2 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee6(hp) {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return new Promise(function (resolve, reject) {
                          var scrollHeight = 0;
                          if (hp > 0) scrollHeight = document.body.scrollHeight / hp * 100; //console.log('Scrolling ...');

                          if (hp > 0) window.scrollBy(0, scrollHeight);else window.scrollTo(0, 0);
                          resolve();
                        });

                      case 2:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function (_x23) {
                return _ref2.apply(this, arguments);
              };
            }(), hightPercentage);

          case 2:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _autoScrollToHight.apply(this, arguments);
}

function setProprtyItem(_x12, _x13, _x14, _x15) {
  return _setProprtyItem.apply(this, arguments);
}
/*end of helper */


function _setProprtyItem() {
  _setProprtyItem = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(page, selector, property, value) {
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return page.evaluate(
            /*#__PURE__*/
            function () {
              var _ref3 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee8(sel, prop, val) {
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        _context8.next = 2;
                        return new Promise(function (resolve, reject) {
                          try {
                            var elm = document.querySelector(sel);
                            if (elm) elm.style.display = 'none'; // if(elm) {
                            //     elm.setProperty('style', 'display: none');
                            // }
                            //window.scrollBy(0, scrollHeight);

                            resolve();
                          } catch (eex) {
                            reject(eex);
                          }
                        });

                      case 2:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8);
              }));

              return function (_x24, _x25, _x26) {
                return _ref3.apply(this, arguments);
              };
            }(), selector, property, value);

          case 2:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));
  return _setProprtyItem.apply(this, arguments);
}

function performTask(_x16, _x17, _x18, _x19, _x20, _x21, _x22) {
  return _performTask.apply(this, arguments);
} //jshint ignore:end
////*[@id="04c6e90faac2675aa89e2176d2eec7d8-4ea1851c99601c376d6e040dd01aedc5dd40213b"]
//var stdin = process.openStdin();
//require('tty').setRawMode(true);
// var stdin = process.openStdin();
// if(stdin.isTTY) {
//     log('Keypress Event added');
//     stdin.on("keypress", function(chunk, key) {
//         log('Chunk : ' + chunk + "\n");
//         log('Key : ' + key + "\n");
//         if(key && (key.name=='c' || key.name=='C')) {
//             if(browser) {
//                 browser.close();
//             }
//         }
//     });
// }


function _performTask() {
  _performTask = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(objPage, userInput, inputControl, element, task, idx, runid) {
    var selector, targetElement, content, contentsElements, i, msg, contentItem, iidx, plugin, parsedContent;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;

            if (!(task && task.action)) {
              _context10.next = 67;
              break;
            }

            if (!(task.action === 'click')) {
              _context10.next = 28;
              break;
            }

            _context10.prev = 3;
            //log(typeof(element));
            selector = task.selector || element._remoteObject.description; //log(`performTask Section : ${selector}`);
            //log(element);
            // if(selector!==null && selector!=='') {
            //     await page.click(task.selector);
            //     await page.waitFor(200);
            // }
            //var value = await element.getProperty('value');
            // var textValue = await element.getProperty('text');
            // if(textValue!=null)
            //     log(`${idx} - Link text => ${textValue._remoteObject.value.trim()}`);
            // else
            //     log(`${idx} - Link text => EMPTY`);
            //Right code
            // await page.evaluate(() => {
            //     document.querySelector(selector).scrollIntoView();
            // });

            if (!element.click) {
              _context10.next = 17;
              break;
            }

            _context10.prev = 6;
            _context10.next = 9;
            return setProprtyItem(page, 'body > div:nth-child(1)', 'style', 'display:none');

          case 9:
            _context10.next = 14;
            break;

          case 11:
            _context10.prev = 11;
            _context10.t0 = _context10["catch"](6);
            log(_context10.t0);

          case 14:
            _context10.next = 16;
            return element.click();

          case 16:
            page.waitFor(200); // autoScrollToHight(page, 0);
            // page.waitFor(100);

          case 17:
            if (!(task.checkselector !== '' && task.checkselector !== null)) {
              _context10.next = 20;
              break;
            }

            _context10.next = 20;
            return page.waitForSelector(task.checkselector, {
              timeout: TIMEOUT
            });

          case 20:
            _context10.next = 26;
            break;

          case 22:
            _context10.prev = 22;
            _context10.t1 = _context10["catch"](3);
            log('eclick');
            log(_context10.t1);

          case 26:
            _context10.next = 67;
            break;

          case 28:
            if (!(task.action === 'read')) {
              _context10.next = 67;
              break;
            }

            targetElement = element;
            content = [];

            if (!(task.read_type === 'inner-text')) {
              _context10.next = 55;
              break;
            }

            _context10.prev = 32;
            _context10.next = 35;
            return page.$$(task.selector).catch(function (reason) {
              return log(reason);
            });

          case 35:
            contentsElements = _context10.sent;
            i = 0;

          case 37:
            if (!(i < contentsElements.length)) {
              _context10.next = 47;
              break;
            }

            _context10.next = 40;
            return contentsElements[i].getProperty('innerText');

          case 40:
            _context10.next = 42;
            return _context10.sent.jsonValue();

          case 42:
            msg = _context10.sent;
            content.push(msg);

          case 44:
            i++;
            _context10.next = 37;
            break;

          case 47:
            _context10.next = 53;
            break;

          case 49:
            _context10.prev = 49;
            _context10.t2 = _context10["catch"](32);
            log('erd_txt');
            log(_context10.t2);

          case 53:
            _context10.next = 66;
            break;

          case 55:
            if (!(task.read_type === 'inner-html')) {
              _context10.next = 66;
              break;
            }

            _context10.prev = 56;
            _context10.next = 59;
            return page.$eval(task.selector, function (e) {
              return e.innerHTML;
            });

          case 59:
            content = _context10.sent;
            _context10.next = 66;
            break;

          case 62:
            _context10.prev = 62;
            _context10.t3 = _context10["catch"](56);
            log('erd_html');
            log(_context10.t3);

          case 66:
            if (task.plugins !== null && task.plugins.length > 0 && content !== null && content !== '') {
              try {
                for (i = 0; i < content.length; i++) {
                  contentItem = content[i];

                  for (iidx = 0; iidx < task.plugins.length; iidx++) {
                    plugin = task.plugins[iidx]; // task.plugins.forEach((plugin, iidx) => {

                    parsedContent = null;

                    if (plugin.parser !== null && typeof plugin.parser === 'function') {
                      parsedContent = plugin.parser(contentItem);
                    }

                    if (plugin.assess !== null && typeof plugin.assess === 'function') {
                      //capturedData = plugin.assess(contentItem, parsedContent, capturedData);
                      plugin.assess(contentItem, parsedContent, getStore(), runid, function (store) {
                        if (store) {//capturedData = store;
                        }
                      }); // capturedData = await new Promise((resolve, reject) => {
                      //     try
                      //     {
                      //         plugin.assess(contentItem, parsedContent, capturedData, function(capdata) {
                      //             resolve(capdata);
                      //         });
                      //     }
                      //     catch(e) {
                      //         log('e-plugin');
                      //         log(e);
                      //         page.screenshot({path: `${tsk.selector}_${moment(new Date()).format('DD-MMM-YYY_HH_mm_ss')}.png`});
                      //         return reject(e);
                      //     }
                      // }).catch((reason)=> {
                      //     log(reason);
                      //     return reject(reason);
                      // }).finally(()=> {
                      //     log('Request completed');
                      // });
                      //capturedData.push(parsedContent);
                      //log(`Captured Data : \n ${JSON.stringify(capturedData)}`);
                    }
                  }

                  ;
                }
              } catch (ex1) {
                log('ex1');
                log(ex1);
              }
            }

          case 67:
            _context10.next = 74;
            break;

          case 69:
            _context10.prev = 69;
            _context10.t4 = _context10["catch"](0);
            log('fe error');
            log(_context10.t4);
            throw _context10.t4;

          case 74:
            return _context10.abrupt("return");

          case 75:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[0, 69], [3, 22], [6, 11], [32, 49], [56, 62]]);
  }));
  return _performTask.apply(this, arguments);
}

var excutionStarted = false;
cron.schedule("*/30 * * * *", function () {
  log("Cron started");
  if (excutionStarted) return false;

  try {
    excutionStarted = true;
    capturedData = {};
    process.on('unhandledRejection', function (reason, promise) {
      log('Unhandled Rejection at:', reason.stack || reason); // Recommended: send the information to sentry.io
      // or whatever crash reporting service you use
    });
    var runid = "".concat(uuidv4(), "_").concat(moment().format("DD-MMM-YYYY HH:mm:ss.SSS"));
    var crawlingUri = "https://www.neptunenext.com/agent/general/index";
    ProcessActivity(crawlingUri, runid).then(function () {
      //what to do after the promise being called
      try {
        log('Process completed.');
        log(JSON.stringify(capturedData)); //log('Closing Browser');
        //page.waitFor(500);

        browser.close();
      } catch (e) {
        log(e);
      } finally {
        //process.exit(0);
        excutionStarted = false;
      }
    }).catch(function (reason) {
      log(reason);
      log(JSON.stringify(capturedData)); //log('Closing Browser');

      page.waitFor(500);
      excutionStarted = false;
      browser.close();
    });
  } catch (e) {
    log(e);
    excutionStarted = false;
  }
});
log("Starting ".concat(process.env.NODE_ENV, " server"));
app.listen("3128");