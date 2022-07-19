const express = require("express");
var morgan = require("morgan");
const contact = require("./router/web/contact/contact");

var expressLayouts = require("express-ejs-layouts");
const { getContact } = require("./function/contactHandler");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

app.use(expressLayouts);

app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: true }));

// app.use(morgan("dev"));

// app.use((req, res, next) => {
//   console.log("Time:", Date.now());
//   next();
// });

//! Home page
app.get("/", (req, res) => {
  const contacts = getContact();

  res.render("index", {
    name: "Feri Teja Kusuma",
    title: "WEBSERVER - EJS",
    contacts,
  });
});

//! About page
app.get("/about", (req, res) => {
  res.render("about");
});

//! Contact router
app.use("/contact", contact);

//! notFound page
app.use("/", (req, res) => {
  res.status(404).render("errorPage", { message: "page is not found" });
});

app.listen(port, () => {
  console.log(`your server listening on port ${port}`);
});
