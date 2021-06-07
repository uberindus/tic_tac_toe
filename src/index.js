import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props){
	return(
		<button
        className="square"
        onClick={() => props.onClick()}
    >
        {props.value}
    </button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
    return (
    	<Square
    		key={i}
	    	value={this.props.squares[i]}
	    	onClick={() => this.props.onClick(i)}
	    />
    );
  }

  parseRow(i){
	  	let row = [];
	  	for (var column = 0; column < 3; column++) {
	  		row.push(this.renderSquare(i*3 + column));
	  	}
	  	return row;
  }

  render() {

  	let rows = []
  	for (var i = 0; i < 3; i++) {
  		rows.push(
  			<div key={i} className="board-row">
  				{this.parseRow(i)}
  			</div>
  		);
  	}

    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
			}],
			stepNumber: 0,
			xIsNext: true,
		};

	}
	handleClick(i){
  	const history = this.state.history.slice(0, this.state.stepNumber + 1);
  	const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]){
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		})
	}

  render() {
  	const history = this.state.history;
    const current = history[this.state.stepNumber];
  	const winner = calculateWinner(current.squares);
    
  	const moves = history.map((step, move) => {
  		let desc;
  		console.log(`move ${move}`);
  		if (move === 0){
  			desc = 'Go to game start';
  		}
  		else{
  			const turn = calculateLastTurn(history[move - 1].squares, history[move].squares);
  			desc = `Go to move #${move} - (${turn[0]}, ${turn[1]})`;
  		} 
  		return(	
				<li key={move}>
        	<button onClick={() => this.jumpTo(move)}>{desc}</button>
      	</li>
  		);
  	});

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// ========================================

// Helpers

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


function calculateLastTurn(prevSquares, nextSquares){
	for (var i = 0; i < prevSquares.length; i++) {
		if (prevSquares[i] === null && nextSquares[i] !== null){
			return [Math.floor(i/3) + 1, i % 3 + 1];
		}
	}

}