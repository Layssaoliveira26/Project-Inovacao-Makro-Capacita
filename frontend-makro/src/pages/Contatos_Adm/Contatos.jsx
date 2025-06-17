"use client"
import { useState, useEffect } from "react"
import "./Contatos.css"
import Logo from "../../assets/logo_makro.png"
import Logout from "../../assets/logout.png";
import HamburgerIcon from '../../assets/hamburger.png'; 
import CloseIcon from '../../assets/close.png';
import api from "../../services/api"
import { Link } from 'react-router-dom'

function Contatos() {
    const [selectedSolution, setSelectedSolution] = useState(null)
    const [statusModalOpen, setStatusModalOpen] = useState(false)
    const [currentSolution, setCurrentSolution] = useState(null)
    const [newStatus, setNewStatus] = useState("")
    const [solutions, setSolutions] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showSidebar, setShowSidebar] = useState(false);
    
    const DEFAULT_VALUES = {
        projectName: "*NOME DO PROJETO*",
        status: "Em análise",
        receiptDate: new Date().toLocaleDateString("pt-BR"),
        description: "Descrição não fornecida",
    }
    
    const STATUS_OPTIONS = ["Aguardando análise", "Em análise", "Aprovado", "Reprovado"]

    async function getProjects() {
        try {
            setIsLoading(true)
            const response = await api.get("/contatos")

            const formattedSolutions = response.data.map((contato) => ({
                id: contato.id,
                name: contato.nome || "Não informado",
                email: contato.email || "Não informado",
                phone: contato.telefone || "Não informado",
                status: contato.status || DEFAULT_VALUES.status,
                receiptDate: contato.createdAt
                    ? new Date(contato.createdAt).toLocaleDateString("pt-BR")
                    : DEFAULT_VALUES.receiptDate,
                description: contato.descricao || DEFAULT_VALUES.description,
                projectName: DEFAULT_VALUES.projectName 
            }))

            setSolutions(formattedSolutions)
        } catch (err) {
            setError("Erro ao carregar os contatos")
            console.error("Erro detalhado:", err.response?.data || err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getProjects()
    }, [])

    const openSolutionDetails = (solution) => setSelectedSolution(solution)
    const closeSolutionDetails = () => setSelectedSolution(null)
    
    const handleLogout = () => (window.location.href = "/login_adm")
    
    const openStatusModal = (solution) => {
        setCurrentSolution(solution)
        setNewStatus(solution.status)
        setStatusModalOpen(true)
    }
    
    const closeStatusModal = () => {
        setStatusModalOpen(false)
        setCurrentSolution(null)
    }
    
    const handleStatusChange = (e) => setNewStatus(e.target.value)
    
    const saveStatusChange = async () => {
        try {
            // Busca os dados completos do contato
            const fullContactData = solutions.find(s => s.id === currentSolution.id)
            
            // Envia todos os campos necessários para o backend
            await api.put(`/contatos/${currentSolution.id}`, {
                status: newStatus,
                nome: fullContactData.name,
                email: fullContactData.email,
                telefone: fullContactData.phone,
                descricao: fullContactData.description
            })

            // Atualização otimista do estado local
            const updatedSolutions = solutions.map((solution) =>
                solution.id === currentSolution.id
                    ? { ...solution, status: newStatus }
                    : solution
            )
            
            setSolutions(updatedSolutions)
            
            // Atualiza também no contato selecionado se estiver aberto
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
            alert("Falha ao atualizar status. Verifique o console para detalhes.")
        }
    }
    
    const getStatusClass = (status) => {
        switch (status) {
            case "Aprovado": return "status-approved"
            case "Reprovado": return "status-rejected"
            case "Em análise": return "status-pending"
            case "Aguardando análise": return "status-analyze"
            default: return ""
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
                        <a href="/solucoes_adm" className="nav-link">Submissões</a>
                        <a href="/contatos_adm" className="nav-link active">Contatos</a>
                        <a href="/desafios_adm" className="nav-link">Desafios</a>
                        <a href="/cases_adm" className="nav-link">Cases de Sucesso</a>
                        <a href="/cadastro_adm" className="nav-link">Cadastro usuários</a>
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

            <h2>Contatos</h2>
            
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Ação</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Status</th>
                            <th>Data Recebimento</th>
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
                                    >
                                        +
                                    </button>
                                </td>
                                <td className="name-cell" data-label="Nome:">{solution.name}</td>
                                <td className="email-cell" data-label="Email:">{solution.email}</td>
                                <td className="phone-cell" data-label="Telefone:">{solution.phone}</td>
                                <td className="status-cell" data-label="Status:">
                                    <span className={`status-badge ${getStatusClass(solution.status)}`}>
                                        {solution.status}
                                    </span>
                                </td>
                                <td className="date-cell" data-label="Data recebimento:">
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
            
            {selectedSolution && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Documento da proposta</h3>
                        <button className="close-button" onClick={closeSolutionDetails}>
                            &times;
                        </button>
                        <div className="detail-row">
                            <span className="detail-label">Nome do Projeto:</span>
                            <span className="detail-value">{selectedSolution.projectName}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Email:</span>
                            <span className="detail-value">{selectedSolution.email}</span>
                        </div>
                        <div className="description-title">Descrição da proposta</div>
                        <div className="description-box">{selectedSolution.description}</div>
                        <div className="description-title">Imagem do Projeto:</div>
                        <div className="upload-area">
                            <input type="file" accept="image/*" />
                        </div>
                    </div>
                </div>
            )}

            
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

export default Contatos