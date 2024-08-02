import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
const prisma = new PrismaClient()

export const getAnswers = async (questionIdx: number, res: NextApiResponse) => {
    try {
        const question = await prisma.answer.findUnique({
            where: {
                idx: questionIdx,
            },
        })
        if (!question) {
            return res
                .status(404)
                .json({ message: '해당하는 질문이 없습니다.' })
        }
        // 해당 질문에 대한 답변들 조회
        const answers = await prisma.answer.findMany({
            where: {
                questionIdx,
            },
        })
        if (answers.length === 0) {
            return res
                .status(404)
                .json({ message: '해당하는 답변이 없습니다.' })
        }
        return res
            .status(200)
            .json({ answers, status: '답변 조회에 성공했습니다.' })
    } catch (error) {
        console.error('질문 조회 중 오류 발생:', error)
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' })
    }
}
