import React from 'react';

const ConfigList = ({ configs, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="config-list">
        <div className="empty-state">
          <div className="spinner"></div>
          <p>Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="config-list">
      <div className="list-header">
        <h2>Configurações</h2>
        <span className="list-count">{configs.length} itens</span>
      </div>

      {configs.length === 0 ? (
        <div className="empty-state">
          <h3>Nenhuma configuração encontrada</h3>
          <p>Crie sua primeira configuração para começar</p>
        </div>
      ) : (
        <table className="config-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Ambiente</th>
              <th>Serviço</th>
              <th>Chave</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {configs.map((config) => (
              <tr key={config.id}>
                <td>
                  <div className="config-name">{config.name}</div>
                </td>
                <td>
                  <span className={`environment-badge ${config.environment}`}>
                    {config.environment}
                  </span>
                </td>
                <td>{config.service}</td>
                <td>
                  <code className="config-key">{config.key}</code>
                </td>
                <td>
                  {config.description || (
                    <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Sem descrição
                    </span>
                  )}
                </td>
                <td>
                  <div className="config-actions">
                    <button 
                      className="btn-icon btn-edit"
                      onClick={() => onEdit(config)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-icon btn-delete"
                      onClick={() => onDelete(config.id)}
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ConfigList;