module.exports = function(data){
    if (typeof Buffer.from === "function") {
        // Node 5.10+
        return Buffer.from(data, 'base64'); // Ta-da
    } else {
        // older Node versions, now deprecated
        return new Buffer(data, 'base64'); // Ta-da
    }
}