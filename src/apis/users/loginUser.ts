import { PrismaClient } from '@prisma/client'
import { compare } from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import { withSwagger } from 'next-swagger-doc'
import { sign, verify } from 'jsonwebtoken'

const prisma = new PrismaClient()

export const loginUser = async (req: NextApiRequest, res: NextApiResponse) => {
    const { nickname, password } = req.body
    if (!nickname || !password) {
        return res
            .status(400)
            .json({ message: '닉네임, 비밀번호이 필요합니다.' })
    }
    const user = await prisma.user.findFirst({
        where: {
            nickname,
        },
    })
    if (user === null) {
        return res
            .status(400)
            .json({ message: '닉네임에 해당하는 유저가 없습니다.' })
    }
    const hashedPassword = user.password
    const isCollect = await compare(password, hashedPassword)
    if (isCollect !== true) {
        return res
            .status(400)
            .json({ message: '비밀번호가 일치하지 않습니다.' })
    }

    const payload = {
        nickname: user.nickname,
        idx: user.idx,
        createAt: user.createdAt,
        updateAt: user.updatedAt,
    }
    const token = await sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: '1h',
    })
    res.status(200).json({ status: 'success', token })
}
