import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Meteor from 'react-native-meteor';

import { List, ListItem } from 'react-native-elements';

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

	static navigationOptions() {
		return {
			headerTitle: 'Default Inventory List'
		};
	}

	setDefaultList(listId) {
		Meteor.call('inventorylists.setDefault', listId);
		this.props.navigation.goBack();
	}

	render() {

		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
				<List>
					{this.state.lists.map((list) => 
						<ListItem
							title={list.name}
							onPress={() => this.setDefaultList(list._id)}
							key={list._id}
							rightIcon={list.isDefault 
								? {name: 'done'} 
								: {}} />
					)}
				</List>
			</SafeAreaView>
		);
	}
}