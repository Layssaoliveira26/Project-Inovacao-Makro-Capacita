import Logo from '../../assets/logo_makro.png';
import Representante from '../../assets/representante_makro.png';
import Transicao from '../../assets/fundo_transicao.png';
import Luz from '../../assets/mancha_branca.png';
import Inovacao from '../../assets/inovacao.png';
import Colaboracao from '../../assets/colaboracao.png';
import Seguranca from '../../assets/seguranca.png';
import FundoMaquina from '../../assets/fundo_empresa.png'
import Simbolo from '../../assets/simbolo_empresa.png'
import Investimento from '../../assets/investimento.png'
import Conexao from '../../assets/conexao.png'
import Transformacao from '../../assets/transformacao.png'
import Lampada from '../../assets/lampada_lateral.png'
import Parceiros from '../../assets/animacao_parceiros.mp4'
import DesafioCarousel from '../../components/DesafioCarousel';
import CaseCarousel from '../../components/CaseCarousel';
import MineracaoIcon from '../../assets/mineracao.png';
import PetroquimicaIcon from '../../assets/petroquimica.png';
import EnergiaIcon from '../../assets/energia.png';
import SiderurgicaIcon from '../../assets/Ssiderurgica 1.png';
import RefinariaIcon from '../../assets/refinaria.png';
import MetalurgicaIcon from '../../assets/mertalurgica.png';
import CimenteriaIcon from '../../assets/cimenteria.png';
import PapelCeluloseIcon from '../../assets/papel-celulose.png';
import OperacoesPortuariasIcon from '../../assets/operacoes-portuarias.png';
import DesafioModal from '../../components/DesafioModal';
import './Home.css';
import React, { useState } from 'react';
import api from '../../services/api'

