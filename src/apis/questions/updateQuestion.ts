import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const updateQuestion = async (
    questionIdx: number,
    req: NextApiRequest,
    res: NextApiResponse
) => {
    // questionIdx에 해당하는 질문의 제목과 내용 수정
    try {
        if (!req.body.title || !req.body.content) {
            return res.status(400).json({
                message: '제목, 내용이 필요합니다.',
            })
        }
        // questionIdx에 해당하는 질문에 하나이상의 답변이 달려있는지 확인
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
        if (question.Answer.length > 0) {
            return res.status(400).json({
                message: '이미 답변이 달린 질문은 수정할 수 없습니다.',
            })
        }

        await prisma.question.update({
            where: {
                idx: questionIdx,
            },
            data: {
                title: req.body.title,
                content: req.body.content,
            },
        })

        return res.status(200).json({ status: '질문 수정에 성공했습니다.' })
    } catch (error) {
        console.error('질문 조회 중 오류 발생:', error)
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' })
    }
}
