import express from 'express'
import {
    getAllBoards,
    getBoardById,
    createBoard,
    updateBoard,
    deleteBoard,
} from '../controllers/board.controller.js'

const router = express.Router()

router.get('/boards', getAllBoards)
router.get('/boards/:boardId', getBoardById)
router.post('/boards', createBoard)
router.put('/boards/:boardId', updateBoard)
router.delete('/boards/:boardId', deleteBoard)

export default router