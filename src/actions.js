const ADD_NOTE = 'ADD_NOTE';
const UPDATE_NOTE = 'UPDATE_NOTE';
const DELETE_NOTE = 'DELETE_NOTE';
const REVERT_OPTIMISTIC_CHANGE = 'REVERT_OPTIMISTIC_CHANGE';

const addNote = note => ({
  type: ADD_NOTE,
  payload: { ...note },
  meta: {
    optimistic: {
      command: [ADD_NOTE, { ...note }],
      // We cannot reduce a new note into another action.
      reducer: () => null
    }
  }
});

const updateNote = note => ({
  type: UPDATE_NOTE,
  payload: { ...note },
  meta: {
    optimistic: {
      command: [UPDATE_NOTE, { ...note }],
      reducer: otherAction => {
        const { payload: otherNote } = otherAction;
        if (otherNote.id === note.id) {
          return [
            'modify',
            { ...otherAction, payload: { ...otherNote, ...note } }
          ];
        }
        return null;
      }
    }
  }
});

const deleteNote = noteId => ({
  type: DELETE_NOTE,
  payload: { id: noteId },
  meta: {
    optimistic: {
      command: [DELETE_NOTE, { id: noteId }],
      reducer: otherAction => {
        const { payload: otherNote } = otherAction;
        if (otherNote.id === noteId) {
          return ['delete'];
        }
        return null;
      }
    }
  }
});

const revertOptimisticChange = diff => ({
  type: REVERT_OPTIMISTIC_CHANGE,
  payload: diff
});

module.exports = {
  ADD_NOTE,
  UPDATE_NOTE,
  DELETE_NOTE,
  REVERT_OPTIMISTIC_CHANGE,
  addNote,
  updateNote,
  deleteNote,
  revertOptimisticChange
};
