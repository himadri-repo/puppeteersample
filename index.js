//In this program we will be logging into github and will be downloading specific file.

//jshint esversion:6
//const tty = require('tty');
const cron = require("node-cron");
const express = require("express");
const fs = require("fs");

const uuidv4 = require('uuid/v4');
const puppeteer = require('puppeteer');
const metadata = require('./metadata');
const delay = require('delay');
const moment = require('moment');

app = express();

const TIMEOUT = 5000;

var browser = null;
var page = null;
var pageConfig = null;
var capturedData = {};
//jshint ignore:start

function log() {
    var time = moment().format("HH:mm:ss.SSS");
    var args = Array.from(arguments);

    args.unshift(time);
    console.log.apply(console, args);
}

async function navigatePage(pageName) {
    try
    {
        //log('before launch of browser');
        browser = await puppeteer.launch(
            {
                headless:true,
                ignoreDefaultArgs: ['--enable-automation'],
                args: ['--start-fullscreen']
                //slowMo: 100
            }).catch((reason) => {
                log(reason);
                return;
            });
        //const page = await browser.newPage();
        let pages = await browser.pages();
        page = pages.length>0?pages[0]:await browser.newPage();
        //log('after new page created');
        await page.setViewport({ width: 1366, height: 768});
        //log('after view port');
        /*page.setRequestInterception(true);
        page.on("load", interceptedRequest => {
            log("Load -> " + interceptedRequest.url());
        });*/
        //const response = await page.goto("https://github.com/login");
        let response = await page.goto(pageName, {waitUntil:'load', timeout:30000}); //wait for 10 secs as timeout
        //log(await page.cookies());
        //await page.waitForNavigation();
        log('after navigation done');
        //assumed page loaded
        pageConfig = metadata.pages.find(pg => {
            return response.url().indexOf(pg.name)>-1;
        });

        var actionItem = pageConfig.actions[0];
        
        /* puppeteer issues*/
        const elementHandle = await page.$('body').catch((reason)=> log(reason));
        elementHandle.constructor.prototype.boundingBox = async function() {
          const box = await this.executionContext().evaluate(element => {
            const rect = element.getBoundingClientRect();
            const x = Math.max(rect.left, 0);
            const width = Math.min(rect.right, window.innerWidth) - x;
            const y = Math.max(rect.top, 0);
            const height = Math.min(rect.bottom, window.innerHeight) - y;
            return { x: x, width: width, y: y, height: height };
          }, this);
          return box;
        };
        elementHandle.dispose();
        /*End of fixes */

        //log(actionItem);

        for(var iidx=0; iidx<actionItem.userinputs.length; iidx++) {
            try
            {
                var val = actionItem.userinputs[iidx];
                var idx = iidx;

                log(JSON.stringify(val) + ' - ' + idx);
                if(val.action==='keyed') {
                    //log('Going to click');
                    await page.click(val.selector).then(function(val1, val2) {
                        //log('Click finished');
                    });
                    //log('Clicked');
                    await page.keyboard.type(val.value).then(function(val1, val2) {
                        //log('Key pressed');
                    });
                    //log('Keyed');
                }
                else if(val.action==='click') { 
                    await page.click(val.selector);
                    if(val.checkselector!=='' && val.checkselector!==null) {
                        await page.waitForSelector(val.checkselector, {timeout: TIMEOUT});
                    }
                }
            }
            catch(err) {
                log(err);
            }
        }
    }
    catch(fe) {

    }
}

