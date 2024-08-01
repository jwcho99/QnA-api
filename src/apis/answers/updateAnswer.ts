import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
const prisma = new PrismaClient()

export const updateAnswer = async (
    answerIdx: number,
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        if (!req.body.content) {
            return res.status(400).json({ message: '변경 내용이 필요합니다' })
        }
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
        await prisma.answer.update({
            where: {
                idx: answerIdx,
            },
            data: {
                content: req.body.content,
            },
        })
        return res.status(200).json({ status: '답변 수정에 성공했습니다.' })
    } catch (error) {
        console.error('질문 조회 중 오류 발생:', error)
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' })
    }
}
