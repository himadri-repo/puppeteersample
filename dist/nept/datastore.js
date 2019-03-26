"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//jshint esversion:6
//jshint ignore:start
var mysql = require('mysql');

var moment = require('moment');

var pool = null;

function getDBPool() {
  if (pool) return pool; //Local DB

  pool = mysql.createPool({
    connectionLimit: 30,
    connectTimeout: 15000,
    host: "139.59.92.9",
    user: "oxyusr",
    password: "oxy@123",
    database: "oxytra",
    port: 3306
  }); //Remote DB
  // pool = mysql.createPool({
  //     connectionLimit: 30,
  //     connectTimeout: 15000,
  //     host: "www.oxytra.com",
  //     user: "oxyusr",
  //     password: "oxy@321-#",
  //     database: "oxytra",
  //     port: 3306
  // });

  return pool;
}

function saveData(_x, _x2, _x3) {
  return _saveData.apply(this, arguments);
}

function _saveData() {
  _saveData = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(result, runid, callback) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            // var con = mysql.createConnection({
            //     host: "139.59.92.9",
            //     user: "oxyusr",
            //     password: "oxy@123",
            //     database: "oxytra",
            //     port: 3306
            // });
            //con.connect(function(err, data) {
            getDBPool().getConnection(
            /*#__PURE__*/
            function () {
              var _ref = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee4(err, con) {
                var srccity, dstcity, aircode, airline, sql, insertStatus;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.prev = 0;

                        if (!err) {
                          _context4.next = 6;
                          break;
                        }

                        console.log(err);
                        _context4.next = 5;
                        return saveData(result, runid, callback);

                      case 5:
                        return _context4.abrupt("return");

                      case 6:
                        //console.log('DB connected');
                        srccity = result.departure.circle;
                        dstcity = result.arrival.circle;
                        aircode = result.flight;
                        airline = "".concat(result.flight, "_").concat(result.flight_number);
                        sql = "select id from city_tbl where code = '".concat(srccity, "'"); //var sql = `INSERT INTO city_tbl ( city, code ) SELECT '${srccity}', '${srccity}' WHERE NOT EXISTS (SELECT * FROM city_tbl WHERE code = '${srccity}')`;

                        insertStatus = {};
                        con.query(sql, function (err, data) {
                          if (err) console.log(err);
                          var cityid = 0;

                          if (data && data.length) {
                            cityid = data[0].id;
                          } //console.log(JSON.stringify(data));
                          //console.log(`${srccity} & ${dstcity} record inserted`);


                          if (cityid === 0) {
                            var _insertQry = "INSERT INTO city_tbl ( city, code ) values ('".concat(srccity, "', '").concat(srccity, "')");

                            con.query(_insertQry, function (err1, data1) {
                              if (err1) console.log(err1);
                              insertStatus.firstQueryFeedback = data1;
                            });
                          } //second query


                          sql = "select id from city_tbl where code = '".concat(dstcity, "'"); //sql = `INSERT INTO city_tbl ( city, code ) SELECT '${dstcity}', '${dstcity}' WHERE NOT EXISTS (SELECT * FROM city_tbl WHERE code = '${dstcity}')`;

                          con.query(sql, function (err1, data1) {
                            if (err1) console.log(err1); //console.log(JSON.stringify(data));
                            //console.log(`${srccity} & ${dstcity} record inserted`);

                            cityid = 0;

                            if (data1 && data1.length > 0) {
                              cityid = data1[0].id;
                            } //third query
                            //sql = `INSERT INTO airline_tbl (aircode,airline, image) SELECT '${aircode}','${airline}', 'faculty_1540217511.png' WHERE NOT EXISTS (SELECT * FROM airline_tbl WHERE aircode = '${aircode}')`;


                            if (cityid === 0) {
                              insertQry = "INSERT INTO city_tbl ( city, code ) values ('".concat(dstcity, "', '").concat(dstcity, "')");
                              con.query(insertQry,
                              /*#__PURE__*/
                              function () {
                                var _ref2 = _asyncToGenerator(
                                /*#__PURE__*/
                                regeneratorRuntime.mark(function _callee(err2, data2) {
                                  return regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                      switch (_context.prev = _context.next) {
                                        case 0:
                                          if (err2) console.log(err2); //console.log(JSON.stringify(data));
                                          //console.log(`${srccity} & ${dstcity} record inserted`);

                                          insertStatus.secondQueryFeedback = data2;

                                        case 2:
                                        case "end":
                                          return _context.stop();
                                      }
                                    }
                                  }, _callee);
                                }));

                                return function (_x21, _x22) {
                                  return _ref2.apply(this, arguments);
                                };
                              }());
                            }

                            sql = "SELECT id FROM airline_tbl WHERE aircode = '".concat(aircode, "'");
                            var airline_id = 0; //sql = `INSERT INTO city_tbl ( city, code ) SELECT '${dstcity}', '${dstcity}' WHERE NOT EXISTS (SELECT * FROM city_tbl WHERE code = '${dstcity}')`;

                            con.query(sql,
                            /*#__PURE__*/
                            function () {
                              var _ref3 = _asyncToGenerator(
                              /*#__PURE__*/
                              regeneratorRuntime.mark(function _callee3(err2, data2) {
                                var saveResult;
                                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                  while (1) {
                                    switch (_context3.prev = _context3.next) {
                                      case 0:
                                        if (err2) console.log(err2);
                                        if (data2 && data2.length > 0) airline_id = data2[0].id;

                                        if (airline_id === 0) {
                                          insertQry = "INSERT INTO airline_tbl (aircode,airline, image) values ('".concat(aircode, "','").concat(airline, "', 'flight.png')");
                                          con.query(insertQry,
                                          /*#__PURE__*/
                                          function () {
                                            var _ref4 = _asyncToGenerator(
                                            /*#__PURE__*/
                                            regeneratorRuntime.mark(function _callee2(err3, data3) {
                                              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                                while (1) {
                                                  switch (_context2.prev = _context2.next) {
                                                    case 0:
                                                      if (err3) console.log(err3); //console.log(JSON.stringify(data));
                                                      //console.log(`${srccity} & ${dstcity} record inserted`);

                                                      insertStatus.thirdQueryFeedback = data3;

                                                    case 2:
                                                    case "end":
                                                      return _context2.stop();
                                                  }
                                                }
                                              }, _callee2);
                                            }));

                                            return function (_x25, _x26) {
                                              return _ref4.apply(this, arguments);
                                            };
                                          }());
                                        }

                                        _context3.next = 5;
                                        return saveTicketInformation(con, result, insertStatus, runid, function (insertresult) {
                                          //con.destroy();
                                          con.release();
                                          insertStatus = insertresult;

                                          if (callback) {
                                            callback(insertStatus);
                                          }
                                        });

                                      case 5:
                                        saveResult = _context3.sent;

                                      case 6:
                                      case "end":
                                        return _context3.stop();
                                    }
                                  }
                                }, _callee3);
                              }));

                              return function (_x23, _x24) {
                                return _ref3.apply(this, arguments);
                              };
                            }()); //con.destroy();
                          });
                        });
                        _context4.next = 18;
                        break;

                      case 15:
                        _context4.prev = 15;
                        _context4.t0 = _context4["catch"](0);
                        console.log(_context4.t0);

                      case 18:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4, null, [[0, 15]]);
              }));

              return function (_x19, _x20) {
                return _ref.apply(this, arguments);
              };
            }());

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _saveData.apply(this, arguments);
}

