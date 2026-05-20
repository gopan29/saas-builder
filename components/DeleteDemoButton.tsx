'use client'

import { useTransition } from 'react'
import { deleteDemo } from '@/app/admin/demos/actions'
import { useRouter } from 'next/navigation'

type Props = {
  id: string
  clientName: string
}

export default function DeleteDemoButton({ id, clientName }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    if (!confirm(`「${clientName}」を削除しますか？この操作は取り消せません。`)) return

    startTransition(async () => {
      await deleteDemo(id)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs text-red-400 hover:text-red-600 border border-red-100 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      {isPending ? '削除中...' : '削除'}
    </button>
  )
}
