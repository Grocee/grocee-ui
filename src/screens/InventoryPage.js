import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { StackNavigator } from 'react-navigation';
import settings from '../../config/settings';
import Meteor, { createContainer } from 'react-native-meteor';
import Home from '../Inventory/Home';
import InventoryList from '../Inventory/InventoryList';
import CreateList from '../Inventory/CreateList';

const InventoryPage = StackNavigator(
	{
		Home: {
			screen: Home,
			path: 'inventory',
		},
		InventoryList: {
			screen: InventoryList,
			path: 'inventory/list/:listName',
		}
	}
)

const MainStack = StackNavigator(
	{
		Inventory: {
			screen: InventoryPage,
		},
		CreateList: {
			screen: CreateList,
		},
	},
	{
		mode: 'modal',
		headerMode: 'none'
	}
)

export default MainStack;