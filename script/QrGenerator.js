const qr = require("qr-image");
const fs = require("fs");

class QrGenerator {
    constructor(type, link) {
        this.type = type
        this.link = link
    }
    Create() {
        if (this.path == undefined || this.path == "") {
            this.path = "."
        } else { if (!fs.existsSync(this.path)) fs.mkdirSync(this.path) }

        try {
            let qr_image = qr.image(this.link, { type: this.type });
            qr_image.pipe(fs.createWriteStream(this.path + "/qr_code." + this.type));
        } catch (error) {
            throw new Error(error);
        }
    }
    setPath(path) {
        this.path = path;
    }

}

module.exports = QrGenerator;
// Create a new instance and pass type and data, to generate a QR CODE.
// let code = new QrGenerator("svg", "ola mundo");
//      Exemplo setPath("./path") create new path if not exist, if this first level path.
// code.setPath("./public / images / qrCodes");
//      If dont use setPath the archive has create in equals level to QrGenerator.js .
// code.Create();