async function ProcessActivity(targetUri, runid=uuid5()) {
    //await navigatePage("https://github.com/login");
    try
    {
        if(targetUri===undefined || targetUri===null || targetUri==="")
            return;

        await navigatePage(targetUri);
        log('Page navigated...');
        if(browser!==null && page!==null) {
            log('URL -> ' + page.url());

            for(pageIdx=1; pageIdx<metadata.pages.length; pageIdx++) {
                pageConfig = metadata.pages[pageIdx];
                // pageConfig = metadata.pages.find(pg => {
                //     return page.url().indexOf(pg.name)>-1;
                // });
                let repeatsourceContent = null;
                let repeatsourceData = null;
                let repeatsourceType = null;
                let repeatsource = null;

                let isrepeat = (pageConfig.actions[0].repeat===undefined || pageConfig.actions[0].repeat===null)?false:pageConfig.actions[0].repeat;
                if(isrepeat) {
                    repeatsource = pageConfig.actions[0].repeatsource;
                    repeatsourceType = (repeatsource===undefined || repeatsource===null)?null:((repeatsource instanceof Array)?
                        'array':((repeatsource instanceof Number)?'number':(typeof(repeatsource)==='function'?'function':null)));
                    if(repeatsourceType==='array' || repeatsourceType==='number') {
                        repeatsourceData = repeatsource;
                    }
                    else if(repeatsourceType==='function') {
                        repeatsourceData = repeatsource;
                    }
                    
                    if( pageConfig.actions[0].repeatsourceselector!==undefined && 
                        pageConfig.actions[0].repeatsourceselector!==null && isrepeat)
                    {
                        //repeatsourceControl = await objPage.$$(pageConfig.actions[0].repeatsourceselector);
                        let type = (pageConfig.actions[0].repeatsourceContentType===undefined || 
                                pageConfig.actions[0].repeatsourceContentType===undefined)?'html':
                                (pageConfig.actions[0].repeatsourceContentType);

                        if(type==='html') {
                            await page.waitForSelector(pageConfig.actions[0].repeatsourceselector, {timeout: TIMEOUT});
                            repeatsourceContent = await page.$eval(pageConfig.actions[0].repeatsourceselector, e => e.innerHTML);
                        }
                        else if(type==='text') {
                            await page.waitForSelector(pageConfig.actions[0].repeatsourceselector, {timeout: TIMEOUT});
                            repeatsourceContent = await page.$eval(pageConfig.actions[0].repeatsourceselector, e => e.innerText);
                        }

                        if(repeatsourceType==='array' || repeatsourceType==='number') {
                            repeatsourceData = repeatsource;
                        }
                        else if(repeatsourceType==='function') {
                            //log('getting repeatSourceData');
                            repeatsourceData = repeatsource(repeatsourceContent); //it should return array
                            //log('got repeatSourceData');
                            if(repeatsourceData instanceof Number) {
                                repeatsourceType = 'number';
                            }
                            else if(repeatsourceData instanceof Array) {
                                repeatsourceType = 'array';
                            }
                            else if(repeatsourceData instanceof Object) {
                                repeatsourceType = 'object';
                            }

                            if(repeatsourceData===undefined)
                            {
                                repeatsourceData = null;
                            }
                        }
                    }
                }

                if(pageConfig!==null) //We landed to right page now
                {
                    let loopCount = 1;
                    if(repeatsourceType===null || repeatsourceType==='object') {
                        loopCount = 1;
                    }
                    else if(repeatsourceType==='number') {
                        loopCount = parseInt(repeatsourceData);
                    }
                    else if(repeatsourceType==='array') {
                        loopCount = repeatsourceData.length;
                    }

                    //for(var i=0; i<loopCount; i++) { //
                    var i=0;
                    while(i<loopCount) {
                        let repeatsourceDataValue = (repeatsourceType==='array')?repeatsourceData[i]:'NA';
                        //log(`${i} - ${repeatsourceDataValue}`);
                        //remove false from here, this is just for testing.
                        if(pageConfig.actions[0].userinputs.length>0) {
                            for(var iidx=0; iidx<pageConfig.actions[0].userinputs.length; iidx++) {
                                var userInput =  pageConfig.actions[0].userinputs[iidx];
                                
                                //this is the place we need to use repeat functionality
                                if(repeatsourceType===null) {
                                    await performUserOperation(page, userInput, i, runid);
                                }
                                else if(repeatsourceType==='number') {
                                    await performUserOperation(page, userInput, i, runid);
                                }
                                else if(repeatsourceType==='array') {
                                    try
                                    {
                                        //log(`Perform user operation ${i} - ${userInput.action}`);
                                        await performUserOperation(page, userInput, repeatsourceData[i], runid);
                                        // await performUserOperation(page, userInput, repeatsourceData[i], function(input, sourcedata) {
                                        //     log(`Error happened at index ${i}`);
                                        //     i--; break;
                                        // });
                                        //log(`Perform user operation ${i} - ${userInput.action} Done`);
                                    }
                                    catch(e) {
                                        log(e)
                                        //if(e.toLowerCase()==='control missing') {
                                        log('Retrying once again.')
                                        i--;
                                        break;
                                        //}
                                    }
                                }
                                else if(repeatsourceType==='object') {
                                    //no idea what to do here
                                }
                            }
                        }
                        else {
                            //there is no user input. Kind of code cleaning process.
                            try
                            {
                                let action = pageConfig.actions[0];
                                if(action.type==='code' && action.methodname!==undefined && action.methodname!==null) {
                                    let methodName = action.methodname;

                                    if(methodName!==undefined && methodName!==null) {
                                        await action[methodName].call(action, runid);
                                        log(`${methodName} finished`);
                                    }
                                }
                            }
                            catch(ep) {
                                log(ep);
                            }
                        }
                        i++;
                        //log(`Next operation ${i} starting`);
                    }
                }
            }

            log('Operation completed');
        }
    }
    catch(fe) {
        log(fe);
    }
    // finally {
    //     exhaustSeats4Rest()
    // }
}

