import './login.css'
import Logo from '../../assets/logo_makro.png'
function Login() {
    return (
        <div className='tela_login'>
            <div className='logo_makro'>
                <img src={Logo} alt='Makro Logo'></img>
            </div>
            <div className='bloco_login'>
                <h2>Login</h2>
                <div className='input_group'>
                <input type='email' placeholder='E-mail'/>
                </div>
                <div className='input_group'>
                <input type='password'placeholder='Senha'/>
                </div>
                <button className='enter_btn'>Entrar</button>
            </div>
        </div>
        
    )
}

export default Login