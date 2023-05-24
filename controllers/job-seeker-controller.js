const bcrypt = require("bcrypt");
const jobSeekerModel = require("../models/job-seeker-model");
const JobModel = require("../models/job-model");
const HospitalModel = require("../models/hospital-model");
const IndustryModel = require("../models/industry-model");
const HotelModel = require("../models/hotel-model");


const getSignupPage = (req, res) => {
    let alertMessage = req.session.alertMessage
    res.render("job-seeker/signup", { alertMessage });
    delete req.session.alertMessage;
}
const doSignup = async (req, res) => {
    // console.log(req.body);
    try {
        let oldpassword = req.body.password;
        req.body.password = await bcrypt.hash(oldpassword, 10); //encrypting the password from jobSeeker and adding it to the req.body object
        // console.log(req.body);
        const jobSeeker = await jobSeekerModel.create(req.body);
        req.session.alertMessage = "Signup Comlpleted successfully"
        res.status(201).redirect("/job-seeker/login")
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error in creating New Job seeker. Retry !!!!!";
        res.redirect("/job-seeker/signup")
    }
}

const getLoginPage = (req, res) => {
    let alertMessage = req.session.alertMessage
    res.render("job-seeker/login", { alertMessage })
    delete req.session.alertMessage;
}
const doLogin = async (req, res) => {
    try {
        // console.log(req.body, req.body.password);
        let { password } = req.body;
        const jobSeeker = await jobSeekerModel.findOne({ email: req.body.email });
        if (jobSeeker) {
            const exist = await bcrypt.compare(password, jobSeeker.password);
            if (exist) {
                req.session.jobSeeker = jobSeeker;
                req.session.alertMessage = "Logged In successfully";
                return res.redirect("/job-seeker")
            }
        }
        req.session.alertMessage = "Invalid job seeker Credentials";
        res.redirect("/job-seeker/login");
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error Occured. Please Retry !!!";
        res.redirect("/job-seeker/login")
    }
}
//home page
const getHomePage = function (req, res, next) {
    let { alertMessage } = req.session;
    if (req.session.jobSeeker) {
        let { jobSeeker } = req.session; //fetching jobSeeker and alert message stored in session
        res.render("job-seeker/home-page", { title: 'Smart city', jobSeeker, alertMessage });
        delete req.session.alertMessage;
    } else {
        res.render("job-seeker/home-page", { title: 'Smart city', alertMessage });
        delete req.session.alertMessage;
    }
}
//logout
const logout = (req, res) => {
    req.session.jobSeeker = null;
    req.session.alertMessage = "Logged Out Successfully!!!"
    res.redirect("/job-seeker")
}
const searchJob = async (req, res) => {
    let jobs = await JobModel.find({})
    res.render("job-seeker/view-jobs", { jobs })
}
const searchHospital = async (req, res) => {
    let hospitals = await HospitalModel.find({})
    res.render("job-seeker/view-hospitals", { hospitals })
}
const searchIndustry = async (req, res) => {
    let industry = await IndustryModel.find({})
    res.render("job-seeker/view-industry", { industry })
}
const searchHotels = async (req, res) => {
    let hotels = await HotelModel.find({})
    res.render("job-seeker/view-hotels", { hotels })
}




module.exports = { getSignupPage, doSignup, getLoginPage, doLogin, getHomePage, logout, searchJob, searchHospital, searchIndustry, searchHotels }