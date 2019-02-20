const { diff } = require('deep-diff');
const OptimisticQueue = require('./optimisticQueue');
const { revertOptimisticChange } = require('./actions');

const isOptimistic = action => action.meta && action.meta.optimistic;

const optimisticMiddleware = store => {
  const optimisticQueue = new OptimisticQueue({
    onError: (err, changes) => store.dispatch(revertOptimisticChange(changes)),
    shouldProcess: true
  });

  return next => action => {
    if (!isOptimistic(action)) {
      return next(action);
    }

    const prevState = store.getState();
    const result = next(action);
    const nextState = store.getState();

    const stateChange = diff(prevState, nextState);
    optimisticQueue.push({ action, stateChange });

    return result;
  };
};

module.exports = optimisticMiddleware;
