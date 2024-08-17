export const initialState = {
  past: [],
  present: {
    notes: [],
    connectors: [],
    groups: []
  },
  future: []
};

export function undoReducer(state, action) {
  const { past, present, future } = state;

  switch (action.type) {
    case 'UNDO':
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      };
    case 'REDO':
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture
      };
    case 'ADD_NOTE':
      return {
        past: [...past, present],
        present: {
          ...present,
          notes: [...present.notes, action.payload]
        },
        future: []
      };
    case 'ADD_CONNECTOR':
      return {
        past: [...past, present],
        present: {
          ...present,
          connectors: [...present.connectors, action.payload]
        },
        future: []
      };
    case 'ADD_GROUP':
      return {
        past: [...past, present],
        present: {
          ...present,
          groups: [...present.groups, action.payload]
        },
        future: []
      };
    case 'UPDATE_NOTE':
      return {
        past: [...past, present],
        present: {
          ...present,
          notes: present.notes.map(note =>
            note.id === action.payload.id ? { ...note, ...action.payload } : note
          )
        },
        future: []
      };
    case 'UPDATE_CONNECTOR':
      return {
        past: [...past, present],
        present: {
          ...present,
          connectors: present.connectors.map(connector =>
            connector.id === action.payload.id ? { ...connector, ...action.payload } : connector
          )
        },
        future: []
      };
    case 'UPDATE_GROUP':
      return {
        past: [...past, present],
        present: {
          ...present,
          groups: present.groups.map(group =>
            group.id === action.payload.id ? { ...group, ...action.payload } : group
          )
        },
        future: []
      };
    case 'IMPORT_STATE':
      return {
        past: [],
        present: action.payload,
        future: []
      };
    default:
      return state;
  }
}