import { redirect } from 'next/navigation'

export default function LegacyPropertyRedirect({
  params,
}: {
  params: { propertyId: string }
}) {
  redirect(`/detail/${params.propertyId}`)
}
