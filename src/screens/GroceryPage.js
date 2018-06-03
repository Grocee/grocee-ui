import { StackNavigator } from 'react-navigation';

import { navigationOptions } from '../../config/styles';

import Home from '../Grocery/Home';
import AddList from '../Grocery/AddList';
import GroceryList from '../Grocery/GroceryList';
import AddGrocery from '../Grocery/AddGrocery';

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
		},
		AddGrocery: {
			screen: AddGrocery,
			path: 'grocery/list/add',
			mode: 'modal' // why doesn't this work?
		}
	},
	{
		initialRouteName: 'Home',
		navigationOptions,
		mode: 'screen' 
	}
);

export default GroceryPage;