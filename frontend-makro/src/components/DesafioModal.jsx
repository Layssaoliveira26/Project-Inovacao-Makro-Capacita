"use client"
import "./DesafioModal.css"
import { useState } from "react"
import SubmissaoForm from "./SubmissaoForm"
import startupIcon from '../assets/startup 1.png'
import documentoIcon from '../assets/documento 1.png'
import educacaoIcon from '../assets/educacao 1.png'
import computadorIcon from '../assets/computador 1.png'

const DesafioModal = ({ isOpen, onClose, desafio }) => {
    const [showForm, setShowForm] = useState(false)

    const handleClose = () => {
        setShowForm(false)
        onClose()
    }

    const handleFormSubmit = () => {
        alert("Formulário enviado com sucesso!")
        handleClose()
    }

    if (!isOpen || !desafio) return null

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content2">
                    {!showForm ? (
                        <>
                            {/* Left Section */}
                            <div className="modal-left">
                                <h1 className="modal-title">{desafio.titulo}</h1>
                                <div className="modal-tag">O que buscamos nesse desafio?</div>
                                <p className="modal-description">{desafio.descricao}</p>
                            </div>

                            {/* Right Section */}
                            <div className="modal-right">
                                <button className="modal-close" onClick={handleClose}>
                                    ×
                                </button>
                                <div className="participants-section">
                                    <h2 className="section-title">Quem pode participar?</h2>
                                    <div className="participants-grid">
                                        <div className="participant-item">
                                            <div className="participant-icon">
                                                <img src={startupIcon} alt="Startup" />
                                            </div>
                                            <span>Startups</span>
                                        </div>
                                        <div className="participant-item">
                                            <div className="participant-icon">
                                                <img src={documentoIcon} alt="Pesquisadores" />
                                            </div>
                                            <span>Pesquisadores</span>
                                        </div>
                                        <div className="participant-item">
                                            <div className="participant-icon">
                                                <img src={educacaoIcon} alt="Universidades" />
                                            </div>
                                            <span>Universidades</span>
                                        </div>
                                        <div className="participant-item">
                                            <div className="participant-icon">
                                                <img src={computadorIcon} alt="Empresas de Tecnologia" />
                                            </div>
                                            <span>Empresas de Tecnologia</span>
                                        </div>
                                    </div>

                                    <div className="benefits-section">
                                        <h2 className="section-title">Benefícios</h2>
                                        <div className="benefits-list">
                                            <div className="benefit-item">
                                                <div className="benefit-check">✓</div>
                                                <span>Possibilidade de implementação de piloto com a Makro Engenharia</span>
                                            </div>
                                            <div className="benefit-item">
                                                <div className="benefit-check">✓</div>
                                                <span>Visibilidade para sua solução no setor industrial</span>
                                            </div>
                                            <div className="benefit-item">
                                                <div className="benefit-check">✓</div>
                                                <span>Networking com especialistas e líderes da indústria</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="submit-button" onClick={() => setShowForm(true)}>
                                        Submeter Solução
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <SubmissaoForm onSubmit={handleFormSubmit} onClose={handleClose} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default DesafioModal
