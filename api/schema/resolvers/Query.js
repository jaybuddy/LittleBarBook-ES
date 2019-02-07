const fetch = require('node-fetch');

const baseUrl = 'http://localhost:3000/api/v1';

const User = (parent, args, context) => {
  return fetch(`${baseUrl}/user`, {
    method: 'GET',
    headers: {
      token: context.token,
    },
  }).then(res => res.json());
};

const Drinks = (parent, args, context) => {
  return fetch(`${baseUrl}/drinks`, {
    method: 'GET',
    headers: {
      token: context.token,
    },
  }).then(res => res.json());
};

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
