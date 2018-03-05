import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Meteor from 'react-native-meteor';
import { 
	TabNavigator,
	TabBarBottom
} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SERVER_URL = 'ws://localhost:3000/websocket';

type Props = {};
export default class App extends Component<Props> {

  componentWillMount() {
	Meteor.connect(SERVER_URL);
  }

  render() {
	  return (<RootStack />);
  }
}

class HomePage extends Component<Props> {
	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					Welcome to Grocee!
				</Text>
			</View>
		);
	}
}

class GroceryPage extends Component<Props> {
	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					Grocery Page
				</Text>
			</View>
		);
	}
}

class RecipePage extends Component<Props> {
	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					Recipe Page
				</Text>
			</View>
		);
	}
}

class InventoryPage extends Component<Props> {
	
	_handleAddInventory() {
		Meteor.call('inventories.insert', 'inventory item', '1 item');
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					Inventory Page
				</Text>
				<TouchableOpacity style={styles.button} onPress={this._handleAddInventory}>
		  			<Text>Test Add Inventory</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const RootStack = TabNavigator(
	{
		Home: {
			screen: HomePage
		},
		Grocery: {
			screen: GroceryPage
		},
		Recipe: {
			screen: RecipePage
		},
		Inventory: {
			screen: InventoryPage
		}
	},
	{
		navigationOptions: ({ navigation }) => {
			tabBarIcon: ({ focused, tintColor }) => {
				const { routeName } = navigation.store;
				let iconName;
				if (routeName === 'Home') {
					iconName = 'home';
				} else if (routeName === 'Grocery') {
					iconName = 'local-grocery-store';
				} else if (routeName === 'Recipe') {
					iconName = 'bookmarks';
				} else if (routeName === 'Inventory') {
					iconName = 'kitchen';
				}

				return (<Ionicons name={iconName} size={25} color={tintColor}/>);
			}
		},
		tabBarOptions: {
			activeTintColor: 'tomato',
			inactiveTintColor: 'gray'
		},
		tabBarComponent: TabBarBottom,
		tabBarPOsition: 'bottom',
		animationEnabled: false,
		swipeEnabled: false
	}
)

const styles = StyleSheet.create({
  container: {
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: '#F5FCFF',
  },
  welcome: {
	fontSize: 20,
	textAlign: 'center',
	margin: 10,
  },
  instructions: {
	textAlign: 'center',
	color: '#333333',
	marginBottom: 5,
  },
  button: {
	padding: 10,
	backgroundColor: '#c5c5c5',
  },
});
