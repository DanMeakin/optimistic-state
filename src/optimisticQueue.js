const callApi = require('./api');

/**
 * Defines a queue of optimistic actions and state changes triggered by those
 * actions.
 *
 *
 */
class OptimisticQueue {
  constructor({ onError, shouldProcess = false, api = callApi }) {
    this.queue = [];
    this.onError = onError;
    this.shouldProcessQueue = shouldProcess;
    this.api = api;
  }

  push(newItem) {
    this.foldInto(newItem);
    this.processQueue();
  }

  run() {
    this.shouldProcessQueue = true;
    this.processQueue();
  }

  foldInto({ action, stateChange }) {
    const { reducer } = action.meta.optimistic;

    // eslint-disable-next-line
    for (let i = 0; i < this.queue.length; i++) {
      const { action: queueAction, stateChange: queueStateChange } = this.queue[
        i
      ];

      // Get the result of calling the element's reducer function. If we get
      // do not get a populated array back from the reducer, we continue to the
      // next iteration.
      const [command, reducedAction] = reducer(queueAction) || [];
      if (!command) {
        continue;
      }

      // Where we have a command, we update the queue based on it, then return.
      if (command === 'modify') {
        this.queue[i] = {
          action: reducedAction,
          stateChange: queueStateChange.concat(stateChange)
        };
      } else if (command === 'delete') {
        this.queue.splice(i, 1);
      }
      return;
    }

    // If we get to this point, we cannot fold our new element into an existing
    // value in the queue, so we just push.
    this.queue.push({ action, stateChange });
  }

  /**
   * Process each entry of the queue, using its optimistic command to call an
   * API.
   *
   * Once the call is complete, wait and then process the next entry.
   */
  async processQueue() {
    // Only process if the shouldProcessQueue flag is set, and if the queue is
    // not empty.
    if (!this.shouldProcessQueue || this.queue.length === 0) {
      return;
    }

    const {
      action: {
        meta: {
          optimistic: { command }
        }
      },
      stateChange
    } = this.queue.shift();

    try {
      await this.api(...command);
    } catch (err) {
      console.warn(`Error calling API: ${JSON.stringify(err)}`);
      this.onError(err, stateChange);
    }
    await new Promise(resolve => setTimeout(resolve(), 500));
    this.processQueue();
  }
}

module.exports = OptimisticQueue;
