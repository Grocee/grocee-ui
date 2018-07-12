import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import Home from '../Inventory/Home';
import InventoryList from '../Inventory/InventoryList';
import Inventory from '../Inventory/Inventory';
import { navigationOptions } from '../../config/styles';

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
		}
	},
	{
		initialRouteName: 'Home',
		navigationOptions,
		mode: 'screen'
	}
);

export default InventoryPage;