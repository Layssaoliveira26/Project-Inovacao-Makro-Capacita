import { useState, useEffect } from "react";
import "./Solucoes.css";
import Logo from "../../assets/logo_makro.png";
import api from "../../services/api";

function Solucoes() {
    const [selectedSolution, setSelectedSolution] = useState(null);
    const [solutions, setSolutions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Valores padrão
    const DEFAULT_VALUES = {
        projectName: "Projeto não definido",
        status: "Em análise",
        receiptDate: new Date().toLocaleDateString('pt-BR'),
        description: "Descrição não fornecida"
    };

    // Puxar projetos do back-end
    async function getProjects() {
        try {
            setIsLoading(true);
            const response = await api.get('/clientes');

            const formattedSolutions = response.data.map(cliente => ({
                id: cliente.id,
                name: cliente.nome || "Não informado",
                email: cliente.email || "Não informado",
                phone: cliente.telefone || "Não informado",
                projectName: cliente.nomeProjeto || DEFAULT_VALUES.projectName,
                status: cliente.status || DEFAULT_VALUES.status,
                receiptDate: cliente.createdAt 
                    ? new Date(cliente.createdAt).toLocaleDateString('pt-BR')
                    : DEFAULT_VALUES.receiptDate,
                description: cliente.descricao || DEFAULT_VALUES.description
            }));

            setSolutions(formattedSolutions);
        } catch (err) {
            setError('Erro ao carregar as soluções');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getProjects();
    }, []);

    const openSolutionDetails = (solution) => {
        setSelectedSolution(solution);
    };

    const closeSolutionDetails = () => {
        setSelectedSolution(null);
    };

    const handleLogout = () => {
        window.location.href = "/login_adm";
    };

    const getStatusClass = (status) => {
        const statusValue = status || DEFAULT_VALUES.status;
        switch (statusValue) {
            case "Aprovado":
                return "status-approved";
            case "Reprovado":
                return "status-rejected";
            case "Em análise":
                return "status-pending";
            default:
                return "";
        }
    };

    if (isLoading) return <div className="loading">Carregando...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="solutions-container">
            {/* Logo */}
            <div className="logo_makro">
                <img src={Logo || "/placeholder.svg"} alt="Makro Logo" />
            </div>

            <h2>Soluções</h2>

            {/* Tabela de soluções */}
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
                                    <span className={`status-badge ${getStatusClass(solution.status)}`}>
                                        {solution.status}
                                    </span>
                                </td>
                                <td data-label="Data de Recebimento:">{solution.receiptDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Botão de sair */}
            <div className="logout-container">
                <button className="logout-button" onClick={handleLogout}>
                    <span className="logout-arrow"></span>
                    <span>Sair</span>
                </button>
            </div>

            {/* Modal de detalhes */}
            {selectedSolution && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Documento da proposta</h3>
                        <button className="close-button" onClick={closeSolutionDetails}>
                            &times;
                        </button>

                        <div className="solution-details">
                            <div className="detail-row">
                                <span className="detail-label">Nome do Cliente:</span>
                                <span className="detail-value">{selectedSolution.name}</span>
                            </div>
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
    );
}

export default Solucoes;