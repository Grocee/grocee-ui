import { SafeAreaView, StackNavigator } from 'react-navigation';
import Meteor from 'react-native-meteor';

import Home from '../Grocery/Home';
import AddList from '../Grocery/AddList';
import List from '../Grocery/List';

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
			mode: 'modal',
			navigationOptions: ({ _navigation }) => ({
				title: 'Add Grocery List'
			})
		},
		List: {
			screen: List,
			path: 'grocery/list/:listName',
			navigationOptions: ({ _navigation }) => ({
				title: 'Grocery List',
			})
		}
	},
	{
		initialRouteName: 'List'
	}
);

export default GroceryPage;