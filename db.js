const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://sumit2001:Engineer@cluster0.t08d1.mongodb.net/test?authSource=admin&replicaSet=atlas-sr8hhq-shard-0&readPreference=primary&ssl=true"

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to Mongo Successfully");
    });
}

module.exports = connectToMongo;