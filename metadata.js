//jshint esversion: 6
module.exports = {
    pages: [
        {
            id: 1,
            name: 'index',
            actions: [
                {
                    name: 'index',
                    type: 'authentication',
                    userinputs: [
                        {
                            id: 1,
                            controlid: '',
                            selector: '#email',
                            checkcontent: '',
                            type: 'textbox',
                            value: '9800412356',
                            action: 'keyed',
                            checkselector: ''
                        },
                        {
                            id: 2,
                            controlid: '',
                            selector: '#password',
                            checkcontent: '',
                            type: 'textbox',
                            value: 'Sumit@12356',
                            action: 'keyed',
                            checkselector: ''
                        },
                        {
                            id: 3,
                            controlid: '',
                            selector: '#login_submit',
                            checkcontent: '',
                            type: 'button',
                            value: '',
                            action: 'click',
                            checkselector: '#myNavbar > ul > li.normal_srchreali.bg-green > a'
                        }                        
                    ]
                }
            ]
        },
        {
            id: 2,
            name: 'index',
            actions: [
                {
                    name: 'index',
                    type: 'homepage',
                    userinputs: [
                        {
                            id: 1,
                            controlid: '',
                            selector: '#myNavbar > ul > li.normal_srchreali.bg-green > a',
                            checkcontent: '',
                            type: 'hyperlink',
                            value: '',
                            action: 'click',
                            checkselector: '#special_fare_flight_form > div:nth-child(2) > div > div.col-lg-3.col-md-3.col-sm-12.col-xs-12.destination-wrapper.no_padding_sm > div.col-md-12.no_padding_sm.font_16 > h4'
                        }
                    ]
                }
            ]
        },
        {
            id: 3,
            name: 'webscrapping',
            actions: [
                {
                    name: 'webscrapping',
                    type: 'code',
                    userinputs: [
                        {
                            id: 1,
                            controlid: '',
                            selector: '.chosen-search > input[type="text"]',
                            checkcontent: '',
                            type: 'textbox',
                            value: 'Delhi (DEL) - Bangalore (BLR)',
                            action: 'keyed',
                            checkselector: ''
                        },                        
                        {
                            id: 2,
                            controlid: '',
                            selector: '.chosen-results > li',
                            isarray: false,
                            checkcontent: 'Please Select',
                            type: 'hyperlink',
                            value: '',
                            action: 'click',
                            checkselector: ''
                        },
                        {
                            id: 3,
                            controlid: '',
                            selector: '.fc-event-container > a',
                            isarray: true,
                            tasks: [
                                {
                                    task_id: 1,
                                    task_name: 'click event',
                                    action: 'click',
                                    checkselector: '.madgrid',
                                },
                                {
                                    task_id: 2,
                                    task_name: 'read content',
                                    action: 'read',
                                    selector: '.madgrid',
                                    read_type: 'inner-text',
                                    plugins: [
                                        {
                                            parser: function(content) {
                                                let deal = {};
                                                console.log(content);
                                                //let src_dest = content.match(/(\w+\s[0-9]{2}:[0-9]{2}|[0-9]{2}\s\w+\s[0-9]{4})|(\w+\s-\s\w+\s([A-Z0-9])\w+(\w+:\s[0-9]{0,2}))/gm);
                                                //let src_dest = content.match(/(^\w+)|((Flight.*)([0-9,]){1,8})|(\w+\s[0-9]{2}:[0-9]{2}|[0-9]{2}\s\w+\s[0-9]{4})|(\w+\s-\s\w+\s([A-Z0-9])\w+(\w+:\s[0-9]{0,2}))/gm);
                                                let lines = content.split('\n');
                                                if(lines!==null && lines.length>0) {
                                                    deal.flight = lines[1].trim();
                                                }
                                                let src_dest = content.match(/([0-9]{1,5}-[0-9]{1,5})|((Flight.*)([0-9,]){1,8})|(\w+\s[0-9]{2}:[0-9]{2}|[0-9]{2}\s\w+\s[0-9]{4})|(\w+\s-\s\w+\s([A-Z0-9])\w+(\w+:\s[0-9]{0,2}))/g);
                                                
                                                if(src_dest.length>6) {
                                                    deal.flight_number = src_dest[0].trim();
                                                    let departure = src_dest[1].split(' ');
                                                    if(departure!==null && departure.length>0) {
                                                        deal.departure = {
                                                            circle: departure[0],
                                                            time: departure[1],
                                                            date: src_dest[2],
                                                            epoch_date: Date.parse(`${src_dest[2]} ${departure[1]}:00.000+05:30`)
                                                        };
                                                    }

                                                    let arrival = src_dest[3].split(' ');
                                                    if(arrival!==null && arrival.length>0) {
                                                        deal.arrival = {
                                                            circle: arrival[0],
                                                            time: arrival[1],
                                                            date: src_dest[4],
                                                            epoch_date: Date.parse(`${src_dest[4]} ${arrival[1]}:00.000+05:30`)
                                                        };
                                                    }

                                                    let seat_details = src_dest[5];
                                                    if(seat_details!==null) {
                                                        let parts = seat_details.match(/([^-:])\w+/gm);
                                                        if(parts!==null && parts.length>3) {
                                                            deal.ticket_type = parts[0].trim();
                                                            deal.availability = parseInt(parts[3].trim());
                                                        }
                                                    }

                                                    let pricingText = src_dest[6];
                                                    if(pricingText!==null) {
                                                        let price = pricingText.match(/([0-9,]){1,8}/gm);
                                                        if(price!==null && price.length>0) {
                                                            deal.price = parseInt(price[0].trim().replace(',',''));
                                                        }
                                                    }
                                                }
        
                                                return {condition: 'good', completion: 'good', result: deal};
                                            },
                                            assess: function(content, result) {
                                                console.log(JSON.stringify(result));
                                            }
                                        }
                                    ]
                                },
                                {
                                    task_id: 3,
                                    task_name: 'click calender',
                                    action: 'click',
                                    selector: '#headingOne > h4 > a',
                                    checkselector: '#special-fare-calendar'
                                }
                            ],
                            checkcontent: '',
                            type: '',
                            value: '',
                            action: 'click',
                            checkselector: ''
                        },
                        {
                            id: 4,
                            controlid: '',
                            selector: 'button.fc-next-button.fc-button.fc-state-default.fc-corner-left.fc-corner-right',
                            isarray: false,
                            checkcontent: 'Please Select',
                            type: 'hyperlink',
                            value: '',
                            action: 'click',
                            checkselector: ''
                        },
                        {
                            id: 5,
                            controlid: '',
                            selector: '.fc-event-container > a',
                            isarray: true,
                            tasks: [
                                {
                                    task_id: 1,
                                    task_name: 'click event',
                                    action: 'click',
                                    checkselector: '.madgrid',
                                },
                                {
                                    task_id: 2,
                                    task_name: 'read content',
                                    action: 'read',
                                    selector: '.madgrid',
                                    read_type: 'inner-text',
                                    plugins: [
                                        {
                                            parser: function(content) {
                                                let deal = {};
                                                console.log(content);
                                                //let src_dest = content.match(/(\w+\s[0-9]{2}:[0-9]{2}|[0-9]{2}\s\w+\s[0-9]{4})|(\w+\s-\s\w+\s([A-Z0-9])\w+(\w+:\s[0-9]{0,2}))/gm);
                                                //let src_dest = content.match(/(^\w+)|((Flight.*)([0-9,]){1,8})|(\w+\s[0-9]{2}:[0-9]{2}|[0-9]{2}\s\w+\s[0-9]{4})|(\w+\s-\s\w+\s([A-Z0-9])\w+(\w+:\s[0-9]{0,2}))/gm);
                                                let lines = content.split('\n');
                                                if(lines!==null && lines.length>0) {
                                                    deal.flight = lines[1].trim();
                                                }
                                                let src_dest = content.match(/([0-9]{1,5}-[0-9]{1,5})|((Flight.*)([0-9,]){1,8})|(\w+\s[0-9]{2}:[0-9]{2}|[0-9]{2}\s\w+\s[0-9]{4})|(\w+\s-\s\w+\s([A-Z0-9])\w+(\w+:\s[0-9]{0,2}))/g);
                                                
                                                if(src_dest.length>6) {
                                                    deal.flight_number = src_dest[0].trim();
                                                    let departure = src_dest[1].split(' ');
                                                    if(departure!==null && departure.length>0) {
                                                        deal.departure = {
                                                            circle: departure[0],
                                                            time: departure[1],
                                                            date: src_dest[2],
                                                            epoch_date: Date.parse(`${src_dest[2]} ${departure[1]}:00.000+05:30`)
                                                        };
                                                    }

                                                    let arrival = src_dest[3].split(' ');
                                                    if(arrival!==null && arrival.length>0) {
                                                        deal.arrival = {
                                                            circle: arrival[0],
                                                            time: arrival[1],
                                                            date: src_dest[4],
                                                            epoch_date: Date.parse(`${src_dest[4]} ${arrival[1]}:00.000+05:30`)
                                                        };
                                                    }

                                                    let seat_details = src_dest[5];
                                                    if(seat_details!==null) {
                                                        let parts = seat_details.match(/([^-:])\w+/gm);
                                                        if(parts!==null && parts.length>3) {
                                                            deal.ticket_type = parts[0].trim();
                                                            deal.availability = parseInt(parts[3].trim());
                                                        }
                                                    }

                                                    let pricingText = src_dest[6];
                                                    if(pricingText!==null) {
                                                        let price = pricingText.match(/([0-9,]){1,8}/gm);
                                                        if(price!==null && price.length>0) {
                                                            deal.price = parseInt(price[0].trim().replace(',',''));
                                                        }
                                                    }
                                                }
        
                                                return {condition: 'good', completion: 'good', result: deal};
                                            },
                                            assess: function(content, result) {
                                                console.log(JSON.stringify(result));

                                                return result;
                                            }
                                        }
                                    ]
                                },
                                {
                                    task_id: 3,
                                    task_name: 'click calender',
                                    action: 'click',
                                    selector: '#headingOne > h4 > a',
                                    checkselector: '#special-fare-calendar'
                                }
                            ],
                            checkcontent: '',
                            type: '',
                            value: '',
                            action: 'click',
                            checkselector: ''
                        }
                    ]
                }
            ]
        }
    ]
};