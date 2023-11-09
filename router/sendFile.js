const express = require("express");
const Router = express.Router();
const multer = require("multer");
const fs = require("fs");
const qrCode = require("../script/QrGenerator");
const config = require("../config")
//const os = require("os");
//const networkInfo = os.networkInterfaces();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/tmp/uploads');
    }, filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const nameLength = file.originalname.split(".").length;
        //const log = file.originalname
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split(".")[nameLength - 1])
    }
})
const upload = multer({
    storage: storage,
    // fileFilter: (req, file, cb) => {
    //     const fileType = file.originalname.split(".")[file.originalname.split(".").length - 1]
    //     if (fileType.toUpperCase() == "PNG" || fileType.toUpperCase() == "JPEG" || fileType.toUpperCase() == "JPG") {
    //         cb(null, true);
    //     } else {
    //         cb(null, false);
    //     }
    // }
})

Router.get("/share", (req, res) => {
    //Procura os nomes dos dos uploads 
    fs.readdir("./public/tmp/uploads", (err, files) => {
        //pega o ip local
        //let local_ip = networkInfo["Wi-Fi"][1]["address"];
        const qr = new qrCode("svg", config.ip + ":" + 8080);
        qr.setPath("./public/tmp")
        qr.Create()
        //essa função delete o qr code 5s após ele ser criado
        setTimeout(() => {
            fs.unlink("./public/tmp/qr_code.svg", () => {
                console.log("QrCode deletado")
            });
        }, 5000)
        let arquivos = [];
        files.forEach((file) => {
            const fileType = file.split(".");
            arquivos.push({ name: file, type: fileType[1] })
        })
        res.render("share", { files: arquivos });
    })
})
// Router.get("/share/:error", (req, res) => {
//     res.render("share", { error: req.params.error });
// })
Router.post("/share", upload.single("data"), (req, res) => {
    console.log("Arquivo salvo " + req.file.data)
    res.redirect("/share");
})

Router.post("/download", (req, res) => {
    let path = "public" + req.body.path;
    console.log(path)
    res.download(path)
})

Router.delete("/share", (req, res) => {
    //Lê os arquivos na pasta uploads
    fs.readdir("./public/tmp/uploads", (err, files) => {
        files.forEach(file => {
            //Apaga os arquivos na pasta
            fs.unlink("./public/tmp/uploads/" + file, () => {
                console.log("deletado " + file)
            })
        })
        console.log("limpeza concluida")
    })
    res.redirect("/share");
})




module.exports = Router;