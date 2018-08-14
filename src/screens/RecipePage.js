import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import Home from '../Recipe/Home';
import Recipe from '../Recipe/Recipe';
import { navigationOptions } from '../../config/styles';

const RecipePage = StackNavigator(
	{
		Home: {
			screen: Home,
			path: 'recipe',
		},
		Recipe: {
			screen: Recipe,
			path: 'recipe/:id'
		}
	},
	{
		initialRouteName: 'Home',
		navigationOptions,
		mode: 'screen'
	}
);

export default RecipePage;