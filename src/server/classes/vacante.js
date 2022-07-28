const _ = require('underscore');
const VacanteModel = require('../models/vacante');
const UsuarioModel = require('../models/usuario');
const PostulacionModel = require('../models/postulacion');

const { response500, response400, response200, response201 } = require('../utils/utils');

class Vacante {

    static findAll(res, params_populate, user, from, limit, auth) {

        VacanteModel.find({})
            .skip(from)
            .limit(limit)
            .sort('dateCreate')
            .populate('enterprise', params_populate)
            .exec((err, employments) => {

                if (err) return response500(res, err);

                if (auth) {
                    PostulationModel.find({ user: user })
                        .populate('employment')
                        .exec((err, postulations) => {
                            if (err) return response500(res, err);
                            let postulationsTmp = [];
                            _.filter(postulations, (post) => {
                                postulationsTmp.push(post.employment)
                            });
                            // console.log(postulationsTmp);
                            // employments = _.without(employments, postulationsTmp);
                            let whithOutResp = this.whithOut(employments, postulationsTmp)
                            EmploymentModel.countDocuments((err, count) => {

                                if (err) return response500(res, err);

                                PostulationModel.find({ user: user })
                                    .populate('employment')
                                    .skip(from)
                                    .limit(limit)
                                    .exec((err, postulationsDB) => {
                                        if (err) return response500(res, err);
                                        let postulationsTmp2 = [];
                                        _.filter(postulationsDB, (post) => {
                                            postulationsTmp2.push(post.employment)
                                        });
                                        res.status(200).json({
                                            ok: true,
                                            data: {
                                                employments: whithOutResp.employments,
                                                postulations: postulationsTmp2
                                            },
                                            total: count
                                        });
                                    });
                            });
                        });
                } else {

                    EmploymentModel.countDocuments((err, count) => {

                        if (err) return response500(res, err);
                        res.status(200).json({
                            ok: true,
                            data: {
                                employments,
                                postulations: []
                            },
                            total: count
                        });

                    });
                }


            });
    }

    static buscarPorId(id) {

        return new Promise((resolve, reject) => {
        VacanteModel.findById(id)
            .populate('empresa')
            .lean()
            .exec((err, vacante) => {

                if (err) reject({ code: 500, err });
                    if (!vacante) reject({ code: 400, err: 'No se encontró la vacante.' });
                    return resolve({
                        ok: true,
                        data: vacante
                });
                });
            });

    }

    static encontrarPorEmpresa(empresa) {

        return new Promise((resolve, reject) => {
            VacanteModel.find({ empresa: empresa })
                .lean()
                .sort({ 'fechaCreacion': -1 })
                .exec((err, vacantes) => {

                    if (err) reject({ code: 500, err });
                    if (!vacantes) reject({ code: 400, err: 'No se encontraron vacantes.' });
                    
                    VacanteModel.countDocuments({ empresa: empresa }, (err, count) => {
                        
                        if (err) reject({ code: 500, err });
                        
                        resolve({
                            ok: true,
                            data: vacantes,
                            total: count
                        });
                    });
            });
        });
    }

    static encontrarTodas() {

        return new Promise((resolve, reject) => {
            VacanteModel.find()
                .lean()
                .sort({ 'fechaCreacion': -1 })
                .populate('empresa', 'razonSocial foto')
                .exec((err, vacantes) => {

                    if (err) reject({ code: 500, err });
                    if (!vacantes) reject({ code: 400, err: 'No se encontraron vacantes.' });
                    VacanteModel.countDocuments({}, (err, count) => {
                        
                        if (err) reject({ code: 500, err });
                        
                        resolve({
                            ok: true,
                            data: vacantes,
                            total: count
                        });
                    });
            });
        });
    }

    static crear(data) {
        return new Promise((resolve, reject) => {
            let body = _.pick(data, ['puesto', 'empresa', 'salario', 'horarios', 'funciones', 'notas']);
            let vacante = new VacanteModel(body);
            vacante.save((err, vacanteCreada) => {
                if (err) reject({ code: 500, err });
                if (!vacanteCreada) reject({ code: 400, err: 'No se pudo crear la vacante.' });
                resolve({
                    data: vacanteCreada,
                });
            });
        });
    }

