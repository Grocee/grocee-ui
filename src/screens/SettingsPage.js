import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, StackNavigator } from 'react-navigation';
import { colors } from '../../config/styles';
import Meteor from 'react-native-meteor';
import { Button } from 'react-native-elements';

class SettingsPage extends Component {
	
	static navigationOptions({ _navigation }) {
		return {
			headerTitle: 'Settings',
			headerStyle: {
				backgroundColor: colors.background
			},
			headerTitleStyle: {
				color: colors.tint
			},
			justifyContent: 'center',
			alignItems: 'center',
		};
	}
	_handleSignOut() {
		Meteor.logout();
	}

	render() {
		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
				<ScrollView style={{ flex: 1 }}>
					<Button 
						style={styles.button}
						title='Sign Out'
						onPress={() => this._handleSignOut()}
					/>
				</ScrollView>
			</SafeAreaView>
		);
	}
}

const SettingsStack = StackNavigator({
	Main: {
		screen: SettingsPage,
	},
});

export const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	button: {
		padding: 5
	}
});

export default SettingsStack;