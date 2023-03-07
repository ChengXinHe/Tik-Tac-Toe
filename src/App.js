import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({xIsNext, squares, onPlay}) {

  function handleClick(i,j) {
    if (squares[i][j]) {
      return;
    }
    const nextSquares = JSON.parse(JSON.stringify(squares));
    if (xIsNext) {
      nextSquares[i][j] = 'X';
    } else {
      nextSquares[i][j] = 'O';
    }
    console.log("changed");
    console.log(nextSquares);
    onPlay(nextSquares);
  }

  const winner = null;
  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next Player: " +  (xIsNext ? "X" : "O");
  }

  const b = squares.map((row,i) => {
    return (
      <div className="board-row"  key={i} >
        {row.map((value, j) => {
          return (
            <span key={i+j}>
              <Square value={value} onSquareClick={() => handleClick(i,j)}/>
            </span>
         )})}
      </div>
    ); 
    })


  return (
    <div>
     <div className='game-info'>
      <ol>{b}</ol>
    </div>
    <div className='status'>{status}</div>
    </div>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory]  = useState([Array(3).fill().map(() => Array(3).fill(null))]);
  const [count, setCount] = useState(0);
  const currentSquares = history[count];

  function handlePlay(nextSquares){
    const newHistory = [...history.slice(0, count+1).concat([nextSquares])];
    setHistory(newHistory);
    setXIsNext(!xIsNext);
    setCount(newHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCount(nextMove);
    const newHistory = [...history.slice(0, nextMove+1)];
    setHistory(newHistory);
  }

  const moves = history.slice().reverse().map((squares, move) => {
    let description;
    let index = history.length - move - 1;
    if (index === 0) {
      description = 'Go to game start';
    } else {
      description = 'Go to move #' + index;
    }
    if(count === move) {
      return (
        <li key = {move}>
          <div>You are at move #{index}</div>
        </li>
      );
    } else {
      return (
      <li key={move}>
        <button onClick={() => jumpTo(index)}>{description}</button>
      </li>
    );
    }
  });
   

  return (
    <div className='game'>
    <div className='game-board'>
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
    </div>
    <div className='game-info'>
      <ol>{moves}</ol>
    </div>
    <div className='game-toggle'>
      <button onClick={() => {}}>toggle</button>
    </div>
    </div>
  );
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
