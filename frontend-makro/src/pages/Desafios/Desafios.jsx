import './Desafios.css';
import Logo from '../../assets/logo_makro.png';
import Logout from "../../assets/logout.png";
import HamburgerIcon from '../../assets/hamburger.png'; 
import CloseIcon from '../../assets/close.png'; 
import '../Login_Adm/Login.css';
import Imagem from '../../assets/imagem 1.png';
import DeleteIcon from '../../assets/delete.png';
import AlterarIcon from '../../assets/alterar.png';
import EditarIcon from '../../assets/editar.png';
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom'

function Desafios() {
    const [challenges, setChallenges] = useState([]);
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredButton, setHoveredButton] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedChallengeForEdit, setSelectedChallengeForEdit] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);

    // Estados para os campos de cadastro
    const [tituloDesafio, setTituloDesafio] = useState('');
    const [descricaoDesafio, setDescricaoDesafio] = useState('');
    const [imagemDesafio, setImagemDesafio] = useState(null);
    const [resumoDesafio, setResumoDesafio] = useState('');

    // Buscar desafios do backend
    async function fetchChallenges() {
        try {
            setIsLoading(true);
            const response = await api.get('/desafios');
            setChallenges(response.data);
        } catch (err) {
            setError("Erro ao carregar desafios");
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

    const handleEdit = (challenge) => {
    setSelectedChallengeForEdit(challenge);
    setShowEditModal(true);
    };

    const handleLogout = () => {
        window.location.href = "/login_adm"
    }

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const updatedStatus = !currentStatus; // Alterna entre true e false
            await api.put(`/desafios/status/${id}`, { status: updatedStatus });

            // Atualiza a lista de desafios no estado
            setChallenges(challenges.map(challenge =>
                challenge.id === id ? { ...challenge, status: updatedStatus } : challenge
            ));

            console.log(`Status do desafio com ID ${id} alterado para ${updatedStatus ? 'Ativo' : 'Inativo'}`);
        } catch (error) {
            console.error("Erro ao alterar status:", error.response?.data || error.message);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Tem certeza de que deseja excluir este desafio?");
        if(confirmDelete) {
            try {
                await api.delete(`/desafios/${id}`);
                setChallenges(challenges.filter(challenge => challenge.id !== id));
                console.log(`Desafio com ID ${id} excluído com sucesso!`);
            } catch (error) {
                console.error("Erro ao excluir desafio:", error.response?.data || error.message);
            }
        }
    };

    // Função para cadastrar desafio no banco de dados
    const handleCadastroDesafio = async () => {
    try {
        const formData = new FormData();
        formData.append('titulo', tituloDesafio);
        formData.append('descricao', descricaoDesafio);
        formData.append('resumo', resumoDesafio);
        formData.append('status', true);

        if (imagemDesafio) {
            formData.append('imagem', imagemDesafio);
        }

        // Teste se os dados estão de fato no FormData
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }

        const response = await api.post('/desafios', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        console.log("Desafio cadastrado com sucesso:", response.data);

        setChallenges([...challenges, response.data]);
        setShowModal(false);
        setTituloDesafio('');
        setDescricaoDesafio('');
        setImagemDesafio(null);
        setResumoDesafio('');
    } catch (error) {
        console.error("Erro ao cadastrar desafio:", error.response?.data || error.message);
    }
};

    const handleSaveEdit = async () => {
        try {
            const formData = new FormData();
            formData.append('titulo', selectedChallengeForEdit.titulo);
            formData.append('descricao', selectedChallengeForEdit.descricao);
            formData.append('resumo', selectedChallengeForEdit.resumo);

            // Se o usuário **não** escolheu uma nova imagem, envie a imagem já cadastrada
            if (selectedChallengeForEdit.imagem instanceof File) {
                formData.append('imagem', selectedChallengeForEdit.imagem);
            } else if (selectedChallengeForEdit.imagem) {
                formData.append('imagem', selectedChallengeForEdit.imagem); // Envia o nome da imagem existente
            }

            const response = await api.put(`/desafios/${selectedChallengeForEdit.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Atualizar lista de desafios
            setChallenges(challenges.map(challenge =>
                challenge.id === selectedChallengeForEdit.id ? response.data : challenge
            ));

            // Atualizar modal de detalhes se for o mesmo desafio
            if (selectedChallenge && selectedChallenge.id === selectedChallengeForEdit.id) {
                setSelectedChallenge(response.data);
            }

            setShowEditModal(false);
            console.log("Desafio atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar desafio:", error.response?.data || error.message);
        }
    };

    // Processar imagem do desafio
    const handleImageChangeDesafio = (event) => {
        const file = event.target.files[0];

        if (file) {
            setImagemDesafio(file);
        }
    };

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

    if (isLoading) return <div className="loading">Carregando desafios...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className='container-desafios'>
            <header className="navbar-cadastro">
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
                        <a href="/contatos_adm" className="nav-link">Contatos</a>
                        <a href="/desafios_adm" className="nav-link active">Desafios</a>
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

            <div className="header-desafios">
                <h2>Desafios</h2>
                <button className="open-modal-btn" onClick={() => setShowModal(true)}>Criar Desafio</button>
            </div>

            {/* Modal de criação de desafios */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button className="close-btn" onClick={() => setShowModal(false)}>X</button>
                            <h4>Cadastrar desafio</h4>
                        </div>
                        <div className="cadastro_desafio">
                            <div className="bloco_desafio">
                                <div className='conteudo_desafio'>
                                    <h3>Título do Desafio:</h3>
                                    <div className='input_desafio'>
                                        <input type='text' placeholder='Digite o título do desafio'
                                            value={tituloDesafio} onChange={(e) => setTituloDesafio(e.target.value)} />
                                    </div>

                                    <h3>Descrição do Desafio:</h3>
                                    <div className='input_desafio'>
                                        <textarea placeholder='Descreva brevemente o desafio...'
                                            value={descricaoDesafio} onChange={(e) => setDescricaoDesafio(e.target.value)} />
                                    </div>

                                    <h3>Resumo do Desafio:</h3>
                                    <div className='input_desafio'>
                                        <textarea 
                                            placeholder="Resuma brevemente o desafio..." 
                                            value={resumoDesafio || ''} Garante que não será null
                                            onChange={(e) => setResumoDesafio(e.target.value)} 
                                        />
                                    </div>

                                    <h3>Imagem do Desafio:</h3>
                                    <div className='input_desafio file-upload'>
                                        <label htmlFor="imageUploadDesafio" className="drop-area">
                                            {imagemDesafio ? (
                                                <img src={URL.createObjectURL(imagemDesafio)} alt="Preview da imagem" width="80" />
                                            ) : (
                                                <div>
                                                    <img src={Imagem} alt="Ícone da imagem" style={{ width: 40, marginBottom: 8 }} />
                                                    <p>Arraste e solte uma imagem</p>
                                                    <span className="file-select">Procurar</span>
                                                </div>
                                            )}
                                        </label>
                                        <input type="file" id="imageUploadDesafio" hidden accept="image/*"
                                            onChange={handleImageChangeDesafio} />
                                    </div>

                                    <button className='cad_button' onClick={handleCadastroDesafio}>Cadastrar Desafio</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && selectedChallengeForEdit && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>X</button>
                            <h4>Editar Desafio</h4>
                        </div>
                        <div className="cadastro_desafio">
                            <div className="bloco_desafio">
                                <div className='conteudo_desafio'>
                                    <h3>Título do Desafio:</h3>
                                    <div className='input_desafio'>
                                        <textarea value={selectedChallengeForEdit.titulo} 
                                            onChange={(e) => setSelectedChallengeForEdit({ ...selectedChallengeForEdit, titulo: e.target.value })} />
                                    </div>

                                    <h3>Descrição do Desafio:</h3>
                                    <div className='input_desafio'>
                                        <textarea value={selectedChallengeForEdit.descricao} 
                                            onChange={(e) => setSelectedChallengeForEdit({ ...selectedChallengeForEdit, descricao: e.target.value })} />
                                    </div>
                                    <h3>Resumo do Desafio:</h3>
                                    <div className='input_desafio'>
                                        <textarea value={selectedChallengeForEdit.resumo} 
                                            onChange={(e) => setSelectedChallengeForEdit({ ...selectedChallengeForEdit, resumo: e.target.value })} />
                                    </div>

                                    <h3>Imagem do Desafio:</h3>
                                    <div className='input_desafio file-upload'>
                                        <label htmlFor="imageUploadEdit" className="drop-area">
                                            {selectedChallengeForEdit.imagem instanceof File ? (
                                                <img src={URL.createObjectURL(selectedChallengeForEdit.imagem)} 
                                                    alt="Preview nova imagem" width="80" />
                                            ) : selectedChallengeForEdit.imagem ? (
                                                <img src={`http://localhost:3000/uploads/${selectedChallengeForEdit.imagem}`} 
                                                    alt="Preview imagem atual" width="80" />
                                            ) : (
                                                <span>Sem imagem cadastrada</span>
                                            )}
                                        </label>
                                        <input type="file" id="imageUploadEdit" hidden accept="image/*"
                                            onChange={(event) => {
                                                const file = event.target.files[0];
                                                if (file) {
                                                    setSelectedChallengeForEdit({ ...selectedChallengeForEdit, imagem: file });
                                                }
                                            }} />
                                    </div>

                                    <button className='cad_button' onClick={() => handleSaveEdit()}>Salvar Alterações</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedChallenge && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Detalhes do Desafio</h3>
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
                                    <img src={`http://localhost:3000/uploads/${selectedChallenge.imagem}`} alt="Imagem do desafio" width="250" />
                                ) : (
                                    <span>Sem imagem</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabela de desafios */}
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Ação</th>
                            <th>Título do desafio</th>
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
                                        <img src={challenge.imagem} alt="Imagem do desafio" width="80" />
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
                                        <img src={AlterarIcon} alt="Alterar Status" width="20" title='Alterar status' />
                                    </button>
                                </td>
                                <td className="challenge-actions-cell">
                                    <button onClick={() => handleEdit(challenge)} className="alter-button">
                                        <img src={EditarIcon} alt="Editar" width="30" title='Editar' />
                                    </button>
                                </td>                                
                                <td className="challenge-actions-cell">
                                    <button onClick={() => handleDelete(challenge.id)} className="delete-button">
                                        <img src={DeleteIcon} alt="Deletar" width="20" title='Deletar' />
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

export default Desafios;