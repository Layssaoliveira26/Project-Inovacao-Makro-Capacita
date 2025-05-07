{/*"use client"*/} 

import { useState, useEffect } from "react"
import "./Solucoes.css"
import Logo from "../../assets/logo_makro.png"
import api from "../../services/api"

{/*const Solucoes = () => {*/}
function Solucoes(){
    const [selectedSolution, setSelectedSolution] = useState(null)

    // Dados fictícios para as soluções com os novos campos
    const [solutions, setSolutions] = useState([])

    async function getProjects(){
        const solutionsFromApi= await api.get('/clientes')

        setSolutions(solutionsFromApi.data)
    }

    useEffect(() => {
        getProjects()
    }, [])


        {/*{
            id: 1,
            name: "Juliana Ribeiro",
            email: "juliana.ribeiro@makroengenharia.com",
            phone: "(11) 91234-5678",
            projectName: "Sistema de Gestão de Obras",
            status: "Aprovado",
            receiptDate: "15/04/2025",
            description:
                "Sistema inteligente de gestão de obras, com painéis de acompanhamento em tempo real, alertas de atraso e relatórios automáticos, para reduzir falhas de comunicação e aumentar a produtividade no canteiro.",
        },
        {
            id: 2,
            name: "Carlos Mendes",
            email: "carlos.mendes@makroengenharia.com",
            phone: "(11) 99876-5432",
            projectName: "Plataforma de Controle de Insumos",
            status: "Em análise",
            receiptDate: "02/05/2025",
            description:
                "Plataforma de controle de insumos e materiais com integração ao estoque, evitando desperdício e reduzindo custos com compras não planejadas.",
        },
        {
            id: 3,
            name: "Ana Silva",
            email: "ana.silva@makroengenharia.com",
            phone: "(11) 98765-4321",
            projectName: "Sistema de Monitoramento",
            status: "Reprovado",
            receiptDate: "28/04/2025",
            description:
                "Sistema de monitoramento remoto para equipamentos de construção, permitindo manutenção preventiva e redução de paradas não programadas.",
        },*/}
    

    const openSolutionDetails = (solution) => {
        setSelectedSolution(solution)
    }

    const closeSolutionDetails = () => {
        setSelectedSolution(null)
    }

    const handleLogout = () => {
        window.location.href = "/login_adm"
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

    return (
        <div className="solutions-container">
            {/* Logo */}
            <div className="logo_makro">
                <img src={Logo || "/placeholder.svg"} alt="Makro Logo" />
            </div>

            <h2>Soluções</h2>

            {/*Aqui vem o bloco com o elemento da solução do projeto*/}
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Ação</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Número</th>
                            <th>Nome do Projeto</th>
                            <th>Status</th>
                            <th>Data de Recebimento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solutions.map((solution) => (
                            <tr key={solution.id}>
                                <td>
                                    <button onClick={() => openSolutionDetails(solution)}>+</button>
                                </td>
                                <td data-label="Nome:">{solution.name}</td>
                                <td data-label="Email:">{solution.email}</td>
                                <td data-label="Número:">{solution.phone}</td>
                                <td data-label="Nome do Projeto:">{solution.projectName}</td>
                                <td data-label="Status:">
                                    <span className={`status-badge ${getStatusClass(solution.status)}`}>{solution.status}</span>
                                </td>
                                <td data-label="Data de Recebimento:">{solution.receiptDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        {/*Aqui finaliza o bloco de dados de um projeto*/}
        
            {/* Botão de sair posicionado mais abaixo */}
            <div className="logout-container">
                <button className="logout-button" onClick={handleLogout}>
                    <span className="logout-arrow"></span>
                    <span>Sair</span>
                </button>
            </div>

            {selectedSolution && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>documento da proposta</h3>
                        <button className="close-button" onClick={closeSolutionDetails}>
                            &times;
                        </button>

                        <div className="solution-details">
                            <div className="detail-row">
                                <span className="detail-label">Nome do Projeto:</span>
                                <span className="detail-value">{selectedSolution.projectName}</span>
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
                        </div>

                        <div className="description-title">Descrição da proposta</div>
                        <div className="description-box">{selectedSolution.description}</div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Solucoes
