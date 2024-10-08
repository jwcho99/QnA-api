import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const updateUser = async (
    userIdx: number,
    req: NextApiRequest,
    res: NextApiResponse
) => {
    if (!req.body.nickname || !req.body.password) {
        return res
            .status(400)
            .json({ message: '닉네임, 비밀번호가 필요합니다.' })
    }
    try {
        const updatedUser = await prisma.user.update({
            where: {
                idx: userIdx,
            },
            data: {
                nickname: req.body.nickname,
                password: req.body.password,
            },
        })
        return res.status(200).json({
            status: '업데이트 성공',
            idx: updatedUser.idx,
        })
    } catch (error) {
        console.error('사용자 수정 중 오류 발생:', error)
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' })
    }
}