function Home() {
    const areas = [
        { id: 1, title: "Mineração", icon: MineracaoIcon, subtitle: "" },
        { id: 2, title: "Petroquímica", icon: PetroquimicaIcon, subtitle: "" },
        { id: 3, title: "Energia", icon: EnergiaIcon, subtitle: "(eólica, hidrelétrica, termelétrica)" },
        { id: 4, title: "Siderúrgica", icon: SiderurgicaIcon, subtitle: "" },
        { id: 5, title: "Refinaria", icon: RefinariaIcon, subtitle: "" },
        { id: 6, title: "Metalúrgica", icon: MetalurgicaIcon, subtitle: "" },
        { id: 7, title: "Cimenteria", icon: CimenteriaIcon, subtitle: "" },
        { id: 8, title: "Papel e Celulose", icon: PapelCeluloseIcon, subtitle: "" },
        { id: 9, title: "Operações Portuárias", icon: OperacoesPortuariasIcon, subtitle: "(on-shore/off-shore)" },
    ];
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [desafioSelecionado, setDesafioSelecionado] = useState(null);

    const handleVerMaisClick = (desafio) => {
        setDesafioSelecionado(desafio)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setDesafioSelecionado(null)
    }

    return (
        <div className='landing_page'>
            {/* Seção Principal */}
            <div className='tela_home'>
                <div className='header'>
                    <div className="logo_makro_header">
                        <img src={Logo} alt="Makro Logo" />
                    </div>

                    <div className='conteudo_home'>
                        <img className='img_representante' src={Representante} alt='Representante Makro' />
                        <img className='luz_branca' src={Luz} alt='sombra branca' />

                        <div className='textos_header'>
                            <h1>Programa de<br />Inovação</h1>
                            <div className='botoes_header'>
                                <a href='#tela_desafios'>
                                    <button className='btn_header'>Conheça Nossos Desafios</button>
                                </a>
                                
                                <button className='btn_header_white'>Entre em Contato</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seção de Transição */}
                <div className='dados_transicao'>
                    <img src={Transicao} alt="Transição" className='fundo_transicao' />
                    <div className='caracteristicas_container'>
                        <div className='bloco_caracteristicas'>
                            <img src={Inovacao} className='img_caracteristicas' alt='Inovação' />
                            <h4>Inovação</h4>
                        </div>
                        <div className='bloco_caracteristicas'>
                            <img src={Colaboracao} className='img_caracteristicas' alt='Colaboração' />
                            <h4>Colaboração</h4>
                        </div>
                        <div className='bloco_caracteristicas'>
                            <img src={Seguranca} className='img_caracteristicas' alt='Segurança' />
                            <h4>Segurança</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seção de Desafios */}
            <div id='tela_desafios'>
                <div className='texto_desafio'>
                    <h3 className='titulo_desafios'>Desafios Makro Engenharia</h3>
                </div>
                <DesafioCarousel onVerMaisClick={handleVerMaisClick} />
                <DesafioModal isOpen={isModalOpen} onClose={handleCloseModal}  desafio={desafioSelecionado}/>
            </div>



            {/*Seção sobre a empresa*/}
            <div className='tela_sobre_empresa'>
                <div className='imgs-sobre-empresa'>
                    <img src={FundoMaquina} className='fundo_empresa' alt='imagem de fundo com máquina' />
                    <img src={Simbolo} className='simbolo_empresa' alt='imagem lateral com simbolo da empresa' />
                    <div className='textos_sobre_makro'>
                        <div className='titulos_sobre'>
                            <h6 className='subtitulo_empresa'>Sobre a Empresa</h6>
                            <div className='fundo_titulo_makro'>
                                <h2 className='titulo_makro'> Makro Engenharia</h2>
                            </div>
                        </div>
                        <p className='p_sobre_empresa'>Com 48 anos de mercado e atuação em todo o Brasil, a Makro Engenharia é uma empresa<br /> especialista em engenharia de movimento, oferecendo soluções seguras e eficientes em içamento, transporte e logística.</p>
                        <div className='subtitulo_pilares'>
                            <h6 className='subtitulo_empresa'>Nossos Pilares de Inovação </h6>
                        </div>
                        <div className='bloco_pilares'>
                            <div className='pilar'>
                                <img className='img_pilar' src={Conexao} alt='conexão digital'></img>
                                <p className='p_pilares_empresa'>Conexão com ecossistema<br /> de inovação</p>
                            </div>
                            <div className='pilar'>
                                <img className='img_pilar' src={Transformacao} alt='transformação digital'></img>
                                <p className='p_pilares_empresa'>Transformação Digital<br /> na Engenharia</p>
                            </div>
                            <div className='pilar'>
                                <img className='img_pilar' src={Investimento} alt='investimento digital'></img>
                                <p className='p_pilares_empresa'>Investimento em<br /> Novas Ideias</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*Seção vários caminhos para inovar*/}
            <div className='tela_caminhos'>
                <div className='fundo_empresa'>
                    <img src={Lampada} className='lampada_lateral' alt='imagem lateral com simbolo de lampada' />
                    <div className='textos_sobre_makro'>
                        <div className='titulos_sobre'>
                            <h3 className='titulo_caminhos'>Vários Caminhos para Inovar</h3>
                        </div>
                        <div className='conteudo_caminhos'>
                            <div className='conteudo_imagem'>
                                <video className='img_parceiros' src={Parceiros} autoPlay loop muted playsInline></video>
                                <p className='descricao_img'>Descrição da imagem</p>
                            </div>
                            <div className='conteudo_texto'>
                                <h5 className='h5_inovacao'>Na Makro, sabemos que grandes transformações não nascem isoladas. Elas ganham força quando diferentes frentes trabalham juntas.</h5>
                                <span className='p_descricao_caminhos'>Nossa proposta é unir a expertise consolidada da Makro em movimentação de cargas e engenharia de grande porte com a agilidade e criatividade de novos atores do mercado.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Seção Áreas de Atuação embutida --- */}
            <div className="areas-atuacao">
                <div className="areas-container">
                    <h2 className="areas-title">
                        Entendendo nossas
                        <br />
                        área de atuação
                    </h2>

                    <div className="areas-grid">
                        {areas.map((area) => (
                            <div key={area.id} className="area-card">
                                <div className="area-icon">
                                    <img src={area.icon || "/placeholder.svg"} alt={area.title} />
                                </div>
                                <h3 className="area-title">{area.title}</h3>
                                {area.subtitle && <p className="area-subtitle">{area.subtitle}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/*Seção de cases de sucesso*/}
            <div className='tela_cases'>
                <div className='texto_case'>
                    <h3 className='titulo_cases'>Nossos Cases de Sucesso</h3>
                </div>
                <CaseCarousel />
            </div>
        </div>
    )
}

export default Home;