import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
const prisma = new PrismaClient()

export const createAnswer = async (
    questionIdx: number,
    req: NextApiRequest,
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
        // 해당 질문에 답변 작성 (body에 content, userIdx 필요)
        if (!req.body.content || !req.body.userIdx) {
            return res
                .status(400)
                .json({ message: '내용과 사용자 정보가 필요합니다.' })
        }
        await prisma.answer.create({
            data: {
                content: req.body.content,
                userIdx: req.body.userIdx,
                questionIdx: questionIdx,
            },
        })
        return res.status(200).json({ status: '답변 생성에 성공했습니다.' })
    } catch (error) {
        console.error('답변 중 오류 발생:', error)
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' })
    }
}
