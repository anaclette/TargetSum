import React from 'react';
import PropTypes from 'prop-types';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';

class RandomNumber extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
  };

  handlePress = () => {
    // console.log('clicked on number: ', this.props.number);
    if (this.props.isDisabled) {
      return;
    }
    this.props.onPress(this.props.id);
  };

  render() {
    return (
      <TouchableOpacity onPress={this.handlePress}>
        <Text style={[styles.text, this.props.isDisabled && styles.disabled]}>
          {this.props.number}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    paddingTop: 7,
    paddingLeft: 40,
    color: '#fafafa',
    margin: 30,
    width: 100,
    height: 50,
    backgroundColor: 'purple',
  },
  disabled: {
    opacity: 0.3,
  },
});

export default RandomNumber;