function transformData(textValue, providedData) {
    var value = textValue;

    try {
        let variables = [];
        let varStarted = false;
        let varEnd = false;
        let variable = "";
        for(var i=0; i<textValue.length; i++)  {
            let chr = textValue.charAt(i);
            if(chr==='$') {
                varStarted = true;
                variable+=chr;
            }
            else if(chr==='{') {
                //varStarted = varStarted?true:false;
                if(varStarted) {
                    variable+=chr;
                }
            }
            else if(chr==='}') {
                if(varStarted) {
                    varEnd = true;
                    variable+=chr;
                }

                if(varStarted && varEnd) {
                    variables.push(variable);
                    varStarted=false;
                    varEnd=false;
                    variable="";
                }
            }
            else {
                if(varStarted) {
                    variable+=chr;
                }
            }
        }

        for(var i=0; i<variables.length; i++) {
            value = value.replace(variables[i], providedData);
        }
    }
    catch(e) {
        log(e);
    }

    return value;
}

async function performUserOperation(objPage, userInput, data, runid, callback) {
    try
    {
        var onError = false;
        //log(`performUserOperation ${userInput.action} starting`, userInput);
        switch (userInput.action) {
            case 'keyed':
                if(typeof(userInput.value)==="string") {
                    //await objPage.click(userInput.selector);
                    if(userInput.selector) {
                        //log('1', userInput.selector);
                        let inputControl = await objPage.$(userInput.selector).catch((reason)=> log(reason));
                        if(inputControl && inputControl.click) {
                            inputControl.click();
                        }
                    }
                    let keyedValue = userInput.value;
                    if(userInput.value.indexOf('${')>-1) {
                        keyedValue = transformData(userInput.value, data);
                    }

                    await page.keyboard.type(keyedValue);

                    await page.waitFor(400);
                    //log(`performUserOperation ${userInput.action} KEY CODE SENT`, keyedValue);
                }
                else if(typeof(userInput.value)==="object") { 
                    if(userInput.selector) {
                        //log('2', userInput.selector);
                        let inputControl = await objPage.$(userInput.selector).catch((reason)=> log(reason));
                        if(inputControl && inputControl.click) {
                            inputControl.click();
                            if(userInput.checkselector!=='' && userInput.checkselector!==null) {
                                await objPage.waitForSelector(userInput.checkselector, {timeout: TIMEOUT});
                            }
                            else
                            {
                                await delay(200);
                            }
                        }
                    }

                    var eventType = userInput.value.eventtype;
                    var delayValue = parseInt(userInput.value.delay);

                    for(var ndx=0; ndx<userInput.value.keys.length; ndx++) {
                        var keyValue = userInput.value.keys[ndx];
                        overrideEventType = eventType;
                        if(keyValue.indexOf('^')>-1)
                        {
                            if(keyValue.split('^')[1]!=="")
                                overrideEventType = keyValue.split('^')[1];
                            }
                            keyValue = keyValue.split('^')[0];

                        if(keyValue!==null && keyValue!=="") {
                            if(overrideEventType==="keydown" || overrideEventType==="down") {
                                await objPage.keyboard.down(keyValue);
                            }
                            else if(overrideEventType==="keyup" || overrideEventType==="up") {
                                await objPage.keyboard.up(keyValue);
                            }
                        }

                        if(delayValue>0) {
                            await delay(delayValue);
                        }
                    }
                }
                break;
            case 'click':
                //objPage.$(//*[@id="04c6e90faac2675aa89e2176d2eec7d8-4ea1851c99601c376d6e040dd01aedc5dd40213b"])
                var inputControl = null;

                try
                {
                    if(userInput.checkcontent!==null && userInput.checkcontent!=="") {
                        // let values = await objPage.evaluate((sel) => {
                        //     let controlItem = (await document.getElementsByClassName(sel)) || 
                        //         (await document.getElementById(sel));

                        //     if(controlItem.text===userInput.checkcontent) {
                        //         inputControl = 
                        //     }
                        // }, userInput.selector);

                        if(userInput.controlid!=="" && userInput.controlid!==null) {
                            //log('3', userInput.controlid);
                            inputControl = await objPage.$$(userInput.controlid).catch((reason)=> log(reason));
                        }
                        else if(userInput.selector!=="" && userInput.selector!==null) {
                            //log('4', userInput.selector);
                            inputControl = await objPage.$$(userInput.selector).catch((reason)=> log(reason));
                        }
                    }
                    else {
                        if(userInput.controlid!=="" && userInput.controlid!==null) {
                            //log('5', userInput.controlid);
                            inputControl = await objPage.$(userInput.controlid).catch((reason)=> log(reason));
                        }
                        else if(userInput.selector!=="" && userInput.selector!==null) {
                            if(userInput.isarray!=null && userInput.isarray) {
                                //log('6', userInput.selector);
                                inputControl = await objPage.$$(userInput.selector).catch((reason)=> log(reason));
                                //inputControl = await objPage.$(userInput.selector);
                                //log('Array type Input Control', inputControl);
                            }
                            else {
                                //log('7', userInput.selector);
                                inputControl = await objPage.$(userInput.selector).catch((reason)=> log(reason));
                            }
                        }
                    }

                    if((userInput.checkcontent!==null && 
                        userInput.checkcontent!=="") && inputControl instanceof Array) {
                        for(var idx=0; idx<inputControl.length; idx++) {
                            let innerText = await inputControl[idx].getProperty('text');
                            innerText = innerText._remoteObject.value;
                            let jsonValue = await inputControl[idx].jsonValue();
                            //log("Text -> "+innerText);
                            if(userInput.checkcontent!==null && 
                                userInput.checkcontent!=="" && 
                                innerText===userInput.checkcontent) 
                            {
                                inputControl = inputControl[idx];
                                break;
                            }
                            else {
                                inputControl = inputControl[0];
                                break;
                            }
                        }
                    }
                }
                catch(err) {
                    log(err);
                }
                if(inputControl!=null) {
                    //log("Going to start operation", inputControl);
                    // if(inputControl.click)
                    //     inputControl.click();
                    // else
                    // {
                    //     log(inputControl);
                    // }
                    if(!(inputControl instanceof Array)) {
                        //log("Input Control not Array", `Going to click ${userInput.selector}`);
                        await page.click(userInput.selector);
                        await page.waitFor(400);

                        if(userInput.checkselector!=='' && userInput.checkselector!==null) {
                            try
                            {
                                await page.waitForSelector(userInput.checkselector, {timeout: TIMEOUT});
                            }
                            catch(e2) {
                                log('e2');
                                log(e2);
                                return;
                            }
                        }
                        //log("Input Control not Array", `click ${userInput.selector} done`);
                    }
                    else {
                        //inputControl.forEach((ctrl, idx) => {
                        for(var idx=0; idx<inputControl.length; idx++) {
                            let ctrl = inputControl[idx];
                            //log(`Perform ${userInput.tasks.length} tasks`, `On ${inputControl.length} controls`, ctrl);
                            if(userInput.tasks!==null && userInput.tasks.length>0) {
                                //userInput.tasks.forEach((tsk, i) => {
                                //log("Array inputControl", idx, ctrl);
                                //noprotect
                                onError = false;
                                for(var i=0; i<userInput.tasks.length; i++) {
                                    let tsk = userInput.tasks[i];
                                    let targetElement = ctrl;
                                    if(tsk.selector!==undefined && tsk.selector!==null && tsk.selector!=="") {
                                        //log('Selector : ' + tsk.selector);
                                        if(tsk.selector!=='' && tsk.selector!==null) {
                                            onError = false;
                                            try
                                            {
                                                await page.waitForSelector(tsk.selector, {timeout: TIMEOUT});
                                            }
                                            catch(e1) {
                                                log('e1');
                                                log(e1);
                                                //await page.screenshot({path: `${tsk.selector}_${moment(new Date()).format('DD-MMM-YYY_HH_mm_ss')}.png`});
                                                onError = true;
                                                throw 'control missing';
                                                // if(callback) 
                                                //     callback(userInput, data);
                                                //if(callback) callback(e1);
                                                //return;
                                            }
                                        }
                                        //log('8', tsk.selector);
                                        targetElement = await objPage.$(tsk.selector).catch((reason)=> log(reason));
                                    }
                                    //log("Going to perform Task", tsk, i);
                                    let returnValue = await performTask(objPage, userInput, inputControl, targetElement, tsk, i, runid);
                                    //log("Task done", tsk, i);

                                    await page.waitFor(400); //delay to get UI refreshed with json data
                                };
                            }
                            else if(userInput.action && userInput.action==='click') {
                                //log('not sure what to click');
                            }
                        };
                    }
                }
                
                break;
            default:
                break;
        }
    }
    catch(fe) {
        log(fe);
        throw fe;
    }
    //log(`End of == performUserOperation ${userInput.action} starting`);
}

