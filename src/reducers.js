const { revertChange } = require('deep-diff');
const {
  ADD_NOTE,
  UPDATE_NOTE,
  DELETE_NOTE,
  REVERT_OPTIMISTIC_CHANGE
} = require('./actions');

const handlers = {
  [ADD_NOTE]: (state, { payload }) => ({
    ...state,
    notes: { ...state.notes, [payload.id]: payload }
  }),
  [UPDATE_NOTE]: (state, { payload }) => ({
    ...state,
    notes: {
      ...state.notes,
      [payload.id]: { ...state.notes[payload.id], ...payload }
    }
  }),
  [DELETE_NOTE]: (state, { payload }) => {
    const { [payload.id]: removedNote, ...notes } = state.notes;
    return {
      ...state,
      notes
    };
  },
  [REVERT_OPTIMISTIC_CHANGE]: (state, { payload: changes }) => {
    const nextState = { ...state };

    // Changes are accumulated left-to-right, but we want to revert them
    // in reverse order.
    changes.reverse();
    changes.forEach(change => revertChange(nextState, true, change));
    return nextState;
  }
};

const initialState = {
  notes: {}
};

const reducer = (state = initialState, action) => {
  const handler = handlers[action.type] || (() => state);
  return handler(state, action);
};

module.exports = reducer;
