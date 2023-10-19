const express = require("express");
const app = express();
const sendFile = require("./router/sendFile");
const config = require("./config")


app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use(express.json());

app.set("view engine", "ejs")
app.use("/", sendFile)

app.get("/", (req, res) => {
    res.redirect("/share")
})

app.listen(config.port, (err) => {
    if (!err) {
        console.log("Aplication online " + config.ip + ":" + config.port);
    }
})