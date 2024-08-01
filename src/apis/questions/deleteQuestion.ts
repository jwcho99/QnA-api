import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const deleteQuestion = async (
    questionIdx: number,
    res: NextApiResponse
) => {
    // questionIdx에 해당하는 질문 삭제
    try {
        // questionIdx에 해당하는 질문에 하나이상의 답변이 달려있는지 확인하고 삭제
        const question = await prisma.question.findUnique({
            where: {
                idx: questionIdx,
            },
            include: {
                Answer: {
                    select: {
                        idx: true,
                    },
                },
            },
        })
        if (!question) {
            return res
                .status(404)
                .json({ message: '해당하는 질문이 없습니다.' })
        }
        question.Answer.forEach(async (answer) => {
            await prisma.answer.delete({
                where: {
                    idx: answer.idx,
                },
            })
        })
        await prisma.question.delete({
            where: {
                idx: questionIdx,
            },
        })
        return res.status(200).json({ status: '질문 삭제에 성공했습니다.' })
    } catch (error) {
        console.error('질문 조회 중 오류 발생:', error)
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' })
    }
}
