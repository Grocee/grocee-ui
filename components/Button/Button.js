import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles';
import { Button } from 'react-native-elements';

const GroceeButton = (props) => {
	const { text, onPress } = props;
	return (<Button title={text} onPress={onPress} titleStyle={styles.buttonText} buttonStyle={styles.button} />)
};

GroceeButton.propTypes = {
	text: PropTypes.string,
	onPress: PropTypes.func,
};

GroceeButton.defaultProps = {
	text: 'Button Text',
	// eslint-disable-next-line no-console
	onPress: () => console.log('Button Pressed'),
};

export default GroceeButton;