import { SafeAreaView, StackNavigator } from 'react-navigation';
import Meteor from 'react-native-meteor';

import { navigationOptions } from '../../config/styles';

import Home from '../Grocery/Home';
import AddList from '../Grocery/AddList';
import GroceryList from '../Grocery/GroceryList';

const GroceryPage = StackNavigator(
	{
		Home: {
			screen: Home,
			path: 'grocery'
		},
		AddList: {
			screen: AddList,
			path: 'grocery/addList',
			mode: 'modal' // why doesn't this work?
		},
		GroceryList: {
			screen: GroceryList,
			path: 'grocery/list/:id'
		}
	},
	{
		initialRouteName: 'Home',
		navigationOptions,
		mode: 'screen' 
	}
);

export default GroceryPage;