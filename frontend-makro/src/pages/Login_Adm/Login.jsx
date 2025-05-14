import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './login.css';
import Logo from '../../assets/logo_makro.png';
import api from '../../services/api';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

    const handleLogin = async () => {
        try {
            const response = await api.post('/login', { email, senha });
            if (response.status === 200) {
                navigate('/solucoes_adm');
            }
        } catch (error) {
            setErro('E-mail ou senha inválidos');
        }
    };

    return (
        <div className='tela_login'>
            <div className="logo-container">
                <img src={Logo || "/placeholder.svg"} alt="Makro Logo" className="logo-image" />
            </div>
            <div className='bloco_login'>
                <h2>Login</h2>
                <div className='input_group'>
                    <input
                        type='email'
                        placeholder='E-mail'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className='input_group'>
                    <input
                        type='password'
                        placeholder='Senha'
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                    />
                </div>
                {erro && <p style={{ color: 'red' }}>{erro}</p>}
                <button className='enter_btn' onClick={handleLogin}>
                    Entrar
                </button>
            </div>
        </div>
    );
}

export default Login;
