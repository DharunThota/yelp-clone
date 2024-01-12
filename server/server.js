import "dotenv/config";
import express from 'express';
import bodyParser from 'body-parser';
import pg from "pg";
import cors from "cors";

const db = new pg.Client({
    user: process.env.DB_USER, 
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

db.connect();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

//get all restaurants
app.get("/api/v1/restaurants", async (req, res) => {
    try {
        //const result = await db.query("SELECT * FROM restaurants");
        const restaurantsData = await db.query("SELECT * FROM restaurants LEFT JOIN(SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) AS average_rating FROM reviews GROUP BY restaurant_id) reviews ON restaurants.id = reviews.restaurant_id;")
        res.status(200).json({
            status: "Success",
            results: restaurantsData.rows.length,
            data: {
                restaurants: restaurantsData.rows,
            }
        });   
    } catch (error) {
        console.log(error);
    }
});

//get a restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
    try {
        //const id = parseInt(req.params.id);
        const restaurant = await db.query("SELECT * FROM restaurants LEFT JOIN(SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) AS average_rating FROM reviews GROUP BY restaurant_id) reviews ON restaurants.id = reviews.restaurant_id WHERE id = $1", [req.params.id]);
        const reviews = await db.query("SELECT * FROM reviews WHERE restaurant_id = $1", [req.params.id]);
        res.status(200).json({
            status: "Success",
            data: {
                restaurants: restaurant.rows[0],
                reviews: reviews.rows,
            }
        }); 
    } catch (error) {
        console.log(error);
    }  
});

//create a restaurant
app.post("/api/v1/restaurants", async (req, res) => {
    console.log(req.body);
    try {
        const result = await db.query("INSERT INTO restaurants(name, location, price_range) VALUES($1, $2, $3) RETURNING *", 
        [req.body.name, req.body.location, req.body.price_range]);
        res.status(201).json({
            status: "Success",
            data: {
                restaurants: result.rows[0],
            }
        });
    } catch (error) {
        console.log(error);
    }
});

//update a restaurant
app.put("/api/v1/restaurants/:id", async (req, res) => {
    console.log(req.params.id);
    console.log(req.body);
    try {
        const result = await db.query("UPDATE restaurants SET name=$1, location=$2, price_range=$3 WHERE id=$4 RETURNING *",
        [req.body.name, req.body.location, req.body.price_range, req.params.id]);
        res.status(200).json({
            status: "Success",
            data: {
                restaurants: result.rows[0],
            }
        });
    } catch (error) {
        console.log(error);
    }
});

//delete a restaurant
app.delete("/api/v1/restaurants/:id", async (req, res) => {
    try {
        const result = await db.query("DELETE FROM restaurants WHERE id=$1 RETURNING *", [req.params.id]);
        res.status(204).json({
            status: "Success",
            data: {
                restaurants: result.rows[0],
            }
        });
    } catch (error) {
        console.log(error);
    }
});

//add a review
app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
    try {
        const result = await db.query("INSERT INTO reviews(restaurant_id, name, rating, review) VALUES($1, $2, $3, $4) RETURNING *", 
        [req.params.id, req.body.name, req.body.rating, req.body.review]);
        res.status(201).json({
            status: "Success",
            data: {
                review: result.rows[0],
            }
        });
    } catch (error) {
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});