import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import Meteor from 'react-native-meteor';
import { SafeAreaView } from 'react-navigation';

import { colors } from '../../config/styles';
import { List, ListItem } from 'react-native-elements';

export default class Home extends Component {

	constructor(props) {
		super(props);

		let email = ''

		if (this.props.screenProps.user.emails.length > 0) {
			email = this.props.screenProps.user.emails[0].address
		}

		this.state = { email }
	}

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

	render() {
		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
				<ScrollView>
					<List>
						<ListItem
							title="Account"
							subtitle={this.state.email}
							onPress={() => this.props.navigation.navigate('Account')} />
						<ListItem
							title="Default Inventory List"
							onPress={() => this.props.navigation.navigate('SelectInventoryList')} />
					</List>
				</ScrollView>
			</SafeAreaView>
		);
	}
}