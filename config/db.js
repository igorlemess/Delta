if (process.env.NODE_ENV == "production") {
    module.exports = { mongURI: "mongodb+srv://esquiloamarelo:sonic2006@cluster0.ght3vp1.mongodb.net/?retryWrites=true&w=majority" };
} else {
    module.exports = { mongURI: "mongodb://0.0.0.0:27017/Delta" };
}