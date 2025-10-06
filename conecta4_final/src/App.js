import React, { useState, useEffect, useRef } from 'react';
import Tabuleiro from './Tabuleiro';
import { startConfetti, stopConfetti } from './confetti';

const COLS = 7;
const ROWS = 6;

function criarTabuleiro(){
  return Array.from({length: ROWS}, ()=> Array(COLS).fill(null));
}

export default function App(){
  const [tab, setTab] = useState(criarTabuleiro());
  const [jogador, setJogador] = useState('vermelho');
  const [vencedor, setVencedor] = useState(null);
  const [historico, setHistorico] = useState([]);

  const [nomeVermelho, setNomeVermelho] = useState('Vermelho');
  const [nomeAmarelo, setNomeAmarelo] = useState('Amarelo');
  const [oponente, setOponente] = useState('humano');

  const [modoEspecial, setModoEspecial] = useState(false);
  const [numVerdes, setNumVerdes] = useState(1);
  const [verdeSpots, setVerdeSpots] = useState([]);

  const [msgAviso, setMsgAviso] = useState(null);
  const confettiRef = useRef(null);

  const partidaIniciada = Array.isArray(historico) && historico.length > 0 || vencedor !== null;

  useEffect(()=>{
    if(vencedor) startConfetti(confettiRef.current);
  },[vencedor]);

  useEffect(()=>{
    if(oponente === 'cpu' && jogador === 'amarelo' && !vencedor){
      const t = setTimeout(()=>{
        const coluna = calcularJogadaCPU(tab, 'amarelo', 'vermelho');
        if(coluna != null) jogarNaColuna(coluna);
      }, 700);
      return ()=> clearTimeout(t);
    }
  },[oponente, jogador, vencedor, tab]);

  useEffect(()=>{
    if(oponente === 'cpu' && !partidaIniciada) setNomeAmarelo('BOT');
  },[oponente, partidaIniciada]);

  useEffect(()=>{
    if(!partidaIniciada){
      if(modoEspecial) setVerdeSpots(gerarVerdes(numVerdes));
      else setVerdeSpots([]);
    }
  },[modoEspecial, numVerdes, partidaIniciada]);

  function zera(){
    setTab(criarTabuleiro());
    const primeiro = Math.random() < 0.5 ? 'vermelho' : 'amarelo';
    setJogador(primeiro);
    setVencedor(null);
    setHistorico([]);
    setMsgAviso(null);
    if(modoEspecial) setVerdeSpots(gerarVerdes(numVerdes));
    else setVerdeSpots([]);
    stopConfetti(confettiRef.current);
  }

  function undo(){
    const last = historico[historico.length -1];
    if(!last || vencedor) return;
    const novo = tab.map(r=>r.slice());
    novo[last.r][last.c] = null;
    setTab(novo);
    setHistorico(historico.slice(0,-1));
    setJogador(last.jogador === 'vermelho' ? 'amarelo' : 'vermelho');
  }

  function jogarNaColuna(col){
    if(vencedor) return;
    for(let r = ROWS-1; r>=0; r--){
      if(!tab[r][col]){
        const novo = tab.map(row=>row.slice());
        novo[r][col] = jogador;
        setTab(novo);
        setHistorico([...historico, {r,c:col,jogador}]);
        const win = checarVitoria(novo, r, col, jogador);
        if(win) setVencedor({jogador, linha: win});
        else {
          const key = `${r},${col}`;
          if(modoEspecial && verdeSpots.includes(key)){
            setMsgAviso('Acertou um espaço especial — joga novamente!');
            setTimeout(()=> setMsgAviso(null), 1800);
          } else {
            setJogador(prev => prev === 'vermelho' ? 'amarelo' : 'vermelho');
          }
        }
        return;
      }
    }
    const elm = document.querySelector('[data-col="'+col+'"]');
    if(elm){
      elm.classList.remove('shake');
      void elm.offsetWidth;
      elm.classList.add('shake');
    }
  }

  return (
    <div className="app">
      <header className="cabecalho">
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <h1>Conecta 4 — Versão Final</h1>
          <div className="menu">
            <label>Jogador 1:
              <input
                value={nomeVermelho}
                onChange={e=>setNomeVermelho(e.target.value)}
                disabled={partidaIniciada}
              />
            </label>

            <label>Jogador 2:
              <input
                value={nomeAmarelo}
                onChange={e=>setNomeAmarelo(e.target.value)}
                disabled={oponente === 'cpu' || partidaIniciada}
              />
            </label>

            <label>Oponente:
              <select value={oponente} onChange={e=>setOponente(e.target.value)} disabled={partidaIniciada}>
                <option value="humano">Humano</option>
                <option value="cpu">Máquina (CPU)</option>
              </select>
            </label>

            <label style={{display:'flex',alignItems:'center',gap:6}}>
              <input type="checkbox" checked={modoEspecial} onChange={e=>setModoEspecial(e.target.checked)} disabled={partidaIniciada} />
              <span>Modo de jogo especial</span>
              <span className="tooltip" style={{marginLeft:6}}>
                <span className="qmark">?</span>
                <span className="tooltiptext">Se ativado, N espaços do tabuleiro são marcados em verde no início da partida. Ao jogar em um espaço verde o jogador ganha a oportunidade de jogar novamente.</span>
              </span>
            </label>

            <label>
              Quantos verdes:
              <select value={numVerdes} onChange={e=>setNumVerdes(Number(e.target.value))} disabled={partidaIniciada || !modoEspecial}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </label>
          </div>
        </div>
        <div className="controles">
          <button onClick={zera}>Recomeçar</button>
          <button onClick={undo} disabled={historico.length===0 || vencedor}>Desfazer</button>
        </div>
      </header>

      <main>
        <div className="col-esquerda">
          <div className="status">
            {vencedor ? (
              <div className="vencedor">🎉 {vencedor.jogador === 'vermelho' ? nomeVermelho : nomeAmarelo} venceu!</div>
            ) : (
              <div className="proximo">Próximo: <span className={'token mini '+jogador}></span> {jogador === 'vermelho' ? nomeVermelho : nomeAmarelo}</div>
            )}
            {msgAviso && <div className="msg-aviso">{msgAviso}</div>}
            {modoEspecial && <div style={{marginTop:8, fontSize:13, opacity:0.9}}>Espaços especiais nesta partida: <strong>{verdeSpots.length}</strong></div>}
          </div>

          <aside className="ajuda">
            <h3>Dicas rápidas</h3>
            <ul>
              <li>Clique em uma coluna para soltar a peça.</li>
              <li>Use <strong>Desfazer</strong> para reverter o último movimento.</li>
              <li>Procure criar duas ameaças simultâneas!</li>
            </ul>
          </aside>
        </div>

        <div className="tabuleiro-container">
          <Tabuleiro tab={tab} onPlay={jogarNaColuna} vencedor={vencedor} verdeSpots={verdeSpots} />
        </div>

        <canvas id="confetti" ref={confettiRef} className="confetti-canvas"></canvas>
      </main>

      <footer className="rodape">
        <small>Feito com ♥ — melhore e personalize à vontade.</small>
      </footer>
    </div>
  );
}

