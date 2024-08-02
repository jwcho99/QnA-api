import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
const prisma = new PrismaClient()

export const likeQuestion = async (
    questionIdx: number,
    res: NextApiResponse
) => {
    try {
        const question = await prisma.question.findUnique({
            where: {
                idx: questionIdx,
            },
        })
        if (!question) {
            return res
                .status(404)
                .json({ message: '해당하는 질문이 없습니다.' })
        }

        await prisma.question.update({
            where: {
                idx: questionIdx,
            },
            data: {
                like: {
                    increment: 1,
                },
            },
        })
        return res.status(200).json({ status: '질문 좋아요에 성공했습니다.' })
    } catch (error) {
        console.error('질문 조회 중 오류 발생:', error)
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' })
    }
}
