'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    CheckCircle2, Circle, ChevronRight, ChevronDown, Menu, X, Search,
    NotebookPen, ListChecks, Flag, Plus, Trash2, RotateCcw, Radio, Lock, LogOut,
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { NEXUS_LOG_ENTRIES, PHASES, type LogEntry } from '@/data/nexus-log-data'

/* ============================ types ============================ */

type CustomTodo = { id: string; text: string; done: boolean }

type RowState = {
    days: boolean[]
    deliverables: boolean[]
    dod: boolean[]
    tasks: boolean[]
    custom: CustomTodo[]
    notes: string
}

type RowsMap = Record<string, RowState>

/* ========================== helpers ========================== */

function emptyRow(entry: LogEntry): RowState {
    return {
        days: entry.kind === 'sprint' ? entry.days.map(() => false) : [],
        deliverables: entry.kind === 'sprint' ? entry.deliverables.map(() => false) : [],
        dod: entry.kind === 'sprint' ? entry.dod.map(() => false) : [],
        tasks: entry.kind === 'deload' ? entry.tasks.map(() => false) : [],
        custom: [],
        notes: '',
    }
}

// Reconcile a DB row against the current static entry shape, in case the
// day/deliverable/DoD counts changed since the row was last saved.
function normalize(entry: LogEntry, db: Partial<RowState> | null | undefined): RowState {
    const base = emptyRow(entry)
    if (!db) return base
    const fit = (arr: boolean[] | undefined, len: number) => {
        const a = Array.isArray(arr) ? arr : []
        const out = a.slice(0, len)
        while (out.length < len) out.push(false)
        return out
    }
    return {
        days: fit(db.days, base.days.length),
        deliverables: fit(db.deliverables, base.deliverables.length),
        dod: fit(db.dod, base.dod.length),
        tasks: fit(db.tasks, base.tasks.length),
        custom: Array.isArray(db.custom) ? db.custom : [],
        notes: typeof db.notes === 'string' ? db.notes : '',
    }
}

function totals(entry: LogEntry, row: RowState) {
    if (entry.kind === 'sprint') {
        const done = row.days.filter(Boolean).length + row.deliverables.filter(Boolean).length +
            row.dod.filter(Boolean).length + row.custom.filter((c) => c.done).length
        const total = entry.days.length + entry.deliverables.length + entry.dod.length + row.custom.length
        return { done, total: total || 1 }
    }
    const done = row.tasks.filter(Boolean).length + row.custom.filter((c) => c.done).length
    const total = entry.tasks.length + row.custom.length
    return { done, total: total || 1 }
}

function statusOf(entry: LogEntry, row: RowState) {
    const { done, total } = totals(entry, row)
    if (done === 0) return 'pending'
    if (done === total) return 'done'
    return 'active'
}

/* ============================= page ============================= */

export default function NexusLogPage() {
    const [authChecked, setAuthChecked] = useState(false)
    const [authenticated, setAuthenticated] = useState(false)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setAuthenticated(!!session)
            setAuthChecked(true)
        })
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
            setAuthenticated(!!session)
        })
        return () => subscription.unsubscribe()
    }, [])

    if (!authChecked) {
        return (
            <div style={{ ...S.app, alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                <style>{CSS}</style>
                <div style={{ color: T.sub, fontFamily: T.mono, fontSize: 13, letterSpacing: 1 }}>CHECKING CREDENTIALS…</div>
            </div>
        )
    }

    if (!authenticated) return <LoginGate />

    return <Tracker />
}

/* ============================ login ============================ */

function LoginGate() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setError(error.message)
        setLoading(false)
    }

    return (
        <div style={{ ...S.app, alignItems: 'center', justifyContent: 'center', display: 'flex', padding: 20 }}>
            <style>{CSS}</style>
            <form onSubmit={handleLogin} style={S.loginCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Lock size={16} color={T.accent} />
                    <span style={S.brand}>NEXUS FIELD LOG</span>
                </div>
                <p style={{ fontSize: 12.5, color: T.sub, margin: '2px 0 18px' }}>Sign in to access the tracker.</p>
                {error && <div style={S.loginError}>{error}</div>}
                <label style={S.loginLabel}>Email</label>
                <input style={S.loginInput} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
                <label style={S.loginLabel}>Password</label>
                <input style={S.loginInput} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" disabled={loading} style={S.loginBtn}>{loading ? 'Signing in…' : 'Sign in'}</button>
            </form>
        </div>
    )
}

