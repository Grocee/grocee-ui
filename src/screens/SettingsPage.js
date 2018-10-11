import React from 'react';
import { StackNavigator } from 'react-navigation';
import { navigationOptions } from "../../config/styles";
import Home from '../Settings/Home';
import SelectInventoryList from '../Settings/SelectInventoryList';
import Account from '../Settings/Account';

const SettingsPage = StackNavigator(
	{
		Home: {
			screen: Home,
			path: 'settings'
		},
		SelectInventoryList: {
			screen: SelectInventoryList,
			path: 'selectInventoryList'
		},
		Account: {
			screen: Account,
			path: 'account'
		},

	},
	{
		initialRouteName: 'Home',
		navigationOptions,
		mode: 'screen'
	}
);

export default SettingsPage;