import React, { useState, useEffect } from 'react';
import ConfigList from './components/ConfigList';
import ConfigForm from './components/ConfigForm';
import SearchBar from './components/SearchBar';
import { getConfigs, createConfig, updateConfig, deleteConfig, login } from './services/api';
import './App.css';

function App() {
  const [configs, setConfigs] = useState([]);
  const [editingConfig, setEditingConfig] = useState(null);
  const [filters, setFilters] = useState({});
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState('list'); // 'list' or 'form'

  useEffect(() => {
    if (token) {
      fetchConfigs();
    }
  }, [token, filters]);

  const fetchConfigs = async () => {
    setIsLoading(true);
    try {
      const data = await getConfigs(filters, token);
      setConfigs(data);
    } catch (error) {
      console.error('Error fetching configs:', error);
      showNotification('Erro ao carregar configurações', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login(username, password);
      setToken(response.access_token);
      localStorage.setItem('token', response.access_token);
      showNotification('Login realizado com sucesso!', 'success');
    } catch (error) {
      showNotification('Credenciais inválidas. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (configData) => {
    setIsLoading(true);
    try {
      if (editingConfig) {
        await updateConfig(editingConfig.id, configData, token);
        showNotification('Configuração atualizada com sucesso!', 'success');
      } else {
        await createConfig(configData, token);
        showNotification('Configuração criada com sucesso!', 'success');
      }
      setEditingConfig(null);
      setActiveView('list');
      fetchConfigs();
    } catch (error) {
      console.error('Error saving config:', error);
      showNotification('Erro ao salvar configuração', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta configuração?')) {
      setIsLoading(true);
      try {
        await deleteConfig(id, token);
        showNotification('Configuração excluída com sucesso!', 'success');
        fetchConfigs();
      } catch (error) {
        console.error('Error deleting config:', error);
        showNotification('Erro ao excluir configuração', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setUsername('');
    setPassword('');
    showNotification('Logout realizado com sucesso', 'info');
  };

  const showNotification = (message, type = 'info') => {
    // Implementação simples de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 4000);
  };

  const handleNewConfig = () => {
    setEditingConfig(null);
    setActiveView('form');
  };

  const handleCancelEdit = () => {
    setEditingConfig(null);
    setActiveView('list');
  };

  if (!token) {
    return (
      <div className="app">
        <div className="login-page">
          <div className="login-container">
            <div className="login-card">
              <div className="login-header">
                <div className="app-logo">
                  <div className="logo-icon">⚙️</div>
                  <h1>ConfigManager</h1>
                </div>
                <p className="login-subtitle">Gerencie variáveis de ambiente com segurança</p>
              </div>
              
              <form onSubmit={handleLogin} className="login-form">
                <div className="input-group">
                  <label htmlFor="username">Usuário</label>
                  <input
                    id="username"
                    type="text"
                    className="input-field"
                    placeholder="seu.usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="password">Senha</label>
                  <input
                    id="password"
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="login-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      Entrando...
                    </>
                  ) : (
                    'Acessar Sistema'
                  )}
                </button>
              </form>
              
              <div className="login-footer">
                <div className="demo-info">
                  <h4>Credenciais de Demonstração</h4>
                  <div className="credentials">
                    <span><strong>Usuário:</strong> admin</span>
                    <span><strong>Senha:</strong> admin123</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <div className="logo">⚙️</div>
            <h1>ConfigManager</h1>
          </div>
          <div className="header-actions">
            <button className="btn-new" onClick={handleNewConfig}>
              <span>+</span>
              Nova Configuração
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              <span>🚪</span>
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="container">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-section">
              <h3>Filtros</h3>
              <SearchBar onFilterChange={setFilters} />
            </div>
            <div className="sidebar-section">
              <h3>Estatísticas</h3>
              <div className="stats">
                <div className="stat-item">
                  <span className="stat-number">{configs.length}</span>
                  <span className="stat-label">Total</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {configs.filter(c => c.environment === 'production').length}
                  </span>
                  <span className="stat-label">Produção</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {configs.filter(c => c.environment === 'development').length}
                  </span>
                  <span className="stat-label">Desenvolvimento</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="main-content">
            {activeView === 'list' ? (
              <ConfigList 
                configs={configs}
                onEdit={(config) => {
                  setEditingConfig(config);
                  setActiveView('form');
                }}
                onDelete={handleDelete}
                isLoading={isLoading}
              />
            ) : (
              <ConfigForm 
                config={editingConfig}
                onSubmit={handleSubmit}
                onCancel={handleCancelEdit}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;