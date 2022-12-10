const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.sendfile(__dirname+"/main/main.html");
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log('서버가 실행됩니다.');
})