//In this program we will be logging into github and will be downloading specific file.

//jshint esversion:6
//const tty = require('tty');
const puppeteer = require('puppeteer');
const metadata = require('./metadata');
const delay = require('delay');

var browser = null;
var page = null;
var pageConfig = null;
var capturedData = [];
//jshint ignore:start

// function log() {
//     var time = moment().format("HH:mm:ss.SSS");
//     var args = Array.from(arguments);

//     args.unshift(time);
//     console.log.apply(console, args);
// }

async function navigatePage(pageName) {
    browser = await puppeteer.launch(
        {
            headless:true,
            ignoreDefaultArgs: ['--enable-automation'],
            args: ['--start-fullscreen']
            //slowMo: 100
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

async function ProcessActivity() {
    //await navigatePage("https://github.com/login");
    await navigatePage("https://www.neptunenext.com/agent/general/index");
    if(browser!==null && page!==null) {
        console.log('URL -> ' + page.url());

        for(pageIdx=1; pageIdx<metadata.pages.length; pageIdx++) {
            pageConfig = metadata.pages[pageIdx];
            // pageConfig = metadata.pages.find(pg => {
            //     return page.url().indexOf(pg.name)>-1;
            // });

            if(pageConfig!==null) //We landed to right page now
            {
                for(var iidx=0; iidx<pageConfig.actions[0].userinputs.length; iidx++) {
                    var userInput =  pageConfig.actions[0].userinputs[iidx];

                    await performUserOperation(page, userInput);
                }
            }
        }

        console.log('Operation completed');
    }
}

async function performUserOperation(objPage, userInput) {
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
                await page.keyboard.type(userInput.value);
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
                        console.log("Text -> " + innerText);
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
                    console.log(userInput.selector);
                    await page.click(userInput.selector);
                    //await page.delay(4000);

                    if(userInput.checkselector!=='' && userInput.checkselector!==null) {
                        await page.waitForSelector(userInput.checkselector, {timeout: 30000});
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
                                    console.log('Selector : ' + tsk.selector);
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

async function performTask(objPage, userInput, inputControl, element, task, idx) {
    if(task && task.action) {
        if(task.action==='click') {
            //console.log(element);
            if(element.click) {
                element.click();
            }
            if(task.checkselector!=='' && task.checkselector!==null) {
                await page.waitForSelector(task.checkselector, {timeout: 30000});
            }
        }
        else if(task.action==='read') {
            let targetElement = element;
            let content = null;
            if(task.read_type==='inner-text') {
                //let content = await page.$eval(task.selector||userInput.selector); //targetElement._remoteObject.value;
                content = await page.$eval(task.selector, e => e.innerText); //targetElement._remoteObject.value;
                //console.log(content);
            }
            else if(task.read_type==='inner-html') {
                //let content = await page.$eval(task.selector||userInput.selector); //targetElement._remoteObject.value;
                content = await page.$eval(task.selector, e => e.innerHTML); //targetElement._remoteObject.value;
                //console.log(content);
            }
            if(task.plugins!==null && task.plugins.length>0 && content!==null && content!=='')
            {
                task.plugins.forEach((plugin, iidx) => {
                    let parsedContent = null;
                    if(plugin.parser!==null && typeof(plugin.parser)==='function') {
                        parsedContent = plugin.parser(content);
                    }
                    if(plugin.assess!==null && typeof(plugin.assess)==='function') {
                        plugin.assess(content, parsedContent);
                        capturedData.push(parsedContent);
                    }
                });
            }
        }
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

ProcessActivity().then(()=> {
    //what to do after the promise being called

    console.log(JSON.stringify(capturedData));
    //console.log('Closing Browser');
    page.waitFor(500);
    browser.close();
});