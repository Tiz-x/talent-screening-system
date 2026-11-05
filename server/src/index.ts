import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is missing');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

// A basic route so you don't see "Cannot GET /"
app.get('/', (req, res) => {
  res.send('Talent Screening API is running smoothly!');
});

// REGISTER ENDPOINT
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role, // 'APPLICANT' or 'EMPLOYER'
      },
    });

    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});