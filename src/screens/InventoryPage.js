import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { StackNavigator } from 'react-navigation';
import settings from '../../config/settings';
import Meteor, { createContainer } from 'react-native-meteor';
import Home from '../Inventory/Home';
import InventoryList from '../Inventory/InventoryList';

Meteor.connect(settings.METEOR_URL);

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

export default InventoryPage;