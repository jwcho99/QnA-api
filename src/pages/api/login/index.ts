import { PrismaClient } from '@prisma/client'
import { compare } from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import { loginUser } from '@/apis/users/loginUser'

const prisma = new PrismaClient()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === 'POST') {
            // 로그인
            await loginUser(req, res)
        } else {
            res.status(400).json({
                message: '지원하지 않는 메서드입니다.',
            })
        }
    } catch (error) {
        console.error('API 처리 중 오류 발생:', error)
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        })
    }
}

export default handler
