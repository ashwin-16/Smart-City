const bcrypt = require("bcrypt");
const TouristModel = require("../models/tourist-model");
const HospitalModel = require("../models/hospital-model");
const HotelModel = require("../models/hotel-model")
const TheaterModel = require("../models/theater-model")
const LibraryModel = require("../models/library-model")



const getSignupPage = (req, res) => {
    let alertMessage = req.session.alertMessage
    res.render("tourist/signup", { alertMessage });
    delete req.session.alertMessage;
}
const doSignup = async (req, res) => {
    // console.log(req.body);
    try {
        let oldpassword = req.body.password;
        req.body.password = await bcrypt.hash(oldpassword, 10); //encrypting the password from tourist and adding it to the req.body object
        // console.log(req.body);
        const tourist = await TouristModel.create(req.body);
        req.session.alertMessage = "Signup Comlpleted successfully"
        res.status(201).redirect("/tourist/login")
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error in creating New Tourist. Retry !!!!!";
        res.redirect("/tourist/signup")
    }
}

const getLoginPage = (req, res) => {
    if (req.session.tourist) {
        res.redirect("/tourist")
    } else {
        let alertMessage = req.session.alertMessage
        res.render("tourist/login", { alertMessage })
        delete req.session.alertMessage;
    }
}
const doLogin = async (req, res) => {
    try {
        // console.log(req.body, req.body.password);
        let { password } = req.body;
        const tourist = await TouristModel.findOne({ email: req.body.email });
        if (tourist) {
            const exist = await bcrypt.compare(password, tourist.password);
            if (exist) {
                req.session.tourist = tourist;
                req.session.alertMessage = "Logged In successfully";
                return res.redirect("/tourist")
            }
        }
        req.session.alertMessage = "Invalid Tourist Credentials";
        res.redirect("/tourist/login");
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error Occured. Please Retry !!!";
        res.redirect("/tourist/login")
    }
}
//home page
const getHomePage = function (req, res, next) {
    let { alertMessage } = req.session;
    if (req.session.tourist) {
        let { tourist } = req.session; //fetching tourist and alert message stored in session
        res.render("tourist/home-page", { title: 'Smart city', tourist, alertMessage });
        delete req.session.alertMessage;
    } else {
        res.render("tourist/home-page", { title: 'Smart city', alertMessage });
        delete req.session.alertMessage;
    }
}
//logout
const logout = (req, res) => {
    req.session.tourist = null;
    req.session.alertMessage = "Logged Out Successfully!!!"
    res.redirect("/")
}
const searchHotel = async (req, res) => {
    let hotels = await HotelModel.find({})
    res.render("tourist/view-hotels", { hotels })
}
const searchHospital = async (req, res) => {
    let hospitals = await HospitalModel.find({})
    res.render("tourist/view-hospitals", { hospitals })
}
const searchTheater = async (req, res) => {
    let theaters = await TheaterModel.find({})
    res.render("tourist/view-theaters", { theaters })
}
const searchLibrary = async (req, res) => {
    let libraries = await LibraryModel.find({})
    res.render("tourist/view-libraries", { libraries })
}




module.exports = { getSignupPage, doSignup, getLoginPage, doLogin, getHomePage, logout, searchHotel, searchHospital, searchTheater, searchLibrary }