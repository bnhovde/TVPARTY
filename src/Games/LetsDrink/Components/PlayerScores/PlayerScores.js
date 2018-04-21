/**
*
* Loader
*
*
*/
import React from 'react';
import styled from 'styled-components';

import { TextBold } from './../../../../Primitives/Text';

const Wrapper = styled.div`
  display: inline-block;
  vertical-align: top;
  width: 30%;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  justify-contents: space-between;
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2vh;
  transition: transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  transform-origin: left center;
  transform: scale(${props => (props.active ? '1.3' : '1')});
`;

const Indicator = styled.span`
  display: block;
  position: absolute;
  left: -20px;
  width: 15px;
  top: 50%;
  font-family: 'Permanent Marker', cursive;
  transform: translateY(-50%);
`;

const Avatar = styled.img`
  display: inline-block;
  width: 2vw;
  margin-right: 10px;
`;

const ScoreText = styled.span`
  display: inline-block;
  font-family: 'Permanent Marker', cursive;
  margin-left: 10px;
`;

function PlayerScores(props) {
  const { players = {}, playersTurn, playerWithShades, playerWithHair } = props;

  // Generate avatar
  let avatarSrc = 'face.svg';
  let avatarSrcWithHair = 'face-hair.svg';
  let avatarSrcWithShades = 'face-shades.svg';

  return (
    <Wrapper>
      <List>
        {Object.keys(players)
          .filter(p => !players[p].inactive)
          .map(p => {
            let avatar = 'face';
            if (playerWithHair === p) {
              avatar = 'face-hair';
            }
            if (playerWithShades === p) {
              avatar = 'face-shades';
            }
            if (playerWithHair === p && playerWithShades === p) {
              avatar = 'face-shades-hair';
            }
            return (
              <Card key={p} active={playersTurn === p}>
                {playersTurn === p && <Indicator>&gt;</Indicator>}
                <Avatar
                  src={`${process.env
                    .PUBLIC_URL}/assets/letsDrink/${avatar}.svg`}
                />
                <TextBold>{players[p].name}</TextBold>
                <ScoreText> ({players[p].points || 0})</ScoreText>
              </Card>
            );
          })}
      </List>
    </Wrapper>
  );
}

export default PlayerScores;
