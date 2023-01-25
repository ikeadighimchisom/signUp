const express = require("express");
const userRouter = require ( "./ROUTE/userroute" );

const port = 7000;
const app = express();
app.use( express.json () );

app.use('/api', userRouter);
app.listen(port, () => {
    console.log(`listening on port..` + port)
})

app.get("/", (req, res) => {
    res.send("Welcome to my Api")
});