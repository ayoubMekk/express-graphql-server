const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./schema')
const mongoose = require('mongoose');

const PORT = 5000;
const app = express();

// db connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/graphqldb', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('mongodb connected ..'))
    .catch(err => console.log(err));


app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})