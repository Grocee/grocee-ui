import { StyleSheet } from 'react-native';

const colors = {
	background: '#FF5252',
	tint: 'white',
	signInBackground: '#F5F2F9',
	errorText: '#FA3256',
	headerText: '#444444',
	buttonBackground: '#39BD98',
	buttonText: '#FFFFFF',
	inputBackground: '#FFFFFF',
	inputDivider: '#E4E2E5',
};

const navigationOptions = {
	headerStyle: {
		backgroundColor: colors.background
	},
	headerTintColor: colors.tint,
	headerTitleStyle: {
		color: colors.tint
	}
};

const stylesheet = StyleSheet.create({
	input: {
		fontSize: 18,
		padding: 12
	},
	rightButton: {
		padding: 5
	},
	fab: {
		position: 'absolute',
		bottom: 24,
		right: 24,
	},
	newItem: {
		backgroundColor: 'white',
		height: 40,
		padding: 4
	},
	standaloneRowFront: {
		backgroundColor: 'white',
		justifyContent: 'center',
		padding: 10,
		height: 45,
		borderWidth: 0.3,
		borderColor: '#3c3c3c'
	},
	standaloneRowBack: {
		alignItems: 'center',
		backgroundColor: 'red',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 15
	},
	backTextWhite: {
		color: '#FFF'
	},
	badge: {
		backgroundColor: 'salmon'
	}
});

export { colors, navigationOptions, stylesheet };