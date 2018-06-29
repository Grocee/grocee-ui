import React from 'react';
import { colors } from '../../config/styles';
import { Icon } from 'react-native-elements';

const EditButton = () => {
	return (
		<Icon
			name='edit'
			color={colors.tint}
			size={24}
			underlayColor='transparent'
		/>
	)
};

export default EditButton;