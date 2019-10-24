var fs = require('fs');
var colors = require('colors');
const moment = require('moment');
const delay = require('delay');
const uuidv4 = require('uuid/v4');
var html2json = require('html2json').html2json;
var json2html = require('html2json').json2html;

class CheapPortal_Crawl {
    //this.config, this.context and this.parameters are implecitely available to access

    /*

    */
    async tx_set_user_input(taskinfo) {
        // const page = this.context.getContextData('page');
        //var params = this.hlp_get_passed_parameters(taskinfo);
        var selector = this.input_parameters.selector;
        var value = this.input_parameters.value;
        await this.page.type(selector, value);

        this.output_parameters.status = true;
        return true;
    }

    /*

    */
    async tx_click_button(taskinfo) {
        //const page = this.context.getContextData('page');
        //var params = this.hlp_get_passed_parameters(taskinfo);
        var flag = true;
        var timeout = 10000;

        var selector = this.input_parameters.selector;
        await this.page.click(selector).catch(reason => {
            console.log(`E13 => ${reason}`);
            flag = false;
        });

        await this.page.waitForNavigation({waitUntil: 'domcontentloaded', timeout: timeout}).catch((reason) => {
            this.log('error', `Error (button click) => ${reason}`);
            console.log('error', `Error (button click) => ${reason}`);
        });

        return flag;
    }

    /*

    */
    async tx_read_content(taskinfo) {
        var flag = true;
        var content = '';
        var element_loaded = true;

        var selector = this.input_parameters.selector;
        var content_type = this.input_parameters.content_type;
        if(!content_type) {
            content_type = 'html';
        }
        await this.page.waitForSelector(selector).catch(reason => {
            console.log(`E16 => ${reason}`);
            element_loaded = false;
        });

        if(element_loaded) {
            if(content_type === 'html') {
                // Get inner HTML
                content = await this.page.evaluate((sel) => document.querySelector(sel).innerHTML, selector).catch(reason => {
                    console.log(`E18 => ${reason}`);
                    flag = false;
                });
            } else {
                // Get inner text
                content = await this.page.evaluate((sel) => document.querySelector(sel).innerText, selector).catch(reason => {
                    console.log(`E17 => ${reason}`);
                    flag = false;
                });
            }
        }

        //this.log('info', `Content => ${content}`);

        this.output_parameters.content = content.trim();

        return content.trim()!=='';
    }

    /*

    */
    async tx_parse_content(taskinfo) {
        var flag = true;
        var content = this.input_parameters.content;
        var content_type = this.input_parameters.content_type;
        var regex = this.input_parameters.regex;
        

        //this.log('info', `Content to parse => ${content}`);
        //var clear_html_regex = /(<([^>]+)>)/ig;
        // var clear_html_regex = /(<([^>]+)>)(\s*)/ig;
        var clear_html_regex = /(<([^>]+)>)/ig;
        
        content = content.replace(clear_html_regex, "\n");

        if(!content_type) {
            content_type = 'html';
        }

        var content_list = content.split('\n');
        var items = [];
        for (let index = 0; index < content_list.length; index++) {
            const contnet_listitem = content_list[index];
            if(contnet_listitem.trim() !== '') {
                items.push(contnet_listitem);
            }
        }

        this.context.setContextData('circles', items);
        this.output_parameters.content = items;

        return flag;
    }

