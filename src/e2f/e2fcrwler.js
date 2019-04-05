//jshint esversion: 6
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
            return response.json();
        })
        .catch(reason => {
            Logger.log("error", reason);
            throw reason;
        }); // parses JSON response into native Javascript objects 
    }
}
