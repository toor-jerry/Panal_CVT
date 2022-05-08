// Socket
const { io } = require('../app');

const _ = require('underscore'); // super set

// Cite model
const CiteModel = require('../models/cite');

// Class Area
const { Area } = require('../classes/area');

class Cite {

    // search all cites
    static findAll() {

        return new Promise((resolve, reject) => {

            CiteModel.find({})
                .populate('area')
                .sort('date hour')
                .exec((err, cites) => {

                    if (err) reject({ msg: `Could not found cites.`, err, code: 500 });
                    resolve({ data: cites });

                });
        });
    }

    // search by id
    static findById(id) {

        return new Promise((resolve, reject) => {

            CiteModel.findById(id)
                .populate('area')
                .lean()
                .exec((err, cite) => {

                    if (err) reject({ msg: `Could not found cite.`, err, code: 500 });
                    if (!cite) reject({ msg: `Cite not found.`, err, code: 400 });
                    resolve({ data: cite });

                });
        });
    }

    // search all cites by date an returns cites no registered
    static findAllByDate(area, date) {

        return new Promise((resolve, reject) => {

            if (!area)
                return reject({ msg: 'No area', code: 400 });

            if (!date)
                return reject({ msg: 'No date', code: 400 });

            CiteModel.find({ area: area, date: date }, 'hour')
                .sort('date hour')
                .exec((err, cites) => {

                    if (err) reject({ msg: `Could not found cites.`, err, code: 500 });

                    if (!cites) cites = [];

                    // hours cites
                    let citesArray = [];
                    // hours
                    for (let hour = 9; hour < 17; hour++) {
                        let time = '';
                        if (hour < 12)
                            time = 'A.M.';
                        else
                            time = 'P.M.';
                        // minutes
                        for (let min = 0; min < 60; min += 15) {
                            if (min < 10)
                                citesArray.push(`${hour}:0${min} ${time}`);
                            else
                                citesArray.push(`${hour}:${min} ${time}`);
                        }
                    }

                    let citesDBTmp = [];
                    // if cites register > 0
                    if (cites.length > 0) {
                        // hours cites
                        // hours
                        cites.forEach(citeDB => citesDBTmp.push(citeDB.hour));

                        citesDBTmp = _.union(citesDBTmp); // unique hours db, Computes the union of the passed-in arrays: the list of unique items, in order, that are present in one or more of the arrays.

                        citesArray = _.difference(citesArray, citesDBTmp); // returns the values from array that are not present in the other arrays.

                    }
                    resolve({ data: citesArray, citesRegistered: citesDBTmp });

                });
        });
    }

    // search first cites of first area
    static findAllFisrtArea() {

        return new Promise((resolve, reject) => {

            Area.findAll()
                .then(resp => {
                    if (resp.data.length === 0) {
                        return reject({ msg: `No data (not found areas).`, err, code: 400 });
                    }
                    let area = resp.data[0];

                    let date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;
                    this.findAllByDate(area, date)
                        .then(cites => resolve(cites))
                        .catch(err => reject({ msg: `Could not found cites.`, err, code: 500 }))
                })
                .catch(err => reject({ msg: `Could not found Areas.`, err, code: 500 }))

        });
    }

    // search all cites by area
    static findAllByArea(area) {

        return new Promise((resolve, reject) => {

            CiteModel.find({ area: area })
                .populate('area')
                .sort('date hour')
                .exec((err, cites) => {

                    if (err) reject({ msg: `Could not found cites.`, err, code: 500 });
                    resolve({ data: cites });

                });
        });
    }

    // search all cites by area and date
    static findAllByAreaAndDate(area, date) {

        return new Promise((resolve, reject) => {
            CiteModel.find({ area: area, date: date })
                .lean()
                .populate('area')
                .sort('date hour')
                .exec((err, cites) => {
                    if (err) reject({ msg: `Could not found cites.`, err, code: 500 });
                    resolve({ data: cites });

                });
        });
    }


    // create cites
    static create(data) {
        return new Promise((resolve, reject) => {
            if (!data)
                return reject({ msg: 'No data', code: 400 });

            if (!data.area)
                return reject({ msg: 'No area', code: 400 });

            // data definiticion
            let body = {
                full_name: data.full_name,
                email: data.email,
                whatsapp: data.whatsapp,
                area: data.area,
                hour: data.hour,
                description: data.description
            };

            body.date = `${new Date().getFullYear()}-${data.month}-${data.day}`;
            // if cite not registered
            this.findAllByDate(body.area, body.date)
                .then(res => {

                    if (_.contains(res.citesRegistered, body.hour)) {
                        return reject({ msg: 'Cite already registered!!', code: 400 });
                    }
                    // new cite model
                    let cite = new CiteModel(body);

                    // data persist
                    cite.save((err, citeCreated) => {
                        if (err) return reject({ msg: 'Error db', err, code: 500 });
                        if (!citeCreated) return reject({ msg: 'Could not create the cite.', code: 500 });

                        // emit to users cite is not disponible
                        io.emit('new-cite-registered', { date: citeCreated.date, hour: citeCreated.hour });
                        io.emit('new-cite-registered-admin', { data: citeCreated });
                        resolve(citeCreated);
                    });
                })
                .catch(err => reject({ msg: `Could not create the cite.`, err, code: 500 }));
        });
    }

    // delete Cite
    static delete(cite) {
        return new Promise((resolve, reject) => {

            CiteModel.findByIdAndRemove(cite, (err, citeDB) => {

                if (err) return reject({ msg: 'Error db', err, code: 500 });
                if (!citeDB) return reject({ msg: 'Could not delete the Cite.', err, code: 500 });

                io.emit('delete-cite-registered-admin', { data: citeDB });
                resolve(citeDB);
            });
        });
    }

}

module.exports = { Cite }