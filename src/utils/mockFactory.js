// src/utils/mockFactory.js
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const DEFAULT_PASSWORD = 'coder123';
const SALT_ROUNDS = 10;

export async function generateMockUsers(count) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
    const role = faker.helpers.arrayElement(['user', 'admin']);
    users.push({
      _id: faker.database.mongodbObjectId(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordHash,
      role,
      pets: []
    });
  }
  return users;
}

export async function generateMockPets(count) {
  const pets = [];
  for (let i = 0; i < count; i++) {
    pets.push({
      _id: faker.database.mongodbObjectId(),
      name: faker.animal.dog(),
      type: faker.animal.type()
    });
  }
  return pets;
}


// src/routes/mocks.router.js
import { Router } from 'express';
import { generateMockUsers, generateMockPets } from '../utils/mockFactory.js';
import userModel from '../models/userModel.js';
import petModel from '../models/petModel.js';

const router = Router();

// Migrate /mockingpets endpoint
router.get('/mockingpets', async (req, res, next) => {
  try {
    const pets = await generateMockPets(20);
    res.json(pets);
  } catch (err) {
    next(err);
  }
});

// GET /mockingusers?count=50
router.get('/mockingusers', async (req, res, next) => {
  try {
    const count = parseInt(req.query.count) || 50;
    const users = await generateMockUsers(count);
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// POST /generateData { users: number, pets: number }
router.post('/generateData', async (req, res, next) => {
  try {
    const { users: uCount = 0, pets: pCount = 0 } = req.body;
    // Generate mock data
    const [users, pets] = await Promise.all([
      generateMockUsers(uCount),
      generateMockPets(pCount)
    ]);
    // Insert into DB
    const insertedUsers = await userModel.insertMany(users);
    const insertedPets = await petModel.insertMany(pets);
    res.json({ insertedUsers, insertedPets });
  } catch (err) {
    next(err);
  }
});

export default router;
