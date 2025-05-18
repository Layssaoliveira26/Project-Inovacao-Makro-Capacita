"use client"

import { useState, useEffect } from "react"
import "./Aprovados.css"
import Logo from "../../assets/logo_makro.png"
import api from "../../services/api"

function Aprovados() {
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

    const STATUS_OPTIONS = ["Em análise", "Aprovado", "Reprovado"]

    async function getProjects() {
        try {
            setIsLoading(true)
            const response = await api.get("/clientes")
            const formattedSolutions = response.data.map((cliente) => ({
                id: cliente.id,
                name: cliente.nome || "Não informado",
                email: cliente.email || "Não informado",
                phone: cliente.telefone || "Não informado",
                projectName: cliente.nomeProjeto || DEFAULT_VALUES.projectName,
                status: cliente.status || DEFAULT_VALUES.status,
                receiptDate: cliente.createdAt
                    ? new Date(cliente.createdAt).toLocaleDateString("pt-BR")
                    : DEFAULT_VALUES.receiptDate,
                description: cliente.descricao || DEFAULT_VALUES.description,
            }))

            const approvedSolutions = formattedSolutions.filter(
                (sol) => sol.status === "Aprovado"
            )

            setSolutions(approvedSolutions)
        } catch (err) {
            setError("Erro ao carregar as soluções")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        // getProjects()

        const mockData = [
            {
                id: 1,
                name: "Juliana Ribeiro",
                email: "juliana.ribeiro@makroengenharia.com",
                phone: "(11) 9 9234-5678",
                projectName: "*NOME DO PROJETO*",
                status: "Em análise",
                receiptDate: "10/05/2025",
                description: "App voltado para educação básica.",
            },
            {
                id: 2,
                name: "Juliana Ribeiro",
                email: "juliana.ribeiro@makroengenharia.com",
                phone: "(11) 9 9234-5678",
                projectName: "*NOME DO PROJETO*",
                status: "Aprovado",
                receiptDate: "08/05/2025",
                description: "Sistema web para gerenciar vendas.",
            },
            {
                id: 3,
                name: "Juliana Ribeiro",
                email: "juliana.ribeiro@makroengenharia.com",
                phone: "(11) 9 9234-5678",
                projectName: "*NOME DO PROJETO*",
                status: "Reprovado",
                receiptDate: "08/05/2025",
                description: "Sistema de monitoramento remoto para equipamentos de construção.",
            },
        ]

        const approvedMock = mockData.filter((item) => item.status === "Aprovado")
        setSolutions(approvedMock)
        setIsLoading(false)
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
            const updatedSolutions = solutions.map((solution) =>
                solution.id === currentSolution.id
                    ? { ...solution, status: newStatus }
                    : solution
            )

            setSolutions(updatedSolutions)

            if (selectedSolution?.id === currentSolution.id) {
                setSelectedSolution({ ...selectedSolution, status: newStatus })
            }

            closeStatusModal()
        } catch (error) {
            console.error("Erro ao atualizar status:", error)
        }
    }

    const getStatusClass = (status) => {
        switch (status) {
            case "Aprovado":
                return "status-approved"
            case "Reprovado":
                return "status-rejected"
            case "Em análise":
                return "status-pending"
            default:
                return ""
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
                        <a href="/solucoes_adm" className="nav-link">
                            Submissões
                        </a>
                        <a href="/aprovados_adm" className="nav-link active">
                            Projetos em Aprovados
                        </a>
                        <a href="/cadastro_adm" className="nav-link">
                            Cadastro usuários
                        </a>
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

            <h2>Projetos Aprovados</h2>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Ação</th>
                            <th>Nome do Projeto</th>
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
                                    <button className="expand-button" onClick={() => openSolutionDetails(solution)}>
                                        +
                                    </button>
                                </td>
                                <td className="project-name-cell">{solution.projectName}</td>
                                <td className="phone-cell">{solution.phone}</td>
                                <td className="status-cell">
                                    <span className={`status-badge ${getStatusClass(solution.status)}`}>{solution.status}</span>
                                </td>
                                <td className="date-cell">{solution.receiptDate}</td>
                                <td className="actions-cell">
                                    <button className="add-to-home-button" onClick={() => addToHomePage(solution)}>
                                        Adicionar à Tela Inicial
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
                            <span className="detail-label">Email</span>
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
            

        </div>
    )
}

export default Aprovados
