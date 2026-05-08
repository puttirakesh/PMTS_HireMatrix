import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Resume from '../models/Resume'

function parseBooleanQuery(q: string) {
  // Tokenise boolean query into MongoDB $and/$or/$nor conditions
  q = q.trim()
  const filters: any[] = []
  const makeRegex = (term: string) => ({
    $or: [
      { name: { $regex: term, $options: 'i' } },
      { role: { $regex: term, $options: 'i' } },
      { keywords: { $elemMatch: { $regex: term, $options: 'i' } } },
      { notes: { $regex: term, $options: 'i' } },
    ],
  })

  // Handle NOT terms
  const notPattern = /\s+NOT\s+"([^"]+)"|NOT\s+(\S+)/gi
  let notTerms: string[] = []
  q = q.replace(notPattern, (_, p1, p2) => { notTerms.push(p1 || p2); return '' })

  // Split by AND and OR
  const parts = q.split(/\s+AND\s+/i)
  for (const part of parts) {
    const orParts = part.split(/\s+OR\s+/i)
    if (orParts.length > 1) {
      filters.push({ $or: orParts.map(t => makeRegex(t.replace(/^"|"$/g, '').trim())) })
    } else {
      const t = part.replace(/^"|"$/g, '').trim()
      if (t) filters.push(makeRegex(t))
    }
  }

  const query: any = {}
  if (filters.length === 1) Object.assign(query, filters[0])
  else if (filters.length > 1) query.$and = filters

  if (notTerms.length > 0) {
    query.$nor = notTerms.map(t => makeRegex(t))
  }

  return query
}

export async function GET(req: NextRequest) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const q    = searchParams.get('q') || ''
  const role = searchParams.get('role') || ''

  const filter: any = {}
  if (q) Object.assign(filter, parseBooleanQuery(q))
  if (role) filter.role = { $regex: role, $options: 'i' }

  const [resumes, total] = await Promise.all([
    Resume.find(filter).sort({ createdAt: -1 }).limit(50).lean(),
    Resume.countDocuments(filter),
  ])
  return NextResponse.json({ resumes, total })
}