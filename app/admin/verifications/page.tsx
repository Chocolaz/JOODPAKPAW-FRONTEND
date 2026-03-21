'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import {
  getAdminVerifications,
  getAdminVerificationById,
  approveVerification,
  rejectVerification,
  type AdminVerificationSummary,
  type AdminVerificationDetail,
} from '@/lib/api'
import { X, CheckCircle, XCircle, RotateCcw, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

// ── Image Lightbox ─────────────────────────────────────────────────────────────
function ImageLightbox({ src, label, onClose }: { src: string; label: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/80 flex flex-col items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-semibold">{label}</span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <img
          src={src}
          alt={label}
          className="w-full rounded-md object-contain max-h-[80vh] border border-white/10"
        />
      </div>
    </div>
  )
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
]

function statusBadge(status: string) {
  const base = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11.5px] font-semibold font-mono uppercase tracking-wide border-[1.5px]'
  if (status === 'pending') return `${base} border-dashed border-[#b8b8b8] text-[#3a3a3a] bg-white`
  if (status === 'approved') return `${base} border-[#b8b8b8] bg-[#e0e0e0] text-[#1c1c1c]`
  if (status === 'rejected') return `${base} border-[#b8b8b8] bg-[#f5f5f5] text-[#777]`
  return base
}

function dotColor(status: string) {
  if (status === 'pending') return 'bg-amber-400'
  if (status === 'approved') return 'bg-green-500'
  return 'bg-gray-400'
}

function formatDate(dateStr: string) {
  return new Date(dateStr.replace(' ', 'T')).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function Avatar({ user }: { user: { avatar: string; firstName: string; lastName: string } }) {
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.firstName}
        className="w-8 h-8 rounded-full object-cover border-[1.5px] border-[#bbb] shrink-0"
      />
    )
  }
  return (
    <div className="w-8 h-8 rounded-full bg-[#d0d0d0] border-[1.5px] border-[#bbb] flex items-center justify-center text-[13px] font-bold text-[#555] shrink-0">
      {user.firstName.charAt(0)}
    </div>
  )
}

