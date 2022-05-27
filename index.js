const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors');
connectToMongo();

const app = express()
app.use(cors());
// const port = 5000
const port = process.env.PORT || 8080;
app.use(express.json());
//Available Routes
app.use('/api/auth/', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.get('/', (req, res) => {
    res.send('Hello Sumit!')
})

app.listen(port, () => {
    console.log(`iNotebook app listening on port ${port}`)
})