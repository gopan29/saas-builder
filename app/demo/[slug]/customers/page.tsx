import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { customers, dogs } from '@/lib/sample-data'
import BeautySalonCustomers from '@/components/demo/beauty-salon/CustomersContent'
import DentalPatients from '@/components/demo/dental-clinic/PatientsContent'
import EstheticCustomers from '@/components/demo/esthetic-salon/CustomersContent'
import OsteopathicPatients from '@/components/demo/osteopathic-clinic/PatientsContent'
import JukuStudents from '@/components/demo/juku/StudentsContent'
import YogaMembers from '@/components/demo/yoga-fitness/MembersContent'

type Props = { params: Promise<{ slug: string }> }

export default async function CustomersPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: demo } = await supabase.from('demos').select('industry_template').eq('slug', slug).single()
  if (!demo) notFound()

  if (demo.industry_template === 'beauty_salon') return <BeautySalonCustomers />
  if (demo.industry_template === 'dental_clinic') return <DentalPatients />
  if (demo.industry_template === 'esthetic_salon') return <EstheticCustomers />
  if (demo.industry_template === 'restaurant') notFound()
  if (demo.industry_template === 'osteopathic_clinic') return <OsteopathicPatients />
  if (demo.industry_template === 'juku') return <JukuStudents />
  if (demo.industry_template === 'yoga_fitness') return <YogaMembers />

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">顧客管理</h1>
          <p className="text-sm text-gray-400 mt-0.5">登録顧客 {customers.length} 名</p>
        </div>
        <button className="bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-lg opacity-60 cursor-default whitespace-nowrap">＋ 新規登録（デモ）</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {customers.map(c => {
            const myDogs = dogs.filter(d => d.customer_id === c.id)
            return (
              <div key={c.id} className="px-3 sm:px-4 py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800">{c.name}</span>
                    <span className="text-xs bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full">{c.visit_count}回来店</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{c.phone}</p>
                  {myDogs.length > 0 && (
                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                      {myDogs.map(d => (
                        <span key={d.id} className="text-xs bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full">
                          🐶 {d.name}（{d.breed}）
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">{c.registered_at} 登録</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
