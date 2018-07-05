import React from 'react';
import { colors } from '../../config/styles';
import { Icon } from 'react-native-elements';

const DeleteButton = () => {
	return (
		<Icon
			name='delete'
			color={colors.tint}
			size={24}
			underlayColor='transparent'
		/>
	)
};

export default DeleteButton;