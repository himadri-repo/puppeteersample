//In this program we will be logging into github and will be downloading specific file.

//jshint esversion:6
//const tty = require('tty');
const puppeteer = require('puppeteer');
const metadata = require('./metadata');
const delay = require('delay');

var browser = null;
var page = null;
var pageConfig = null;
var capturedData = {};
//jshint ignore:start

// function log() {
//     var time = moment().format("HH:mm:ss.SSS");
//     var args = Array.from(arguments);

//     args.unshift(time);
//     console.log.apply(console, args);
// }

async function navigatePage(pageName) {
    try
    {
        browser = await puppeteer.launch(
            {
                headless:true,
                ignoreDefaultArgs: ['--enable-automation'],
                args: ['--start-fullscreen']
                //slowMo: 100
            }).catch((reason) => {
                console.log(reason);
                return;
            });
        //const page = await browser.newPage();
        let pages = await browser.pages();
        page = pages.length>0?pages[0]:await browser.newPage();
        await page.setViewport({ width: 1366, height: 768});
        /*page.setRequestInterception(true);
        page.on("load", interceptedRequest => {
            console.log("Load -> " + interceptedRequest.url());
        });*/
        //const response = await page.goto("https://github.com/login");
        let response = await page.goto(pageName, {waitUntil:'load', timeout:30000}); //wait for 10 secs as timeout

        //console.log(await page.cookies());
        //await page.waitForNavigation();
        //assumed page loaded
        pageConfig = metadata.pages.find(pg => {
            return response.url().indexOf(pg.name)>-1;
        });

        var actionItem = pageConfig.actions[0];
        
        /* puppeteer issues*/
        const elementHandle = await page.$('body');
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

        //console.log(actionItem);

        for(var iidx=0; iidx<actionItem.userinputs.length; iidx++) {
            try
            {
                var val = actionItem.userinputs[iidx];
                var idx = iidx;

                //console.log(val + ' - ' + idx);
                if(val.action==='keyed') {
                    await page.click(val.selector);
                    await page.keyboard.type(val.value);
                }
                else if(val.action==='click') { 
                    await page.click(val.selector);
                    if(val.checkselector!=='' && val.checkselector!==null) {
                        await page.waitForSelector(val.checkselector, {timeout: 30000});
                    }
                }
            }
            catch(err) {
                console.log(err);
            }
        }
    }
    catch(fe) {

    }
}

async function ProcessActivity(targetUri) {
    //await navigatePage("https://github.com/login");
    try
    {
        if(targetUri===undefined || targetUri===null || targetUri==="")
            return;

        await navigatePage(targetUri);
        if(browser!==null && page!==null) {
            console.log('URL -> ' + page.url());

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
                            await page.waitForSelector(pageConfig.actions[0].repeatsourceselector, {timeout: 30000});
                            repeatsourceContent = await page.$eval(pageConfig.actions[0].repeatsourceselector, e => e.innerHTML);
                        }
                        else if(type==='text') {
                            await page.waitForSelector(pageConfig.actions[0].repeatsourceselector, {timeout: 30000});
                            repeatsourceContent = await page.$eval(pageConfig.actions[0].repeatsourceselector, e => e.innerText);
                        }

                        if(repeatsourceType==='array' || repeatsourceType==='number') {
                            repeatsourceData = repeatsource;
                        }
                        else if(repeatsourceType==='function') {
                            repeatsourceData = repeatsource(repeatsourceContent); //it should return array
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

                    for(var i=0; i<loopCount; i++) { //
                        let repeatsourceDataValue = (repeatsourceType==='array')?repeatsourceData[i]:'NA';
                        //console.log(`${i} - ${repeatsourceDataValue}`);
                        for(var iidx=0; iidx<pageConfig.actions[0].userinputs.length; iidx++) {
                            var userInput =  pageConfig.actions[0].userinputs[iidx];
                            
                            //this is the place we need to use repeat functionality
                            if(repeatsourceType===null) {
                                await performUserOperation(page, userInput);
                            }
                            else if(repeatsourceType==='number') {
                                await performUserOperation(page, userInput, i);
                            }
                            else if(repeatsourceType==='array') {
                                try
                                {
                                    await performUserOperation(page, userInput, repeatsourceData[i]);
                                }
                                catch(e) {
                                    console.log(e)
                                }
                            }
                            else if(repeatsourceType==='object') {
                                //no idea what to do here
                            }
                        }
                    }
                }
            }

            console.log('Operation completed');
        }
    }
    catch(fe) {
        console.log(fe);
    }
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
        console.log(e);
    }

    return value;
}

