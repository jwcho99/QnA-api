import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
const prisma = new PrismaClient()

export const deleteAnswer = async (answerIdx: number, res: NextApiResponse) => {
    try {
        const answer = await prisma.answer.findUnique({
            where: {
                idx: answerIdx,
            },
        })
        if (!answer) {
            return res
                .status(404)
                .json({ message: '해당하는 답변이 없습니다.' })
        }
        await prisma.answer.delete({
            where: {
                idx: answerIdx,
            },
        })
        return res.status(200).json({ status: '답변 삭제에 성공했습니다.' })
    } catch (error) {
        console.error('질문 조회 중 오류 발생:', error)
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' })
    }
}
