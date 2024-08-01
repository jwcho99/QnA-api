import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const getQuestion = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    // 존재하는 모든 질문들을 가져오기
    try {
        const questions = await prisma.question.findMany()
        return res.status(200).json({ status: 'success', questions })
    } catch (error) {
        console.error('질문 조회 중 오류 발생:', error)
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' })
    }
}
