import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, Button} from 'react-native';
import RandomNumber from './RandomNumber';
import shuffle from 'lodash.shuffle';

class Game extends React.Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired,
  };
  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds,
  };

  gameStatus = 'PLAYING';

  randomNumbers = Array.from({length: this.props.randomNumberCount}).map(
    () => 1 + Math.floor(10 * Math.random()),
  );
  target = this.randomNumbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);

  shuffledRandomNumbers = shuffle(this.randomNumbers);

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState(
        prevState => {
          return {remainingSeconds: prevState.remainingSeconds - 1};
        },
        () => {
          if (this.state.remainingSeconds === 0) {
            clearInterval(this.intervalId);
          }
        },
      );
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  isNumberSelected = numberIndex => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
  };

  selectNumber = numberIndex => {
    this.setState(prevState => ({
      selectedIds: [...prevState.selectedIds, numberIndex],
    }));
  };
  componentWillUpdate(nextProps, nextState) {
    if (
      nextState.selectedIds !== this.state.selectedIds ||
      nextState.remainingSeconds === 0
    ) {
      this.gameStatus = this.calcGameStatus(nextState);
      if (this.gameStatus !== 'PLAYING') {
        clearInterval(this.intervalId);
      }
    }
  }
  calcGameStatus = nextState => {
    // console.log('calcGameStatus...');
    const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
      return acc + this.shuffledRandomNumbers[curr];
    }, 0);
    // console.warn(sumSelected);
    // console.log(sumSelected);
    if (nextState.remainingSeconds === 0) {
      return 'LOST';
    }
    if (sumSelected < this.target) {
      return 'PLAYING';
    }
    if (sumSelected === this.target) {
      return 'WON';
    }
    if (sumSelected > this.target) {
      return 'LOST';
    }
  };

  render() {
    const gameStatus = this.gameStatus;
    return (
      <View style={styles.container}>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
          {this.target}
        </Text>
        {/* it is not usually a good idea to set the key value to the index in the array because if we delete an item it will complicate things, but in this case we are using the index since we are not deleting any values */}
        {/* the ideal thing to do is to give each element a unique key, each number could be an object and assign a unique ID to that object */}
        <View style={styles.innerBoxesContainer}>
          {this.shuffledRandomNumbers.map((randomNumber, index) => (
            <RandomNumber
              key={index}
              id={index}
              number={randomNumber}
              isDisabled={
                this.isNumberSelected(index) || gameStatus !== 'PLAYING'
              }
              onPress={this.selectNumber}></RandomNumber>
          ))}
        </View>
        {this.gameStatus !== 'PLAYING' && (
          <Button title="Play Again" onPress={this.props.onPlayAgain}></Button>
        )}
        <Text>{this.state.remainingSeconds}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    paddingTop: 60,
    flex: 1,
  },

  target: {
    fontSize: 40,
    textAlign: 'center',
    margin: 50,
  },

  innerBoxesContainer: {
    margin: 20,
    backgroundColor: 'peru',
    height: '45%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    borderRadius: 10,
  },

  STATUS_PLAYING: {
    backgroundColor: '#aaa',
  },

  STATUS_WON: {
    backgroundColor: 'green',
  },

  STATUS_LOST: {
    backgroundColor: 'red',
  },
});

export default Game;
