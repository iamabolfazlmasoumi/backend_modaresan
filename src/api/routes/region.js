import express from 'express';
import regionController from '../../controllers/region';
import {createCityValidation, createCountryValidation, createProvinceValidation} from "../validations/region";
import {checkAccessControl} from "../middlewares/access-control";

const router = express.Router();

// routes
router.post('/country', createCountryValidation, checkAccessControl('admin__create_country'), regionController.createCountry);
router.post('/province', createProvinceValidation, checkAccessControl('admin__create_province'), regionController.createProvince);
router.post('/city', createCityValidation, checkAccessControl('admin__create_city'), regionController.createCity);

router.get('/country', regionController.countriesList);
router.get('/province', regionController.provincesList);
router.get('/city', regionController.citiesList);

router.get('/country/:id', regionController.getCountry);
router.get('/province/:id', regionController.getProvince);
router.get('/city/:id', regionController.getCity);

router.put('/country/:id', regionController.editCountry);
router.put('/province/:id', regionController.editProvince);
router.put('/city/:id', regionController.editProvince);


export default router;