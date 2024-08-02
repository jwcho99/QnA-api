import { create } from 'domain'
import type { NextApiRequest, NextApiResponse } from 'next'
import { likeAnswer } from '@/apis/answers/likeAnswer'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { idx } = req.query
    const idxStr = Array.isArray(idx) ? idx[0] : idx
    if (
        !idxStr ||
        isNaN(parseInt(idxStr, 10)) ||
        parseInt(idxStr, 10).toString() !== idxStr
    ) {
        return res.status(400).json({ message: '유효하지 않은 idx입니다.' })
    }
    const answerIdx = parseInt(idxStr, 10)

    try {
        if (req.method === 'POST') {
            // 답변 좋아요
            await likeAnswer(answerIdx, res)
        } else {
            res.status(400).json({
                message: '지원하지 않는 메서드입니다.',
            })
        }
    } catch (error) {
        console.error('API 처리 중 오류 발생:', error)
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        })
    }
}

export default handler
