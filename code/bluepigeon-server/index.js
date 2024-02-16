const express = require('express');
const app = require('express')();
const admin = require('./firebase').admin;
const addUser = require("./firebase").addUser;
const addProfile = require("./firebase").addProfile;
const getProfile = require("./firebase").getProfile;
const addPost = require("./firebase").addPost;
const getPosts = require("./firebase").getPosts;
const activateUser = require("./firebase").activateUser;
const deactivateUser = require("./firebase").deactivateUser;
const getUsers = require("./firebase").getUsers;
const deleteUser = require("./firebase").deleteUser;
const enableUser = require("./firebase").enableUser;
const disableUser = require("./firebase").disableUser;
const cors = require('cors');
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.get('/', (req, res) => {
    res.status(200).send({ message: "Hello, It Works!" })
})

const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const idToken = authHeader.split(" ")[1];
        admin
            .auth()
            .verifyIdToken(idToken)
            .then(function (decodedToken) {
                return next();
            })
            .catch(function (error) {
                return res.status(403).send({ status: "Unauthorized" });
            });
    } else {
        res.sendStatus(401);
    }
};


app.post("/register", authenticateJWT, async (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    try {
        const result = await addUser(email, name);
        res.status(200).send({ result: result })
    } catch (error) {
        res.status(500).send({ result: "Internal Server Error" })
    }
})


app.post("/activate", authenticateJWT, async (req, res) => {
    const email = req.body.email;
    try {
        const result = await activateUser(email);
        res.status(200).send({ result: result })
    } catch (error) {
        res.status(500).send({ result: "Internal Server Error" })
    }
})

app.post("/deactivate", authenticateJWT, async (req, res) => {
    const email = req.body.email;
    try {
        const result = await deactivateUser(email);
        res.status(200).send({ result: result })
    } catch (error) {
        res.status(500).send({ result: "Internal Server Error" })
    }
})

app.post("/enable", async (req, res) => {
    const email = req.body.email;
    try {
        const result = await enableUser(email);
        res.status(200).send({ success: true })
    } catch (error) {
        res.status(500).send({ result: "Internal Server Error" })
    }
})


app.post("/disable", async (req, res) => {
    const email = req.body.email;
    try {
        const result = await disableUser(email);
        res.status(200).send({ success: true })
    } catch (error) {
        res.status(500).send({ result: "Internal Server Error" })
    }
})

app.post("/delete", async (req, res) => {
    const email = req.body.email;
    try {
        const result = await deleteUser(email);
        res.status(200).send({ success: true })
    } catch (error) {
        res.status(500).send({ result: "Internal Server Error" })
    }
})

app.post("/add-post", authenticateJWT, async (req, res) => {
    const title = req.body.title;
    const email = req.body.email;
    const name = req.body.name;
    const url = req.body.url;
    const content = req.body.content;
    try {
        const result = await addPost(title, email, name, url, content);
        res.status(200).send({ result: "Success" })
    } catch (error) {
        res.status(500).send({ result: "Internal Server Error" })
    }
})

app.get("/posts", authenticateJWT, async (req, res) => {
    const posts = await getPosts();
    try {
        res.status(200).send({ result: posts })
    } catch (error) {
        res.status(500).send({ result: "Internal Server Error" })
    }
})

app.get("/users", async (req, res) => {
    const users = await getUsers();
    try {
        res.status(200).send({ result: users })
    } catch (error) {
        res.status(500).send({ result: "Internal Server Error" })
    }
})

app.post("/add-image", authenticateJWT, async (req, res) => {
    const email = req.body.email;
    const image = req.body.image;
    try {
        const result = await addProfile(email, image);
        res.status(200).send({ result: result })
    } catch (error) {
        res.status(500).send({ result: "Internal Server Error" })
    }
})

app.post("/get-profile", authenticateJWT, async (req, res) => {
    const email = req.body.email;
    try {
        const result = await getProfile(email);
        res.status(200).send({ result: result })
    } catch (error) {
        res.status(500).send({ result: "Internal Server Error" })
    }

})

app.listen(PORT, () => console.log("Server Started at localhost:8080"));