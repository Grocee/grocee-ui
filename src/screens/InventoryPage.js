import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import Home from '../Inventory/Home';
import InventoryList from '../Inventory/InventoryList';
import Inventory from '../Inventory/Inventory';
import { navigationOptions } from '../../config/styles';
import AddList from "../Inventory/AddList";

const InventoryPage = StackNavigator(
	{
		Home: {
			screen: Home,
			path: 'inventory',
		},
		InventoryList: {
			screen: InventoryList,
			path: 'inventory/list/:listName',
		},
		InventoryEdit: {
			screen: Inventory,
			path: 'inventory/:id'
		},
		AddList: {
			screen: AddList,
			path: 'inventory/addList',
		},
	},
	{
		initialRouteName: 'Home',
		navigationOptions,
		mode: 'screen'
	}
);

export default InventoryPage;