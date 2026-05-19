import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { dogs, customers } from '@/lib/sample-data'

type Props = { params: Promise<{ slug: string }> }

export default async function DogsPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: demo } = await supabase.from('demos').select('industry_template').eq('slug', slug).single()
  if (!demo) notFound()
  if (demo.industry_template !== 'dog_salon') notFound()

  const genderColor = (g: string) => g === '女の子' ? 'bg-pink-50 text-pink-500' : 'bg-blue-50 text-blue-500'

  const getAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const now = new Date()
    const age = now.getFullYear() - birth.getFullYear()
    return age
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">ワンちゃん管理</h1>
          <p className="text-sm text-gray-400 mt-0.5">登録頭数 {dogs.length} 頭</p>
        </div>
        <button className="bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-lg opacity-60 cursor-default whitespace-nowrap">
          ＋ 新規登録（デモ）
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {dogs.map(d => {
          const owner = customers.find(c => c.id === d.customer_id)
          return (
            <Link key={d.id} href={`/demo/${slug}/dogs/${d.id}`} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  🐶
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-800 text-lg">{d.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${genderColor(d.gender)}`}>
                      {d.gender}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{d.breed}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {getAge(d.birth_date)}歳 ／ {d.weight}kg ／ {d.color}
                  </p>
                  {owner && (
                    <p className="text-xs text-indigo-400 mt-1">👤 {owner.name} 様</p>
                  )}
                  {d.notes && (
                    <p className="text-xs text-orange-400 mt-1 bg-orange-50 px-2 py-1 rounded-lg">
                      ⚠️ {d.notes}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
