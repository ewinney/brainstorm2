import React from 'react';

const MiniMap = ({ notes, groups }) => {
  const mapSize = { width: 150, height: 100 };
  const canvasSize = { width: 3000, height: 2000 };

  const scale = Math.min(mapSize.width / canvasSize.width, mapSize.height / canvasSize.height);

  return (
    <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
      <div style={{ width: mapSize.width, height: mapSize.height, position: 'relative' }}>
        {groups.map((group) => (
          <div
            key={group.id}
            style={{
              position: 'absolute',
              left: group.position.x * scale,
              top: group.position.y * scale,
              width: group.size.width * scale,
              height: group.size.height * scale,
              backgroundColor: 'rgba(200, 200, 200, 0.2)',
              border: '1px solid #888',
            }}
          />
        ))}
        {notes.map((note) => (
          <div
            key={note.id}
            style={{
              position: 'absolute',
              left: note.position.x * scale,
              top: note.position.y * scale,
              width: 4,
              height: 4,
              backgroundColor: note.type === 'note' ? 'blue' : 'green',
              borderRadius: '50%',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MiniMap;