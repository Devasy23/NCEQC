import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ConnectionProvider } from './context/ConnectionContext';
import { ToastProvider } from './context/ToastContext';
import { Background } from './components/layout/Background';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { Dashboard } from './components/Dashboard';
import { ConfigureModal } from './components/modals/ConfigureModal';
import { JsonEditorModal } from './components/modals/JsonEditorModal';
import { AddModal } from './components/modals/AddModal';
import { useModalAlert } from './hooks/useModalAlert';
import { useConfirmModal } from './hooks/useConfirmModal';
import { ModuleType, ViewState, Plugin } from './types';

// Wrapper to provide context to the main layout
const AppContent = () => {
  const { isDarkMode } = useTheme();
  const [activeSection, setActiveSection] = useState<ViewState>('home');
  const [activeModule, setActiveModule] = useState<ModuleType>('CLS');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Modal States
  const [configureModal, setConfigureModal] = useState<Plugin | null>(null);
  const [jsonEditor, setJsonEditor] = useState<{ item: any, type: string } | null>(null);
  const [addModal, setAddModal] = useState<string | null>(null);

  // Hooks
  const { showAlert, AlertComponent } = useModalAlert();
  const { showConfirm, ConfirmComponent } = useConfirmModal();

  // Handlers
  const handleConfigure = (plugin: Plugin) => setConfigureModal(plugin);
  const handleConfirmConfigure = () => { 
    if (configureModal) showAlert(`Setup complete for ${configureModal.name}!`); 
    setConfigureModal(null); 
  };

  const handleEdit = (item: any, type: string) => setJsonEditor({ item, type });
  
  const handleSaveJson = (content: string) => { 
    try { 
      JSON.parse(content); 
      showAlert('Config patched successfully!'); 
      setJsonEditor(null); 
    } catch (e) { 
      showAlert('JSON is broken. Fix it.'); 
    }
  };

  const handleDelete = (item: any, type: string) => { 
    showConfirm(`Nuke ${item.name}?`, () => { 
      showAlert(`${item.name} has been obliterated.`); 
    }); 
  };

  const handleAdd = (type: string) => setAddModal(type);
  const handleConfirmAdd = () => {
      if (addModal) showAlert(`${addModal} successfully spawned!`);
      setAddModal(null);
  };

  return (
    <div className={`flex h-screen font-sans overflow-hidden selection:bg-[#ff88cc] selection:text-black ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-[#f0f2f5] text-black'}`}>
      <Background />
      <AlertComponent />
      <ConfirmComponent />
      
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        isOpen={isSidebarOpen} 
      />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <TopBar 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
        <Dashboard 
            activeSection={activeSection}
            activeModule={activeModule}
            setActiveModule={setActiveModule}
            onConfigure={handleConfigure}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
      </div>

      {configureModal && (
          <ConfigureModal 
            plugin={configureModal}
            onClose={() => setConfigureModal(null)}
            onConfirm={handleConfirmConfigure}
          />
      )}

      {jsonEditor && (
          <JsonEditorModal 
            item={jsonEditor.item}
            onClose={() => setJsonEditor(null)}
            onSave={handleSaveJson}
          />
      )}

      {addModal && (
          <AddModal 
            type={addModal}
            onClose={() => setAddModal(null)}
            onConfirm={handleConfirmAdd}
          />
      )}
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <ConnectionProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
};

export default App;
