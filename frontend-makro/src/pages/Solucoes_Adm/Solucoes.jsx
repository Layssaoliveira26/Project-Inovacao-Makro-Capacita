import React, { useState } from "react";
import './Solucoes.css';
import Logo from '../../assets/logo_makro.png';

const Solucoes = () => {
    const [selectedSolution, setSelectedSolution] = useState(null);

    // Dados fictícios para as soluções
    const solutions = [
        {
            id: 1,
            name: "Juliana Ribeiro",
            email: "juliana.ribeiro@makroengenharia.com",
            phone: "(11) 91234-5678",
            description: "Sistema inteligente de gestão de obras, com painéis de acompanhamento em tempo real, alertas de atraso e relatórios automáticos, para reduzir falhas de comunicação e aumentar a produtividade no canteiro."
        },
        {
            id: 2,
            name: "Carlos Mendes",
            email: "carlos.mendes@makroengenharia.com",
            phone: "(11) 99876-5432",
            description: "Plataforma de controle de insumos e materiais com integração ao estoque, evitando desperdício e reduzindo custos com compras não planejadas."
        },
    ];

    const openSolutionDetails = (solution) => {
        setSelectedSolution(solution);
    };

    const closeSolutionDetails = () => {
        setSelectedSolution(null);
    };

    return (
        <div className="solutions-container">
            {/* Logo */}
            <div className='logo_makro'>
                <img src={Logo} alt='Makro Logo' />
            </div>

            <h2>Soluções</h2>

            <table>
                <thead>
                    <tr>
                        <th>Ação</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                    </tr>
                </thead>
                <tbody>
                    {solutions.map((solution) => (
                        <tr key={solution.id}>
                            <td>
                                <button onClick={() => openSolutionDetails(solution)}>+</button>
                            </td>
                            <td>{solution.name}</td>
                            <td>{solution.email}</td>
                            <td>{solution.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedSolution && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>documento da proposta</h3>
                        <button className="close-button" onClick={closeSolutionDetails}>&times;</button>

                        <div className="description-title">Descrição da proposta</div>
                        <div className="description-box">
                            {selectedSolution.description}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Solucoes;