import '../Desafios/Desafios.css';
import Logo from '../../assets/logo_makro.png';
import '../Login_Adm/Login.css';
import Imagem from '../../assets/imagem 1.png';
import DeleteIcon from '../../assets/delete.png';
import AlterarIcon from '../../assets/alterar.png';
import EditarIcon from '../../assets/editar.png';
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function Cases() {
    const [challenges, setChallenges] = useState([]);
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredButton, setHoveredButton] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Estados para os campos de cadastro
    const [tituloCase, setTituloCase] = useState('');
    const [descricaoCase, setDescricaoCase] = useState('');
    const [imagemCase, setImagemCase] = useState(null);
    const [resumoCase, setResumoCase] = useState('');

    // Buscar cases do backend
    async function fetchChallenges() {
        try {
            setIsLoading(true);
            const response = await api.get('/case');
            setChallenges(response.data);
        } catch (err) {
            setError("Erro ao carregar cases");
            console.error("Detalhes do erro:", err.response?.data || err.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchChallenges();
    }, []);

    const openChallengeDetails = (challenge) => {
        setSelectedChallenge(challenge);
    };

    const closeChallengeDetails = () => {
        setSelectedChallenge(null);
    };

    const handleEdit = (id) => {
        console.log(`Editar case com id: ${id}`);
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const updatedStatus = !currentStatus; // Alterna entre true e false
            await api.put(`/case/status/${id}`, { status: updatedStatus });

            // Atualiza a lista de cases no estado
            setChallenges(challenges.map(challenge =>
                challenge.id === id ? { ...challenge, status: updatedStatus } : challenge
            ));

            console.log(`Status do case com ID ${id} alterado para ${updatedStatus ? 'Ativo' : 'Inativo'}`);
        } catch (error) {
            console.error("Erro ao alterar status:", error.response?.data || error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/case/${id}`);
            setChallenges(challenges.filter(challenge => challenge.id !== id));
            console.log(`Case com ID ${id} excluído com sucesso!`);
        } catch (error) {
            console.error("Erro ao excluir case:", error.response?.data || error.message);
        }
    };

    // Função para cadastrar case no banco de dados
    const handleCadastroCase = async () => {
    try {
        const formData = new FormData();
        formData.append('titulo', tituloCase);
        formData.append('descricao', descricaoCase);
        formData.append('resumo', resumoCase);
        formData.append('status', true);

        if (imagemCase) {
            formData.append('imagem', imagemCase);
        }

        // Teste se os dados estão de fato no FormData
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }

        const response = await api.post('/case', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        console.log("Case cadastrado com sucesso:", response.data);

        setChallenges([...challenges, response.data]);
        setShowModal(false);
        setTituloCase('');
        setDescricaoCase('');
        setImagemCase(null);
        setResumoCase('');
    } catch (error) {
        console.error("Erro ao cadastrar case:", error.response?.data || error.message);
    }
};

    // Processar imagem do case
    const handleImageChangeCase = (event) => {
        const file = event.target.files[0];

        if (file) {
            setImagemCase(file);
        }
    };

    if (isLoading) return <div className="loading">Carregando cases...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className='container-desafios'>
            <header className="navbar-cadastro">
                <div className="navbar-left">
                    <div className="logo-container">
                        <img src={Logo || "/placeholder.svg"} alt="Makro Logo" className="logo-image" />
                    </div>
                    <div className="nav-links-container">
                        <a href="/solucoes_adm" className="nav-link">Submissões</a>
                        <a href="/contatos_adm" className="nav-link">Contatos</a>
                        <a href="/desafios_adm" className="nav-link">Desafios</a>
                        <a href="/cases_adm" className="nav-link active">Cases de Sucesso</a>
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

            <div className="header-desafios">
                <h2>Casos de sucesso</h2>
                <button className="open-modal-btn" onClick={() => setShowModal(true)}>Criar Case</button>
            </div>

            {/* Modal de criação de cases */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button className="close-btn" onClick={() => setShowModal(false)}>X</button>
                            <h4>Cadastrar case</h4>
                        </div>
                        <div className="cadastro_desafio">
                            <div className="bloco_desafio">
                                <div className='conteudo_desafio'>
                                    <h3>Título do Case:</h3>
                                    <div className='input_desafio'>
                                        <input type='text' placeholder='Digite o título do case'
                                            value={tituloCase} onChange={(e) => setTituloCase(e.target.value)} />
                                    </div>

                                    <h3>Descrição do Case:</h3>
                                    <div className='input_desafio'>
                                        <textarea placeholder='Descreva brevemente o case...'
                                            value={descricaoCase} onChange={(e) => setDescricaoCase(e.target.value)} />
                                    </div>

                                    <h3>Resumo do Case:</h3>
                                    <div className='input_desafio'>
                                        <textarea 
                                            placeholder="Resuma brevemente o case..." 
                                            value={resumoCase || ''} // Garante que não será null
                                            onChange={(e) => setResumoCase(e.target.value)} 
                                        />
                                    </div>

                                    <h3>Imagem do Case:</h3>
                                    <div className='input_desafio file-upload'>
                                        <label htmlFor="imageUploadCase" className="drop-area">
                                            {imagemCase ? (
                                                <img src={URL.createObjectURL(imagemCase)} alt="Preview da imagem" width="80" />
                                            ) : (
                                                <div>
                                                    <img src={Imagem} alt="Ícone da imagem" style={{ width: 40, marginBottom: 8 }} />
                                                    <p>Arraste e solte uma imagem</p>
                                                    <span className="file-select">Procurar</span>
                                                </div>
                                            )}
                                        </label>
                                        <input type="file" id="imageUploadCase" hidden accept="image/*"
                                            onChange={handleImageChangeCase} />
                                    </div>

                                    <button className='cad_button' onClick={handleCadastroCase}>Cadastrar Case</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedChallenge && (
    <div className="modal">
        <div className="modal-content">
            <h3>Detalhes do Case</h3>
            <button className="close-button" onClick={closeChallengeDetails}>
                &times;
            </button>
            <div className="challenge-details">
                <div className="detail-row">
                    <span className="detail-label">Título:</span>
                    <span className="detail-value">{selectedChallenge.titulo}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Descrição:</span>
                    <span className="detail-value">{selectedChallenge.descricao}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Resumo:</span>
                    <span className="detail-value">{selectedChallenge.resumo}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge ${selectedChallenge.status ? 'ativo' : 'inativo'}`}>
                        {selectedChallenge.status ? 'Ativo' : 'Inativo'}
                    </span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Imagem:</span>
                    {selectedChallenge.imagem ? (
                        <img src={`http://localhost:3000/uploads/${selectedChallenge.imagem}`} alt="Imagem do case" width="250" />
                    ) : (
                        <span>Sem imagem</span>
                    )}
                </div>
            </div>
        </div>
    </div>
)}

            {/* Tabela de cases */}
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Ação</th>
                            <th>Título do case</th>
                            <th>Descrição</th>
                            <th>Imagem</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {challenges.map((challenge) => (
                            <tr key={challenge.id} className="solution-row-2">
                                <td className="detalhes">
                                    <button className="expand-button" onClick={() => openChallengeDetails(challenge)}>+</button>
                                </td>
                                <td className="name-challenge-cell" data-label="Nome:">{challenge.titulo}</td>
                                <td className="description-cell" data-label="Descrição:">{challenge.descricao}</td>
                                {/* <td className="resumo-cell">{challenge.resumo}</td> */}
                                {/* <td className="image-cell">
                                    {challenge.imagem ? (
                                        <img src={challenge.imagem} alt="Imagem do case" width="80" />
                                    ) : (
                                        <span>Sem imagem</span>
                                    )}
                                </td> */}
                                <td className="status-exibition" data-label="Status:">
                                    <span className={`status-badge ${challenge.status ? 'ativo' : 'inativo'}`}>
                                        {challenge.status ? "Ativo" : "Inativo"}
                                    </span>
                                </td>
                                <td className="challenge-status-cell">
                                    <button onClick={() => handleToggleStatus(challenge.id, challenge.status)} className="status-button">
                                        <img src={AlterarIcon} alt="Alterar Status" width="20" />
                                    </button>
                                </td>
                                <td className="challenge-actions-cell">
                                    <button onClick={() => handleDelete(challenge.id)} className="delete-button">
                                        <img src={DeleteIcon} alt="Deletar" width="20" />
                                    </button>
                                </td>
                                <td className="challenge-actions-cell">
                                    <button onClick={() => handleEdit(challenge.id)} className="alter-button">
                                        <img src={EditarIcon} alt="Editar" width="30" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Cases;