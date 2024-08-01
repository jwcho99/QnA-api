import { create } from 'domain'
import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteUser } from '@/apis/users/deleteUser'
import { createUser } from '@/apis/users/createUser'
import { updateUser } from '@/apis/users/updateUser'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === 'POST') {
            // 회원가입
            await createUser(req, res)
        } else if (req.method === 'PUT') {
            // 회원정보 수정 {idx}
            await updateUser(req, res)
        } else if (req.method === 'DELETE') {
            // 회원 탈퇴 {idx}
            await deleteUser(req, res)
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
