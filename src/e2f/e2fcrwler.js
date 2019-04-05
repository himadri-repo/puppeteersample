//jshint esversion: 6
//jshint ignore:start
const cron = require("node-cron");
const express = require("express");
const fs = require("fs");

const uuidv4 = require('uuid/v4');
const delay = require('delay');
const moment = require('moment');
const fetch = require('isomorphic-fetch');

//import moment from "moment";
// import "isomorphic-fetch";

export class Logger {
    static log(type, message) {
        switch (type) {
            case "info":
            Logger._write("info",message);
                break;
            case "warning":
                Logger._write("warning",message);
                break;
            case "error":
                Logger._write("error",message);
                break;
            default:
                break;
        }
    }

    static _write(type) {
        var time = moment().format("HH:mm:ss.SSS");
        //arguments.splice(0)
        var args = Array.from(arguments);
        //args.splice(0);
    
        args.unshift(time);
        args.unshift(type.toUpperCase());
        console.log.apply(console, args);
    }
}

export class E2FCrawler {
    constructor(options) {
        this.options = options || {url: '', output: 'json'};
    }

    postData(searchOption={url: '', data: {usrId: 109, usrType: 'N'}}) {
        // Default options are marked with *
        return fetch(searchOption.url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify(searchOption.data), // body data type must match "Content-Type" header
        })
        .then(response => {
            Logger.log("info", "Response received");
            this.data = response.json();
            this.finalData = this.transformData(this.data);
            return response.json();
        })
        .catch(reason => {
            Logger.log("error", reason);
            throw reason;
        }); // parses JSON response into native Javascript objects 
    }

    transformData(data) {
        if(data===null || data===undefined || data.length===0) return;

        let parsedDataSet = [];
        let parsedRecord = {};

        for(var i=0; i<data.length; i++) {
            try
            {
                let dataItem = data[i];
                parsedRecord = {
                    flight: dataItem.airlns_name,
                    flight_number: dataItem.flight_no,
                    departure: {
                        id: -1,
                        circle: _getCircleName(dataItem.destn, 0).then(result => result).catch(reason => Logger.log('error', reason)),
                        time: dataItem.travel_time,
                        date: dataItem.travel_date,
                        epoch_date: _getDate(dataItem.travel_date, dataItem.travel_time).then(result => result).catch(reason => Logger.log('error', reason))
                    },
                    arrival: {
                        id: -1,
                        circle: _getCircleName(dataItem.destn, 1).then(result => result).catch(reason => Logger.log('error', reason)),
                        time: dataItem.arrival_time,
                        date: dataItem.arrival_date,
                        epoch_date: _getDate(dataItem.arrival_date, dataItem.arrival_time).then(result => result).catch(reason => Logger.log('error', reason))
                    },

                    ticket_type: 'Economy',
                    availability: dataItem.seat,
                    price: (dataItem.fare+dataItem.srv_tax+dataItem.gst),
                    flight_id: 1,
                    runid: '',
                    recid: dataItem.id
                };

                parsedDataSet.push(parsedRecord);
                Logger.log('info', 'Data', JSON.stringify(parsedRecord));
            }
            catch(e) {
                Logger.log('error', e);
            }
        }

        return parsedDataSet;
    }

    async _getCircleName(circle, index) {
        let circleName = '';
        if(circle!==null && circle!==undefined && circle.indexOf('to')>-1) {
            let circles = circle.split('to');
            if(circles.length>0) {
                circleName = circles[index];
            }
        }

        return circleName;
    }

    async _getDate(strDate, strTime) {
        let dt = Date.now();
        try{
            dt = new Date(`${strDate} ${strTime}`);
        }
        catch(e) {
            Logger.log('error', e);
        }

        return dt;
    }
}

//jshint ignore:end