async function performTask(objPage, userInput, inputControl, element, task, idx, runid) {
    try
    {
        //log('Start performTask => ', idx, task);
        if(task && task.action) {
            if(task.action==='click') {
                //log(typeof(element));
                let selector = task.selector || element._remoteObject.description;
                log(`performTask Section : ${selector}`);
                //log(element);

                // if(selector!==null && selector!=='') {
                //     await page.click(task.selector);
                //     await page.waitFor(200);
                // }
                //Right code

                if(element.click) {
                    await element.click();
                    page.waitFor(100);
                }


                // if(task.selector!=='' && task.selector!==null && element.click) {
                //     //await page.click(task.selector);
                //     await page.waitForSelector(task.selector, {timeout: 30000});
                //     await element.click();
                //     page.waitFor(100);
                // }

                if(task.checkselector!=='' && task.checkselector!==null) {
                    await page.waitForSelector(task.checkselector, {timeout: TIMEOUT});
                }
            }
            else if(task.action==='read') {
                let targetElement = element;
                let content = [];
                if(task.read_type==='inner-text') {
                    //let content = await page.$eval(task.selector||userInput.selector); //targetElement._remoteObject.value;
                    // content = await page.$eval(task.selector, function(e) {
                    //     return e.innerText;
                    // }); //targetElement._remoteObject.value;
                    //log('9', task.selector);
                    let contentsElements = await page.$$(task.selector).catch((reason)=> log(reason));
                    for(var i=0; i<contentsElements.length; i++) {
                        let msg = await (await contentsElements[i].getProperty('innerText')).jsonValue();
                        content.push(msg);
                    }
                    // content = await page.$$eval(task.selector, function(e) {
                    //     log(`Length of element => ${e.length}`);
                    //     return e.innerText;
                    // }); //targetElement._remoteObject.value;
                    //log(content);
                }
                else if(task.read_type==='inner-html') {
                    //let content = await page.$eval(task.selector||userInput.selector); //targetElement._remoteObject.value;
                    content = await page.$eval(task.selector, e => e.innerHTML); //targetElement._remoteObject.value;
                    //content = await page.$$eval(task.selector, e => e.innerHTML); //targetElement._remoteObject.value;
                    //log(content);
                }
                if(task.plugins!==null && task.plugins.length>0 && content!==null && content!=='')
                {
                    for(var i=0; i<content.length; i++) {
                        let contentItem = content[i];
                        for(var iidx=0; iidx<task.plugins.length; iidx++) {
                            let plugin = task.plugins[iidx];
                        // task.plugins.forEach((plugin, iidx) => {
                            let parsedContent = null;
                            if(plugin.parser!==null && typeof(plugin.parser)==='function') {
                                parsedContent = plugin.parser(contentItem);
                            }
                            if(plugin.assess!==null && typeof(plugin.assess)==='function') {
                                //capturedData = plugin.assess(contentItem, parsedContent, capturedData);
                                plugin.assess(contentItem, parsedContent, capturedData, runid, function(store) {
                                    if(store)
                                    {
                                        capturedData = store;
                                    }
                                });
                                // capturedData = await new Promise((resolve, reject) => {
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
                        };
                    }
                }
            }
        }
        //log('End performTask => ', idx, task);
    }
    catch(fe) {
        log(fe);
        throw(fe);
    }
    return;
}

//jshint ignore:end
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

var excutionStarted = false;
//cron.schedule("*/30 * * * *", function() {
    log("Cron started");
    if(excutionStarted)
        return false;

    try
    {
        excutionStarted = true;
        capturedData = {};
        process.on('unhandledRejection', (reason, promise) => {
            log('Unhandled Rejection at:', reason.stack || reason);
            // Recommended: send the information to sentry.io
            // or whatever crash reporting service you use
        });

        let runid = `${uuidv4()}_${moment().format("DD-MMM-YYYY HH:mm:ss.SSS")}`;
        let crawlingUri = "https://www.neptunenext.com/agent/general/index";
        ProcessActivity(crawlingUri, runid).then(()=> {
            //what to do after the promise being called
            try
            {
                log('Process completed.');

                //log(JSON.stringify(capturedData));
                //log('Closing Browser');
                //page.waitFor(500);
                browser.close();
            }
            catch(e) {
                log(e);
            }
            finally {
                //process.exit(0);
                excutionStarted = false;
            }
        }).catch((reason) => {
            log(reason);
            log(JSON.stringify(capturedData));
            //log('Closing Browser');
            page.waitFor(500);
            excutionStarted = false;
            browser.close();
        });
    }
    catch(e) {
        log(e);
        excutionStarted = false;
    }
//});

app.listen("3128");