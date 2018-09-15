import React, { Component } from 'react';
import { colors, stylesheet } from '../../config/styles';
import { StyleSheet } from 'react-native';
import Meteor from 'react-native-meteor';
import { SafeAreaView } from 'react-navigation';
import TableView from 'react-native-tableview'
const { Section, Item } = TableView;

export default class Home extends Component {

	static navigationOptions({ navigation }) {
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
				<TableView
					style={{ flex: 1 }}
					tableViewStyle={TableView.Consts.Style.Grouped}
					tableViewCellStyle={TableView.Consts.CellStyle.Default}>
					<Section label="General">
						<Item
							accessoryType={TableView.Consts.AccessoryType.DisclosureIndicator}
							onPress={() => this.props.navigation.navigate('SelectInventoryList')}>
							Default Inventory List
						</Item>
					</Section>
					<Section>
						<Item
							onPress={() => this.handleSignOut()}
							style={stylesheet.signOutText}>
							Sign Out
						</Item>
					</Section>
				</TableView>
			</SafeAreaView>
		);
	}
}