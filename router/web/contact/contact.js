const express = require("express");
const {
  deleteContact,
  getContactDetail,
  getContact,
  addContact,
  updateContact,
} = require("../../../function/handler/contactHandler");
const {
  contactValidator,
  uploadMulter,
} = require("../../../function/middleware/middleware");
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
router.post(
  "/",
  uploadMulter.single("avatar"),
  contactValidator,
  async (req, res) => {
    const message = req.errorMessage;

    if (message.length > 0) {
      return res.render("contactAdd", {
        message: message,
        params: req.body,
      });
    }
    await addContact(req.body, `public/upload/images/${req.file.originalname}`);

    res.redirect("/contact?added=success");
  }
);

//! TO ADD USER PAGE
router.get("/add", (req, res) => {
  res.render("contactAdd");
});

//! UPDATE USER PAGE
router.get("/update/:userID", async (req, res) => {
  const userID = req.params.userID;
  const contact = await getContactDetail(userID);

  if (!contact) {
    res.status(404).render("errorPage", { message: "user not found" });
    return;
  }

  res.render("contactUpdate", { userID: userID, contact: contact });
});

//! UPDATE USER FUNC
router.post(
  "/update/:userID",
  uploadMulter.single("avatar"),
  contactValidator,
  async (req, res) => {
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
      if (JSON.stringify(existContact) === JSON.stringify(newContact)) {
        res.redirect("/contact");
        return;
      }
      console.log("file", req.file);
      const filePath = `public/upload/images/${req.file.originalname}`;

      updateContact(userID, newContact, filePath);

      res.redirect("/contact?updated=success");
    } catch (error) {
      console.log("error", error);
    }
  }
);

//! GET USER DETAIL
router.get("/:userID", async (req, res) => {
  const userID = req.params.userID;
  const user = await getContactDetail(userID);

  if (!user) {
    res.status(404).render("errorPage", { message: "user not found" });
    return;
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
    const userID = req.params.userID;

    const user = await getContactDetail(userID);

    if (!user) {
      res.status(404).render("errorPage", { message: "user not found" });
      return;
    }

    await deleteContact(userID);

    res.redirect("/contact?deleted=success");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
