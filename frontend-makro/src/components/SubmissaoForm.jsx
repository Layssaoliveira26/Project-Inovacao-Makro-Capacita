"use client";
import "./SubmissaoForm.css";
import { useRef } from "react";
import api from "../services/api";

function SubmissaoForm({ onSubmit, onClose, desafioId }) {
  const inputNome = useRef();
  const inputNomeProjeto = useRef();
  const inputCelular = useRef();
  const inputEmail = useRef();
  const inputDescricao = useRef();

  async function createSubmition() {
    try {
      // Criando objeto JSON com os dados do formulário
      const payload = {
        nome: inputNome.current.value,
        nomeProjeto: inputNomeProjeto.current.value,
        telefone: inputCelular.current.value,
        email: inputEmail.current.value,
        descricao: inputDescricao.current.value,
        desafioId: desafioId,
      };

      // Enviando o JSON diretamente — axios já define o Content-Type para application/json automaticamente
      await api.post("/submissoes", payload);
    } catch (err) {
      console.error("Erro ao enviar submissão:", err);
      console.log("Detalhes do erro:", err.response?.data);
      alert("Erro ao enviar submissão. Verifique os dados.");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createSubmition();
    if (onSubmit) onSubmit();
  };

  return (
    <div className="form-container">
      <button className="modal-close" onClick={onClose}>
        ×
      </button>
      <div className="form-header">
        <h1 className="form-title">Submissão de Soluções Inovadoras</h1>
        <p className="form-subtitle">
          Preencha sua proposta de forma rápida e segura e contribua com ideias transformadoras.
        </p>
      </div>
      <form className="submission-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input type="text" id="nome" name="nome" ref={inputNome} required />
          </div>
          <div className="form-group">
            <label htmlFor="nomeProjeto">Nome do projeto</label>
            <input type="text" id="nomeProjeto" name="nomeProjeto" ref={inputNomeProjeto} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="celular">Celular</label>
            <input type="tel" id="celular" name="celular" ref={inputCelular} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email" ref={inputEmail} required />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="descricao">Descrição da Proposta:</label>
          <textarea id="descricao" name="descricao" rows="4" ref={inputDescricao} required />
        </div>
        <div className="form-group documento-group">
          <div className="form-group">
            <label htmlFor="documento">Documento da Proposta</label>
            <button type="button" className="file-upload-btn" disabled>
              Anexar Arquivo (desativado)
            </button>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">Enviar</button>
        </div>
      </form>
    </div>
  );
}

export default SubmissaoForm;
