import React, { useState, useEffect } from 'react';
import api from '../services/api';

const DesafioCarousel = ({ onVerMaisClick }) => {
  const [desafios, setDesafios] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const desafiosPorPagina = 3;

  useEffect(() => {
    async function getActiveDesafios() {
      const response = await api.get('/desafios/ativos');
      setDesafios(response.data);
    }

    getActiveDesafios();
  }, []);

  const proximoGrupo = () => {
    if (indiceAtual + desafiosPorPagina < desafios.length) {
      setIndiceAtual(indiceAtual + desafiosPorPagina);
    }
  };

  const grupoAnterior = () => {
    if (indiceAtual - desafiosPorPagina >= 0) {
      setIndiceAtual(indiceAtual - desafiosPorPagina);
    }
  };

  const desafiosVisiveis = desafios.slice(indiceAtual, indiceAtual + desafiosPorPagina);
  console.log('Desafios visíveis:', desafiosVisiveis);
  return (
    <div className="carousel-container">
      <button className="seta esquerda" onClick={grupoAnterior}>&#10094;</button>

      <div className="desafios-visiveis">
        {desafiosVisiveis.map((desafio, index) => (
          <div className="card-desafio" key={index}>
            <img
              src={`http://localhost:3000/uploads/${encodeURIComponent(desafio.imagem)}`}
              alt={desafio.titulo}
              className="imagem-desafio"
            />
            <div className="bloco_text_desafios">
              <h5 className="titulo_bloco_desafio">{desafio.titulo}</h5>
              <p className="descricao_desafios">{desafio.resumo}</p>
              <button className="btn_detalhes" onClick={() => onVerMaisClick(desafio)}>
                Ver detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="seta direita" onClick={proximoGrupo}>&#10095;</button>
    </div>
  );
};

export default DesafioCarousel;
