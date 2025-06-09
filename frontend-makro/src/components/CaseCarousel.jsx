import React, { useEffect, useState } from 'react';
import api from '../services/api'

function Home() {
    const [cases, setCases] = useState([]);
    const [indiceAtual, setIndiceAtual] = useState(0);
    const casesPorPagina = 3;

    const proximoGrupo = () => {
        if (indiceAtual + casesPorPagina < cases.length) {
            setIndiceAtual(indiceAtual + casesPorPagina);
        }
    }

    const grupoAnterior = () => {
        if (indiceAtual - casesPorPagina >= 0) {
            setIndiceAtual(indiceAtual - casesPorPagina);
        }
    }

    async function getCases() {
      const response = await api.get('/case/ativos')
      setCases(response.data)
    }

    useEffect(() => {
      getCases()
    }, [])

    const casesVisiveis = cases.slice(indiceAtual, indiceAtual + casesPorPagina);

      return (
      <div className="carousel-container">
        <button className="seta esquerda" onClick={grupoAnterior}>&#10094;</button>

        <div className="desafios-visiveis">
          {casesVisiveis.map((item, index) => (
            <div className="card-desafio" key={index}>
              <img 
                src={`http://localhost:3000/uploads/${encodeURIComponent(item.imagem)}`}
                alt={item.titulo} 
                className="imagem-desafio" 
              />
              <div className='bloco_text_desafios'>
                <h5 className='titulo_bloco_desafio'>{item.titulo}</h5>
                <p className='descricao_desafios'>{item.descricao}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="seta direita" onClick={proximoGrupo}>&#10095;</button>
      </div>
  );
};

export default Home;

