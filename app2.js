const express = require('express'); 
const pool = require('./database'); 
const cors = require('cors');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
  
app.use(express.json()); 
app.use(cors()); 
app.use(express.static('Public'));

app.listen(3000, () => {
    console.log("Server is listening to port 3000")
    });


app.get('/', (req, res) => { 
    res.render('index');
});


// get request for all the posts
app.get('/posts', async(req, res) => { try {
    console.log("get posts request has arrived"); const posts = await pool.query(
    "SELECT * FROM posttable" );
    res.render('posts', { posts: posts.rows }); } catch (err) {
    console.error(err.message); }
    });

     // get request for single post
    app.get('/singlepost/:id', async(req, res) => { try {
        const id = req.params.id; console.log(req.params.id);
        console.log("get a single post request has arrived"); const posts = await pool.query(
        "SELECT * FROM posttable WHERE id = $1", [id] );
        res.render('singlepost', { posts: posts.rows[0] }); } catch (err) {
        console.error(err.message); }
        });

       
        app.get('/posts/:id', async(req, res) => { try {
            const { id } = req.params;
            console.log("get a post request has arrived"); const Apost = await pool.query(
            "SELECT * FROM posttable WHERE id = $1", [id] );
            res.json(Apost.rows[0]); } catch (err) {
                console.error(err.message); }
});

app.delete('/posts/:id', async(req, res) => { try {
    console.log(req.params);
    const { id } = req.params;
    const post = req.body;
    console.log("delete a post request has arrived"); 
    const deletepost = await pool.query(
    "DELETE FROM posttable WHERE id = $1", [id] );
    res.redirect('posts');
    } catch (err) { 
        console.error(err.message);
    } });


    app.post('/posts', async(req, res) => { try {
        const post = req.body; console.log(post);
        const newpost = await pool.query(
        "INSERT INTO posttable(title, body, urllink, likes) values ($1, $2, $3, $4) RETURNING*", [post.title, post.body, post.urllink, post.likes]
        );
        res.redirect('posts'); } catch (err) {
        console.error(err.message) }
        });

    app.put('/posts/:id', async(req, res) =>{
        try{
            console.log("update request has arrived");
            const {id} = req.params;
            const post = req.body;
            const updatepost = await pool.query(
                "UPDATE posttable(likes) values ($4) RETURNING*", [post.likes]
        );
        res.json(post);
            } catch (err) {
                console.error(err.message);
            }
        });

        app.get('/create', (req, res) => { res.render('create');
    });

    
    app.use((req, res) => { res.status(404).render('404');
    });