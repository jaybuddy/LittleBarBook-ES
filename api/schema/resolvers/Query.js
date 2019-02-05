const fetch = require('node-fetch');

const baseUrl = 'http://localhost:3000/api/v1';

const User = () => fetch(`${baseUrl}/user`, { method: 'GET' }).then(res => res.json());
const Drinks = () => fetch(`${baseUrl}/drinks`, { method: 'GET' }).then(res => res.json());

/**
 * Ingredient
 * The API query for the drink ingredients
 * @param {*} parent
 * @param {*} args
 */
const Ingredient = (parent, args) => {
  const { drinkId } = args;
  return fetch(`${baseUrl}/ingredients?id=${drinkId}`, { method: 'GET' }).then(res => res.json());
};

module.exports = { User, Drinks, Ingredient };
