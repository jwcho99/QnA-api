import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

/**
 * @swagger
 * /api/user:
 *   post:
 *     description: 회원가입
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 사용자 이메일 주소
 *               password:
 *                 type: string
 *                 description: 사용자 비밀번호 (최소 6자)
 *     responses:
 *       200:
 *         description: 회원가입 완료!
 *       400:
 *         description: 회원가입 에러
 */

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