    async tx_read_ticket_data(taskinfo) {
        var flag = true;
        var content = this.input_parameters.content;
        var selector = this.input_parameters.selector;
        var page_size_selector = this.input_parameters.page_size_selector;
        var page_size_value = this.input_parameters.page_size_value;
        var content_selector = this.input_parameters.content_selector;
        var element_loaded = true;
        var tickets = [];
        var timeout = parseInt(this.input_parameters.timeout);
        var delay = parseInt(this.input_parameters.delay);
        var i = 0;
        var timeout = 4000;

        for (let index = 0; index < content.length; index++) {
            const item = content[index];
            element_loaded = true;

            console.log(`Circle -> ${item}`);
            this.log('info', `Circle : ${item}`);

            if(item && item.trim() === 'Select Sector') {
                await this.page.select(selector, item).catch(reason => console.log(`Error (read ticket_data): ${reason}`));

                //await this.page.waitFor(timeout);
                // await this.page.waitForNavigation({waitUntil: 'domcontentloaded', timeout: timeout}).catch((reason) => {
                //     this.log('error', `Error (select) => ${reason}`);
                //     console.log('error', `Error (select) => ${reason}`);
                // });

                //{visible: true, timeout: timeout}
                await this.page.waitForSelector(content_selector, {timeout: timeout}).catch(reason => {
                    console.log(`E20 => ${reason}`);
                    this.log('info', `E20 : ${reason}`);
                    // element_loaded = false;
                });
            }

            if(item && item.trim()!=='Select Sector') {
                await this.page.select(selector, item).catch(reason => console.log(`${reason}`));
                await this.page.waitFor(timeout);
                await this.page.select(page_size_selector, page_size_value).catch(reason => console.log(`${reason}`));
                
                //await this.page.waitFor(timeout);
                // await this.page.waitForNavigation({waitUntil: 'domcontentloaded', timeout: timeout}).catch((reason) => {
                //     this.log('error', `Error (select circle) => ${reason}`);
                //     console.log('error', `Error (select circle) => ${reason}`);
                // });

                //{visible: true, timeout: timeout}
                await this.page.waitForSelector(content_selector, {timeout: timeout}).catch(reason => {
                    console.log(`E21 => ${reason}`);
                    this.log('info', `E21 : ${reason}`);
                    // element_loaded = false;
                });

                if(element_loaded) {
                    //timeout = 10000;
                    // Get inner HTML
                    var htmlcontent = await this.page.$eval(content_selector, e => e.innerHTML).catch(reason => console.log(`E24 => ${reason}`)); //targetElement._remoteObject.value;
                    // var htmlcontent = await this.page.evaluate((sel) => document.querySelector(sel).innerHTML, content_selector).catch(reason => {
                    //     console.log(`E18 => ${reason}`);
                    //     flag = false;
                    // });
                    //this.log('info', `HTML Content : ${htmlcontent}`);

                    // var clear_html_regex = /(<([^>]+)>)/ig;
        
                    // content = content.replace(clear_html_regex, "");
                    var jsoncontent = html2json(htmlcontent);

                    if(jsoncontent) {
                        var ticket = {};
                        for (let idx = 0; idx < jsoncontent.child.length; idx++) {
                            const record = jsoncontent.child[idx];
                            ticket = {};
                            ticket.ticket_type='Economy';
                            ticket.type='ONEWAY';
                            ticket.flight='SPL';
                            ticket.flight_number='SPL_000-000';
                            ticket.departure = {};
                            ticket.arrival = {};
                            ticket.rtn_departure = {};
                            ticket.rtn_arrival = {};
                            for (let cellidx = 0; record.child && cellidx < record.child.length; cellidx++) {
                                const cell_node = record.child[cellidx];
                                if(cell_node && cell_node.node==='element')
                                {
                                    for (let celliidx = 0; cell_node.child && celliidx < cell_node.child.length; celliidx++) {
                                        try
                                        {
                                            const cell_item = cell_node.child[celliidx];
                                            if(cell_item.node === 'text') {
                                                switch (cellidx) {
                                                    case 1:
                                                        var circle = cell_item.text.replace('\t', '').trim();
                                                        if(circle !== null && circle !== '') {
                                                            var airports = circle.split('-');
                                                            if(airports && airports.length===1)
                                                                airports = circle.split(' ');

                                                            if(airports) {
                                                                ticket.departure = {'circle': airports[0]};
                                                                ticket.arrival = {'circle': airports[1]};
                                                                if(airports.length>2) {
                                                                    ticket.rtn_departure = {'circle': airports[1]};
                                                                    ticket.rtn_arrival = {'circle': airports[2]};
                                                                }
                                                            }
                                                        }

                                                        break;
                                                    case 3:
                                                        var date = cell_item.text.replace('\t', '').trim()
                                                        ticket.departure.date = date;
                                                        ticket.arrival.date = date;
                                                        //ticket.dept_date = cell_item.text.replace('\t', '').trim();
                                                        break;
                                                    case 5:
                                                        var date = cell_item.text.replace('\t', '').trim()
                                                        if(date && date!==undefined && date!=='') {
                                                            ticket.rtn_departure.date = date;
                                                            ticket.rtn_arrival.date = date;
                                                        }
    
                                                        //ticket.rtn_date = cell_item.text.replace('\t', '').trim();
                                                        break;
                                                    case 7:
                                                        if(ticket.departure.time ===  undefined) {
                                                            var st_time = cell_item.text.replace('\t', '').trim();
                                                            ticket.departure.time = st_time;
                                                            //ticket.start_dept_time = cell_item.text.replace('\t', '').trim();
                                                        }
                                                        else {
                                                            var ed_time = cell_item.text.replace('\t', '').trim();
                                                            //ticket.start_arrv_time = cell_item.text.replace('\t', '').trim();
                                                            ticket.arrival.time = ed_time;
                                                        }
                                                        break;
                                                    case 9:
                                                        //return type ticket;
                                                        if(ticket.rtn_departure.time ===  undefined) {
                                                            var rtst_time = cell_item.text.replace('\t', '').trim();
                                                            //ticket.rtn_dept_time = cell_item.text.replace('\t', '').trim();
                                                            if(rtst_time && rtst_time!==undefined && rtst_time!=='') {
                                                                ticket.rtn_departure.time = rtst_time
                                                                if(ticket.rtn_dept_time !== '') {
                                                                    ticket.type='ROUNDTRIP';
                                                                }
                                                            }
                                                        }
                                                        else {
                                                            var rted_time = cell_item.text.replace('\t', '').trim();
                                                            if(rted_time && rted_time!==undefined && rted_time!=='') {
                                                                ticket.rtn_arrival.time = rted_time
                                                                if(ticket.rtn_arrival.time<ticket.rtn_departure.time) {
                                                                    //date changed so return arrival date should be one day more.
                                                                    var rtn_arrival_date = moment(ticket.rtn_arrival.date, 'DD-MMM-YYYY');
                                                                    ticket.rtn_arrival.date = rtn_arrival_date.add(1, 'day').format('DD-MMM-YYYY');
                                                                }
                                                                //ticket.rtn_arrv_time = cell_item.text.replace('\t', '').trim();
                                                            }
                                                        }
                                                        break;
                                                    case 11:
                                                        ticket.availability = parseInt(cell_item.text.replace('\t', '').trim());
                                                        break;
                                                    case 15:
                                                        ticket.max_no_of_person = parseInt(cell_item.text.replace('\t', '').trim());
                                                        break;
                                                    case 17:
                                                        ticket.price = parseFloat(cell_item.text.replace('\t', '').trim());
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            }
                                            else if(cell_item.node === 'element' && cell_item.tag === 'a') {
                                                switch (cellidx) {
                                                    case 19:
                                                        let id = cell_item.attr.href.trim().match(/\d+/gm);

                                                        ticket.url = cell_item.attr.href.trim();
                                                        ticket.id = ticket.recid = (id && id.length>0) ? parseInt(id[0]) : 0;
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            }
                                        }
                                        catch(ex) {
                                            console.log(ex);
                                        }
                                    }
                                }
                            }

                            if(ticket && ticket.id>0 && ticket.type==='ONEWAY') {
                                if(ticket.rtn_departure.circle && ticket.rtn_arrival.circle) {
                                    console.log(`\t(${i}) Ticket Save == (${ticket.departure.circle}-${ticket.arrival.circle}) | (${ticket.rtn_departure.circle}-${ticket.rtn_arrival.circle})`);
                                    console.log(`\t\t(${i}) Ticket == ${ticket.departure.date} - [${ticket.departure.time} - ${ticket.arrival.time}] | ${ticket.rtn_departure.date} - [${ticket.rtn_departure.time} - ${ticket.rtn_arrival.time}]`);
                                    this.log('info', `\t(${i}) Ticket Save == (${ticket.departure.circle}-${ticket.arrival.circle}) | (${ticket.rtn_departure.circle}-${ticket.rtn_arrival.circle})`);
                                    this.log('info', `\t\t(${i}) Ticket == ${ticket.departure.date} - [${ticket.departure.time} - ${ticket.arrival.time}] | ${ticket.rtn_departure.date} - [${ticket.rtn_departure.time} - ${ticket.rtn_arrival.time}]`);
                                } else {
                                    console.log(`\t(${i}) Ticket Save == (${ticket.departure.circle}-${ticket.arrival.circle})`);
                                    console.log(`\t\t(${i}) Ticket == ${ticket.departure.date} - [${ticket.departure.time} - ${ticket.arrival.time}]`);
                                    this.log('info', `\t(${i}) Ticket Save == (${ticket.departure.circle}-${ticket.arrival.circle})`);
                                    this.log('info', `\t\t(${i}) Ticket == ${ticket.departure.date} - [${ticket.departure.time} - ${ticket.arrival.time}]`);
                                }

                                ticket.departure.epoch_date = Date.parse(`${ticket.departure.date} ${ticket.departure.time}:00.000`);
                                ticket.arrival.epoch_date = Date.parse(`${ticket.arrival.date} ${ticket.arrival.time}:00.000`);

                                if(ticket.rtn_departure.date && ticket.rtn_arrival.date) {
                                    ticket.rtn_departure.epoch_date = Date.parse(`${ticket.rtn_departure.date} ${ticket.rtn_departure.time}:00.000`);
                                    ticket.rtn_arrival.epoch_date = Date.parse(`${ticket.rtn_arrival.date} ${ticket.rtn_arrival.time}:00.000`);
                                }

                                tickets.push(ticket);
                                i++;
                            }
                        }
                    }
                }
            }
        }

        this.context.setContextData('tickets', tickets);
        this.output_parameters.tickets = tickets;

        this.log('info', JSON.stringify(tickets));

        return flag;
    }

    async tx_save2db(taskinfo) {
        var flag = true;

        let runid = `${uuidv4()}_${moment().format("DD-MMM-YYYY HH:mm:ss.SSS")}`;
        var tickets = this.input_parameters.tickets;
        const datastore = require('./radharani/cheapdatastore');

        try
        {
            await datastore.saveCircleBatchData(runid, tickets, '', (updatedTickets) => {
                if(updatedTickets) {
                    this.log('info', `Ticket length : ${updatedTickets.length}`);
                }
                // let impactedRows = metadata.circlecrawlfinished(runid, getStore(), key, function(status) {
                //     log(`Finaliation of ${key} - ${status}`);
                // });
            });

            var finalizedDataset = await datastore.finalization(runid);

            this.log('info', JSON.stringify(finalizedDataset));
        }
        catch(ex) {
            this.log('Error', ex);
        }

        return flag;
    }

    async tx_close(taskinfo) {
        var browser = this.context.getContextData('browser');
        
        await browser.close();
        console.log('Operation completed');
    }

    hlp_get_passed_parameters(taskinfo) {
        var params = {};
        taskinfo.parameters.forEach(parameter => {
            if(parameter && parameter.direction==='input') {
                if(parameter.sourcetype === 'value') {
                    params[parameter.name] = parameter.value;
                } else if(parameter.sourcetype === 'variable') {
                    params[parameter.name] = parameter.value;
                }
            }
        });

        return params;
    }
}

module.exports = CheapPortal_Crawl;