async function performUserOperation(objPage, userInput, data) {
    try
    {
        switch (userInput.action) {
            case 'keyed':
                if(typeof(userInput.value)==="string") {
                    //await objPage.click(userInput.selector);
                    if(userInput.selector) {
                        let inputControl = await objPage.$(userInput.selector);
                        if(inputControl && inputControl.click) {
                            inputControl.click();
                        }
                    }
                    let keyedValue = userInput.value;
                    if(userInput.value.indexOf('${')>-1) {
                        keyedValue = transformData(userInput.value, data);
                    }

                    await page.keyboard.type(keyedValue);

                    await page.waitFor(200);
                }
                else if(typeof(userInput.value)==="object") { 
                    if(userInput.selector) {
                        let inputControl = await objPage.$(userInput.selector);
                        if(inputControl && inputControl.click) {
                            inputControl.click();
                            if(userInput.checkselector!=='' && userInput.checkselector!==null) {
                                await objPage.waitForSelector(userInput.checkselector, {timeout: 30000});
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
                            inputControl = await objPage.$$(userInput.controlid);
                        }
                        else if(userInput.selector!=="" && userInput.selector!==null) {
                            inputControl = await objPage.$$(userInput.selector);
                        }
                    }
                    else {
                        if(userInput.controlid!=="" && userInput.controlid!==null) {
                            inputControl = await objPage.$(userInput.controlid);
                        }
                        else if(userInput.selector!=="" && userInput.selector!==null) {
                            if(userInput.isarray!=null && userInput.isarray) {
                                inputControl = await objPage.$$(userInput.selector);
                                //inputControl = await objPage.$(userInput.selector);
                            }
                            else {
                                inputControl = await objPage.$(userInput.selector);
                            }
                        }
                    }

                    if((userInput.checkcontent!==null && 
                        userInput.checkcontent!=="") && inputControl instanceof Array) {
                        for(var idx=0; idx<inputControl.length; idx++) {
                            let innerText = await inputControl[idx].getProperty('text');
                            innerText = innerText._remoteObject.value;
                            let jsonValue = await inputControl[idx].jsonValue();
                            //console.log("Text -> " + innerText);
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
                    console.log(err);
                }
                if(inputControl!=null) {
                    //console.log(inputControl);
                    // if(inputControl.click)
                    //     inputControl.click();
                    // else
                    // {
                    //     console.log(inputControl);
                    // }
                    if(!(inputControl instanceof Array)) {
                        //console.log(userInput.selector);
                        await page.click(userInput.selector);
                        //await page.delay(4000);

                        if(userInput.checkselector!=='' && userInput.checkselector!==null) {
                            try
                            {
                                await page.waitForSelector(userInput.checkselector, {timeout: 30000});
                            }
                            catch(e2) {
                                console.log(e2);
                                return;
                            }
                        }
                    }
                    else {
                        //inputControl.forEach((ctrl, idx) => {
                        for(var idx=0; idx<inputControl.length; idx++) {
                            let ctrl = inputControl[idx];
                            if(userInput.tasks!==null && userInput.tasks.length>0) {
                                //userInput.tasks.forEach((tsk, i) => {
                                for(var i=0; i<userInput.tasks.length; i++) {
                                    let tsk = userInput.tasks[i];
                                    let targetElement = ctrl;
                                    if(tsk.selector!==undefined && tsk.selector!==null && tsk.selector!=="") {
                                        //console.log('Selector : ' + tsk.selector);
                                        if(tsk.selector!=='' && tsk.selector!==null) {
                                            try
                                            {
                                                await page.waitForSelector(tsk.selector, {timeout: 30000});
                                            }
                                            catch(e1) {
                                                console.log(e1);
                                                return;
                                            }
                                        }

                                        targetElement = await objPage.$(tsk.selector);
                                    }
                        
                                    let returnValue = await performTask(objPage, userInput, inputControl, targetElement, tsk, i);

                                    await page.waitFor(500); //delay to get UI refreshed with json data
                                };
                            }
                            else if(userInput.action && userInput.action==='click') {
                                console.log('not sure what to click');
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
        console.log(fe);
    }
}

async function performTask(objPage, userInput, inputControl, element, task, idx) {
    try
    {
        if(task && task.action) {
            if(task.action==='click') {
                //console.log(typeof(element));
                console.log(`performTask Section : ${task.selector || element._remoteObject.description}`);
                //console.log(element);

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
                    await page.waitForSelector(task.checkselector, {timeout: 30000});
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
                    let contentsElements = await page.$$(task.selector);
                    for(var i=0; i<contentsElements.length; i++) {
                        let msg = await (await contentsElements[i].getProperty('innerText')).jsonValue();
                        content.push(msg);
                    }
                    // content = await page.$$eval(task.selector, function(e) {
                    //     console.log(`Length of element => ${e.length}`);
                    //     return e.innerText;
                    // }); //targetElement._remoteObject.value;
                    //console.log(content);
                }
                else if(task.read_type==='inner-html') {
                    //let content = await page.$eval(task.selector||userInput.selector); //targetElement._remoteObject.value;
                    content = await page.$eval(task.selector, e => e.innerHTML); //targetElement._remoteObject.value;
                    //content = await page.$$eval(task.selector, e => e.innerHTML); //targetElement._remoteObject.value;
                    //console.log(content);
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
                                capturedData = plugin.assess(contentItem, parsedContent, capturedData);
                                //capturedData.push(parsedContent);
                            }
                        };
                    }
                }
            }
        }
    }
    catch(fe) {
        console.log(fe);
    }
    return;
}

//jshint ignore:end
////*[@id="04c6e90faac2675aa89e2176d2eec7d8-4ea1851c99601c376d6e040dd01aedc5dd40213b"]
//var stdin = process.openStdin();
//require('tty').setRawMode(true);

// var stdin = process.openStdin();
// if(stdin.isTTY) {
//     console.log('Keypress Event added');
//     stdin.on("keypress", function(chunk, key) {
//         console.log('Chunk : ' + chunk + "\n");
//         console.log('Key : ' + key + "\n");

//         if(key && (key.name=='c' || key.name=='C')) {
//             if(browser) {
//                 browser.close();
//             }
//         }
//     });
// }
let crawlingUri = "https://www.neptunenext.com/agent/general/index";
ProcessActivity(crawlingUri).then(()=> {
    //what to do after the promise being called

    console.log(JSON.stringify(capturedData));
    //console.log('Closing Browser');
    page.waitFor(500);
    browser.close();
}).catch((reason) => {
    console.log(reason);
    console.log(JSON.stringify(capturedData));
    //console.log('Closing Browser');
    page.waitFor(500);
    browser.close();
});