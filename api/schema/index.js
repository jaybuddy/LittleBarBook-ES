const glob = require('glob');
const path = require('path');
const fs = require('fs');

// Import Types
const typeDefinitions = glob.sync('**/types/*.graphql').map(filePath => fs.readFileSync(filePath, 'utf8'));
