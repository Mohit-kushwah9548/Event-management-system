// Initialize MongoDB database and user
db = db.getSiblingDB('admin');

// Check if glau_admin user exists, if not create it
db.createUser({
  user: 'glau_admin',
  pwd: 'MySecurePass123',
  roles: [
    { role: 'root', db: 'admin' }
  ]
});

// Switch to glau-event database
db = db.getSiblingDB('glau-event');

// Create collections
db.createCollection('users');
db.createCollection('events');
db.createCollection('orders');

console.log('✅ MongoDB initialized: Database and collections created');