    static update(res, id_employment, enterprise, data) {

        EmploymentModel.findOne({ _id: id_employment, enterprise: enterprise }, (err, employment) => {
            if (err) return response500(res, err);
            if (!employment) return response400(res, 'Employment not found.');

            employment = _.extend(employment, _.pick(data, ['name', 'enterprise', 'salary', 'horary', 'workable_days', 'description', 'vacancy_numbers', 'domicile', 'requeriments', 'dateLimit', 'category', 'type', 'state']));

            employment.save((err, employmentUpdated) => {
                if (err) return response500(res, err);
                if (!employmentUpdated) return response400(res, 'Could not update the employment.');
                response200(res, employmentUpdated);
            });
        });
    }

    // Eliminar vacante
    static eliminar(res, idVacante, empresa) {

        VacanteModel.findOneAndRemove({ _id: idVacante, empresa: empresa }, (err, vacanteEliminada) => {

            if (err) return response500(res, err);
            if (!vacanteEliminada) return response400(res, 'No se pudo eliminar la vacante.');

            PostulacionModel.deleteMany({ empleo: idVacante }, (err, result) => {
                if (err) return response500(res, err, 'No se pudieron borrar las postulaciones ligadas a esta vacante.');
                return res.status(200).json({
                    ok: true,
                    data: vacanteEliminada,
                    totalDeleted: result.deletedCount
                });
            });

        });

    }

    static buscarVacantes = (regex, from = 0, limit = 10) => {

        return new Promise((resolve, reject) => {

            let state = (regex.source.toLowerCase().trim() == 'true') ? true : false;
            let salario = Number(regex.source) || undefined;

            VacanteModel.find({}, 'puesto empresa salario horarios funciones notas fechaCreacion')
                .lean()
                .populate('empresa', 'razonSocial foto')
                .or([{ 'puesto': regex },  { 'horarios': regex }, { 'funciones': regex }, { 'notas': regex }, { 'salario': salario }])
                //.skip(from)
                //.limit(limit)
                .exec((err, vacantes) => {
                    if (err)
                        return reject(`No se pudo buscar '${regex}' en vacantes, ${err}.`);
                        VacanteModel.countDocuments({})
                        .or([{ 'puesto': regex },  { 'horarios': regex }, { 'funciones': regex }, { 'notas': regex }, { 'salario': salario }])
                        .exec((err, total) => {
                            if (err)
                                return reject(`No se pudo buscar '${regex}' en vacantes, ${err}.`);
                            else resolve({
                                data: vacantes,
                                total
                            });
                        });

                });
        });
    }

    static searchOnlyEmployments = (regex, from = 0, limit = 10) => {

        return new Promise((resolve, reject) => {

            let state = (regex.source.toLowerCase().trim() == 'true') ? true : false;
            let vacancy_numbers = Number(regex.source) || undefined;

            EmploymentModel.find({ type: 'JOB_OFFER' }, 'name description category salary horary workable_days vacancy_numbers requeriments domicile state type')
                .populate('enterprise', 'name')
                .or([{ 'name': regex }, { 'description': regex }, { 'category': regex }, { 'salary': regex }, { 'horary': regex }, { 'workable_days': regex }, { 'vacancy_numbers': vacancy_numbers }, { 'requeriments': regex }, { 'domicile': regex }, { 'state': state }, { 'type': regex }])
                .skip(from)
                .limit(limit)
                .exec((err, employments) => {

                    if (err)
                        return reject(`Could not found ${regex} in employments.`, err);
                    EmploymentModel.countDocuments({ type: 'JOB_OFFER' })
                        .or([{ 'name': regex }, { 'description': regex }, { 'category': regex }, { 'salary': regex }, { 'horary': regex }, { 'workable_days': regex }, { 'vacancy_numbers': vacancy_numbers }, { 'requeriments': regex }, { 'domicile': regex }, { 'state': state }, { 'type': regex }])
                        .exec((err, total) => {
                            if (err)
                                return reject(`Could not found ${regex} in employments (total).`, err);
                            else resolve({
                                data: employments,
                                total
                            });
                        });

                });
        });
    }

