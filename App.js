import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from 'react-native';
import Meteor, { createContainer } from 'react-native-meteor';
import { 
	TabNavigator,
	TabBarBottom
} from 'react-navigation';
import settings from './config/settings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RecipePage from './screens/RecipePage';

Meteor.connect(settings.METEOR_URL);

const App = (props) => {
	const { status, user, loggingIn, recipes } = props;
	
	// if (!status.connected || loggingIn) {
	// 	console.log('Loading...');
	// 	return <Text>Loading...</Text>;
	// } else if (user !== null) {
	// 	console.log('User is logged in: ' + user.username);
	// 	return <RootStack />;
	// }
	// console.log('Not logged in. Need to login...')
	// return <Text>LOGIN NOW!</Text>;
	return <RootStack screenProps={recipes}/>;
};

export default createContainer(() => {
	Meteor.subscribe('recipes');
	return {
		status: Meteor.status(),
		user: Meteor.user(),
		loggingIn: Meteor.loggingIn(),
		recipes: Meteor.collection('recipes').find(),
	};
}, App);

class HomePage extends Component {
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

class GroceryPage extends Component {
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

class InventoryPage extends Component {
	
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
