import DemoForm from '@/components/DemoForm'
import { createDemo } from '@/app/admin/demos/actions'
import Link from 'next/link'

export default function NewDemoPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/demos" className="text-sm text-gray-400 hover:text-gray-600">← 一覧に戻る</Link>
        <h1 className="text-2xl font-bold text-gray-800 mt-2">新規デモ作成</h1>
      </div>
      <DemoForm action={createDemo} />
    </div>
  )
}
