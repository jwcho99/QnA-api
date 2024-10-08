import { create } from 'domain'
import type { NextApiRequest, NextApiResponse } from 'next'

import { PrismaClient } from '@prisma/client'
import { createAnswer } from '@/apis/answers/createAnswer'
import { getAnswers } from '@/apis/answers/getAnswers'

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
    const questionIdx = parseInt(idxStr, 10)

    try {
        if (req.method === 'POST') {
            // 질문에 답변 작성 (body에 content, userIdx 필요)
            await createAnswer(questionIdx, req, res)
        } else if (req.method === 'GET') {
            // 답변 조회
            await getAnswers(questionIdx, res)
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
