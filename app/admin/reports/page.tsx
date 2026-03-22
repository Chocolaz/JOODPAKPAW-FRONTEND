'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { getAdminReports, getAdminReportById } from '@/lib/api'
import type { AdminReportSummary, AdminReportDetail } from '@/types/adminReport'
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

// ── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateRelative(dateStr: string) {
  const diffDays = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateStr)
}

const STATUS_CONFIG = {
  pending: {
    pill: 'bg-orange-50 text-accent-orange border-orange-200',
    dot: 'bg-accent-orange',
    icon: Clock,
  },
  resolved: {
    pill: 'bg-green-50 text-positive-green border-green-200',
    dot: 'bg-positive-green',
    icon: CheckCircle2,
  },
  dismissed: {
    pill: 'bg-gray-100 text-gray-500 border-gray-200',
    dot: 'bg-gray-400',
    icon: XCircle,
  },
}

type TypeFilter = 'property' | 'review'
type StatusFilter = 'all' | 'pending' | 'resolved' | 'dismissed'

const TYPE_TABS: { key: TypeFilter; label: string }[] = [
  { key: 'property', label: 'Property Reports' },
  { key: 'review', label: 'Review Reports' },
]

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'dismissed', label: 'Dismissed' },
]

// ── Sub-components ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
  if (!cfg) return null
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.pill}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function UserAvatar({
  user,
  size = 'sm',
}: {
  user: { avatar: string; firstName: string; lastName: string }
  size?: 'sm' | 'md'
}) {
  const cls =
    size === 'md'
      ? 'w-10 h-10 text-base rounded-full'
      : 'w-7 h-7 text-sm rounded-full'

  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.firstName}
        className={`${cls} object-cover ring-1 ring-black/5 shrink-0`}
      />
    )
  }
  return (
    <div
      className={`${cls} bg-gray-100 text-gray-600 font-semibold font-baloo2 flex items-center justify-center shrink-0 text-[13px]`}
    >
      {user.firstName.charAt(0)}
    </div>
  )
}

// ── Lightbox ─────────────────────────────────────────────────────────────────
function ImageLightbox({
  src,
  label,
  onClose,
}: {
  src: string
  label: string
  onClose: () => void
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-8"
      onClick={onClose}
    >
      <div
        className="max-w-3xl w-full flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-sm">{label}</span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <img
          src={src}
          alt={label}
          className="w-full rounded-xl object-contain max-h-[78vh] shadow-2xl"
        />
        <p className="text-center text-white/30 text-xs">
          Press Esc or click outside to close
        </p>
      </div>
    </div>
  )
}

