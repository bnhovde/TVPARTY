import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './ScoreBoard.css';

const ScoreBoard = ({scores, currentPlayer}) => {
  return (
      <div className="ScoreBoard">
        <table>
          <tbody>
          {
            scores.map((scoreEntry) => {
              let className = "";
              if(currentPlayer === scoreEntry.playerName) {
                className = "activePlayer";
              }
              return (
                  <tr className={className} key={scoreEntry.playerName}>
                    <td className="playerName">{scoreEntry.playerName}:</td>
                    <td className="score">{scoreEntry.score}</td>
                  </tr>
              );
            })
          }
          </tbody>
        </table>
      </div>
  );
};

ScoreBoard.propTypes = {
  scores: PropTypes.array,
  currentPlayer: PropTypes.string,
};

ScoreBoard.defaultProps = {
  scores: [],
};

export default ScoreBoard;
