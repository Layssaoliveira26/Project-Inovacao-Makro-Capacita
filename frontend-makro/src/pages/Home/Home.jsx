import Logo from '../../assets/logo_makro.png'
import Representante from '../../assets/representante_makro.png'
import Transicao from '../../assets/fundo_transicao.png'
import './Home.css'

function Home() {
    return (
        <div className='tela_home'>
            <div className='header'>
                <div className="logo_makro_header">
                    <img src={Logo} alt="Makro Logo" />
                </div>

                <div className='conteudo_home'>
                    <img className='img_representante' src={Representante} alt='Representante Makro' />

                    <div className='textos_header'>
                        <h1>Programa de<br />Inovação</h1>
                        <div className='botoes_header'>
                            <button className='btn_header'>Conheça Nossos Desafios</button>
                            <button className='btn_header_white'>Entre em Contato</button>
                        </div>
                    </div>
                </div>
                <div className='dados_transicao'>
                    <img src={Transicao} />
                </div>
            </div>
        </div>
    )
}

export default Home
