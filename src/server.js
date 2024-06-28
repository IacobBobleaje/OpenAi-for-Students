import OpenAI from 'openai';
import path from 'path';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Enable All CORS Requests
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());
// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname)));

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBw9AB4HQRclx88rL5vUheQRkWThgSpVt0",
    authDomain: "edubuddyai.firebaseapp.com",
    projectId: "edubuddyai",
    storageBucket: "edubuddyai.appspot.com",
    messagingSenderId: "635464961692",
    appId: "1:635464961692:web:ea70f15b6b012c2ae3e759",
    measurementId: "G-RR5W8KGG7M"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// OpenAI configuration
const openai = new OpenAI({
    apiKey: 'sk-proj-BnaG7Wj7DdTgB7TiifCUT3BlbkFJWDFOWuM1ueZ1lJvFrHQe',
});

// Endpoint to handle POST requests for OpenAI API
app.post('/api/getResponse', async (req, res) => {
    const { query } = req.body;
    try {
        const chatResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: query }
            ],
        });
        res.json({ answer: chatResponse.choices[0].message.content });
    } catch (error) {
        console.error('Error from OpenAI: ', error);
        res.status(500).send('Failed to fetch response from OpenAI');
    }
});

// Endpoint for user signup
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        res.status(201).json({ message: 'User signed up successfully', user: userCredential.user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to sign up', error: error.message });
    }
});

// Endpoint for user login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        res.status(200).json({ message: 'User logged in successfully', user: userCredential.user });
    } catch (error) {
        res.status(401).json({ message: 'Failed to log in', error: error.message });
    }
});


// Endpoint for Firebase Firestore
app.post('/api/contact', async (req, res) => {
    const { Name, Phone, Email, Message } = req.body;
    try {
        const docRef = await addDoc(collection(db, "Details"), {
            Name,
            Phone,
            Email,
            Message
        });
        res.status(201).json({ message: 'Contact details submitted successfully', id: docRef.id });
    } catch (error) {
        res.status(500).json({ message: 'Failed to submit contact details', error: error.message });
    }
});

// Define a route to serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
