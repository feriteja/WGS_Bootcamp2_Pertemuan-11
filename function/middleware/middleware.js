const pool = require("../../db");
const validator = require("validator");
var multer = require("multer");
const fs = require("fs");

//!  contactValidator Middleware
const contactValidator = async (req, res, next) => {
  try {
    const { name, email, mobile } = req.body;
    const newContact = req.body;
    const userID = req.params.userID;

    const existedUser = await pool.query(
      `SELECT name FROM contact WHERE name = '${name}'`
    );

    const isNameDuplicate = existedUser.rows.length > 0 ? true : false;

    const isEmailValid = validator.isEmail(email);
    const isNumber = validator.isMobilePhone(mobile, "id-ID");
    req.errorMessage = [];
    if (isNameDuplicate && userID !== newContact.name) {
      req.errorMessage.push("Name is Duplicated, Please enter something else");
    }
    if (!isEmailValid) {
      req.errorMessage.push("Email is not valid");
    }
    if (!isNumber && mobile) {
      req.errorMessage.push("Number is not valid");
    }
    next();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "../../../public/upload/images/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploadMulter = multer({
  storage: storage,
});

module.exports = { contactValidator, uploadMulter };
