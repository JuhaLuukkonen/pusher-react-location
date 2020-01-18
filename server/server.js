    const express = require('express')
    const bodyParser = require('body-parser')
    const Pusher = require('pusher');
    const path = require('path')
    const app = express()

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')))
  // Handle React routing, return all requests to React app
  app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, 'client/build', 'index.html'))
  })
}
const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`API listening on port ${port}...`)
})

    // create a express application
    const app = express();

    // initialize pusher
    let pusher = new Pusher({
        appId: '933324',
        key: '196bc825529730bb36fe',
        secret: 'c45c199a16684a1313c2',
        cluster: 'eu',
        encrypted: true
    });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    // to Allow CORS
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept'
        );
        next();
    });

    app.post('/pusher/auth', (req, res) => {
        let socketId = req.body.socket_id;
        let channel = req.body.channel_name;
        random_string = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        let presenceData = {
            user_id: random_string,
            user_info: {
                username: '@' + random_string,
            }
        };
        let auth = pusher.authenticate(socketId, channel, presenceData);
        res.send(auth);
    });

    app.post('/update-location', (req, res) => {
        // trigger a new post event via pusher
        pusher.trigger('presence-channel', 'location-update', {
            'username': req.body.username,
            'location': req.body.location
        })
        res.json({ 'status': 200 });
    });

    let port = 3128;
    app.listen(port);
    console.log('listening');