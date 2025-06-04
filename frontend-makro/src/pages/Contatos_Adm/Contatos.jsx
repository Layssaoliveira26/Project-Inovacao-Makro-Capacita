"use client"
import { useState, useEffect } from "react"
import "./Contatos.css"
import Logo from "../../assets/logo_makro.png"
import api from "../../services/api"

function Contatos() {
    const [selectedSolution, setSelectedSolution] = useState(null)
    const [statusModalOpen, setStatusModalOpen] = useState(false)
    const [currentSolution, setCurrentSolution] = useState(null)
    const [newStatus, setNewStatus] = useState("")
    const [solutions, setSolutions] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    
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

    if (isLoading) return <div className="loading">Carregando...</div>
    if (error) return <div className="error">{error}</div>

    return (
        <div className="solutions-container">
            <header className="navbar">
                <div className="navbar-left">
                    <div className="logo-container">
                        <img src={Logo || "/placeholder.svg"} alt="Makro Logo" className="logo-image" />
                    </div>
                    <div className="nav-links-container">
                        <a href="/solucoes_adm" className="nav-link">Submissões</a>
                        <a href="/contatos_adm" className="nav-link active">Contatos</a>
                        <a href="/desafios_adm" className="nav-link">Desafios</a>
                        <a href="/cases_adm" className="nav-link">Cases de Sucesso</a>
                        <a href="/cadastro_adm" className="nav-link">Cadastro usuários</a>
                    </div>
                </div>
                <div className="navbar-right">
                    <div className="user-icon">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="20" cy="20" r="19" stroke="white" strokeWidth="2" />
                            <circle cx="20" cy="15" r="6" stroke="white" strokeWidth="2" />
                            <path d="M7 32C7 25.9249 12.9249 21 20 21C27.0751 21 33 25.9249 33 32" stroke="white" strokeWidth="2" />
                        </svg>
                    </div>
                </div>
            </header>

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

            <div className="logout-container">
                <button className="logout-button" onClick={handleLogout}>
                    <span className="logout-arrow"></span>
                    <span>Sair</span>
                </button>
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