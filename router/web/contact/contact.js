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
router.get("/", async (req, res) => {
  const contacts = await getContact();
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
router.post("/", contactValidator, async (req, res) => {
  const message = req.errorMessage;

  if (message.length > 0) {
    return res.render("contactAdd", {
      message: message,
      params: req.body,
    });
  }
  addContact(req.body);

  const contacts = await getContact();

  res.redirect("/contact?added=success");
});

//! TO ADD USER PAGE
router.get("/add", (req, res) => {
  res.render("contactAdd");
});

//! UPDATE USER PAGE
router.get("/update/:userID", async (req, res) => {
  const userID = req.params.userID;
  const contact = await getContactDetail(userID);

  res.render("contactUpdate", { userID: userID, contact: contact });
});

//! UPDATE USER FUNC
router.post("/update/:userID", contactValidator, async (req, res) => {
  try {
    const userID = req.params.userID;
    const newContact = req.body;
    const existContact = await getContactDetail(userID);
    const message = req.errorMessage;

    if (message.length > 0) {
      return res.render("contactUpdate", {
        message: message,
        userID: userID,
        contact: req.body,
      });
    }

    console.log(
      `🚀 ---------------------------------------------------------------------🚀`
    );
    console.log(
      `🚀 ~ file: contact.js ~ line 75 ~ router.post ~ newContact`,
      newContact
    );
    console.log(
      `🚀 ---------------------------------------------------------------------🚀`
    );
    console.log(
      `🚀 -------------------------------------------------------------------------🚀`
    );
    console.log(
      `🚀 ~ file: contact.js ~ line 75 ~ router.post ~ existContact`,
      existContact
    );
    console.log(
      `🚀 -------------------------------------------------------------------------🚀`
    );
    if (JSON.stringify(existContact) === JSON.stringify(newContact)) {
      res.redirect("/contact");
      return;
    }

    updateContact(userID, newContact);

    res.redirect("/contact?updated=success");
  } catch (error) {
    console.log("error", error);
  }
});

//! GET USER DETAIL
router.get("/:userID", async (req, res) => {
  const userID = req.params.userID;
  const user = await getContactDetail(userID);

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
router.post("/:userID", async (req, res) => {
  try {
    const contact = req.params.userID;

    const isDeleted = await deleteContact(contact);

    if (isDeleted) {
      res.status(404).render("errorPage");
      console.log("masuk");
    }

    res.redirect("/contact?deleted=success");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
