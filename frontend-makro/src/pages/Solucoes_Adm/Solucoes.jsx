"use client"
import { useState, useEffect } from "react"
import "./Solucoes.css"
import Logo from "../../assets/logo_makro.png"
import Logout from "../../assets/logout.png";
import HamburgerIcon from '../../assets/hamburger.png'; 
import CloseIcon from '../../assets/close.png';
import api from "../../services/api"
import { Link } from 'react-router-dom'

function Solucoes() {
    const [selectedSolution, setSelectedSolution] = useState(null)
    const [statusModalOpen, setStatusModalOpen] = useState(false)
    const [currentSolution, setCurrentSolution] = useState(null)
    const [newStatus, setNewStatus] = useState("")
    const [solutions, setSolutions] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showSidebar, setShowSidebar] = useState(false);
    
    const handleViewDocument = async (documento) => {
  try {
    if (!documento) throw new Error("Nenhum documento disponível");
    const filename = documento.split('/').pop();
    const documentUrl = `http://localhost:3000/api/documentos/${filename}`;
    console.log('Tentando abrir:', documentUrl); // Para debug
    window.open(documentUrl, '_blank');
    
  } catch (error) {
    console.error('Erro ao abrir documento:', error);
    alert(`Erro ao abrir documento: ${error.message}`);
  }
    };
    // Valores padrão
    const DEFAULT_VALUES = {
        projectName: "*NOME DO PROJETO*",
        status: "Em análise",
        receiptDate: new Date().toLocaleDateString("pt-BR"),
        description: "Descrição não fornecida",
    }

    // Status disponíveis
    const STATUS_OPTIONS = ["Aguardando análise", "Em análise", "Aprovado", "Reprovado"]

    async function getProjects() {
        try {
            setIsLoading(true)
            const response = await api.get("/submissoes")
            console.log("Submissões recebidas:", response.data)

            const formattedSolutions = response.data.map((submissao) => ({
                id: submissao.id,
                name: submissao.nome || "Não informado",
                email: submissao.email || "Não informado",
                phone: submissao.telefone || "Não informado",
                projectName: submissao.nomeProjeto || DEFAULT_VALUES.projectName,
                status: submissao.status || DEFAULT_VALUES.status,
                receiptDate: submissao.createdAt
                    || DEFAULT_VALUES.receiptDate,
                description: submissao.descricao || DEFAULT_VALUES.description,
                nameChallenge: submissao.desafioTitulo,
                documento: submissao.documento
            }))

            setSolutions(formattedSolutions)
        } catch (err) {
            setError("Erro ao carregar as submissões")
            console.error("Detalhes do erro:", err.response?.data || err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getProjects()
    }, [])

    const openSolutionDetails = (solution) => {
        setSelectedSolution(solution)
    }

    const closeSolutionDetails = () => {
        setSelectedSolution(null)
    }

    const handleLogout = () => {
        window.location.href = "/login_adm"
    }

    // Funções para alterar status
    const openStatusModal = (solution) => {
        setCurrentSolution(solution)
        setNewStatus(solution.status)
        setStatusModalOpen(true)
    }

    const closeStatusModal = () => {
        setStatusModalOpen(false)
        setCurrentSolution(null)
    }

    const handleStatusChange = (e) => {
        setNewStatus(e.target.value)
    }

    const saveStatusChange = async () => {
        try {
            // Busca os dados completos da submissão
            const fullSolutionData = solutions.find(s => s.id === currentSolution.id)
            
            // Envia todos os campos necessários para o backend
            const response = await api.put(`/submissoes/${currentSolution.id}`, {
                status: newStatus,
                nome: fullSolutionData.name,
                email: fullSolutionData.email,
                telefone: fullSolutionData.phone,
                nomeProjeto: fullSolutionData.projectName,
                descricao: fullSolutionData.description
            })

            console.log("Resposta da API:", response.data)

            // Atualização otimista do estado local
            const updatedSolutions = solutions.map(solution =>
                solution.id === currentSolution.id
                    ? { ...solution, status: newStatus }
                    : solution
            )

            setSolutions(updatedSolutions)

            // Atualiza também na submissão selecionada se estiver aberta
            if (selectedSolution?.id === currentSolution.id) {
                setSelectedSolution({ ...selectedSolution, status: newStatus })
            }

            closeStatusModal()
            
        } catch (error) {
            console.error("Falha ao atualizar status:", {
                error: error.response?.data || error.message,
                requestData: {
                    id: currentSolution.id,
                    status: newStatus
                }
            })
            
        }
    }

    const getStatusClass = (status) => {
        const statusValue = status || DEFAULT_VALUES.status
        switch (statusValue) {
            case "Aprovado":
                return "status-approved"
            case "Reprovado":
                return "status-rejected"
            case "Em análise":
                return "status-pending"
            case "Aguardando análise":
                return "status-analyze"
            default:
                return ""
        }
    }

    const handleToggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    useEffect(() => {
        if (showSidebar) {
            document.body.classList.add('sidebar-open');
        } else {
            document.body.classList.remove('sidebar-open');
        }
        // Limpeza ao desmontar o componente
        return () => {
            document.body.classList.remove('sidebar-open');
        };
    }, [showSidebar]);

    if (isLoading) return <div className="loading">Carregando...</div>
    if (error) return <div className="error">{error}</div>

    return (
        <div className="solutions-container">
            <header className="navbar">
                <div className="navbar-left">
                    <div className="logo-container">
                        <Link to='/'>
                            <img src={Logo || "/placeholder.svg"} alt="Makro Logo" className="logo-image" />
                        </Link>
                    </div>
                    <button className="hamburger-button" onClick={handleToggleSidebar}>
                        <img src={HamburgerIcon} alt="Menu" />
                    </button>                      
                    <div className="nav-links-container">
                        <a href="/solucoes_adm" className="nav-link active">
                            Submissões
                        </a>
                        <a href="/contatos_adm" className="nav-link">
                            Contatos
                        </a>
                        <a href="/desafios_adm" className="nav-link">
                            Desafios
                        </a>
                        <a href="/cases_adm" className="nav-link">
                            Cases de Sucesso
                        </a>
                        <a href="/cadastro_adm" className="nav-link">
                            Cadastro usuários
                        </a>
                    </div>
                </div>
                <div className="navbar-right">
                    <button className="logout-button" onClick={handleLogout}>
                        <img src={Logout || "/placeholder.svg"} alt="Logout" className="logout-image" />
                    </button>
                </div>
            </header>

            {/* Sidebar (Barra Lateral) */}
            {showSidebar && (
                <div className="sidebar-overlay" onClick={handleToggleSidebar}>
                    <div className={`sidebar ${showSidebar ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                        <button className="close-sidebar-button" onClick={handleToggleSidebar}>
                            <img src={CloseIcon} alt="Fechar Menu" />
                        </button>
                        <div className="sidebar-links">
                            <Link to="/solucoes_adm" className="sidebar-link" onClick={handleToggleSidebar}>Submissões</Link>
                            <Link to="/contatos_adm" className="sidebar-link" onClick={handleToggleSidebar}>Contatos</Link>
                            <Link to="/desafios_adm" className="sidebar-link" onClick={handleToggleSidebar}>Desafios</Link>
                            <Link to="/cases_adm" className="sidebar-link" onClick={handleToggleSidebar}>Cases de Sucesso</Link>
                            <Link to="/cadastro_adm" className="sidebar-link" onClick={handleToggleSidebar}>Cadastro usuários</Link>
                        </div>
                    </div>
                </div>
            )}            

            <h2>Submissões</h2>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Ação</th>
                            <th>Nome do Projeto</th>
                            <th>Desafio de Origem</th>
                            <th>Número</th>
                            <th>Status</th>
                            <th>Data de Recebimento</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solutions.map((solution) => (
                            <tr key={solution.id} className="solution-row">
                                <td className="action-cell">
                                    <button 
                                        className="expand-button" 
                                        onClick={() => openSolutionDetails(solution)}
                                        aria-label="Ver detalhes"
                                    >
                                        +
                                    </button>
                                </td>
                                <td className="project-name-cell" data-label="Nome do Projeto:">
                                    {solution.projectName}
                                </td>
                                <td className="origin-cell" data-label="Desafio de Origem:">
                                    {solution.nameChallenge}
                                </td>
                                <td className="phone-cell" data-label="Número:">
                                    {solution.phone}
                                </td>
                                <td className="status-cell" data-label="Status:">
                                    <span className={`status-badge ${getStatusClass(solution.status)}`}>
                                        {solution.status}
                                    </span>
                                </td>
                                <td className="date-cell" data-label="Data de Recebimento:">
                                    {solution.receiptDate}
                                </td>
                                <td className="actions-cell">
                                    <button 
                                        className="alterar-status-button" 
                                        onClick={() => openStatusModal(solution)}
                                    >
                                        Alterar status
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Detalhes - Mantido exatamente como estava */}
            {selectedSolution && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Documento da proposta</h3>
                        <button className="close-button" onClick={closeSolutionDetails}>
                            &times;
                        </button>
                        <div className="solution-details">
                            <div className="detail-row">
                                <span className="detail-label">Nome do submissor:</span>
                                <span className="detail-value">{selectedSolution.name}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Nome do Projeto:</span>
                                <span className="detail-value">{selectedSolution.projectName}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">{selectedSolution.email}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Status:</span>
                                <span className={`status-badge ${getStatusClass(selectedSolution.status)}`}>
                                    {selectedSolution.status}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Data de Recebimento:</span>
                                <span className="detail-value">{selectedSolution.receiptDate}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Documento:</span>
                                <span className="detail-value">
                                    {selectedSolution.documento ? (
                                    <button 
                                        onClick={() => handleViewDocument(selectedSolution.documento)}
                                        className="download-button"
                                    >
                                        Baixar Documento
                                    </button>
                                    ) : (
                                    "Nenhum documento enviado"
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="description-title">Descrição da proposta</div>
                        <div className="description-box">{selectedSolution.description}</div>
                    </div>
                </div>
            )}

            {/* Modal de Status - Mantido exatamente como estava */}
            {statusModalOpen && currentSolution && (
                <div className="modal">
                    <div className="modal-content status-modal">
                        <h3>Alterar Status</h3>
                        <button className="close-button" onClick={closeStatusModal}>
                            &times;
                        </button>
                        <div className="status-form">
                            <div className="status-selection">
                                <label htmlFor="status-select">Selecione o novo status:</label>
                                <div className="status-options">
                                    {STATUS_OPTIONS.map((status) => (
                                        <label key={status} className="status-option">
                                            <input
                                                type="radio"
                                                name="status"
                                                value={status}
                                                checked={newStatus === status}
                                                onChange={handleStatusChange}
                                            />
                                            <span className={`status-badge ${getStatusClass(status)}`}>
                                                {status}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="status-actions">
                                <button className="cancel-button" onClick={closeStatusModal}>
                                    Cancelar
                                </button>
                                <button className="save-button" onClick={saveStatusChange}>
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Solucoes