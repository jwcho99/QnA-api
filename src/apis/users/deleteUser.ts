import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const deleteUser = async (userIdx: number, res: NextApiResponse) => {
    // 회원 삭제 및 회원이 작성한 질문, 답변, 댓글 삭제
    try {
        // 1. 사용자의 답변 삭제
        await prisma.answer.deleteMany({
            where: {
                userIdx: userIdx,
            },
        })
        // 2. 사용자가 올린 질문들에 대한 답변 삭제
        const userQuestions = await prisma.question.findMany({
            where: {
                userIdx: userIdx,
            },
            select: { idx: true },
        })
        const questionIdxs = userQuestions.map((question) => question.idx)
        await prisma.answer.deleteMany({
            where: {
                questionIdx: {
                    in: questionIdxs,
                },
            },
        })

        // 3. 사용자의 질문 삭제
        await prisma.question.deleteMany({
            where: {
                userIdx: userIdx,
            },
        })
        // 4. 사용자 삭제
        await prisma.user.delete({
            where: {
                idx: userIdx,
            },
        })
        return res.status(200).json({ status: '사용자 삭제에 성공했습니다.' })
    } catch (error) {
        console.error('사용자 삭제 중 오류 발생:', error)
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' })
    }
}
