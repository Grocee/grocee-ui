import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  FlatList,
  Text,
  TextInput,
  Linking,
  ScrollView
} from 'react-native';
import { SafeAreaView, StackNavigator } from 'react-navigation';
import settings from '../../config/settings';
import Meteor, { createContainer } from 'react-native-meteor';
import Button from '../components/Button';

Meteor.connect(settings.METEOR_URL);

class SettingsPage extends Component {
	
	_handleSignOut() {
		Meteor.logout();
	}

	render() {
		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
				<ScrollView style={{ flex: 1}}>
					<Button text='Sign Out' onPress={() => this._handleSignOut()}/>
				</ScrollView>
			</SafeAreaView>
		);
	}
};

SettingsPage.navigationOptions = props => {
	return {
		headerTitle: 'Settings',
		justifyContent: 'center',
		alignItems: 'center',
	};
};

const SettingsStack = StackNavigator({
	Main: {
		screen: SettingsPage,
	},
});

export const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default SettingsStack;