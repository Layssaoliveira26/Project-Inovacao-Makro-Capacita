import React, { useState } from 'react';
import Desafio1 from '../assets/desafio1.png'
import Desafio2 from '../assets/desafio2.png'
import Desafio3 from '../assets/desafio3.png'



const desafios = [
  { titulo: 'Desafio 1', descricao: 'Descrição breve do desafio 1 com limite de caracteres. Aqui deverá ser escrito o texto que representa o desafio.', imagem: Desafio1 },
  { titulo: 'Desafio 2', descricao: 'Descrição breve do desafio 1 com limite de caracteres. Aqui deverá ser escrito o texto que representa o desafio.', imagem: Desafio2 },
  { titulo: 'Desafio 3', descricao: 'Descrição breve do desafio 1 com limite de caracteres. Aqui deverá ser escrito o texto que representa o desafio.', imagem: Desafio3 },
  { titulo: 'Desafio 4', descricao: 'Descrição breve do desafio 1 com limite de caracteres. Aqui deverá ser escrito o texto que representa o desafio.', imagem: Desafio1 },
  { titulo: 'Desafio 5', descricao: 'Descrição breve do desafio 1 com limite de caracteres. Aqui deverá ser escrito o texto que representa o desafio.', imagem: Desafio2 },
  { titulo: 'Desafio 6', descricao: 'Descrição breve do desafio 1 com limite de caracteres. Aqui deverá ser escrito o texto que representa o desafio.', imagem: Desafio3 },
  { titulo: 'Desafio 4', descricao: 'Descrição do desafio 4', imagem: 'https://via.placeholder.com/300x180?text=Desafio+4' },
  { titulo: 'Desafio 5', descricao: 'Descrição do desafio 5', imagem: 'https://via.placeholder.com/300x180?text=Desafio+5' },
  { titulo: 'Desafio 6', descricao: 'Descrição do desafio 6', imagem: 'https://via.placeholder.com/300x180?text=Desafio+6' },
];

const Home = () => {
  const [indiceAtual, setIndiceAtual] = useState(0);
  const desafiosPorPagina = 3;

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

  return (
      <div className="carousel-container">
        <button className="seta esquerda" onClick={grupoAnterior}>&#10094;</button>

        <div className="desafios-visiveis">
          {desafiosVisiveis.map((desafio, index) => (
            <div className="card-desafio" key={index}>
              <img src={desafio.imagem} alt={desafio.titulo} className="imagem-desafio" />
              <div className='bloco_text_desafios'>
                <h5 className='titulo_bloco_desafio'>{desafio.titulo}</h5>
                <p className='descricao_desafios'>{desafio.descricao}</p>
                <button className='btn_detalhes'>Ver detalhes</button>
              </div>
            </div>
          ))}
        </div>

        <button className="seta direita" onClick={proximoGrupo}>&#10095;</button>
      </div>
  );
};

export default Home;
