var express = require('express');
var router = express.Router();


//controllers
const { getSignupPage, doSignup, getLoginPage, doLogin, getHomePage, logout, searchJob, searchHospital, searchIndustry, searchHotels } = require("../controllers/job-seeker-controller")
const checkJobSeeker = require('../middleware/checkJobSeeker')

router.route('/').get(checkJobSeeker, getHomePage);
router.route('/signup').get(getSignupPage).post(doSignup);
router.route('/login').get(getLoginPage).post(doLogin);
router.route('/logout').get(checkJobSeeker, logout);
router.route('/search-jobs').get(checkJobSeeker, searchJob);
router.route('/search-hospitals').get(checkJobSeeker, searchHospital);
router.route('/search-industries').get(checkJobSeeker, searchIndustry);
router.route('/search-hotels').get(checkJobSeeker, searchHotels);

module.exports = router;
