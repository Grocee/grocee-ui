import { SafeAreaView, StackNavigator } from 'react-navigation';
import Meteor from 'react-native-meteor';

import Home from '../Grocery/Home';
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
		List: {
			screen: List,
			path: 'grocery/list/:listName',
			navigationOptions: ({ _navigation }) => ({
				title: 'Groceries',
			})
		}
	}
);

export default GroceryPage;