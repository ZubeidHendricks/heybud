const fs = require('fs');
const path = require('path');
const db = require('../index');

async function runMigration() {
  try {
    const schema = fs.readFileSync(
      path.join(__dirname, '..', 'schema.sql'),
      'utf8'
    );
    
    await db.query(schema);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();