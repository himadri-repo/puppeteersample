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
            Logger._write(arguments);
                break;
            case "warning":
                Logger._write(arguments);
                break;
            case "error":
                Logger._write(arguments);
                break;
            default:
                break;
        }
    }

    static _write(type) {
        var time = moment().format("HH:mm:ss.SSS");
        //arguments.splice(0)
        var args = Array.from(arguments[0]);
        type = args[0];
        args.splice(0,1);
    
        args.unshift(time);
        args.unshift(type.toUpperCase());
        console.log.apply(console, args);
    }
}

export class MPTCrawler {
    constructor(options) {
        this.options = options || {url: '', output: 'json', token: ''};
    }

    getData(searchOption={url: '', data: {usrId: 109, usrType: 'N'}, token: ''}) {
        // Default options are marked with *
        let json_post = {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Content-Type": "application/json",
                "Authorization": 'Bearer j8edg53swttitdzzYiJ1iNDf7zg3oUdahhwa3EC3xRog08ANaEJYw74sCvAa',
                "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36",
                "Referer": "https://fd.metropolitantravels.com/dashboard",
                "Accept-Encoding": "gzip, deflate, br",
                "Cookie": "_ga=GA1.2.1076591431.1557470013; _gid=GA1.2.1851459083.1557470013; remember_web_59ba36addc2b2f9401580f014c7f58ea4e30989d=eyJpdiI6InpWMHFVQWtBV3pqZXVIaFwvSCtcL1JxUT09IiwidmFsdWUiOiJNdkFVZytqM3ljOHA5Nit5R1UycWtRdUdUK2lmZ3FPazZNaG95Q1wvdjArbURGeXFZVnR2ZFVxd2s0RVY4dWtCd2g5QWQ1WnhrZGxxZWtzckQwNFRJUWFpTXBFZWRaU3JabFwvTm9lOUxQc3lScmhtXC9CdG5QK2RIU3BQZ0tMalZzeCtkcFVFUXNqWjluSHNnNlQzaER2OStqRVVCRnFzTmV5WkR1dWk4QXBHc1E9IiwibWFjIjoiNjBjMTg1ZGMzYjc4MDYyMTY1ODA2ODZjY2IxMDBmNzhiODlkZjZlMjg4MzNmYTczMDE4ZWRmZjNjMGQ3N2U0OCJ9; XSRF-TOKEN=eyJpdiI6IjJIRkhjQTF2R244WEttRXVkSHJjeXc9PSIsInZhbHVlIjoiS1wvZE1XZGtoWXltaCtqTVdGTGlsM3NocERDYUp3YmNOZTlsaW1XQmxiMnI5TFptM0tmTDFEMHZDWUc3VVBjOEMiLCJtYWMiOiJiNzI1M2MyMWVhMWVkZDYyNjk5YmYwODljZGViMTY1NWJjZmE5YzkwMGU2NjYzYTkxZDhlZWVhZmFhNzgyMGNkIn0%3D;",
                "Cookie": "metropolitan_travels_session=eyJpdiI6IkxhRE9PZHRmWk4yemlTRE5xTzRDY1E9PSIsInZhbHVlIjoiYVpIbXY5TlU5akRnaTdScm9UVkFvMXJQeThWY3lJN0pZODVmNW9HWEpnQzY5V29wdEpuQXAycTRGZ1dpamVQXC8iLCJtYWMiOiJmNTUzNDBhZTMxMmU2OTA1YzNmYmY4MDA0YzliMTI4ZWQyNzA2NGFhYTE2ZWQxNWY4YWFmZjdjOTNkYzljOTg3In0%3D"
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
        };

        return fetch(searchOption.url, json_post)
        .then(async response => {
            Logger.log("info", "Response received");
            this.data = await response.json();
            this.finalData = await this.transformData(this.data);
            return this.data;
        })
        .catch(reason => {
            Logger.log("error", reason);
            throw reason;
        }); // parses JSON response into native Javascript objects 
    }

    async transformData(data) {
        if(data===null || data===undefined || data.length===0) return;

        let parsedDataSet = [];
        let parsedRecord = {};
        data = data;

        for(var i=0; i<data.length; i++) {
            try
            {
                let dataItem = data[i];
                parsedRecord = {
                    flight: dataItem.airline.name,
                    flight_number: dataItem.flight_number,
                    departure: {
                        id: -1,
                        circle: await this._getCircleName(dataItem.sector_name, 0, ['-',' ', 'to']).then(result => result).catch(reason => Logger.log('error', reason)),
                        time: dataItem.departure_time,
                        date: moment(dataItem.departure_at).format("YYYY-MM-DD"),
                        epoch_date: await this._getDate(moment(dataItem.departure_at).format("YYYY-MM-DD"), dataItem.departure_time).then(result => result).catch(reason => Logger.log('error', reason))
                    },
                    arrival: {
                        id: -1,
                        circle: await this._getCircleName(dataItem.sector_name, 1, ['-', ' ', 'to']).then(result => result).catch(reason => Logger.log('error', reason)),
                        time: dataItem.departure_time,
                        date: moment(dataItem.departure_at).format("YYYY-MM-DD"),
                        epoch_date: await this._getDate(moment(dataItem.departure_at).format("YYYY-MM-DD"), dataItem.departure_time).then(result => result).catch(reason => Logger.log('error', reason))
                    },

                    ticket_type: dataItem.travel_class,
                    availability: dataItem.available_seats,
                    price: (dataItem.price),
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

    async _getCircleName(circle, index, delimeters=['-',' ','to']) {
        let circleName = '';

        for (let idx = 0; idx < delimeters.length; idx++) {
            const delimeter = delimeters[idx];
            if(circle!==null && circle!==undefined && circle.indexOf(delimeter)>-1) {
                let circles = circle.split(delimeter);
                if(circles.length>0) {
                    circleName = circles[index].trim();
                    break;
                }
            }
        }

        if(circleName.toLowerCase().indexOf('bengaluru')>-1)
            circleName = 'Bangalore';

        return circleName;
    }

    async _getDate(strDate, strTime) {
        let dt = Date.now();
        try{
            dt = Date.parse(`${strDate} ${strTime}`);
        }
        catch(e) {
            Logger.log('error', e);
        }

        return dt;
    }
}

//jshint ignore:end