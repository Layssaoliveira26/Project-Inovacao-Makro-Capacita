import '../Login_Adm/Login.css';
import './Cadastro.css'
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Logo from '../../assets/logo_makro.png';
import DeleteIcon from '../../assets/delete.png';
import { Link } from 'react-router-dom';

function Cases() {
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [emailUsuario, setEmailUsuario] = useState('');
    const [senhaUsuario, setSenhaUsuario] = useState('');

    async function fetchUsuarios() {
        try {
            setIsLoading(true);
            const response = await api.get('/usuarios');
            setUsuarios(response.data);
        } catch (err) {
            setError("Erro ao carregar usuários");
            console.error("Detalhes do erro:", err.response?.data || err.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Tem certeza de que deseja excluir este usuário?");
        if(confirmDelete) {
            try {
                await api.delete(`/usuarios/${id}`);
                setUsuarios(usuarios.filter(usuarios => usuarios.id !== id));
                console.log(`Usuário com ID ${id} excluído com sucesso!`);
            } catch (error) {
                console.error("Erro ao excluir usuário:", error.response?.data || error.message);
            }
        }
    };

    const handleCadastroUsuario = async () => {
        try {
            const response = await api.post('/usuarios', {
                email: emailUsuario,
                senha: senhaUsuario
            });

            console.log("Usuário cadastrado com sucesso:", response.data);

            setUsuarios([...usuarios, response.data]);
            setShowModal(false);
            setEmailUsuario('');
            setSenhaUsuario('');
        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error.response?.data || error.message);
        }
    };

    if (isLoading) return <div className="loading">Carregando usuários...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className='container-desafios'>
            <header className="navbar-cadastro">
                <div className="navbar-left">
                    <div className="logo-container">
                        <Link to='/login_adm'>
                        <img src={Logo || "/placeholder.svg"} alt="Makro Logo" className="logo-image" />
                        </Link>
                    </div>
                    <div className="nav-links-container">
                        <a href="/solucoes_adm" className="nav-link">Submissões</a>
                        <a href="/contatos_adm" className="nav-link">Contatos</a>
                        <a href="/desafios_adm" className="nav-link">Desafios</a>
                        <a href="/cases_adm" className="nav-link active">Usuários</a>
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
                <h2>Usuários</h2>
                <button className="open-modal-btn" onClick={() => setShowModal(true)}>Cadastrar Usuário</button>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button className="close-btn" onClick={() => setShowModal(false)}>X</button>
                            <h4>Cadastrar Usuário</h4>
                        </div>
                        <div className="cadastro_desafio">
                            <div className="bloco_desafio">
                                <div className='conteudo_desafio'>
                                    <h3>Email:</h3>
                                    <div className='input_desafio'>
                                        <input type='text' placeholder='Digite o email do usuário'
                                            value={emailUsuario} onChange={(e) => setEmailUsuario(e.target.value)} />
                                    </div>

                                    <h3>Senha:</h3>
                                    <div className='input_desafio'>
                                        <input type='password' placeholder='Digite a senha do usuário'
                                            value={senhaUsuario} onChange={(e) => setSenhaUsuario(e.target.value)} />
                                    </div>

                                    <button className='cad_button' onClick={handleCadastroUsuario}>Cadastrar Usuário</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody className='tbody_user'>
                        {usuarios.map((usuario) => (
                            <tr className='tr_users' key={usuario.id}>
                                <td className='number-user' data-label="Email:">{usuario.id}</td>
                                <td className='name-challenge-cell' data-label="Senha:">{usuario.email}</td>
                                <td>
                                    <button onClick={() => handleDelete(usuario.id)} className="del-button">
                                        <img src={DeleteIcon} alt="Deletar" width="35" />
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
