import { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react'
import { parseCSV, csvRowsToEntries } from '../lib/csvImport'
import { useWorkouts } from '../hooks/useWorkouts'
import type { ParsedCSVRow } from '../lib/csvImport'

type Tab = 'csv' | 'json'

export default function Import() {
  const { workouts, importMany } = useWorkouts()
  const [tab, setTab] = useState<Tab>('csv')

  // CSV state
  const fileRef = useRef<HTMLInputElement>(null)
  const [csvRows,  setCsvRows]  = useState<ParsedCSVRow[] | null>(null)
  const [result,   setResult]   = useState<{ imported: number; skipped: number; reasons: string[] } | null>(null)
  const [csvError, setCsvError] = useState('')
  const [importing, setImporting] = useState(false)

  // JSON state
  const [jsonResult, setJsonResult] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const text = ev.target?.result as string
      try {
        const rows = parseCSV(text)
        setCsvRows(rows)
        setResult(null)
        setCsvError('')
      } catch {
        setCsvError('Failed to parse CSV file')
      }
    }
    reader.readAsText(file)
  }

  async function handleImport() {
    if (!csvRows) return
    setImporting(true)
    const entries = csvRowsToEntries(csvRows)
    const skipped = csvRows.filter(r => !r.valid)
    await importMany(entries)
    setResult({
      imported: entries.length,
      skipped:  skipped.length,
      reasons:  skipped.map(s => `Row ${s.rowIndex}: ${s.error}`),
    })
    setCsvRows(null)
    if (fileRef.current) fileRef.current.value = ''
    setImporting(false)
  }

  function handleExportJSON() {
    const data = JSON.stringify(workouts, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `starting-strength-backup-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleImportJSON(text: string) {
    try {
      const parsed = JSON.parse(text)
      if (!Array.isArray(parsed)) { setJsonResult('Error: Invalid format'); return }
      const existing = new Set(workouts.map(w => w.id))
      const newEntries = parsed.filter((e: { id: string }) => !existing.has(e.id))
      await importMany(newEntries)
      setJsonResult(`Imported ${newEntries.length} new entries`)
    } catch {
      setJsonResult('Error: Failed to parse JSON')
    }
  }

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-stone-900 mb-1">Import</h1>
      <p className="text-xs text-stone-500 mb-5">Upload training data from Google Sheets</p>

      {/* Tabs */}
      <div className="flex bg-stone-100 rounded-xl p-1 mb-5">
        {(['csv', 'json'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              tab === t ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {t === 'csv' ? 'CSV from Google Sheets' : 'JSON Backup'}
          </button>
        ))}
      </div>

      {tab === 'csv' && (
        <>
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 mb-4">
            <h3 className="text-xs font-semibold text-stone-700 mb-2">Expected CSV format</h3>
            <code className="text-xs text-stone-600 block leading-relaxed">
              date,squat_volume,squat_weight,<br />
              press_volume,press_weight,<br />
              deadlift_volume,deadlift_weight<br />
              <br />
              2024-01-15,1x5,100,1x5,60,1x5,140
            </code>
            <p className="text-xs text-stone-400 mt-2">
              Export from Google Sheets: File &rarr; Download &rarr; CSV
            </p>
          </div>

          {!csvRows && !result && (
            <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-stone-200 rounded-2xl p-8 cursor-pointer hover:border-amber-300 hover:bg-amber-50/30 transition-all">
              <Upload size={24} className="text-stone-300" />
              <div className="text-center">
                <div className="text-sm font-medium text-stone-700">Upload CSV file</div>
                <div className="text-xs text-stone-400 mt-0.5">Tap to select from your device</div>
              </div>
              <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleFileChange} className="hidden" />
            </label>
          )}

          {csvError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl p-3 mt-3 text-red-700 text-sm">
              <AlertCircle size={16} /> {csvError}
            </div>
          )}

          {csvRows && csvRows.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-stone-900">Preview</h3>
                <span className="text-xs text-stone-500">
                  {csvRows.filter(r => r.valid).length} valid / {csvRows.filter(r => !r.valid).length} invalid
                </span>
              </div>
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden mb-4">
                {csvRows.slice(0, 8).map((row, i) => (
                  <div key={i} className={`px-4 py-3 flex items-center gap-3 text-xs ${i > 0 ? 'border-t border-stone-100' : ''} ${!row.valid ? 'bg-red-50' : ''}`}>
                    {row.valid
                      ? <CheckCircle size={12} className="text-green-500 shrink-0" />
                      : <AlertCircle size={12} className="text-red-400 shrink-0" />}
                    <span className="text-stone-600 shrink-0">{row.date}</span>
                    {row.valid
                      ? <span className="text-stone-400">SQ {row.squatWeight ?? '—'}kg · PR {row.pressWeight ?? '—'}kg · DL {row.deadliftWeight ?? '—'}kg</span>
                      : <span className="text-red-500">{row.error}</span>}
                  </div>
                ))}
                {csvRows.length > 8 && (
                  <div className="px-4 py-2.5 text-xs text-stone-400 border-t border-stone-100">
                    +{csvRows.length - 8} more rows
                  </div>
                )}
              </div>
              <button
                onClick={handleImport}
                disabled={importing}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold py-3 rounded-2xl text-sm transition-colors"
              >
                {importing ? 'Importing…' : `Import ${csvRows.filter(r => r.valid).length} entries`}
              </button>
              <button
                onClick={() => { setCsvRows(null); if (fileRef.current) fileRef.current.value = '' }}
                className="w-full mt-2 py-2.5 text-sm text-stone-500 hover:text-stone-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {result && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-sm font-semibold text-green-900">Import complete</span>
              </div>
              <div className="text-sm text-green-700 mb-1">{result.imported} entries imported</div>
              {result.skipped > 0 && (
                <>
                  <div className="text-sm text-amber-700 mb-2">{result.skipped} rows skipped</div>
                  <div className="flex flex-col gap-1">
                    {result.reasons.slice(0, 5).map((r, i) => (
                      <div key={i} className="text-xs text-stone-500">{r}</div>
                    ))}
                  </div>
                </>
              )}
              <button onClick={() => setResult(null)} className="mt-3 text-xs text-green-700 hover:text-green-900 font-medium">
                Import another file
              </button>
            </div>
          )}
        </>
      )}

      {tab === 'json' && (
        <>
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 mb-4">
            <div className="flex items-start gap-2">
              <FileText size={14} className="text-stone-400 mt-0.5 shrink-0" />
              <p className="text-xs text-stone-600 leading-relaxed">
                Export a full backup of all workouts as JSON. Import it on another device or share with your instructor.
              </p>
            </div>
          </div>

          <button
            onClick={handleExportJSON}
            className="w-full flex items-center justify-center gap-2 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-medium py-3 rounded-2xl text-sm mb-4 transition-colors"
          >
            <Download size={16} />
            Export all data (JSON)
          </button>

          <JSONImport onImport={handleImportJSON} result={jsonResult} onClear={() => setJsonResult(null)} />
        </>
      )}
    </div>
  )
}

function JSONImport({
  onImport,
  result,
  onClear,
}: {
  onImport: (text: string) => void
  result: string | null
  onClear: () => void
}) {
  const [text, setText] = useState('')
  return (
    <>
      <div className="mb-3">
        <label className="block text-xs font-medium text-stone-500 mb-1.5">Paste JSON backup</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={5}
          placeholder='[{"id": "...", "date": "2024-01-15", ...}]'
          className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none"
        />
      </div>
      <button
        onClick={() => { onImport(text); setText('') }}
        disabled={!text.trim()}
        className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-stone-200 disabled:text-stone-400 text-white font-semibold py-3 rounded-2xl text-sm transition-colors"
      >
        Import JSON
      </button>
      {result && (
        <div className={`mt-3 p-3 rounded-xl text-sm flex items-center justify-between ${result.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          <span>{result}</span>
          <button onClick={onClear} className="text-xs opacity-60 hover:opacity-100">✕</button>
        </div>
      )}
    </>
  )
}
