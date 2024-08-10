import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
    const { nickname, password } = req.body
    if (!nickname || !password) {
        return res
            .status(400)
            .json({ message: '닉네임, 비밀번호이 필요합니다.' })
    }

    const hashedPassword = await hash(password, 10)
    const users = await prisma.user.create({
        data: {
            nickname: nickname,
            password: hashedPassword,
        },
    })

    res.status(200).json({ status: 'success', idx: users.idx })
}
