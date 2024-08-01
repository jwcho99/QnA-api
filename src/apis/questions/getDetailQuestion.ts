import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const getDetailQuestion = async (
    questionIdx: number,
    res: NextApiResponse
) => {
    // QuestionIdx 에 해당하는 질문과 답변들을 가져오기
    try {
        const questionWithAnswers = await prisma.question.findUnique({
            where: {
                idx: questionIdx,
            },
            include: {
                whichuser: {
                    select: {
                        nickname: true,
                    },
                },
                Answer: {
                    include: {
                        whichuser: {
                            select: {
                                nickname: true,
                            },
                        },
                    },
                    // 답변들을 생성일 기준으로 정렬
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        })
        if (!questionWithAnswers) {
            return res
                .status(404)
                .json({ message: '해당하는 질문이 없습니다.' })
        }
        return res.status(200).json({
            question: {
                ...questionWithAnswers,
            },
            answers: questionWithAnswers.Answer.map((answer) => ({
                user: answer.whichuser.nickname,
                content: answer.content,
                like: answer.like,
                createdAt: answer.createdAt,
                updatedAt: answer.updatedAt,
            })),
        })
    } catch (error) {
        console.error('질문 조회 중 오류 발생:', error)
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' })
    }
}
