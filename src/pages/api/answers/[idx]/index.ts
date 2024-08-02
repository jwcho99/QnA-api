import { create } from 'domain'
import type { NextApiRequest, NextApiResponse } from 'next'
import { updateAnswer } from '@/apis/answers/updateAnswer'
import { deleteAnswer } from '@/apis/answers/deleteAnswer'

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
        if (req.method === 'PUT') {
            // 답변 수정
            await updateAnswer(answerIdx, req, res)
        } else if (req.method === 'DELETE') {
            // 답변 삭제
            await deleteAnswer(answerIdx, res)
        }
    } catch (error) {
        console.error('API 처리 중 오류 발생:', error)
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        })
    }
}

export default handler
