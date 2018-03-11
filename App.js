import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from 'react-native';
import Meteor, { createContainer } from 'react-native-meteor';
import SignIn from './screens/SignIn';
import { 
	TabNavigator,
	TabBarBottom
} from 'react-navigation';
import settings from './config/settings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RecipePage from './screens/RecipePage';
import InventoryPage from './screens/InventoryPage';
import Button from './components/Button';

Meteor.connect(settings.METEOR_URL);

const App = (props) => {
	const { status, user, loggingIn } = props;

	const data = {
		recipes: props.recipes,
		inventories: props.inventories,
	}
	
	if (!status.connected || loggingIn) {
		return <Text>Loading...</Text>;
	} else if (user !== null) {
		return <RootStack screenProps={data}/>;
	}
	return <SignIn />;	
};

export default createContainer(() => {
	Meteor.subscribe('recipes');
	Meteor.subscribe('inventories');
	return {
		status: Meteor.status(),
		user: Meteor.user(),
		loggingIn: Meteor.loggingIn(),
		recipes: Meteor.collection('recipes').find(),
		inventories: Meteor.collection('inventories').find(),
	};
}, App);

class HomePage extends Component {

	_handleSignOut = () => {
		Meteor.logout();
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					Welcome to Grocee!
				</Text>
				<Button text='Sign Out' onPress={this._handleSignOut} />
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
		navigationOptions: ({ navigation }) => ({
			tabBarIcon: ({ focused, tintColor }) => {
				const { routeName } = navigation.state;
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
		}),
		tabBarOptions: {
			activeTintColor: 'tomato',
			inactiveTintColor: 'gray',
		},
		tabBarComponent: TabBarBottom,
		tabBarPosition: 'bottom',
		animationEnabled: false,
		swipeEnabled: false,
	}
);

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
