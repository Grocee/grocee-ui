import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Meteor from 'react-native-meteor';
import TableView from 'react-native-tableview'
const { Section, Item } = TableView;

export default class SelectInventoryList extends Component {

	constructor(props) {
		super(props);

		const defaultLists = this.props.screenProps.inventoryLists.filter(list => list.isDefault);

		let defaultList;
		if (defaultLists.length < 1) {
			defaultList = this.props.screenProps.inventoryLists[0];
		} else {
			defaultList = defaultLists[0];
		}

		this.state = {
			lists: this.props.screenProps.inventoryLists,
			defaultList
		};

	}

	static navigationOptions({ navigation }) {
		return {
			headerTitle: 'Select Inventory List'
		};
	}

	setDefaultList(item) {
		const inventoryList = this.state.lists[item.selectedIndex];
		Meteor.call('inventorylists.setDefault', inventoryList._id);
		this.props.navigation.goBack();
	}

	render() {

		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
				<TableView
					style={{ flex: 1 }}
					tableViewStyle={TableView.Consts.Style.Grouped}
					tableViewCellStyle={TableView.Consts.CellStyle.Default}>
					<Section>
						{this.state.lists.map(list =>
							<Item
								onPress={(item) => this.setDefaultList(item)}
								key={list._id}
								accessoryType={list.isDefault
									? TableView.Consts.AccessoryType.Checkmark
									: TableView.Consts.AccessoryType.None}>
								{list.name}
							</Item>
						)}
					</Section>
				</TableView>
			</SafeAreaView>
		);
	}
}