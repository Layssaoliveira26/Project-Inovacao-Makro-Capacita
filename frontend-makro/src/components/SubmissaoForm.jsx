"use client"
import "./SubmissaoForm.css"
const desafios = [
    "Desafio 1",
    "Desafio 2",
    "Desafio 3",
    "Desafio 4",
    "Desafio 5",
    "Desafio 6",
    "Desafio 7",
    "Desafio 8"
]
const SubmissaoForm = ({ onSubmit, onClose }) => {
    const handleSubmit = (e) => {
        e.preventDefault()
        if (onSubmit) onSubmit()
    }
    return (
        <div className="form-container">
            <button className="modal-close" onClick={onClose}>
                ×
            </button>
            <div className="form-header">
                <h1 className="form-title">Submissão de Soluções Inovadoras</h1>
                <p className="form-subtitle">
                    Preencha sua proposta de forma rápida e segura e contribua com ideias transformadoras.
                </p>
            </div>
            <form className="submission-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nome">Nome Completo</label>
                        <input type="text" id="nome" name="nome" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input type="email" id="email" name="email" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="celular">Celular</label>
                        <input type="tel" id="celular" name="celular"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="desafioOrigem">Desafio de origem</label>
                        <select id="desafioOrigem" name="desafioOrigem" required defaultValue={desafios[0]}>
                            {desafios.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="descricao">Descrição da Proposta:</label>
                    <textarea id="descricao" name="descricao" rows="4" />
                </div>
                <div className="form-group documento-group">
                    <div className="form-group">
                        <label htmlFor="documento">Documento da Proposta</label>
                        <button type="button" className="file-upload-btn">Anexar Arquivo</button>
                    </div>
                </div>
                <div className="form-actions">
                    <button type="submit" className="submit-button">Enviar</button>
                </div>
            </form>
        </div>
    )
}
export default SubmissaoForm