// ── Report Detail Panel ───────────────────────────────────────────────────────
function ReportPanel({
  id,
  onClose,
}: {
  id: number
  onClose: () => void
}) {
  const [detail, setDetail] = useState<AdminReportDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<{ src: string; label: string } | null>(null)

  useEffect(() => {
    setLoading(true)
    getAdminReportById(id)
      .then(setDetail)
      .catch(() => toast.error('Failed to load report.'))
      .finally(() => setLoading(false))
  }, [id])

  const cfg = detail
    ? STATUS_CONFIG[detail.status as keyof typeof STATUS_CONFIG]
    : null

  const stripeColor =
    !detail
      ? 'bg-gray-200'
      : detail.status === 'pending'
        ? 'bg-accent-orange'
        : detail.status === 'resolved'
          ? 'bg-positive-green'
          : 'bg-gray-400'

  return (
    <>
      <div
        className="fixed inset-0 bg-black/25 backdrop-blur-[1px] z-40"
        onClick={onClose}
      />

      <div
        className="fixed right-0 top-0 h-full w-[500px] bg-white z-50 flex flex-col shadow-xl border-l border-gray-200"
        style={{ animation: 'slideIn .22s cubic-bezier(.16,1,.3,1)' }}
      >
        {/* Status stripe */}
        <div className={`h-[3px] w-full shrink-0 ${stripeColor}`} />

        {/* Header */}
        <div className="shrink-0 px-6 py-5 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-semibold text-[15px] text-gray-900 font-baloo2 leading-tight">
                Report #{id}
              </p>
              {detail && (
                <p className="text-xs text-gray-400 mt-0.5 capitalize">
                  {detail.type} · {detail.reportCategoryLabel}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {detail && cfg && <StatusBadge status={detail.status} />}
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6 flex flex-col gap-5">
              {[60, 80, 100, 120].map((h, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-xl animate-pulse"
                  style={{ height: h }}
                />
              ))}
            </div>
          ) : detail ? (
            <div className="px-6 py-5 flex flex-col gap-6">
              {/* Reporter */}
              <section>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Reported By
                </p>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <UserAvatar user={detail.reporter} size="md" />
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold text-gray-900">
                      {detail.reporter.firstName} {detail.reporter.lastName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {detail.reporter.email} · #{detail.reporter.id}
                    </p>
                  </div>
                </div>
              </section>

              {/* Target info */}
              <section>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  {detail.type === 'property' ? 'Reported Property' : 'Reported Review'}
                </p>
                <dl className="divide-y divide-gray-100 bg-gray-50 rounded-xl border border-gray-100 px-4">
                  {detail.type === 'property' && detail.property && (
                    <>
                      <InfoRow label="Property" value={`${detail.property.title} (#${detail.property.id})`} />
                      {detail.propOwner && (
                        <InfoRow
                          label="Owner"
                          value={`${detail.propOwner.firstName} ${detail.propOwner.lastName}`}
                          sub={detail.propOwner.email}
                        />
                      )}
                    </>
                  )}
                  {detail.type === 'review' && (
                    <>
                      {detail.reviewAuthor && (
                        <InfoRow
                          label="Review by"
                          value={`${detail.reviewAuthor.firstName} ${detail.reviewAuthor.lastName}`}
                          sub={detail.reviewAuthor.email}
                        />
                      )}
                      {detail.property && (
                        <InfoRow label="On property" value={`${detail.property.title} (#${detail.property.id})`} />
                      )}
                    </>
                  )}
                  <InfoRow label="Category" value={detail.reportCategoryLabel} />
                  <InfoRow label="Reported" value={formatDate(detail.createdAt)} />
                  <InfoRow label="Status" value={detail.status} />
                  {detail.resolvedAction && (
                    <InfoRow label="Action taken" value={detail.resolvedAction.replace(/_/g, ' ')} />
                  )}
                </dl>
              </section>

              {/* Description */}
              {detail.description && (
                <section>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    Reporter&apos;s Description
                  </p>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 border-l-2 border-l-gray-400">
                    <p className="text-sm text-gray-700 leading-relaxed italic">
                      &ldquo;{detail.description}&rdquo;
                    </p>
                  </div>
                </section>
              )}

              {/* Admin note */}
              {detail.adminNote && (
                <section>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    Admin Note
                  </p>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {detail.adminNote}
                    </p>
                  </div>
                </section>
              )}

              {/* Images */}
              {detail.images && detail.images.length > 0 && (
                <section>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    Attached Images ({detail.images.length})
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {detail.images.map((img, idx) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() =>
                          setLightbox({ src: img.filePath, label: `Image ${idx + 1}` })
                        }
                        className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 group cursor-zoom-in w-full"
                      >
                        <img
                          src={img.filePath}
                          alt={`Report image ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn className="w-5 h-5 text-white" />
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-gray-400">
              Failed to load report details.
            </div>
          )}
        </div>
      </div>

      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          label={lightbox.label}
          onClose={() => setLightbox(null)}
        />
      )}
      <style>{`@keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </>
  )
}

function InfoRow({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="flex justify-between items-start py-2.5 gap-4">
      <dt className="text-xs text-gray-400 shrink-0">{label}</dt>
      <dd className="text-xs font-medium text-gray-800 text-right">
        {value}
        {sub && <span className="block text-gray-400 font-normal">{sub}</span>}
      </dd>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminReportsPage() {
  const [type, setType] = useState<TypeFilter>('property')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<AdminReportSummary[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const LIMIT = 20

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAdminReports({
        type,
        status: status === 'all' ? undefined : status,
        page,
        limit: LIMIT,
      })
      setData(res.data)
      setTotalRows(res.totalRows)
      setTotalPages(res.totalPages)
    } catch {
      toast.error('Failed to load reports.')
    } finally {
      setLoading(false)
    }
  }, [type, status, page])

  useEffect(() => {
    setPage(1)
    setSelectedId(null)
  }, [type, status])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const pendingCount = data.filter((d) => d.status === 'pending').length

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: 'Total reports', value: totalRows, accent: false },
          { label: 'Pending review', value: pendingCount, accent: true },
          { label: 'Showing', value: data.length, accent: false },
        ].map(({ label, value, accent }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 px-5 py-4">
            <p className="text-xs text-gray-400 font-medium mb-2">{label}</p>
            <p
              className={`text-3xl font-bold font-baloo2 leading-none ${
                accent && value > 0 ? 'text-accent-orange' : 'text-gray-900'
              }`}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Type tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-gray-200 pb-4">
        {TYPE_TABS.map((tab) => {
          const active = type === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setType(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                active
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1.5 mb-5">
        {STATUS_TABS.map((tab) => {
          const active = status === tab.key
          const cfg = STATUS_CONFIG[tab.key as keyof typeof STATUS_CONFIG]
          return (
            <button
              key={tab.key}
              onClick={() => setStatus(tab.key)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                active
                  ? tab.key === 'all'
                    ? 'bg-gray-900 text-white'
                    : cfg
                      ? `border ${cfg.pill}`
                      : 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {type === 'property' ? (
                <>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Reporter</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Reports</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3" />
                </>
              ) : (
                <>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Reporter</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Review Author</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3" />
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  {Array.from({ length: type === 'property' ? 7 : 6 }).map((__, j) => (
                    <td key={j} className="px-4 py-4">
                      <div
                        className="h-3.5 bg-gray-100 rounded-full animate-pulse"
                        style={{ width: `${[48, 60, 40, 20, 30, 35, 18][j]}%` }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={type === 'property' ? 7 : 6}
                  className="px-4 py-16 text-center"
                >
                  <p className="text-sm font-semibold text-gray-700 font-baloo2">
                    No reports found
                  </p>
                  <p className="text-sm text-gray-400 mt-1">Try a different filter</p>
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const isPending = row.status === 'pending'
                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedId(row.id)}
                    className="border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors group relative"
                  >
                    {isPending && (
                      <td className="absolute left-0 top-3 bottom-3 w-[2px] rounded-r-full bg-accent-orange p-0 border-0" />
                    )}

                    {/* Reporter */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <UserAvatar user={row.reporter} />
                        <div>
                          <p className="text-[13px] font-semibold text-gray-900 leading-tight">
                            {row.reporter.firstName} {row.reporter.lastName}
                          </p>
                          <p className="text-xs text-gray-400">#{row.reporter.id}</p>
                        </div>
                      </div>
                    </td>

                    {type === 'property' ? (
                      <>
                        <td className="px-4 py-3.5">
                          {row.property ? (
                            <div>
                              <p className="text-[13px] font-medium text-gray-800 leading-tight">
                                {row.property.title}
                              </p>
                              <p className="text-xs text-gray-400">#{row.property.id}</p>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600 font-medium">
                            {row.reportCategoryLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          {row.reportCount != null && row.reportCount > 0 ? (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                                row.reportCount >= 3
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {row.reportCount >= 3 && '⚑ '}
                              {row.reportCount}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3.5">
                          {row.reviewAuthor ? (
                            <div className="flex items-center gap-2">
                              <UserAvatar user={row.reviewAuthor} />
                              <div>
                                <p className="text-[13px] font-medium text-gray-800 leading-tight">
                                  {row.reviewAuthor.firstName} {row.reviewAuthor.lastName}
                                </p>
                                <p className="text-xs text-gray-400">#{row.reviewAuthor.id}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600 font-medium">
                            {row.reportCategoryLabel}
                          </span>
                        </td>
                      </>
                    )}

                    <td className="px-4 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="text-[13px] font-medium text-gray-800">
                        {formatDateRelative(row.createdAt)}
                      </p>
                      <p className="text-xs text-gray-400">{formatDate(row.createdAt)}</p>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <span className="text-sm font-medium text-gray-400 group-hover:text-accent-orange transition-colors">
                        {isPending ? 'Review →' : 'View →'}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {totalRows === 0
              ? 'No results'
              : `${(page - 1) * LIMIT + 1}–${Math.min(page * LIMIT, totalRows)} of ${totalRows}`}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-500 min-w-[52px] text-center">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {selectedId !== null && (
        <ReportPanel id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  )
}
