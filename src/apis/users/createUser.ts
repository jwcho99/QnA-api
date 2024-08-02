import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.body.nickname || !req.body.password) {
        return res
            .status(400)
            .json({ message: '닉네임, 비밀번호이 필요합니다.' })
    }
    const users = await prisma.user.create({
        data: {
            nickname: req.body.nickname,
            password: req.body.password,
        },
    })
    res.status(200).json({ status: 'success', idx: users.idx })
}
