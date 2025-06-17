"use client";
import "./SubmissaoForm.css";
import { useRef, useState, useEffect } from "react";
import api from "../services/api";

function SubmissaoForm({ onSubmit, onClose, desafioId, desafioTitulo }) {
    // Refs para os campos do formulário
    const inputNome = useRef(null);
    const inputNomeProjeto = useRef(null);
    const inputCelular = useRef(null);
    const inputEmail = useRef(null);
    const inputDescricao = useRef(null);
    const inputDocumento = useRef(null);

    // Estados do componente
    const [erro, setErro] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [desafioIdAtual, setDesafioIdAtual] = useState(null);
    const [desafioTitleAtual, setDesafioTitleAtual] = useState(null);

    // Efeito para verificar o desafioId recebido
    useEffect(() => {
        console.group("[SubmissaoForm] Verificação inicial");
        console.log("DesafioID recebido:", desafioId);
        console.log("Tipo do ID:", typeof desafioId);
        console.log("Título do desafio", desafioTitleAtual)
        console.groupEnd();

        if (!desafioId) {
            console.error("Erro: Nenhum desafioId recebido");
            setErro("Nenhum desafio associado. Por favor, feche e abra novamente o formulário.");
        } else {
            setDesafioIdAtual(Number(desafioId));
            setErro(null);
        }

        if(!desafioTitulo) {
            console.error("Erro: Nenhum desafioTitle recebido")
            setErro("Nenhum desafio associado. Por favor, feche e abra novamente o formulário.");
        } else {
            setDesafioTitleAtual(desafioTitulo)
        }
    }, [desafioId, desafioTitulo]);
        

    // Função para validar e enviar o formulário
    const createSubmition = async () => {
        if (!desafioIdAtual) {
            throw new Error("ID do desafio não definido. Não é possível enviar.");
        }

        // Validação dos campos
        const campos = [
            { ref: inputNome, nome: "Nome Completo" },
            { ref: inputNomeProjeto, nome: "Nome do Projeto" },
            { ref: inputCelular, nome: "Celular" },
            { ref: inputEmail, nome: "E-mail" },
            { ref: inputDescricao, nome: "Descrição" }
        ];

        const camposInvalidos = campos.filter(campo => !campo.ref.current?.value?.trim());
        
        if (camposInvalidos.length > 0) {
            throw new Error(`Preencha os campos obrigatórios: ${camposInvalidos.map(c => c.nome).join(", ")}`);
        }

        // Criar FormData - substitui o payload que você tinha antes
        const formData = new FormData();
        
        // Adicionar todos os campos que estavam no payload original
        formData.append('nome', inputNome.current.value.trim());
        formData.append('nomeProjeto', inputNomeProjeto.current.value.trim());
        formData.append('telefone', inputCelular.current.value.trim());
        formData.append('email', inputEmail.current.value.trim());
        formData.append('descricao', inputDescricao.current.value.trim());
        formData.append('desafioId', desafioIdAtual);

        // Adicionar o arquivo se existir (nova funcionalidade)
        if (inputDocumento.current.files && inputDocumento.current.files[0]) {
            formData.append('documento', inputDocumento.current.files[0]);
        }

        console.log("Enviando formulário...");
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        return await api.post("/submissoes", formData, {
            headers: {
                'Content-Type': 'multipart/form-data' // Importante para uploads
            }
        });
    };

    // Manipulador de envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro(null);
        setCarregando(true);

        try {
            await createSubmition();
            alert("Formulário enviado com sucesso!");
            if (onSubmit) onSubmit();
        } catch (error) {
            console.error("Erro na submissão:", {
                message: error.message,
                stack: error.stack,
                response: error.response?.data
            });
            
            setErro(error.message || "Erro ao enviar formulário. Tente novamente.");
        } finally {
            setCarregando(false);
        }
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

            {erro && (
                <div className="error-message">
                    <div className="error-content">
                        <span className="error-icon">⚠️</span>
                        <span>{erro}</span>
                    </div>
                    <button 
                        onClick={() => setErro(null)} 
                        className="error-close-btn"
                    >
                        Fechar
                    </button>
                </div>
            )}

            <form className="submission-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nome">Nome Completo *</label>
                        <input 
                            type="text" 
                            id="nome" 
                            name="nome" 
                            ref={inputNome} 
                            required 
                            disabled={carregando}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nomeProjeto">Nome do projeto *</label>
                        <input 
                            type="text" 
                            id="nomeProjeto" 
                            name="nomeProjeto" 
                            ref={inputNomeProjeto} 
                            required 
                            disabled={carregando}
                        />
                    </div>
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="celular">Celular *</label>
                        <input 
                            type="tel" 
                            id="celular" 
                            name="celular" 
                            ref={inputCelular} 
                            required 
                            disabled={carregando}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">E-mail *</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            ref={inputEmail} 
                            required 
                            disabled={carregando}
                        />
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="descricao">Descrição da Proposta *</label>
                    <textarea 
                        id="descricao" 
                        name="descricao" 
                        rows="4" 
                        ref={inputDescricao} 
                        required 
                        disabled={carregando}
                    />
                </div>
                
                <div className="form-group documento-group">
                    <div className="form-group">
                        <label htmlFor="documento">Documento da Proposta (Opcional)</label>
                        <input 
                            type="file" 
                            id="documento" 
                            name="documento" 
                            ref={inputDocumento} 
                            className="file-upload-btn" 
                            accept=".pdf,.doc,.docx,.txt"
                            disabled={carregando}
                        />

                    </div>
                </div>
                
                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={carregando || !desafioIdAtual}
                    >
                        {carregando ? (
                            <span className="loading-text">
                                <span className="loading-dots">.</span>
                                <span className="loading-dots">.</span>
                                <span className="loading-dots">.</span>
                            </span>
                        ) : "Enviar"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SubmissaoForm;