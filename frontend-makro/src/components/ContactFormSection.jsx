"use client";

import React from "react";
import "./ContactFormSection.css";
import barraAzul from "../assets/barra_azul.jpg";
import instagramIcon from "../assets/icons8-instagram-32 1.png";
import linkedinIcon from "../assets/icons8-linkedin-24 1.png";
import whatsappIcon from "../assets/Vector.png";
import youtubeIcon from "../assets/icons8-youtube-24 1.png";
import facebookIcon from "../assets/icons8-facebook-50 1.png";
import locationIcon from "../assets/local.png";

const ContactFormSection = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            telefone: document.getElementById("telefone").value,
            descricao: document.getElementById("descricao").value,
        };

        try {
            const response = await fetch("http://localhost:3000/api/contatos", { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log("Dados enviados com sucesso!");
                alert("Proposta enviada com sucesso!");
                e.target.reset(); // Limpa os campos do formulário
            } else {
                console.error("Erro ao enviar os dados.");
                alert("Erro ao enviar a proposta, tente novamente.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao conectar com o servidor.");
        }
    };

    return (
        <div id="contact-form-section">
            {/* Imagem de fundo na metade superior da tela */}
            <div
                className="background-image"
                style={{ backgroundImage: `url(${barraAzul})` }}
            />

            {/* Conteúdo principal por cima da imagem */}
            <div className="section-container">
                {/* Lado esquerdo - Formulário */}
                <div className="form-side">
                    <div className="form-card">
                        <h2 className="form-title">
                            Submissão de Soluções<br />Inovadoras
                        </h2>
                        <p className="form-description">
                            Preencha sua proposta de forma rápida e<br />
                            segura e contribua com ideias transformadoras.
                        </p>

                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="input-group">
                                <label htmlFor="nome">Nome Completo</label>
                                <input id="nome" type="text" className="form-input" required />
                            </div>

                            <div className="input-group">
                                <label htmlFor="email">E-mail</label>
                                <input id="email" type="email" className="form-input" required />
                            </div>

                            <div className="input-group">
                                <label htmlFor="telefone">Celular</label>
                                <input id="telefone" type="tel" className="form-input" required />
                            </div>

                            {/* <div className="input-group">
                                <label htmlFor="file-upload">Documento da Proposta</label>
                                <div className="file-upload-container">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="file-input"
                                        accept=".pdf,.doc,.docx"
                                    />
                                    <label htmlFor="file-upload" className="file-upload-btn">
                                        Anexar Arquivo
                                    </label>
                                </div>
                            </div> */}

                            <div className="input-group">
                                <label htmlFor="descricao">Descrição da Proposta</label>
                                <textarea
                                    id="descricao"
                                    className="form-textarea"
                                    rows="5"
                                ></textarea>
                            </div>

                            <div style={{ textAlign: "center" }}>
                                <button type="submit" className="submit-btn">
                                    Enviar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                 {/* Lado direito - Info */}
                <div className="info-side">
                    <div className="contact-section">
                        <h3 className="contact-title">Entre em contato:</h3>
                        <div className="social-media">
                            <a
                                href="https://www.instagram.com/makroengenharia/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                            ><img src={instagramIcon} alt="Instagram" /></a>
                            <a
                                href="https://www.linkedin.com/company/24793029/admin/feed/posts/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                            ><img src={linkedinIcon} alt="Linkedin" /></a>
                            <a
                                href="https://api.whatsapp.com/send/?phone=5585981564302&text=Olá,+Makro+Engenharia!+Vim+pelo+site+e+gostaria+de+saber+mais"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                            ><img src={whatsappIcon} alt="WhatsApp"/></a>
                            <a
                                href="https://www.youtube.com/@makroengenharia"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                            ><img src={youtubeIcon} alt="Youtube" /></a>
                            <a
                                href="https://www.facebook.com/makroengenhariaoficial"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                            ><img src={facebookIcon} alt="Facebook" /></a>
                        </div>
                    </div>

                    <div className="location-section">
                        <h3 className="location-title">Localização</h3>
                        <div className="location-content">
                            <img src={locationIcon} alt="Location" className="location-icon" />
                            <div className="location-text">
                                <p>BR 116, Km 14, 4921</p>
                                <p>Paupuina, Fortaleza, Ceará</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactFormSection;
