import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import DemoForm from '@/components/DemoForm'
import { updateDemo } from '@/app/admin/demos/actions'
import Link from 'next/link'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditDemoPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: demo } = await supabase.from('demos').select('*').eq('id', id).single()
  if (!demo) notFound()

  const action = updateDemo.bind(null, id)

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/demos" className="text-sm text-gray-400 hover:text-gray-600">← 一覧に戻る</Link>
        <h1 className="text-2xl font-bold text-gray-800 mt-2">{demo.client_name} を編集</h1>
      </div>
      <DemoForm demo={demo} action={action} />
    </div>
  )
}
