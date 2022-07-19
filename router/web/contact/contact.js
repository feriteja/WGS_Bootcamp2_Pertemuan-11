const express = require("express");
const {
  contactValidator,
  deleteContact,
  getContactDetail,
  getContact,
  addContact,
  updateContact,
} = require("../../../function/contactHandler");
const router = express.Router();

//! GET ALL USER
router.get("/", (req, res) => {
  const contacts = getContact();
  let message = "";
  if (req.query.added) message = "user has been added";
  if (req.query.updated) message = "user has been updated";
  if (req.query.deleted) message = "user has been deleted";

  res.render("contact", {
    name: "Feri Teja Kusuma",
    title: "WEBSERVER - EJS",
    message,
    contacts,
  });
});

//! ADD USER FUNC
router.post("/", contactValidator, (req, res) => {
  const message = req.errorMessage;

  if (message.length > 0) {
    return res.render("contactAdd", {
      message: message,
      params: req.body,
    });
  }
  addContact(req.body);

  const contacts = getContact();

  res.redirect("/contact?added=success");
});

//! TO ADD USER PAGE
router.get("/add", (req, res) => {
  res.render("contactAdd");
});

//! UPDATE USER PAGE
router.get("/update/:userID", (req, res) => {
  const userID = req.params.userID;
  const contacts = getContact();

  const contact = contacts.find((contact) => contact.name === userID);
  res.render("contactUpdate", { userID: userID, contact: contact });
});

//! UPDATE USER FUNC
router.post("/update/:userID", contactValidator, (req, res) => {
  const userID = req.params.userID;
  const newContact = req.body;
  const existContact = getContactDetail(userID);
  const message = req.errorMessage;

  if (message.length > 0) {
    return res.render("contactUpdate", {
      message: message,
      userID: userID,
      contact: req.body,
    });
  }

  if (JSON.stringify(existContact) === JSON.stringify(newContact)) {
    res.redirect("/contact");
    return;
  }

  updateContact(userID, newContact);

  res.redirect("/contact?updated=success");
});

//! GET USER DETAIL
router.get("/:userID", (req, res) => {
  const userID = req.params.userID;
  const user = getContactDetail(userID);

  if (!user) {
    res.status(404).render("errorPage", { message: "user not found" });
  }

  res.render("detail", {
    name: "Feri Teja Kusuma",
    title: "WEBSERVER - EJS",
    user,
  });
});

//! DELETE  USER
router.post("/:userID", (req, res) => {
  const contact = req.params.userID;

  const isDeleted = deleteContact(contact);

  if (!isDeleted) res.status(404).render("errorPage");

  res.redirect("/contact?deleted=success");
});

module.exports = router;
