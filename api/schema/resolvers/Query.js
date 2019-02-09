const fetch = require('node-fetch');

const baseUrl = 'http://localhost:3000/api/v1';


const User = (parent, args, context) => fetch(`${baseUrl}/user`, {
  method: 'GET',
  headers: {
    authorization: context.authorization,
  },
}).then(res => res.json());

const Drinks = (parent, args, context) => fetch(`${baseUrl}/drinks`, {
  method: 'GET',
  headers: {
    authorization: context.authorization,
  },
}).then(res => res.json());

/**
 * Ingredient
 * The API query for the drink ingredients
 * @param {*} parent
 * @param {*} args
 */
const Ingredients = (parent, args, context) => {
  const { drinkId } = args;
  return fetch(`${baseUrl}/ingredients?id=${drinkId}`, {
    method: 'GET',
    headers: {
      authorization: context.authorization,
    },
  }).then(res => res.json());
};

module.exports = { User, Drinks, Ingredients };