// ── Side Panel ─────────────────────────────────────────────────────────────────
function VerificationPanel({
  id,
  onClose,
  onUpdated,
}: {
  id: number
  onClose: () => void
  onUpdated: () => void
}) {
  const [detail, setDetail] = useState<AdminVerificationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [rejecting, setRejecting] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [acting, setActing] = useState(false)
  const [lightbox, setLightbox] = useState<{ src: string; label: string } | null>(null)

  useEffect(() => {
    setLoading(true)
    getAdminVerificationById(id)
      .then((res) => setDetail(res.verification))
      .catch(() => toast.error('Failed to load verification.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleApprove = async () => {
    if (!detail) return
    setActing(true)
    try {
      await approveVerification(detail.id)
      toast.success(`Approved — ${detail.user.firstName} ${detail.user.lastName} is now verified.`)
      onUpdated()
      onClose()
    } catch {
      toast.error('Failed to approve.')
    } finally {
      setActing(false)
    }
  }

  const handleReject = async () => {
    if (!detail || !rejectReason.trim()) {
      toast.error('Rejection reason is required.')
      return
    }
    setActing(true)
    try {
      await rejectVerification(detail.id, rejectReason.trim())
      toast.success('Rejected — host has been notified.')
      onUpdated()
      onClose()
    } catch {
      toast.error('Failed to reject.')
    } finally {
      setActing(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 h-full w-[520px] bg-white border-l-2 border-[#b8b8b8] z-50 flex flex-col overflow-y-auto"
        style={{ animation: 'slideIn .2s ease-out' }}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-5 border-b-[1.5px] border-[#b8b8b8] bg-[#f5f5f5] shrink-0">
          <h3 className="font-bold text-base text-[#1c1c1c]">
            Verification #{id}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded border-[1.5px] border-[#b8b8b8] bg-white text-[#777] hover:border-[#3a3a3a] hover:text-[#1c1c1c] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Panel body */}
        <div className="flex-1 p-6 flex flex-col gap-5">
          {loading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-[#f0f0f0] rounded animate-pulse" />
              ))}
            </div>
          ) : detail ? (
            <>
              {/* User info */}
              <section className="flex flex-col gap-2.5">
                <p className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#777] pb-1.5 border-b border-[#e0e0e0]">
                  User
                </p>
                <div className="bg-[#f5f5f5] border-[1.5px] border-[#b8b8b8] rounded-md p-3.5 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Avatar user={detail.user} />
                    <div>
                      <p className="font-semibold text-[13px] text-[#1c1c1c]">
                        {detail.user.firstName} {detail.user.lastName}
                      </p>
                      <p className="text-[12px] font-mono text-[#777]">{detail.user.email}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[12.5px]">
                    <span className="text-[#777] font-mono">Submitted</span>
                    <span className="font-medium text-[#1c1c1c]">{formatDate(detail.submittedAt)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[12.5px]">
                    <span className="text-[#777] font-mono">Status</span>
                    <span className={statusBadge(detail.status)}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor(detail.status)}`} />
                      {detail.status}
                    </span>
                  </div>
                  {detail.isResubmit && (
                    <div className="flex justify-between items-center text-[12.5px]">
                      <span className="text-[#777] font-mono">Type</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold border border-[#ccc] bg-white px-2 py-0.5 rounded uppercase tracking-wide">
                        <RotateCcw className="w-3 h-3" />
                        Resubmission
                      </span>
                    </div>
                  )}
                </div>
              </section>

              {/* Previous rejection reason */}
              {detail.previousRejectDescription && (
                <section className="flex flex-col gap-2.5">
                  <p className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#777] pb-1.5 border-b border-[#e0e0e0]">
                    Previous Rejection Reason
                  </p>
                  <div className="bg-[#f5f5f5] border-[1.5px] border-dashed border-[#b8b8b8] border-l-[3px] border-l-solid border-l-[#3a3a3a] rounded-md px-4 py-3 text-[13px] text-[#1c1c1c] italic leading-relaxed">
                    &ldquo;{detail.previousRejectDescription}&rdquo;
                  </div>
                </section>
              )}

              {/* Rejection reason (if rejected) */}
              {detail.status === 'rejected' && detail.rejectDescription && (
                <section className="flex flex-col gap-2.5">
                  <p className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#777] pb-1.5 border-b border-[#e0e0e0]">
                    Rejection Reason
                  </p>
                  <div className="bg-[#f5f5f5] border-[1.5px] border-dashed border-[#b8b8b8] border-l-[3px] border-l-solid border-l-[#3a3a3a] rounded-md px-4 py-3 text-[13px] text-[#1c1c1c] italic leading-relaxed">
                    &ldquo;{detail.rejectDescription}&rdquo;
                  </div>
                </section>
              )}

              {/* Photos */}
              <section className="flex flex-col gap-2.5">
                <p className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#777] pb-1.5 border-b border-[#e0e0e0]">
                  Submitted Photos
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'ID Photo', src: detail.idPhoto },
                    { label: 'Selfie with ID', src: detail.selfieWithId },
                  ].map((photo) => (
                    <div key={photo.label} className="flex flex-col gap-1.5">
                      <span className="text-[11.5px] font-medium text-[#555]">{photo.label}</span>
                      <button
                        type="button"
                        onClick={() => setLightbox({ src: photo.src, label: photo.label })}
                        className="relative aspect-[4/3] rounded border-[1.5px] border-[#b8b8b8] overflow-hidden bg-[#f0f0f0] group cursor-zoom-in block w-full"
                      >
                        <Image src={photo.src} alt={photo.label} fill className="object-cover transition-transform duration-200 group-hover:scale-105" unoptimized />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn className="w-6 h-6 text-white" />
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Actions (pending only) */}
              {detail.status === 'pending' && (
                <section className="flex flex-col gap-2.5">
                  <p className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#777] pb-1.5 border-b border-[#e0e0e0]">
                    Admin Actions
                  </p>

                  {rejecting ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-medium text-[#3a3a3a]">
                          Rejection reason <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Explain why the verification was rejected. The host will see this."
                          rows={3}
                          className="w-full border-[1.5px] border-[#b8b8b8] rounded px-3 py-2 text-[13px] text-[#1c1c1c] bg-white resize-none focus:outline-none focus:border-[#3a3a3a] font-sans"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => { setRejecting(false); setRejectReason('') }}
                          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded border-[1.5px] border-[#b8b8b8] bg-white text-[#3a3a3a] text-[13px] font-semibold hover:border-[#3a3a3a] hover:bg-[#f5f5f5] transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleReject}
                          disabled={acting || !rejectReason.trim()}
                          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded border-[1.5px] border-[#3a3a3a] bg-[#3a3a3a] text-white text-[13px] font-semibold hover:bg-[#222] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          Confirm Reject
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleApprove}
                        disabled={acting}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded border-[1.5px] border-[#b8b8b8] bg-white text-[#1c1c1c] text-[13px] font-semibold hover:border-[#3a3a3a] hover:bg-[#f5f5f5] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Approve
                      </button>
                      <button
                        onClick={() => setRejecting(true)}
                        disabled={acting}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded border-[1.5px] border-dashed border-[#999] bg-[#f5f5f5] text-[#444] text-[13px] font-semibold hover:border-solid hover:border-[#3a3a3a] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                      >
                        <XCircle className="w-4 h-4 text-red-500" />
                        Reject
                      </button>
                    </div>
                  )}
                </section>
              )}
            </>
          ) : (
            <p className="text-[13px] text-[#777]">Failed to load details.</p>
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

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AdminVerificationsPage() {
  const [status, setStatus] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<AdminVerificationSummary[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const LIMIT = 20

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAdminVerifications({
        status: status === 'all' ? undefined : status,
        page,
        limit: LIMIT,
      })
      setData(res.data)
      setTotalRows(res.totalRows)
      setTotalPages(res.totalPages)
    } catch {
      toast.error('Failed to load verifications.')
    } finally {
      setLoading(false)
    }
  }, [status, page])

  useEffect(() => {
    setPage(1)
  }, [status])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Counts per tab — derived from current list (approximation until API provides counts)
  const counts = {
    all: totalRows,
    pending: data.filter((d) => d.status === 'pending').length,
    approved: data.filter((d) => d.status === 'approved').length,
    rejected: data.filter((d) => d.status === 'rejected').length,
  }

  return (
    <div style={{ fontFamily: "'DM Sans', Helvetica, Arial, sans-serif" }}>
      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-5 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatus(tab.key)}
            className={`px-4 py-1.5 rounded text-[13px] font-semibold border-[1.5px] transition-all duration-150 cursor-pointer ${
              status === tab.key
                ? 'bg-[#3a3a3a] border-[#3a3a3a] text-white'
                : 'bg-white border-[#b8b8b8] text-[#777] hover:border-[#3a3a3a] hover:text-[#1c1c1c]'
            }`}
          >
            {tab.label}{' '}
            <span
              className={`inline-block ml-1.5 px-1.5 text-[11px] rounded ${
                status === tab.key ? 'bg-white/20' : 'bg-black/8'
              }`}
            >
              {tab.key === 'all' ? totalRows : counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border-[1.5px] border-[#b8b8b8] rounded-md overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-[#f5f5f5]">
            <tr>
              {['Host', 'Email', 'Submitted', 'Type', 'Status', 'Action'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[11.5px] font-semibold text-[#777] uppercase tracking-wider border-b-[1.5px] border-[#b8b8b8]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-4 py-3.5 border-b border-[#e0e0e0]">
                      <div className="h-4 bg-[#f0f0f0] rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[13px] text-[#777]">
                  No verifications found.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#f5f5f5] transition-colors"
                >
                  <td className="px-4 py-3.5 border-b border-[#e0e0e0]">
                    <div className="flex items-center gap-2">
                      <Avatar user={row.user} />
                      <span className="text-[13px] font-medium text-[#1c1c1c]">
                        {row.user.firstName} {row.user.lastName}
                      </span>
                      <span className="text-[11.5px] font-mono text-[#777]">#{row.user.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 border-b border-[#e0e0e0] font-mono text-[12px] text-[#777]">
                    {row.user.email}
                  </td>
                  <td className="px-4 py-3.5 border-b border-[#e0e0e0] font-mono text-[12px] text-[#555]">
                    {formatDate(row.submittedAt)}
                  </td>
                  <td className="px-4 py-3.5 border-b border-[#e0e0e0]">
                    {row.isResubmit ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold border border-[#ccc] bg-[#f5f5f5] px-2 py-0.5 rounded uppercase tracking-wide text-[#555]">
                        <RotateCcw className="w-3 h-3" />
                        Resubmit
                      </span>
                    ) : (
                      <span className="text-[12px] text-[#aaa] font-mono">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 border-b border-[#e0e0e0]">
                    <span className={statusBadge(row.status)}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor(row.status)}`} />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 border-b border-[#e0e0e0]">
                    <button
                      onClick={() => setSelectedId(row.id)}
                      className="px-3.5 py-1.5 rounded border-[1.5px] border-[#b8b8b8] bg-white text-[#1c1c1c] text-[12.5px] font-semibold hover:border-[#3a3a3a] hover:bg-[#f5f5f5] transition-all cursor-pointer"
                    >
                      {row.status === 'pending' ? 'Review' : 'View'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#e0e0e0] bg-[#fafafa]">
            <span className="text-[12px] font-mono text-[#777]">
              {totalRows} total · page {page} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded border-[1.5px] border-[#b8b8b8] bg-white text-[#555] hover:border-[#3a3a3a] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded border-[1.5px] border-[#b8b8b8] bg-white text-[#555] hover:border-[#3a3a3a] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Side panel */}
      {selectedId !== null && (
        <VerificationPanel
          id={selectedId}
          onClose={() => setSelectedId(null)}
          onUpdated={fetchData}
        />
      )}
    </div>
  )
}
