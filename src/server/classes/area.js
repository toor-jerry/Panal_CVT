// Socket
const { io } = require('../app');

// Area model
const AreaModel = require('../models/area');

class Area {

    // search all Areas
    static findAll() {

        return new Promise((resolve, reject) => {

            AreaModel.find({})
                .lean()
                .sort('name')
                .exec((err, areas) => {

                    if (err) reject({ msg: `Could not found Areas.`, err, code: 500 });

                    let area = new Array();

                    areas.forEach(areaTmp => {
                        area.push({
                            _id: areaTmp._id.toString(),
                            name: areaTmp.name,
                            description: areaTmp.description
                        });
                    });

                    resolve({ data: area });

                });
        });
    }

    // create Area
    static create(data) {
        return new Promise((resolve, reject) => {
            if (!data)
                return reject('No data');

            // data definiticion
            let body = {
                name: data.name,
                description: data.description
            };

            // new model of Area
            let area = new AreaModel(body);

            // data persist
            area.save((err, areaCreated) => {

                if (err) return reject({ msg: 'Error db', err, code: 500 });
                if (!areaCreated) return reject({ msg: 'Could not create the Area.', code: 500 });

                // emit a new area
                io.emit('new-area-registered', { data: areaCreated });
                resolve(areaCreated);
            });

        });
    }

    // delete Area
    static delete(area) {
        return new Promise((resolve, reject) => {

            AreaModel.findByIdAndRemove(area, (err, areaDB) => {

                if (err) return reject({ msg: 'Error db', err, code: 500 });
                if (!areaDB) return reject({ msg: 'Could not delete the Area.', code: 500 });

                // emit area deleted
                io.emit('delete-area-registered', { data: areaDB });
                resolve(areaDB);
            });
        });
    }

}

module.exports = { Area }