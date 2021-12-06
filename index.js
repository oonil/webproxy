const express = require("express");
const app = express();
const PORT = process.env.PORT | 4242;
var session = require("express-session");
console.log("console test2 branch");

//* handle Routing
var routeHandler = require("./src/routeHandler");

//* middlewares;
var requestDetails = require("./src/middleware/requestDetails");
var requestCreate = require("./src/middleware/requestCreate");
var serveStatic = require("./src/middleware/serveStatic");

app.use(
  session({
    secret: "sshh,it's a secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
); //use session

app.use("*", serveStatic); //* Server static files
app.use("*", requestDetails); //* create request details objects
app.use("*", requestCreate); //*  create reqeust object for axios
app.use("*", routeHandler); //* route handler  direct | queryString | referer

app.listen(PORT, () => {
  console.log(`listeing on port ${PORT}`);
});
