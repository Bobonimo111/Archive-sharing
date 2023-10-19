const os = require("os");
const networkInfo = os.networkInterfaces();

function getIp() {
    let local_ip = networkInfo["Wi-Fi"].find((value) => value["family"] == "IPv4");
    console.log(local_ip)
    return (local_ip["address"]);

}
module.exports = {
    "port": 8080,
    "ip": getIp(),
}