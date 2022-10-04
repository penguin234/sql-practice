const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const bodyParser = require('body-parser');
app.use(bodyParser.json());


const { Pool } = require('pg');

const dbpool = new Pool({
    connectionString: process.env.DATABASE_URL,
        ssl: {
        rejectUnauthorized: false
    }
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/query', (req, res) => {
    const query = req.body.query;
    let result = {
        data: null,
        err: null
    };

    (async () => {
        const client = await pool.connect();
        try {
            const data = await client.query(query);
            result.data = data;
        } catch (err) {
            result.err = err;
        } finally {
            client.release();
            res.json(result);
        }
    })();
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('listening on *:' + PORT.toString());
});
