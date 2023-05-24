const bcrypt = require("bcrypt");
const StudentModel = require("../models/student-model");
const LibraryModel = require("../models/library-model");
const CollegeModel = require("../models/college-model");
const HospitalModel = require("../models/hospital-model");


const getSignupPage = (req, res) => {
    let alertMessage = req.session.alertMessage
    res.render("student/signup", { alertMessage });
    delete req.session.alertMessage;
}
const doSignup = async (req, res) => {
    // console.log(req.body);
    try {
        let oldpassword = req.body.password;
        req.body.password = await bcrypt.hash(oldpassword, 10); //encrypting the password from student and adding it to the req.body object
        // console.log(req.body);
        const student = await StudentModel.create(req.body);
        req.session.alertMessage = "Signup Comlpleted successfully"
        res.status(201).redirect("/login")
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error in creating New student. Retry !!!!!";
        res.redirect("/signup")
    }
}

const getLoginPage = (req, res) => {
    let alertMessage = req.session.alertMessage
    res.render("student/login", { alertMessage })
    delete req.session.alertMessage;
}
const doLogin = async (req, res) => {
    try {
        // console.log(req.body, req.body.password);
        let { password } = req.body;
        const student = await StudentModel.findOne({ email: req.body.email });
        if (student) {
            const exist = await bcrypt.compare(password, student.password);
            if (exist) {
                req.session.student = student;
                req.session.alertMessage = "Logged In successfully";
                return res.redirect("/")
            }
        }
        req.session.alertMessage = "Invalid student Credentials";
        res.redirect("/login");
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error Occured. Please Retry !!!";
        res.redirect("/login")
    }
}
//home page
const getHomePage = function (req, res, next) {
    let { alertMessage } = req.session;
    if (req.session.student) {
        let { student } = req.session; //fetching student and alert message stored in session
        res.render('student/home-page', { title: 'Smart city', student, alertMessage });
        delete req.session.alertMessage;
    } else {
        res.render('home-page', { title: 'Smart city', alertMessage });
        delete req.session.alertMessage;
    }
}
    

//logout
const logout = (req, res) => {
    req.session.student = null;
    req.session.alertMessage = "Logged Out Successfully!!!"
    res.redirect("/")
}
const searchLibrary = async (req, res) => {
    let libraries = await LibraryModel.find({})
    res.render("student/view-libraries", { libraries })
}
const searchColleges = async (req, res) => {
    let colleges = await CollegeModel.find({})
    res.render("student/view-colleges", { colleges })
}
const searchHosptals = async (req, res) => {
    let hospitals = await HospitalModel.find({})
    res.render("student/view-hospitals", { hospitals })
}



module.exports = { getSignupPage, doSignup, getLoginPage, doLogin, getHomePage, logout, searchLibrary, searchColleges, searchHosptals }