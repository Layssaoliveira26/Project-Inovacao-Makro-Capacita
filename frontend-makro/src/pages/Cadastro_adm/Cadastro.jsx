//import { useNavigate } from 'react-router-dom';
//import { useState } from 'react';
import '../Login_Adm/Login.css'
import './Cadastro.css'
import Logo from '../../assets/logo_makro.png';
//import api from '../../services/api';

function Cadastro() {
    return (
        
        <div className='container_geral'>
            <header className="navbar-cadastro">
                <div className="navbar-left">
                    <div className="logo-container">
                        <img src={Logo || "/placeholder.svg"} alt="Makro Logo" className="logo-image" />
                    </div>
                    <div className="nav-links-container">
                        <a href="/solucoes_adm" className="nav-link active">
                            Submissões
                        </a>
                        <a href="/desafios_adm" className="nav-link">
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
                    <div className="user-icon">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="20" cy="20" r="19" stroke="white" strokeWidth="2" />
                            <circle cx="20" cy="15" r="6" stroke="white" strokeWidth="2" />
                            <path d="M7 32C7 25.9249 12.9249 21 20 21C27.0751 21 33 25.9249 33 32" stroke="white" strokeWidth="2" />
                        </svg>
                    </div>
                </div>
            </header>
            
            <div className='tela_login'>
                
                <div className='bloco_login'>
                    <h2>Cadastro de Usuários</h2>
                    <div className='input_group'>
                        <input
                            type='email'
                            placeholder='E-mail'
                            
                        />
                    </div>
                    <div className='input_group'>
                        <input
                            type='password'
                            placeholder='Senha'
                            
                        />
                    </div>
                     <button className='enter_btn' /*onClick={handleLogin}*/ >
                        Cadastrar
                    </button>
                </div>
            </div>
        </div>       
    );
}

export default Cadastro;