function saveTicketInformation(_x4, _x5, _x6, _x7, _x8) {
  return _saveTicketInformation.apply(this, arguments);
}

function _saveTicketInformation() {
  _saveTicketInformation = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(conn, result, options, runid, callback) {
    var saveResult, srccity, dstcity, aircode, airline, srcCity, destCity;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            saveResult = {};
            srccity = result.departure.circle;
            dstcity = result.arrival.circle;
            aircode = result.flight;
            airline = "".concat(result.flight, "_").concat(result.flight_number);
            srcCity = 0;
            destCity = 0;
            airline = 0;
            getCity(conn, srccity, function (data) {
              srcCity = data;
              getCity(conn, dstcity, function (data1) {
                destCity = data1;
                getAirline(conn, aircode, function (airlineData) {
                  airline = airlineData;
                  var results = [];
                  results.push(srcCity);
                  results.push(destCity);
                  results.push(airline);

                  if (results !== null) {
                    if (results.length > 0) {
                      srccity = parseInt(results[0]);
                    }

                    if (results.length > 1) {
                      dstcity = parseInt(results[1]);
                    }

                    if (results.length > 2) {
                      aircode = parseInt(results[2]);
                    }

                    result.departure.id = srccity;
                    result.arrival.id = dstcity;
                    result.flight_id = aircode;
                    saveTicket(conn, result, runid, function (saveresult) {
                      saveResult = saveresult;

                      if (callback) {
                        callback(saveResult);
                      }
                    });
                  }
                });
              });
            });

          case 9:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _saveTicketInformation.apply(this, arguments);
}

function saveTicket(_x9, _x10, _x11, _x12) {
  return _saveTicket.apply(this, arguments);
}

function _saveTicket() {
  _saveTicket = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(conn, result, runid, callback) {
    var deptDate1, arrvDate1, deptDate, arrvDate, emptyDate, qrySql;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            deptDate1 = moment(new Date(result.departure.epoch_date)).format("YYYY-MM-DD HH:mm:ss");
            arrvDate1 = moment(new Date(result.arrival.epoch_date)).format("YYYY-MM-DD HH:mm:ss");
            deptDate = moment(new Date(result.departure.epoch_date)).format("YYYY-MM-DD HH:mm");
            arrvDate = moment(new Date(result.arrival.epoch_date)).format("YYYY-MM-DD HH:mm");
            emptyDate = moment(new Date(0, 0, 0, 0, 0, 0)).format("YYYY-MM-DD HH:mm");
            qrySql = "select id from tickets_tbl where source='".concat(result.departure.id, "' and destination=").concat(result.arrival.id, " and departure_date_time='").concat(deptDate, "' and arrival_date_time='").concat(arrvDate, "' and airline='").concat(result.flight_id, "' and data_collected_from='neptunenext'");
            conn.query(qrySql, function (err, data) {
              if (err) {
                console.log(err);
              }

              var insertStatus = {};
              console.log((data.length > 0 ? 'Update' : 'Insert') + JSON.stringify(result));

              if (data.length > 0) {
                //var updateSql = `update tickets_tbl set no_of_person=${result.availability}, max_no_of_person=${result.availability}, availibility= ${result.availability}, price=${result.price}, total=${result.price}+baggage+meal+markup+admin_markup-discount where source='${result.departure.id}' and destination='${result.arrival.id}' and departure_date_time='${deptDate}' and arrival_date_time='${arrvDate}' and airline='${result.flight_id}' and data_collected_from='neptunenext'`;
                var updateSql = "update tickets_tbl set no_of_person=".concat(result.availability, ", max_no_of_person=").concat(result.availability, ", availibility= ").concat(result.availability, ", available='").concat(result.availability > 0 ? 'YES' : 'NO', "', price=").concat(result.price, ", total=").concat(result.price, ", last_sync_key='").concat(runid, "' where source='").concat(result.departure.id, "' and destination='").concat(result.arrival.id, "' and departure_date_time='").concat(deptDate, "' and arrival_date_time='").concat(arrvDate, "' and airline='").concat(result.flight_id, "' and data_collected_from='neptunenext'"); //console.log(`Duplicate ticket (${data[0].id}) exists. Updating record.`);
                //console.log(JSON.stringify(result));

                conn.query(updateSql, function (err, data) {
                  if (err) {
                    console.log(err);
                  } else {
                    //console.log(JSON.stringify(data));
                    //console.log(JSON.stringify(result));
                    //console.log(`${data.insertId} ticket record inserted - ${JSON.stringify(data)}`);
                    insertStatus = data;
                  }

                  if (callback) {
                    callback(insertStatus);
                  }
                });
              } else {
                var insertSql = "INSERT INTO tickets_tbl (source, destination, source1, destination1, trip_type, departure_date_time, arrival_date_time, flight_no, terminal, departure_date_time1, arrival_date_time1, flight_no1, terminal1, terminal2, terminal3, no_of_person, max_no_of_person, no_of_stops, stops_name, no_of_stops1, stops_name1, class, class1, airline, airline1, aircode, aircode1, pnr, ticket_no, price, baggage, meal, markup, admin_markup, discount, total, sale_type, refundable, availibility, user_id, remarks, approved, available, data_collected_from, last_sync_key) \n            VALUES ('".concat(result.departure.id, "','").concat(result.arrival.id, "',0,0,'ONE','").concat(deptDate, "','").concat(arrvDate, "','NPTNX-").concat(result.flight_number, "','NA','").concat(emptyDate, "','").concat(emptyDate, "','','','','',").concat(result.availability, ",").concat(result.availability, ",0,'NA',0,'NA','").concat(result.ticket_type.toUpperCase(), "','','").concat(result.flight_id, "',0,'").concat(result.flight, "','','','TKT-',").concat(result.price, ",0,0,0,0,0,").concat(result.price, ",'request','N',").concat(result.availability, ",104,'',1,'").concat(result.availability > 0 ? 'YES' : 'NO', "', 'neptunenext', '").concat(runid, "')"); //console.log(insertSql);

                conn.query(insertSql, function (err, data) {
                  if (err) {
                    console.log(err);
                  } else {
                    //console.log(JSON.stringify(data));
                    //console.log(JSON.stringify(result));
                    //console.log(`${data.insertId} ticket record inserted`);
                    insertStatus = data;
                  }

                  if (callback) {
                    callback(insertStatus);
                  }
                });
              }
            });

          case 7:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _saveTicket.apply(this, arguments);
}

function finalization(runid, callback) {
  getDBPool().getConnection(function (err, conn) {
    try {
      if (err) {
        console.log(err);
      }

      var sql = "update tickets_tbl set no_of_person=0, max_no_of_person=0, availibility=0, available='NO' where available='YES' and data_collected_from='neptunenext' and last_sync_key<>'".concat(runid, "'");

      try {
        conn.query(sql, function (err, data) {
          if (err || data === null || data === undefined) {
            console.log(err);
          }

          conn.release(); //console.log(JSON.stringify(data));

          if (callback) {
            callback(data);
          }
        });
      } catch (e1) {
        console.log(e1);
      }
    } catch (ex) {
      console.log(ex);
    }
  });
}

function getCity(_x13, _x14, _x15) {
  return _getCity.apply(this, arguments);
}

function _getCity() {
  _getCity = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(conn, city, callback) {
    var sql;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            sql = "select id from city_tbl where code='".concat(city, "'");
            conn.query(sql, function (err, data) {
              if (err || data === null || data === undefined) {
                console.log(err);
              }

              if (data != null && data.length > 0) {
                data = data[0].id;
              }

              if (callback) {
                callback(data);
              }
            });

          case 2:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _getCity.apply(this, arguments);
}

function getAirline(_x16, _x17, _x18) {
  return _getAirline.apply(this, arguments);
} //jshint ignore:end


function _getAirline() {
  _getAirline = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(conn, aircode, callback) {
    var sql;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            sql = "select id from airline_tbl where aircode='".concat(aircode, "'");
            conn.query(sql, function (err, data) {
              if (err || data === null || data === undefined) {
                console.log(err);
              }

              if (data != null && data.length > 0) {
                data = data[0].id;
              }

              if (callback) {
                callback(data);
              }
            });

          case 2:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));
  return _getAirline.apply(this, arguments);
}

module.exports = {
  saveData: saveData,
  finalization: finalization
};