const express = require("express");
const router = express.Router();

const {
    Country,
    State,
    City
} = require("country-state-city");

/* =========================================
   GET ALL COUNTRIES
========================================= */

router.get("/countries", (req, res) => {

    try {

        const countries = Country.getAllCountries().sort((a, b) =>
            a.name.localeCompare(b.name)
        );

        res.status(200).json({
            success: true,
            count: countries.length,
            countries
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

/* =========================================
   GET STATES
========================================= */

router.get("/states/:countryCode", (req, res) => {

    try {

        const states = State.getStatesOfCountry(
            req.params.countryCode
        ).sort((a, b) => a.name.localeCompare(b.name));

        res.status(200).json({
            success: true,
            count: states.length,
            states
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

/* =========================================
   GET CITIES
========================================= */

router.get("/cities/:countryCode/:stateCode", (req, res) => {

    try {

        const cities = City.getCitiesOfState(
            req.params.countryCode,
            req.params.stateCode
        ).sort((a, b) => a.name.localeCompare(b.name));

        res.status(200).json({
            success: true,
            count: cities.length,
            cities
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

module.exports = router;