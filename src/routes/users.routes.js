import express from 'express'
import {
    getAllUsers,
    getUserById,
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
} from '../controllers/user.controller.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)

router.get('/users', getAllUsers)
router.get('/users/:userId', getUserById)
router.put('/users/:userId', updateUser)
router.delete('/users/:userId', deleteUser)

export default router