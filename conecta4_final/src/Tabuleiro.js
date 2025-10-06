import React from 'react';

const COLS = 7;
const ROWS = 6;

export default function Tabuleiro({tab, onPlay, vencedor, verdeSpots = []}){
  const isVerde = (r,c) => verdeSpots.includes(`${r},${c}`);
  return (
    <div className={"tabuleiro " + (vencedor ? 'vencedor' : '')} role="grid" aria-label="Tabuleiro de Conecta 4">
      {Array.from({length: COLS}).map((_, col)=>{
        return (
          <div key={col} className="coluna" data-col={col} data-col-index={col} onClick={()=>onPlay(col)}>
            {Array.from({length: ROWS}).map((_, rowIdx)=>{
              const r = rowIdx;
              const cell = tab[r][col];
              const verde = isVerde(r,col);
              return (
                <div key={rowIdx} className={"celula " + (cell ? 'occupied' : '') + (verde ? ' verde' : '')}>
                  {verde && <div className="green-indicator" aria-hidden />}
                  <div className={"token " + (cell ? cell : 'vazio')} />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
