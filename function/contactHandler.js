const fs = require("fs");
const pool = require("../db");
const validator = require("validator");

//! MidleWare
const contactValidator = async (req, res, next) => {
  try {
    const { name, email, mobile } = req.body;
    const newContact = req.body;
    const userID = req.params.userID;
    console.log(newContact);

    const contacts = await getContact();
    const isNameDuplicate = contacts.some((cons) => cons.name.trim() === name);
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

const getContact = async () => {
  try {
    const contacts = await pool.query(`SELECT name, email FROM contact`);

    return contacts.rows;
  } catch (error) {
    throw error;
  }
};

const getContactDetail = async (userID) => {
  const user = await pool.query(
    `SELECT name, email, mobile FROM contact WHERE name = '${userID}'`
  );

  return user.rows[0];
};

const addContact = async (contact) => {
  await pool.query(`INSERT INTO public.contact(
    name,  email,mobile)
    VALUES ('${contact.name}', '${contact.email}', '${contact.mobile}')`);
};

const deleteContact = async (userID) => {
  try {
    const contacts = await getContact();

    const isContactExist = contacts.find((cont) => cont.name.trim() === userID);

    if (!isContactExist) {
      console.log("user doesn't exist");
      return false;
    }
    await pool.query(`DELETE FROM contact WHERE name = '${userID}'`);
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (userID, contactInput) => {
  const userDetail = await getContactDetail(userID);

  const contact = {
    name: contactInput.name || userDetail.name,
    email: contactInput.email || userDetail.email,
    mobile: contactInput.mobile || userDetail.mobile,
  };

  pool.query(
    `UPDATE contact SET name = '${contact.name}', email = '${contact.email}', mobile='${contact.mobile}' `
  );
};

module.exports = {
  getContact,
  addContact,
  contactValidator,
  deleteContact,
  getContactDetail,
  updateContact,
};
