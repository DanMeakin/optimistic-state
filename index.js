const { createStore, applyMiddleware } = require('redux');

const reducers = require('./src/reducers');
const optimisticMiddleware = require('./src/middleware');

const store = createStore(reducers, applyMiddleware(optimisticMiddleware));

module.exports = { store };
