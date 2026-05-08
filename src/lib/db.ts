import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Resume from '@/models/Resume'

export async function GET(req: NextRequest) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const page  = Math.max(1, Number(searchParams.get('page') || 1))
  const limit = Math.min(50, Number(searchParams.get('limit') || 12))
  const q     = searchParams.get('q') || ''
  const tag   = searchParams.get('tag') || ''
  const skip  = (page - 1) * limit

  const filter: any = {}
  if (q) {
    // Support boolean syntax parsing
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { role: { $regex: q, $options: 'i' } },
      { keywords: { $elemMatch: { $regex: q, $options: 'i' } } },
    ]
  }
  if (tag) filter.keywords = { $elemMatch: { $regex: `^${tag}$`, $options: 'i' } }

  const [resumes, total] = await Promise.all([
    Resume.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Resume.countDocuments(filter),
  ])

  return NextResponse.json({ resumes, total, page, totalPages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const body = await req.json()
  const { name, role, keywords, fileUrl, fileType, publicId, notes } = body

  if (!name || !role || !fileUrl) {
    return NextResponse.json({ error: 'name, role, fileUrl are required' }, { status: 400 })
  }

  const resume = await Resume.create({
    name, role, keywords: keywords || [], fileUrl, fileType, publicId,
    notes: notes || '', uploadedBy: (session.user as any).id,
  })

  return NextResponse.json(resume, { status: 201 })
}