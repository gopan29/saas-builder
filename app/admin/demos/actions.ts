'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createDemo(formData: FormData) {
  const supabase = await createClient()

  const slug = (formData.get('slug') as string).trim().toLowerCase()
  const client_name = (formData.get('client_name') as string).trim()
  const industry_template = formData.get('industry_template') as string
  const theme_color = formData.get('theme_color') as string
  const is_active = formData.get('is_active') === 'true'

  const { error } = await supabase.from('demos').insert({
    slug,
    client_name,
    industry_template,
    theme_color,
    is_active,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/demos')
  redirect('/admin/demos')
}

export async function updateDemo(id: string, formData: FormData) {
  const supabase = await createClient()

  const slug = (formData.get('slug') as string).trim().toLowerCase()
  const client_name = (formData.get('client_name') as string).trim()
  const industry_template = formData.get('industry_template') as string
  const theme_color = formData.get('theme_color') as string
  const is_active = formData.get('is_active') === 'true'

  const { error } = await supabase.from('demos').update({
    slug,
    client_name,
    industry_template,
    theme_color,
    is_active,
  }).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/demos')
  redirect('/admin/demos')
}

export async function deleteDemo(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('demos').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/demos')
}
