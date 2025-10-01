import React, { useState, useEffect } from 'react';

const ConfigForm = ({ config, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    environment: 'development',
    service: '',
    key: '',
    value: '',
    description: '',
    is_encrypted: true
  });

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="config-form">
      <div className="form-header">
        <h2>{config ? 'Editar Configuração' : 'Nova Configuração'}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Nome da Configuração *</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Ex: Database Production"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="environment">Ambiente *</label>
            <select
              id="environment"
              name="environment"
              value={formData.environment}
              onChange={handleChange}
              required
            >
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="service">Serviço *</label>
            <input
              id="service"
              name="service"
              type="text"
              placeholder="Ex: database, minio, airflow"
              value={formData.service}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="key">Chave *</label>
            <input
              id="key"
              name="key"
              type="text"
              placeholder="Ex: DB_HOST, API_KEY"
              value={formData.key}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="value">Valor *</label>
            <textarea
              id="value"
              name="value"
              placeholder="Valor da configuração..."
              value={formData.value}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              placeholder="Descrição opcional da configuração..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="checkbox-group">
              <input
                type="checkbox"
                name="is_encrypted"
                checked={formData.is_encrypted}
                onChange={handleChange}
              />
              <span>Criptografar valor</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn-save" disabled={isLoading}>
            {isLoading ? 'Salvando...' : (config ? 'Atualizar' : 'Criar Configuração')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfigForm;