const { makeExecutableSchema } = require('graphql-tools');
const glob = require('glob');
const path = require('path');
const fs = require('fs');

// Import Types
const typeDefs = glob.sync('**/types/*.graphql').map(filePath => fs.readFileSync(filePath, 'utf8'));
const resolverFunctions = glob.sync('**/resolvers/*.js').map(filePath => (
  { [path.basename(filePath, '.js')]: require(`./resolvers/${path.basename(filePath)}`)}
));

const resolvers = Object.assign.apply(Object, resolverFunctions);

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForNonScalar: false,
  },
});
