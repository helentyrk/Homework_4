const express = require('express'); //import the express module 
const pool = require('./database'); //import database module

const app = express();

app.set('view engine', 'ejs'); //register ejs view engine

app.use(express.json());

// listen for requests on port 3000
app.listen(3000, () => {
    console.log("Server is listening to port 3000")
    });
          


app.get('/posts', async(req, res) => { 
    try {
        console.log("get posts request has arrived"); 
        const posts = await pool.query(
            "SELECT * FROM posttable"
        );
        res.json(posts.rows);
        } catch (err) {
            console.error(err.message);
        }
    });

app.get('/posts/:id', async(req, res) => { 
    try {
        console.log("get a post request has arrived"); 
        const {id} = req.params;
        const posts = await pool.query(
        "SELECT * FROM posttable WHERE id = $1", [id]
        );
        res.json(posts.rows[0]);
    } catch (err) {
        console.error(err.message); 
    }
});

app.post('/posts/', async(req, res) => { 
    try {
    console.log("a post request has arrived"); 
    const post = req.body;
    const newpost = await pool.query(
    "INSERT INTO posttable(id, title, body, urllink) values ($1, $2, $3, $4) RETURNING*", [post.id, post.title, post.body, post.urllink]
    );
    res.json( newpost );
    } catch (err) { 
        console.error(err.message);
    } });

app.put('/posts/:id', async(req, res) => { try {
    const { id } = req.params;
    const post = req.body; console.log("update request has arrived"); 
    const updatepost = await pool.query(
     "UPDATE posttable SET (title, body, urllink) = ($2, $3, $4) WHERE id = $1", [id, post.title, post.body, post.urllink]
    );
    res.json(post); } catch (err) {
    console.error(err.message); }
     });

app.delete('/posts/:id', async(req, res) => { 
    try {
    console.log("delete a post request has arrived"); 
    const { id } = req.params;
    const post = req.body;
    const deletepost = await pool.query(
        "DELETE FROM posttable WHERE id = $1", [id] );
        res.json(post); 
    } catch (err) {
        console.error(err.message); }
        });
