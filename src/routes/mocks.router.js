import { Router } from 'express';
import { faker } from '@faker-js/faker';

const router = Router();

// GET /mockingpets - Generates random pet data
router.get('/mockingpets', (req, res) => {
    const pets = Array.from({ length: 100 }, () => ({
        name: faker.animal.dog(),
        specie: faker.helpers.arrayElement(['dog', 'cat', 'bird', 'hamster']),
        birthDate: faker.date.past(),
        adopted: faker.datatype.boolean(),
        owner: faker.person.fullName(),
        image: faker.image.url()
    }));
    
    res.json({ status: 'success', payload: pets });
});

// GET /mockingusers - Generates random user data with count parameter
router.get('/mockingusers', (req, res) => {
    const count = parseInt(req.query.count) || 100;
    
    const users = Array.from({ length: count }, () => ({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: faker.helpers.arrayElement(['user', 'admin', 'premium']),
        pets: []
    }));
    
    res.json({ status: 'success', payload: users });
});

// POST /generateData - Generates both users and pets data
router.post('/generateData', (req, res) => {
    const usersCount = 50;
    const petsCount = 100;
    
    const users = Array.from({ length: usersCount }, () => ({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: faker.helpers.arrayElement(['user', 'admin', 'premium'])
    }));
    
    const pets = Array.from({ length: petsCount }, () => ({
        name: faker.animal.dog(),
        specie: faker.helpers.arrayElement(['dog', 'cat', 'bird', 'hamster']),
        birthDate: faker.date.past(),
        adopted: faker.datatype.boolean(),
        owner: faker.helpers.arrayElement(users).email,
        image: faker.image.url()
    }));
    
    res.json({
        status: 'success',
        payload: {
            users,
            pets
        }
    });
});

export default router;