    static searchSocietyService = (regex, from = 0, limit = 10) => {

        return new Promise((resolve, reject) => {

            let state = (regex.source.toLowerCase().trim() == 'true') ? true : false;
            let vacancy_numbers = Number(regex.source) || undefined;

            EmploymentModel.find({ type: 'SOCIETY_SERVICE' }, 'name description category salary horary workable_days vacancy_numbers requeriments domicile state type')
                .populate('enterprise', 'name')
                .or([{ 'name': regex }, { 'description': regex }, { 'category': regex }, { 'salary': regex }, { 'horary': regex }, { 'workable_days': regex }, { 'vacancy_numbers': vacancy_numbers }, { 'requeriments': regex }, { 'domicile': regex }, { 'state': state }, { 'type': regex }])
                .skip(from)
                .limit(limit)
                .exec((err, employments) => {
                    if (err)
                        reject(`Could not found ${regex} in employments.`, err);
                    EmploymentModel.countDocuments({ type: 'SOCIETY_SERVICE' })
                        .or([{ 'name': regex }, { 'description': regex }, { 'category': regex }, { 'salary': regex }, { 'horary': regex }, { 'workable_days': regex }, { 'vacancy_numbers': vacancy_numbers }, { 'requeriments': regex }, { 'domicile': regex }, { 'state': state }, { 'type': regex }])
                        .exec((err, total) => {
                            if (err)
                                reject(`Could not found ${regex} in employments (total).`, err);
                            else resolve({
                                data: employments,
                                total
                            });
                        });

                });
        });
    }

    static searchProfessionalPractice = (regex, from = 0, limit = 10) => {

        return new Promise((resolve, reject) => {

            let state = (regex.source.toLowerCase().trim() == 'true') ? true : false;
            let vacancy_numbers = Number(regex.source) || undefined;

            EmploymentModel.find({ type: 'PROFESSIONAL_PRACTICES' }, 'name description category salary horary workable_days vacancy_numbers requeriments domicile state type')
                .populate('enterprise', 'name')
                .or([{ 'name': regex }, { 'description': regex }, { 'category': regex }, { 'salary': regex }, { 'horary': regex }, { 'workable_days': regex }, { 'vacancy_numbers': vacancy_numbers }, { 'requeriments': regex }, { 'domicile': regex }, { 'state': state }, { 'type': regex }])
                .skip(from)
                .limit(limit)
                .exec((err, employments) => {
                    if (err)
                        reject(`Could not found ${regex} in employments.`, err);
                    EmploymentModel.countDocuments({ type: 'PROFESSIONAL_PRACTICES' })
                        .or([{ 'name': regex }, { 'description': regex }, { 'category': regex }, { 'salary': regex }, { 'horary': regex }, { 'workable_days': regex }, { 'vacancy_numbers': vacancy_numbers }, { 'requeriments': regex }, { 'domicile': regex }, { 'state': state }, { 'type': regex }])
                        .exec((err, total) => {
                            if (err)
                                reject(`Could not found ${regex} in employments (total).`, err);
                            else resolve({
                                data: employments,
                                total
                            });
                        });

                });
        });
    }

    

    static countProfessionalPractice = (user) => {

        return new Promise((resolve, reject) => {
            EmploymentModel.find({ type: 'PROFESSIONAL_PRACTICES' })
                .exec((err, employments) => {

                    if (err) return reject(err);
                    PostulationModel.find({ user: user })
                        .populate('employment')
                        .exec((err, postulations) => {
                            if (err) return reject(err);
                            let totalTmp = 0
                            _.filter(postulations, (post) => {
                                let empl = post.employment
                                if (empl.type === 'PROFESSIONAL_PRACTICES') {
                                    employments.forEach(element => {
                                        if ('' + element._id === '' + empl._id) {
                                            totalTmp += 1
                                        }
                                    });
                                }
                            });

                            EmploymentModel.countDocuments({ type: 'PROFESSIONAL_PRACTICES' })
                                .exec((err, total) => {
                                    if (err)
                                        reject(`Could not found ${regex} in social employments (total).`, err);
                                    else resolve(total - totalTmp);
                                });
                        });
                })


        });
    }

}


module.exports = {
    Vacante
}