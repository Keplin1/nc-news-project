const app = require('./app');

app.listen(3030, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Listening on 3030')
    }
});

