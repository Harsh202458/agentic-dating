import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Play, Info } from 'lucide-react'

export default function MatrixView() {
  const [people, setPeople] = useState([])
  const [matches, setMatches] = useState({})
  const [selectedPair, setSelectedPair] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('./data/profiles_analyzed.json').then(r => r.json()),
      fetch('./data/matches.json').then(r => r.json()),
    ]).then(([peopleData, matchData]) => {
      setPeople(peopleData)
      setMatches(matchData)
      if (peopleData.length >= 2) {
        const p1 = peopleData[0]
        const p2 = peopleData[1]
        const m = matchData[p1.id]?.[p2.id]
        setSelectedPair({ p1, p2, match: m })
      }
      setLoading(false)
    }).catch(console.error)
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-2">Calculating 600 Pairwise Dimensions</div>
      <div className="text-xl text-slate-300">Loading Compatibility Matrix...</div>
    </div>
  )

  const getScoreColor = (score) => {
    if (!score) return 'bg-slate-800 text-slate-500'
    if (score >= 85) return 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
    if (score >= 70) return 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
    return 'bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30'
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08] mb-8">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-rose-400 font-semibold mb-2">
            Global Compatibility Topology · 25 × 25 Matrix
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Pairwise Affinity Heatmap
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-2">
            Every cell represents a simulated multi-turn date between two autonomous agents. Click any cell to inspect the synergy thesis or replay the date in full.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 font-mono text-xs text-slate-400 bg-slate-900/80 p-3 rounded-lg border border-white/[0.08]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500/40 border border-rose-500" />
            <span>&ge; 85 (High Resonance)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/40 border border-amber-500" />
            <span>70–84 (Balanced)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-sky-500/40 border border-sky-500" />
            <span>&lt; 70 (Friction)</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Heatmap Grid */}
        <div className="lg:col-span-8 overflow-x-auto bg-[#0d1424] p-4 rounded-xl border border-white/[0.08]">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="p-1 font-mono text-[10px] text-slate-500 text-left sticky left-0 bg-[#0d1424]">Subject</th>
                {people.map(p => (
                  <th key={p.id} className="p-1 font-mono text-[9px] text-slate-400 min-w-[28px] truncate" title={p.name}>
                    {p.name.split(' ')[0].slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {people.map(pRow => (
                <tr key={pRow.id}>
                  <td className="p-1 font-mono text-[10px] text-slate-300 text-left whitespace-nowrap sticky left-0 bg-[#0d1424] pr-2">
                    {pRow.name.split(' ')[0]}
                  </td>
                  {people.map(pCol => {
                    if (pRow.id === pCol.id) {
                      return <td key={pCol.id} className="p-1"><span className="block w-6 h-6 rounded bg-slate-800/40 text-slate-600 font-mono text-[9px] leading-6">-</span></td>
                    }
                    const m = matches[pRow.id]?.[pCol.id]
                    const score = m?.compatibilityScore || 65
                    const isSelected = selectedPair &&
                      ((selectedPair.p1.id === pRow.id && selectedPair.p2.id === pCol.id) ||
                       (selectedPair.p1.id === pCol.id && selectedPair.p2.id === pRow.id))

                    return (
                      <td key={pCol.id} className="p-0.5">
                        <button
                          onClick={() => setSelectedPair({ p1: pRow, p2: pCol, match: m })}
                          className={`w-7 h-7 rounded text-[10px] font-mono font-semibold transition-all cursor-pointer ${getScoreColor(score)} ${
                            isSelected ? 'ring-2 ring-white scale-110 z-10' : ''
                          }`}
                          title={`${pRow.name} × ${pCol.name}: ${score}/100`}
                        >
                          {score}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Pair Detail Card */}
        <div className="lg:col-span-4 bg-[#101726] border border-white/[0.1] rounded-xl p-6 sticky top-24">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-slate-400 pb-3 border-b border-white/[0.08] mb-4">
            <Info size={13} className="text-rose-400" />
            <span>Pair Inspection Inspector</span>
          </div>

          {selectedPair ? (
            <div className="space-y-5">
              {/* Profile pair header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={selectedPair.p1.photo} alt={selectedPair.p1.name} className="w-12 h-12 rounded-lg object-cover border border-rose-500/40" />
                  <div>
                    <div className="font-bold text-sm text-white">{selectedPair.p1.name}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[120px]">{selectedPair.p1.headline}</div>
                  </div>
                </div>
                <div className="text-xl text-rose-400 font-serif italic">×</div>
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <div className="font-bold text-sm text-white">{selectedPair.p2.name}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[120px]">{selectedPair.p2.headline}</div>
                  </div>
                  <img src={selectedPair.p2.photo} alt={selectedPair.p2.name} className="w-12 h-12 rounded-lg object-cover border border-sky-500/40" />
                </div>
              </div>

              {/* Score block */}
              <div className="bg-[#0b0f17] p-4 rounded-lg border border-white/[0.06] text-center">
                <div className="font-mono text-[10px] uppercase text-slate-500 mb-1">Simulated Compatibility</div>
                <div className="text-4xl font-black text-rose-400 font-mono">
                  {selectedPair.match?.compatibilityScore || 75}
                  <span className="text-sm text-slate-500 font-normal"> / 100</span>
                </div>
              </div>

              {/* Match Reason */}
              <div className="space-y-1.5">
                <div className="font-mono text-xs uppercase tracking-wider text-slate-400">Synergy Analysis</div>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {selectedPair.match?.matchReason || 'Strong mutual alignment in creative momentum, lifestyle autonomy, and dedication to personal mission.'}
                </p>
              </div>

              {/* Sparks */}
              {selectedPair.match?.sparks && (
                <div className="space-y-1.5">
                  <div className="font-mono text-xs uppercase tracking-wider text-rose-400">Shared Catalysts</div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {selectedPair.match.sparks.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400 font-mono">✦</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
                <Link
                  to={`/date/${selectedPair.p1.id}/${selectedPair.p2.id}`}
                  className="flex-1 text-center font-mono text-xs font-semibold uppercase tracking-wider py-2.5 rounded bg-rose-500 hover:bg-rose-600 text-white transition-all flex items-center justify-center gap-2"
                >
                  <Play size={12} fill="currentColor" />
                  <span>Launch Date</span>
                </Link>
                <Link
                  to={`/rankings/${selectedPair.p1.id}`}
                  className="p-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="View Leaderboard"
                >
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-10">Select any matrix cell to inspect</p>
          )}
        </div>
      </div>
    </div>
  )
}
