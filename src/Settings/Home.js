import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import Meteor from 'react-native-meteor';
import { SafeAreaView } from 'react-navigation';

import { colors } from '../../config/styles';
import { List, ListItem } from 'react-native-elements';

export default class Home extends Component {

	static navigationOptions() {
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
	handleSignOut() {
		Meteor.logout();
	}

	render() {
		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
				<ScrollView>
					<List>
						<ListItem
							title="Default Inventory List"
							onPress={() => this.props.navigation.navigate('SelectInventoryList')} />
					</List>
					<List>
						<ListItem
							title="Sign Out"
							onPress={() => this.handleSignOut()}
							hideChevron />
					</List>
				</ScrollView>
			</SafeAreaView>
		);
	}
}