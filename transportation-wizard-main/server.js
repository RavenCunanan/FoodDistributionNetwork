const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();


const dir = "/cmc mockup web html base"
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.static("transportation-wizard")); // default URL for website
app.use(express.static(path.join(__dirname, dir)));
const server = http.createServer(app);
const port = process.env.PORT || 3000;


router = express.Router()
app.use("/home", (req, res) => {
    res.sendFile(__dirname + dir + "/index.html");
});
app.use("/contact", (req, res) => {
    // whatever
});
app.use("/about", (req, res) => {
    // whatever
});
app.use("/map", (req, res) => {
    res.sendFile(__dirname + dir + "/map.html")
});
app.use("/login", (req, res) => {
    // whatever
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get("/*", (req, res) => {
    res.status(404).send("Page not found");
});


app.use(router)
server.listen(port);
console.debug("Server listening on port " + port);