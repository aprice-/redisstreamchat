const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const data = require('./data');

const router = express.Router();

router.post('/join/:channel', async (req, res) => {
    let channel = req.params.channel;
    await data.join(channel, req.userName);
    res.send({success: true});
});

router.post('/part/:channel', async (req, res) => {
    let channel = req.params.channel;
    await data.part(channel, req.userName);
    res.send({success: true});
});

router.post('/channel/:channel', async (req, res) => {
    let channel = req.params.channel;
    let message = req.body.message;
    await data.send(channel, req.userName, message);
    res.send({success: true});
});

router.get('/channel/:channel', async (req, res) => {
    let channel = req.params.channel;
    let before = req.query.before;
    let messages = await data.getMessages(channel, before);
    res.send({success: true, messages});
});

router.get('/channel/:channel/members', async (req, res) => {
    let channel = req.params.channel;
    let members = await data.getMembers(channel);
    res.send({success: true, members});
});

const clientRoot = path.join(process.cwd(), '../client/dist');

const app = express();

app.use((req, res, next) => {
    req.userName = req.get('x-username');
    next();
});

app.use(bodyParser.json());
app.use('/api', router);
app.use(express.static(clientRoot));
app.use((req, res) => res.sendFile(`${clientRoot}/index.html`));

const server = app.listen(+process.env.PORT || 3000);

process.on('SIGINT', () => {
    server.close(() => {
        process.exit();
    });
});

module.exports = server;