/* =========================== tracker =========================== */

function Tracker() {
    const [rows, setRows] = useState<RowsMap | null>(null)
    const [selected, setSelected] = useState('S01')
    const [query, setQuery] = useState('')
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [saveFlash, setSaveFlash] = useState(false)
    const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

    // initial fetch
    useEffect(() => {
        (async () => {
            const { data, error } = await supabase.from('nexus_log_entries').select('*')
            const map: RowsMap = {}
            NEXUS_LOG_ENTRIES.forEach((entry) => {
                const db = !error && data ? data.find((r) => r.id === entry.id) : null
                map[entry.id] = normalize(entry, db as Partial<RowState> | null)
            })
            setRows(map)
        })()
    }, [])

    function persist(id: string, patch: Partial<RowState>) {
        if (timers.current[id]) clearTimeout(timers.current[id])
        timers.current[id] = setTimeout(async () => {
            const entry = NEXUS_LOG_ENTRIES.find((e) => e.id === id)!
            const { error } = await supabase.from('nexus_log_entries').upsert(
                { id, kind: entry.kind, ...patch },
                { onConflict: 'id' }
            )
            if (!error) {
                setSaveFlash(true)
                setTimeout(() => setSaveFlash(false), 900)
            }
        }, 500)
    }

    function updateRow(id: string, updater: (r: RowState) => RowState) {
        setRows((prev) => {
            if (!prev) return prev
            const next = { ...prev, [id]: updater(prev[id]) }
            persist(id, next[id])
            return next
        })
    }

    async function signOut() {
        await supabase.auth.signOut()
    }

    const current = NEXUS_LOG_ENTRIES.find((e) => e.id === selected) || NEXUS_LOG_ENTRIES[0]
    const currentRow = rows ? rows[current.id] : null

    const overall = useMemo(() => {
        if (!rows) return { pct: 0, done: 0, total: 1 }
        let done = 0, total = 0
        NEXUS_LOG_ENTRIES.forEach((e) => {
            const t = totals(e, rows[e.id])
            done += t.done; total += t.total
        })
        return { done, total, pct: total ? Math.round((done / total) * 100) : 0 }
    }, [rows])

    const grouped = useMemo(() => {
        const q = query.trim().toLowerCase()
        const filtered = q
            ? NEXUS_LOG_ENTRIES.filter((e) => e.title.toLowerCase().includes(q) || e.num.includes(q) || e.phase.toLowerCase().includes(q))
            : NEXUS_LOG_ENTRIES
        const g: Record<string, LogEntry[]> = {}
        PHASES.forEach((p) => (g[p] = []))
        filtered.forEach((e) => { if (!g[e.phase]) g[e.phase] = []; g[e.phase].push(e) })
        return g
    }, [query])

    if (!rows || !currentRow) {
        return (
            <div style={{ ...S.app, alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                <style>{CSS}</style>
                <div style={{ color: T.sub, fontFamily: T.mono, fontSize: 13, letterSpacing: 1 }}>LOADING FIELD LOG…</div>
            </div>
        )
    }

    return (
        <div style={S.app}>
            <style>{CSS}</style>

            <header style={S.header}>
                <div style={S.headerLeft}>
                    <button className="iconBtn onlyMobile" onClick={() => setDrawerOpen(true)} aria-label="Open sprint list">
                        <Menu size={20} />
                    </button>
                    <div>
                        <div style={S.brandRow}>
                            <Radio size={16} color={T.accent} />
                            <span style={S.brand}>NEXUS FIELD LOG</span>
                        </div>
                        <div style={S.brandSub}>24-sprint execution tracker</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={S.dial}>
                        <svg width="52" height="52" viewBox="0 0 52 52">
                            <circle cx="26" cy="26" r="22" fill="none" stroke={T.panelBorder} strokeWidth="4" />
                            <circle
                                cx="26" cy="26" r="22" fill="none" stroke={T.accent} strokeWidth="4"
                                strokeDasharray={2 * Math.PI * 22}
                                strokeDashoffset={2 * Math.PI * 22 * (1 - overall.pct / 100)}
                                strokeLinecap="round" transform="rotate(-90 26 26)"
                                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                            />
                        </svg>
                        <div style={S.dialText}>{overall.pct}%</div>
                    </div>
                    <button className="iconBtn" onClick={signOut} title="Sign out" aria-label="Sign out">
                        <LogOut size={17} />
                    </button>
                </div>
            </header>

            <div style={S.body}>
                <div className={drawerOpen ? 'backdrop backdropOpen' : 'backdrop'} onClick={() => setDrawerOpen(false)} />
                <nav className={drawerOpen ? 'sidebar sidebarOpen' : 'sidebar'} style={S.sidebar}>
                    <div style={S.searchWrap}>
                        <Search size={14} color={T.sub} />
                        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sprints…" style={S.searchInput} />
                        <button className="iconBtn onlyMobile" onClick={() => setDrawerOpen(false)} aria-label="Close"><X size={18} /></button>
                    </div>
                    <div style={S.sidebarList}>
                        {PHASES.map((phase) => {
                            const items = grouped[phase] || []
                            if (!items.length) return null
                            return (
                                <div key={phase} style={{ marginBottom: 14 }}>
                                    <div style={S.phaseLabel}>{phase}</div>
                                    {items.map((e) => {
                                        const st = statusOf(e, rows[e.id])
                                        const active = e.id === selected
                                        return (
                                            <button key={e.id} onClick={() => { setSelected(e.id); setDrawerOpen(false) }} style={{ ...S.stripBtn, ...(active ? S.stripBtnActive : {}) }}>
                                                <span style={{ ...S.led, background: LED[st] }} />
                                                <span style={S.stripCode}>{e.kind === 'deload' ? e.num : 'SPR-' + e.num}</span>
                                                <span style={S.stripTitle}>{e.title}</span>
                                                <ChevronRight size={14} color={T.subFaint} />
                                            </button>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                </nav>

                <main style={S.main}>
                    <MissionPanel
                        entry={current}
                        row={currentRow}
                        onToggle={(section, i) => updateRow(current.id, (r) => ({ ...r, [section]: r[section].map((v: boolean, idx: number) => (idx === i ? !v : v)) }))}
                        onToggleCustom={(id) => updateRow(current.id, (r) => ({ ...r, custom: r.custom.map((c) => (c.id === id ? { ...c, done: !c.done } : c)) }))}
                        onRemoveCustom={(id) => updateRow(current.id, (r) => ({ ...r, custom: r.custom.filter((c) => c.id !== id) }))}
                        onAddCustom={(text) => updateRow(current.id, (r) => ({ ...r, custom: [...r.custom, { id: Date.now() + '', text, done: false }] }))}
                        onNotes={(text) => updateRow(current.id, (r) => ({ ...r, notes: text }))}
                        onReset={() => updateRow(current.id, () => emptyRow(current))}
                    />
                </main>
            </div>

            <div style={{ ...S.saveFlash, opacity: saveFlash ? 1 : 0 }}>LOGGED</div>
        </div>
    )
}

/* ========================= mission panel ========================= */

function MissionPanel({
    entry, row, onToggle, onToggleCustom, onRemoveCustom, onAddCustom, onNotes, onReset,
}: {
    entry: LogEntry
    row: RowState
    onToggle: (section: 'days' | 'deliverables' | 'dod' | 'tasks', i: number) => void
    onToggleCustom: (id: string) => void
    onRemoveCustom: (id: string) => void
    onAddCustom: (text: string) => void
    onNotes: (text: string) => void
    onReset: () => void
}) {
    const [draft, setDraft] = useState('')
    const t = totals(entry, row)
    const pct = Math.round((t.done / t.total) * 100)
    const st = statusOf(entry, row)

    return (
        <div style={S.panelWrap}>
            <div style={S.panelHead}>
                <div>
                    <div style={S.panelEyebrow}>
                        <span style={{ ...S.led, background: LED[st] }} />
                        {entry.kind === 'deload' ? 'DELOAD' : 'MISSION ' + entry.num} · {entry.phase}
                    </div>
                    <h1 style={S.panelTitle}>{entry.title}</h1>
                    <p style={S.panelMission}>{entry.mission}</p>
                </div>
                <button style={S.ghostBtn} onClick={onReset} title="Reset this entry's checklist">
                    <RotateCcw size={13} /> Reset
                </button>
            </div>

            <div style={S.progressBarOuter}><div style={{ ...S.progressBarInner, width: pct + '%' }} /></div>
            <div style={S.progressCaption}>{t.done} / {t.total} logged — {pct}%</div>

            {entry.kind === 'sprint' ? (
                <>
                    <Section icon={<ListChecks size={15} />} title="Daily execution (6 working days)">
                        {entry.days.map((d, i) => (
                            <TodoRow key={i} label={`Day ${i + 1}`} text={d} checked={row.days[i]} onClick={() => onToggle('days', i)} />
                        ))}
                    </Section>
                    <Section icon={<Flag size={15} />} title="Deliverables">
                        {entry.deliverables.map((d, i) => (
                            <TodoRow key={i} text={d} checked={row.deliverables[i]} onClick={() => onToggle('deliverables', i)} />
                        ))}
                    </Section>
                    <Section icon={<CheckCircle2 size={15} />} title="Definition of done">
                        {entry.dod.map((d, i) => (
                            <TodoRow key={i} text={d} checked={row.dod[i]} onClick={() => onToggle('dod', i)} />
                        ))}
                    </Section>
                </>
            ) : (
                <Section icon={<ListChecks size={15} />} title="Deload tasks">
                    {entry.tasks.map((d, i) => (
                        <TodoRow key={i} text={d} checked={row.tasks[i]} onClick={() => onToggle('tasks', i)} />
                    ))}
                </Section>
            )}

            <Section icon={<Plus size={15} />} title="Your own tasks">
                {row.custom.map((c) => (
                    <div key={c.id} style={S.customRow}>
                        <button onClick={() => onToggleCustom(c.id)} style={S.checkBtn}>
                            {c.done ? <CheckCircle2 size={18} color={T.accent} /> : <Circle size={18} color={T.subFaint} />}
                        </button>
                        <span style={{ ...S.todoText, ...(c.done ? S.todoTextDone : {}) }}>{c.text}</span>
                        <button onClick={() => onRemoveCustom(c.id)} style={S.trashBtn} aria-label="Remove"><Trash2 size={14} /></button>
                    </div>
                ))}
                <form onSubmit={(e) => { e.preventDefault(); if (draft.trim()) { onAddCustom(draft.trim()); setDraft('') } }} style={S.addRow}>
                    <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a task for this entry…" style={S.addInput} />
                    <button type="submit" style={S.addBtn}><Plus size={16} /></button>
                </form>
            </Section>

            <Section icon={<NotebookPen size={15} />} title="Notes & reflections">
                <textarea value={row.notes} onChange={(e) => onNotes(e.target.value)} placeholder="Blockers, decisions, what broke, what to try next…" style={S.notesArea} />
            </Section>
        </div>
    )
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
    const [open, setOpen] = useState(true)
    return (
        <div style={S.section}>
            <button style={S.sectionHead} onClick={() => setOpen((o) => !o)}>
                <span style={S.sectionHeadLeft}>
                    <span style={{ color: T.accent }}>{icon}</span>
                    <span style={S.sectionTitle}>{title}</span>
                </span>
                {open ? <ChevronDown size={16} color={T.sub} /> : <ChevronRight size={16} color={T.sub} />}
            </button>
            {open && <div style={S.sectionBody}>{children}</div>}
        </div>
    )
}

function TodoRow({ label, text, checked, onClick }: { label?: string; text: string; checked: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick} style={S.todoRow}>
            <span style={S.checkBtn}>{checked ? <CheckCircle2 size={18} color={T.accent} /> : <Circle size={18} color={T.subFaint} />}</span>
            <span style={{ ...S.todoText, ...(checked ? S.todoTextDone : {}) }}>
                {label && <b style={S.todoLabel}>{label}</b>}
                {text}
            </span>
        </button>
    )
}

/* ============================ theme ============================ */

const T = {
    bg: '#12151b', panel: '#181c24', panel2: '#1e232c', panelBorder: '#2a2f3a',
    accent: '#e2a24a', accentDim: '#a97a3a', done: '#5fb89b',
    sub: '#9aa0ac', subFaint: '#565c68', text: '#eae7df',
    mono: "'IBM Plex Mono', 'JetBrains Mono', monospace",
    sans: "'IBM Plex Sans', Inter, system-ui, sans-serif",
}
const LED: Record<string, string> = { pending: T.subFaint, active: T.accent, done: T.done }

const S: Record<string, React.CSSProperties> = {
    app: { minHeight: '100vh', background: T.bg, color: T.text, fontFamily: T.sans, display: 'flex', flexDirection: 'column' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${T.panelBorder}`, position: 'sticky', top: 0, background: T.bg, zIndex: 5 },
    headerLeft: { display: 'flex', alignItems: 'center', gap: 10 },
    brandRow: { display: 'flex', alignItems: 'center', gap: 6 },
    brand: { fontFamily: T.mono, fontWeight: 600, fontSize: 14, letterSpacing: 1.5, color: T.text },
    brandSub: { fontSize: 11, color: T.sub, marginTop: 2 },
    dial: { position: 'relative', width: 52, height: 52 },
    dialText: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.mono, fontSize: 12, fontWeight: 600, color: T.accent },
    body: { display: 'flex', flex: 1, minHeight: 0, position: 'relative' },
    sidebar: { width: 300, flexShrink: 0, borderRight: `1px solid ${T.panelBorder}`, background: T.panel, display: 'flex', flexDirection: 'column', minHeight: 0 },
    searchWrap: { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', borderBottom: `1px solid ${T.panelBorder}` },
    searchInput: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: T.text, fontSize: 13, fontFamily: T.sans },
    sidebarList: { overflowY: 'auto', padding: '12px 10px', flex: 1 },
    phaseLabel: { fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, color: T.subFaint, textTransform: 'uppercase', padding: '4px 8px 6px' },
    stripBtn: { display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 8px', background: 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer', textAlign: 'left' },
    stripBtnActive: { background: T.panel2 },
    led: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0 },
    stripCode: { fontFamily: T.mono, fontSize: 10.5, color: T.sub, flexShrink: 0, minWidth: 44 },
    stripTitle: { fontSize: 12.5, color: T.text, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 },
    main: { flex: 1, minWidth: 0, overflowY: 'auto', padding: '22px 26px 60px' },
    panelWrap: { maxWidth: 760, margin: '0 auto' },
    panelHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
    panelEyebrow: { display: 'flex', alignItems: 'center', gap: 7, fontFamily: T.mono, fontSize: 11, letterSpacing: 1.2, color: T.accent, textTransform: 'uppercase', marginBottom: 8 },
    panelTitle: { fontFamily: T.mono, fontSize: 21, lineHeight: 1.3, margin: 0, color: T.text, fontWeight: 600 },
    panelMission: { fontSize: 13.5, color: T.sub, lineHeight: 1.55, marginTop: 8, maxWidth: 620 },
    ghostBtn: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: T.sub, background: 'transparent', border: `1px solid ${T.panelBorder}`, borderRadius: 6, padding: '6px 10px', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: T.sans },
    progressBarOuter: { height: 5, borderRadius: 3, background: T.panel2, overflow: 'hidden', marginTop: 6 },
    progressBarInner: { height: '100%', background: `linear-gradient(90deg, ${T.accentDim}, ${T.accent})`, transition: 'width .4s ease' },
    progressCaption: { fontFamily: T.mono, fontSize: 10.5, color: T.subFaint, marginTop: 6, marginBottom: 20 },
    section: { borderTop: `1px solid ${T.panelBorder}`, paddingTop: 10, marginTop: 10 },
    sectionHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0 10px' },
    sectionHeadLeft: { display: 'flex', alignItems: 'center', gap: 8 },
    sectionTitle: { fontFamily: T.mono, fontSize: 12, letterSpacing: 0.8, color: T.text, textTransform: 'uppercase' },
    sectionBody: { display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 14 },
    todoRow: { display: 'flex', alignItems: 'flex-start', gap: 10, width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px 6px', borderRadius: 6, textAlign: 'left' },
    checkBtn: { flexShrink: 0, marginTop: 1, background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' },
    todoText: { fontSize: 13.5, color: T.text, lineHeight: 1.5 },
    todoTextDone: { color: T.subFaint, textDecoration: 'line-through' },
    todoLabel: { color: T.accent, fontFamily: T.mono, fontSize: 11, marginRight: 8 },
    customRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '6px 6px' },
    trashBtn: { marginLeft: 'auto', background: 'none', border: 'none', color: T.subFaint, cursor: 'pointer', padding: 4, display: 'flex' },
    addRow: { display: 'flex', gap: 8, marginTop: 6, padding: '0 6px' },
    addInput: { flex: 1, background: T.panel2, border: `1px solid ${T.panelBorder}`, borderRadius: 6, padding: '8px 10px', color: T.text, fontSize: 13, outline: 'none', fontFamily: T.sans },
    addBtn: { background: T.panel2, border: `1px solid ${T.panelBorder}`, borderRadius: 6, color: T.accent, cursor: 'pointer', padding: '0 12px', display: 'flex', alignItems: 'center' },
    notesArea: { width: '100%', minHeight: 110, background: T.panel2, border: `1px solid ${T.panelBorder}`, borderRadius: 8, color: T.text, fontSize: 13.5, lineHeight: 1.5, padding: 12, outline: 'none', resize: 'vertical', fontFamily: T.sans, boxSizing: 'border-box' },
    saveFlash: { position: 'fixed', bottom: 16, right: 16, fontFamily: T.mono, fontSize: 10.5, letterSpacing: 1.2, color: T.accent, background: T.panel, border: `1px solid ${T.accentDim}`, borderRadius: 5, padding: '6px 10px', transition: 'opacity .5s ease', pointerEvents: 'none' },
    loginCard: { width: 340, maxWidth: '100%', background: T.panel, border: `1px solid ${T.panelBorder}`, borderRadius: 10, padding: 24 },
    loginError: { fontSize: 12, color: '#e08787', background: 'rgba(224,135,135,0.08)', border: '1px solid rgba(224,135,135,0.3)', borderRadius: 6, padding: '8px 10px', marginBottom: 14 },
    loginLabel: { display: 'block', fontFamily: T.mono, fontSize: 10.5, letterSpacing: 1, color: T.subFaint, textTransform: 'uppercase', margin: '10px 0 6px' },
    loginInput: { width: '100%', background: T.panel2, border: `1px solid ${T.panelBorder}`, borderRadius: 6, padding: '9px 10px', color: T.text, fontSize: 13.5, outline: 'none', boxSizing: 'border-box', fontFamily: T.sans },
    loginBtn: { width: '100%', marginTop: 18, background: T.accent, color: '#1a1508', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600, fontSize: 13.5, cursor: 'pointer' },
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-thumb { background: #2a2f3a; border-radius: 4px; }
  .iconBtn { background: none; border: none; color: ${T.text}; cursor: pointer; padding: 6px; display: flex; }
  .onlyMobile { display: none; }
  input::placeholder, textarea::placeholder { color: ${T.subFaint}; }
  input:focus, textarea:focus { border-color: ${T.accentDim} !important; }
  .stripBtn:hover, .todoRow:hover { background: ${T.panel2} !important; }
  .backdrop { display: none; }

  @media (max-width: 860px) {
    .onlyMobile { display: flex; }
    .sidebar {
      position: fixed !important; top: 0; bottom: 0; left: 0; z-index: 30;
      transform: translateX(-100%); transition: transform .25s ease;
      width: 82vw !important; max-width: 340px;
    }
    .sidebarOpen { transform: translateX(0); }
    .backdrop {
      display: block; position: fixed; inset: 0; background: rgba(0,0,0,0);
      z-index: 20; pointer-events: none; transition: background .25s ease;
    }
    .backdropOpen { background: rgba(0,0,0,0.55); pointer-events: auto; }
  }
`