function gerarVerdes(n){
  const total = ROWS * COLS;
  const indices = Array.from({length: total}, (_,i)=>i);
  for(let i = indices.length -1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const chosen = indices.slice(0,n);
  return chosen.map(idx => {
    const r = Math.floor(idx / COLS);
    const c = idx % COLS;
    return `${r},${c}`;
  });
}

function checarVitoria(tab, r, c, jogador){
  const directions = [
    {dr:0, dc:1}, {dr:1, dc:0}, {dr:1, dc:1}, {dr:1, dc:-1}
  ];
  for(const {dr,dc} of directions){
    let seq = [[r,c]];
    for(let k=1;k<4;k++){
      const rr = r + dr*k, cc = c + dc*k;
      if(rr<0||rr>=tab.length||cc<0||cc>=tab[0].length) break;
      if(tab[rr][cc] === jogador) seq.push([rr,cc]); else break;
    }
    for(let k=1;k<4;k++){
      const rr = r - dr*k, cc = c - dc*k;
      if(rr<0||rr>=tab.length||cc<0||cc>=tab[0].length) break;
      if(tab[rr][cc] === jogador) seq.push([rr,cc]); else break;
    }
    if(seq.length >= 4) return seq;
  }
  return null;
}

function calcularJogadaCPU(tab, cpuPlayer, oponente){
  const COLS = tab[0].length;
  function simDrop(col, player){
    const novo = tab.map(r=>r.slice());
    for(let r = novo.length-1; r>=0; r--){
      if(!novo[r][col]){ novo[r][col] = player; return {r, novo}; }
    }
    return null;
  }
  for(let c=0;c<COLS;c++){
    const s = simDrop(c, cpuPlayer);
    if(s){
      if(checarVitoria(s.novo, s.r, c, cpuPlayer)) return c;
    }
  }
  for(let c=0;c<COLS;c++){
    const s = simDrop(c, oponente);
    if(s){
      if(checarVitoria(s.novo, s.r, c, oponente)) return c;
    }
  }
  const order = [3,2,4,1,5,0,6];
  for(const c of order){
    if(tab[0][c] === null) return c;
  }
  return null;
}
