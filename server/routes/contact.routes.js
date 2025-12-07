import { Router } from 'express';
import { getAllContacts, getContactForDmList, searchContact } from '../controllers/Contact.Controller.js';
import { verifyToken } from '../Middleware/Auth.Middleware.js';
const contactRoutes = Router();

contactRoutes.post('/search',verifyToken, searchContact);
contactRoutes.get('/get-contacts-for-dm', verifyToken,getContactForDmList)
contactRoutes.get('/get-all-contacts', verifyToken,getAllContacts)

export default contactRoutes;