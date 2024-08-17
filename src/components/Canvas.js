import { useState, useCallback, useRef, useMemo } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { motion } from 'framer-motion';
import StickyNote from './StickyNote';
import Chart from './Chart';
import Connector from './Connector';
import Group from './Group';
import MiniMap from './MiniMap';

export default function Canvas({ notes, connectors, groups, dispatch }) {
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const canvasRef = useRef(null);

  const moveItem = useCallback((id, left, top) => {
    dispatch({ type: 'UPDATE_NOTE', payload: { id, position: { x: left, y: top } } });
  }, [dispatch]);

  const updateConnector = useCallback((id, startId, endId, style, label) => {
    dispatch({ type: 'UPDATE_CONNECTOR', payload: { id, startId, endId, style, label } });
  }, [dispatch]);

  const memoizedNotes = useMemo(() => notes, [notes]);
  const memoizedConnectors = useMemo(() => connectors, [connectors]);
  const memoizedGroups = useMemo(() => groups, [groups]);

  const renderNotes = useCallback(() => 
    memoizedNotes.map((item) => 
      item.type === 'note' ? (
        <StickyNote
          key={item.id}
          id={item.id}
          content={item.content}
          position={item.position}
          onMove={moveItem}
          canvasRef={canvasRef}
          dispatch={dispatch}
        />
      ) : (
        <Chart
          key={item.id}
          id={item.id}
          position={item.position}
          onMove={moveItem}
          dispatch={dispatch}
        />
      )
    ), [memoizedNotes, moveItem, canvasRef, dispatch]);

  const renderConnectors = useCallback(() => 
    memoizedConnectors.map((connector) => {
      const startNote = memoizedNotes.find(note => note.id === connector.startId);
      const endNote = memoizedNotes.find(note => note.id === connector.endId);
      if (startNote && endNote) {
        return (
          <Connector
            key={connector.id}
            id={connector.id}
            start={startNote.position}
            end={endNote.position}
            style={connector.style}
            label={connector.label}
            onUpdate={updateConnector}
          />
        );
      }
      return null;
    }), [memoizedConnectors, memoizedNotes, updateConnector]);

  const renderGroups = useCallback(() =>
    memoizedGroups.map((group) => (
      <Group
        key={group.id}
        id={group.id}
        name={group.name}
        noteIds={group.noteIds}
        notes={memoizedNotes}
        dispatch={dispatch}
      />
    )), [memoizedGroups, memoizedNotes, dispatch]);

  return (
    <TransformWrapper
      initialScale={1}
      initialPositionX={0}
      initialPositionY={0}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <>
          <div className="absolute top-4 left-4 z-10 flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => zoomIn()}
              className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
            >
              +
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => zoomOut()}
              className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
            >
              -
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => resetTransform()}
              className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
            >
              Reset
            </motion.button>
          </div>
          <TransformComponent>
            <div ref={canvasRef} className="relative w-[3000px] h-[2000px] bg-white dark:bg-gray-900">
              {renderGroups()}
              {renderConnectors()}
              {renderNotes()}
            </div>
          </TransformComponent>
          <MiniMap notes={memoizedNotes} groups={memoizedGroups} />
        </>
      )}
    </TransformWrapper>
  );
}