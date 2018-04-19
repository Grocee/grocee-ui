import { SafeAreaView, StackNavigator } from 'react-navigation';
import Meteor from 'react-native-meteor';

import Home from '../Grocery/Home';
import AddList from '../Grocery/AddList';
import GroceryList from '../Grocery/GroceryList';

const GroceryPage = StackNavigator(
	{
		Home: {
			screen: Home,
			path: 'grocery',
			navigationOptions: ({ _navigation }) => ({
				title: 'Groceries'
			})
		},
		AddList: {
			screen: AddList,
			path: 'grocery/addList',
			mode: 'modal'
		},
		GroceryList: {
			screen: GroceryList,
			path: 'grocery/list/:listName',
			navigationOptions: ({ _navigation }) => ({
				title: 'Grocery List',
			})
		}
	},
	{
		initialRouteName: 'Home'
	}
);

export default GroceryPage;