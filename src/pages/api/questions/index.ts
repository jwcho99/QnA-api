import { create } from 'domain'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createQuestion } from '@/apis/questions/createQuestion'
import { getQuestion } from '@/apis/questions/getQuestion'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === 'POST') {
            // createQuestion 필수 : useridx, title>=2, content>=3
            await createQuestion(req, res)
        } else if (req.method === 'GET') {
            // 질문 조회
            await getQuestion(req, res)
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
