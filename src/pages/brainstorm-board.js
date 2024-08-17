import withAuth from '@/components/withAuth';
import { useState, useEffect, useCallback, useReducer } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';
import Canvas from '@/components/Canvas';
import Toolbar from '@/components/Toolbar';
import AISuggestions from '@/components/AISuggestions';
import MockWebSocket from '@/lib/mock-websocket';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Download, Upload, Search, Undo, Redo, PresentationIcon, HelpCircle, Save } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';
import SearchModal from '@/components/SearchModal';
import { exportToImage } from '@/lib/export-utils';
import { undoReducer, initialState } from '@/lib/undo-reducer';
import PresentationMode from '@/components/PresentationMode';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import HelpTutorial from '@/components/HelpTutorial';
import { logError, logInfo } from '@/lib/error-logger';
import { trackEvent, trackPageView } from '@/lib/analytics';

function BrainstormBoard() {
  const [state, dispatch] = useReducer(undoReducer, initialState);
  const { notes, connectors, groups } = state.present;
  const [socket, setSocket] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    trackPageView('/brainstorm-board');
    const ws = new MockWebSocket('wss://mock-server.com');
    setSocket(ws);

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const addNote = useCallback((content) => {
    const newNote = { id: Date.now(), content, position: { x: 100, y: 100 }, type: 'note' };
    dispatch({ type: 'ADD_NOTE', payload: newNote });
    if (socket) socket.send(JSON.stringify({ type: 'add', note: newNote }));
    logInfo('Note added', { noteId: newNote.id });
    trackEvent('add_note', { noteId: newNote.id });
  }, [socket]);

  const addChart = useCallback(() => {
    const newChart = { id: Date.now(), position: { x: 100, y: 100 }, type: 'chart' };
    dispatch({ type: 'ADD_NOTE', payload: newChart });
    if (socket) socket.send(JSON.stringify({ type: 'add', note: newChart }));
    logInfo('Chart added', { chartId: newChart.id });
    trackEvent('add_chart', { chartId: newChart.id });
  }, [socket]);

  const addConnector = useCallback((startId, endId, style = 'solid', label = '') => {
    const newConnector = { id: Date.now(), startId, endId, style, label };
    dispatch({ type: 'ADD_CONNECTOR', payload: newConnector });
    if (socket) socket.send(JSON.stringify({ type: 'connect', connector: newConnector }));
    logInfo('Connector added', { connectorId: newConnector.id });
    trackEvent('add_connector', { connectorId: newConnector.id });
  }, [socket]);

  const addGroup = useCallback(() => {
    const newGroup = { id: Date.now(), name: 'New Group', noteIds: [] };
    dispatch({ type: 'ADD_GROUP', payload: newGroup });
    if (socket) socket.send(JSON.stringify({ type: 'add_group', group: newGroup }));
    logInfo('Group added', { groupId: newGroup.id });
    trackEvent('add_group', { groupId: newGroup.id });
  }, [socket]);

  const exportBoard = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.present));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "brainstorm-board.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      logInfo('Board exported');
      trackEvent('export_board');
    } catch (error) {
      logError(error, { action: 'exportBoard' });
      toast({
        title: "Export Error",
        description: "Failed to export the board. Please try again.",
        variant: "destructive",
      });
    }
  };

  const importBoard = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedState = JSON.parse(e.target.result);
          dispatch({ type: 'IMPORT_STATE', payload: importedState });
          toast({
            title: "Board Imported",
            description: "Your brainstorming session has been imported successfully.",
          });
          logInfo('Board imported');
          trackEvent('import_board');
        } catch (error) {
          logError(error, { action: 'importBoard' });
          toast({
            title: "Import Error",
            description: "Failed to import the board. Please check the file format.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExportImage = async () => {
    try {
      await exportToImage('canvas-container', 'brainstorm-board.png');
      toast({
        title: "Board Exported",
        description: "Your brainstorming board has been exported as an image.",
      });
      logInfo('Board exported as image');
      trackEvent('export_board_image');
    } catch (error) {
      logError(error, { action: 'exportImage' });
      toast({
        title: "Export Error",
        description: "Failed to export the board as an image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const saveBoard = async () => {
    setIsSaving(true);
    try {
      // Simulate API call to save board
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Board Saved",
        description: "Your brainstorming board has been saved successfully.",
      });
      logInfo('Board saved');
      trackEvent('save_board');
    } catch (error) {
      logError(error, { action: 'saveBoard' });
      toast({
        title: "Save Error",
        description: "Failed to save the board. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            addNote('New note');
            break;
          case 'c':
            e.preventDefault();
            addChart();
            break;
          case 'g':
            e.preventDefault();
            addGroup();
            break;
          case 's':
            e.preventDefault();
            saveBoard();
            break;
          case 'e':
            e.preventDefault();
            exportBoard();
            break;
          case 'f':
            e.preventDefault();
            setIsSearchOpen(true);
            break;
          case 'z':
            e.preventDefault();
            dispatch({ type: 'UNDO' });
            break;
          case 'y':
            e.preventDefault();
            dispatch({ type: 'REDO' });
            break;
          case 'h':
            e.preventDefault();
            setIsHelpOpen(true);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [addNote, addChart, addGroup, saveBoard]);

  return (
    <ErrorBoundary>
      <DndProvider backend={HTML5Backend}>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          <Toolbar 
            onAddNote={addNote} 
            onAddChart={addChart} 
            onAddConnector={addConnector}
            onAddGroup={addGroup}
          />
          <div className="flex-1 overflow-hidden relative" id="canvas-container">
            <Canvas 
              notes={notes} 
              connectors={connectors} 
              groups={groups}
              dispatch={dispatch}
            />
            <motion.div className="absolute top-4 right-4 z-10 flex space-x-2">
              <AnimatePresence>
                <motion.div
                  key="save-button"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button onClick={saveBoard} disabled={isSaving} title="Save Board (Ctrl+S)">
                    <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </motion.div>
                <motion.div
                  key="export-button"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Button onClick={exportBoard} title="Export Board (Ctrl+E)">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </motion.div>
                <motion.div
                  key="import-button"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Button as="label" htmlFor="import-file" title="Import Board">
                    <Upload className="mr-2 h-4 w-4" /> Import
                    <input
                      id="import-file"
                      type="file"
                      accept=".json"
                      onChange={importBoard}
                      style={{ display: 'none' }}
                    />
                  </Button>
                </motion.div>
                <motion.div
                  key="search-button"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Button onClick={() => setIsSearchOpen(true)} title="Search Notes (Ctrl+F)">
                    <Search className="mr-2 h-4 w-4" /> Search
                  </Button>
                </motion.div>
                <motion.div
                  key="export-image-button"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Button onClick={handleExportImage} title="Export as Image">
                    <Download className="mr-2 h-4 w-4" /> Export Image
                  </Button>
                </motion.div>
                <motion.div
                  key="undo-button"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Button onClick={() => dispatch({ type: 'UNDO' })} title="Undo (Ctrl+Z)" disabled={state.past.length === 0}>
                    <Undo className="mr-2 h-4 w-4" /> Undo
                  </Button>
                </motion.div>
                <motion.div
                  key="redo-button"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <Button onClick={() => dispatch({ type: 'REDO' })} title="Redo (Ctrl+Y)" disabled={state.future.length === 0}>
                    <Redo className="mr-2 h-4 w-4" /> Redo
                  </Button>
                </motion.div>
                <motion.div
                  key="presentation-button"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <Button onClick={() => setIsPresentationMode(true)} title="Enter Presentation Mode">
                    <PresentationIcon className="mr-2 h-4 w-4" /> Present
                  </Button>
                </motion.div>
                <motion.div
                  key="help-button"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  <Button onClick={() => setIsHelpOpen(true)} title="Help (Ctrl+H)">
                    <HelpCircle className="mr-2 h-4 w-4" /> Help
                  </Button>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
          <AISuggestions onAddSuggestion={addNote} notes={notes} connectors={connectors} groups={groups} />
          <ThemeSwitcher />
        </div>
      </DndProvider>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} notes={notes} />
      {isPresentationMode && (
        <PresentationMode
          notes={notes}
          connectors={connectors}
          groups={groups}
          onClose={() => setIsPresentationMode(false)}
        />
      )}
      <HelpTutorial isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </ErrorBoundary>
  );
}

export default withAuth(BrainstormBoard);