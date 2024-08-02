import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const createQuestion = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    // 제목을 2글자 이상, 내용은 3글자 이상이고 userIdx가 존재하는지 확인
    try {
        if (!req.body.title || !req.body.content || !req.body.userIdx) {
            return res.status(400).json({
                message: '제목, 내용, 사용자 정보가 필요합니다.',
            })
        } else if (req.body.title.length < 2 || req.body.content.length < 3) {
            return res.status(400).json({
                message: '제목은 2글자 이상, 내용은 3글자 이상이어야 합니다.',
            })
        }
        const question = await prisma.question.create({
            data: {
                title: req.body.title,
                content: req.body.content,
                userIdx: req.body.userIdx,
            },
        })
        return res
            .status(200)
            .json({ status: '질문 생성 성공!', idx: question.idx })
    } catch (error) {
        console.error('질문 생성 중 오류 발생:', error)
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' })
    }
}
