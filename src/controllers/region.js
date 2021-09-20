// validations
import OperationalError, {
    ALREADY_EXISTS_ERROR,
    NOT_FOUND_ERROR
} from '../api/validations/operational-error';

// models
import Country from '../models/country';
import Province from '../models/province';
import City from '../models/city';
import ProgrammingError from "../api/validations/programmer-error";

const regionController = {


    createCountry: async function (req, res, next) {
        try {
            const {
                title,
                phoneCode
            } = req.body;
            let country = await Country.findOne({
                title: title,
                isDeleted: false
            });
            if (country) {
                //return next(new OperationalError(ALREADY_EXISTS_ERROR, 'country'))
                return next(new OperationalError(NOT_FOUND_ERROR, 'country'));
            }
            const newCountry = new Country({
                title: title,
                phoneCode: phoneCode,
            });
            await newCountry.save();
            return res.status(200).json(newCountry);
        } catch (err) {
            //return next(new OperationalError(500))
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    createProvince: async function (req, res, next) {
        try {
            const {
                title,
                phoneCode,
                country
            } = req.body;
            let province = await Province.findOne({
                title: title,
                isDeleted: false
            });
            if (province) {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, 'province'));
            }
            const newProvince = new Province({
                title: title,
                phoneCode: phoneCode,
                country: country,
            });
            await newProvince.save();
            return res.status(200).json(newProvince);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    createCity: async function (req, res, next) {
        try {
            const {
                title,
                province
            } = req.body;


            let city = await City.findOne({
                title: title
            });
            if (city) {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, 'city'));
            }
            const newCity = new City({
                title: title,
                province: province,
            });
            await newCity.save();
            return res.status(200).json(newCity);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    countriesList: async function (req, res, next) {
        try {
            let countries = await Country.find({
                isDeleted: false
            });
            return res.status(200).json(countries);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    provincesList: async function (req, res, next) {
        try {
            let provinces = await Province.find({
                isDeleted: false
            }).populate("country");
            return res.status(200).json(provinces);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    citiesList: async function (req, res, next) {
        try {
            let cities = await City.find({
                isDeleted: false
            }).populate("province");
            return res.status(200).json(cities);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    listCitiesForProvince: async function (req, res, next) {
        try {
            let province = await Province.find({
                _id: req.params.id
            });
            if (!province) {
                return next(new OperationalError(NOT_FOUND_ERROR, 'province'));
            } else {
                let city = await City.find({
                    province: provinceId
                }).populate("province");
                return res.statsu(200).json(city);
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    getCountry: async function (req, res, next) {
        try {
            let country = await Country.findOne({
                isDeleted: false,
                _id: req.params.id
            });
            if (!country)
                return next(new OperationalError(NOT_FOUND_ERROR, 'country'));
            return re.params.status(200).json(country);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getProvince: async function (req, res, next) {
        try {
            let province = await Province.findOne({
                isDeleted: false,
                _id: req.params.id
            });
            if (!province)
                return next(new OperationalError(NOT_FOUND_ERROR, 'province'));
            return re.params.status(200).json(province);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getCity: async function (req, res, next) {
        try {
            let city = await City.findOne({
                isDeleted: false,
                _id: req.params.id
            });
            if (!city)
                return next(new OperationalError(NOT_FOUND_ERROR, 'city'));
            return re.params.status(200).json(city);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editCountry: async function (req, res, next) {
        try {
            const {
                title,
                phoneCode
            } = req.body;
            let country = await Country.findOne({
                isDeleted: false,
                _id: req.params.id
            });
            if (!country)
                return next(new OperationalError(NOT_FOUND_ERROR, 'country'));
            let updatedCountry = await Country.updateOne({
                isDeleted: false,
                _id: req.params.id
            }, {
                title: title,
                phoneCode: phoneCode,
                updatedAt: Date.now(),
            });
            return res.status(200).json(updatedCountry);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editProvince: async function (req, res, next) {
        try {
            const {
                title,
                phoneCode,
                country
            } = req.body;
            let province = await Province.findOne({
                isDeleted: false,
                _id: req.params.id
            });
            if (!province)
                return next(new OperationalError(NOT_FOUND_ERROR, 'province'));
            let updatedProvince = await Province.updateOne({
                isDeleted: false,
                _id: req.params.id
            }, {
                title: title,
                phoneCoee: phoneCode,
                country: country,
                updatedAt: Date.now()
            });
            return res.status(200).json(updatedProvince);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editCity: async function (req, res, next) {
        try {
            const { title, province } = req.body;
            let city = await City.findOne({ isDeleted: false, _id: req.params.id });
            if (!city)
                return next(new OperationalError(NOT_FOUND_ERROR, 'city'));
            let updatedCity = await City.updateOne({
                isDeleted: false,
                _id:req.params.id
            }, {
                title: title,
                province: province
            });
            return res.status(200).json(updatedCity);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    }
}

export default regionController;