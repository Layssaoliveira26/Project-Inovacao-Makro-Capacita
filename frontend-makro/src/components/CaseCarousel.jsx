import React, { useState } from 'react';
import Case1 from '../assets/desafio1.png'
import Case2 from '../assets/desafio2.png'
import Case3 from '../assets/desafio3.png'

const cases = [
    { titulo: 'Projeto 1', descricao: 'Descrição breve do desafio 1 com limite de caracteres. Aqui deverá ser escrito o texto que representa o case.', imagem: Case1 },
    { titulo: 'Projeto 2', descricao: 'Descrição breve do desafio 1 com limite de caracteres. Aqui deverá ser escrito o texto que representa o case.', imagem: Case2 },
    { titulo: 'Projeto 3', descricao: 'Descrição breve do desafio 1 com limite de caracteres. Aqui deverá ser escrito o texto que representa o case.', imagem: Case1 }

];

const Home = () => {
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

    const casesVisiveis = cases.slice(indiceAtual, indiceAtual + casesPorPagina);

      return (
      <div className="carousel-container">
        <button className="seta esquerda" onClick={grupoAnterior}>&#10094;</button>

        <div className="desafios-visiveis">
          {casesVisiveis.map((item, index) => (
            <div className="card-desafio" key={index}>
              <img src={item.imagem} alt={item.titulo} className="imagem-desafio" />
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

