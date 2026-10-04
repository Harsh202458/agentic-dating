import { useEffect, useRef, useState } from 'react'

export default function UniverseCanvas({ people = [], onSelectPerson, onTriggerDate }) {
  const canvasRef = useRef(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [discoveryAlert, setDiscoveryAlert] = useState(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = (canvas.width = canvas.parentElement.clientWidth)
    let height = (canvas.height = canvas.parentElement.clientHeight)

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return
      width = canvas.width = canvas.parentElement.clientWidth
      height = canvas.height = canvas.parentElement.clientHeight
    }
    window.addEventListener('resize', handleResize)

    // Background stars
    const starCount = 80
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.2 + 0.05
    }))

    // Preload profile avatars
    const imageCache = {}
    people.forEach(p => {
      if (p.photo) {
        const img = new Image()
        img.src = p.photo
        img.crossOrigin = 'anonymous'
        imageCache[p.id] = img
      }
    })

    // Agent nodes
    const nodes = people.map((person, idx) => {
      const angle = (idx / people.length) * Math.PI * 2
      const radius = Math.min(width, height) * 0.35
      const centerX = width / 2
      const centerY = height / 2

      return {
        id: person.id,
        person,
        x: centerX + Math.cos(angle) * (radius * (0.6 + Math.random() * 0.7)),
        y: centerY + Math.sin(angle) * (radius * (0.6 + Math.random() * 0.7)),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        baseRadius: 18,
        pulse: Math.random() * Math.PI * 2,
        color: idx % 2 === 0 ? '#f43f5e' : '#38bdf8'
      }
    })

    // Active connection beam during autonomous discovery
    let activeBeam = null
    let beamTimer = null

    const triggerOrganicDiscovery = () => {
      if (nodes.length < 2) return
      const idxA = Math.floor(Math.random() * nodes.length)
      let idxB = (idxA + Math.floor(Math.random() * (nodes.length - 1)) + 1) % nodes.length
      const nA = nodes[idxA]
      const nB = nodes[idxB]

      const score = Math.floor(82 + Math.random() * 14)
      activeBeam = {
        nodeA: nA,
        nodeB: nB,
        progress: 0,
        score,
        alpha: 1
      }

      setDiscoveryAlert({
        pA: nA.person,
        pB: nB.person,
        score
      })

      setTimeout(() => {
        setDiscoveryAlert(null)
      }, 4200)

      beamTimer = setTimeout(triggerOrganicDiscovery, 8000 + Math.random() * 4000)
    }

    beamTimer = setTimeout(triggerOrganicDiscovery, 2500)

    let mouse = { x: -1000, y: -1000, isHovering: false }

    const onMouseMove = e => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.isHovering = true

      // Check hover
      let found = null
      for (const node of nodes) {
        const dx = node.x - mouse.x
        const dy = node.y - mouse.y
        if (Math.hypot(dx, dy) < node.baseRadius + 10) {
          found = node
          break
        }
      }

      if (found) {
        setHoveredNode(found.person)
        setTooltipPos({ x: e.clientX, y: e.clientY })
        canvas.style.cursor = 'pointer'
      } else {
        setHoveredNode(null)
        canvas.style.cursor = 'default'
      }
    }

    const onMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
      mouse.isHovering = false
      setHoveredNode(null)
    }

    const onClick = e => {
      const rect = canvas.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top

      for (const node of nodes) {
        const dx = node.x - clickX
        const dy = node.y - clickY
        if (Math.hypot(dx, dy) < node.baseRadius + 14) {
          if (onSelectPerson) onSelectPerson(node.person)
          break
        }
      }
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)
    canvas.addEventListener('click', onClick)

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw subtle stars
      stars.forEach(s => {
        s.y -= s.speed
        if (s.y < 0) s.y = height
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Update and draw nodes
      nodes.forEach(node => {
        // Subtle drift
        node.x += node.vx
        node.y += node.vy

        // Boundaries
        if (node.x < 40 || node.x > width - 40) node.vx *= -1
        if (node.y < 40 || node.y > height - 40) node.vy *= -1

        // Mouse repulsion
        const mdx = node.x - mouse.x
        const mdy = node.y - mouse.y
        const dist = Math.hypot(mdx, mdy)
        if (dist < 90 && dist > 0) {
          const force = (90 - dist) / 90
          node.x += (mdx / dist) * force * 1.5
          node.y += (mdy / dist) * force * 1.5
        }

        node.pulse += 0.03
        const pulseScale = 1 + Math.sin(node.pulse) * 0.1
        const isHovered = hoveredNode?.id === node.id

        // Glow ring
        ctx.save()
        ctx.beginPath()
        ctx.arc(node.x, node.y, (node.baseRadius + 6) * pulseScale, 0, Math.PI * 2)
        ctx.strokeStyle = isHovered ? '#f43f5e' : `${node.color}40`
        ctx.lineWidth = isHovered ? 2.5 : 1.2
        ctx.shadowColor = node.color
        ctx.shadowBlur = isHovered ? 20 : 10
        ctx.stroke()
        ctx.restore()

        // Avatar or orb
        ctx.save()
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.baseRadius, 0, Math.PI * 2)
        ctx.clip()

        const img = imageCache[node.id]
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.drawImage(
            img,
            node.x - node.baseRadius,
            node.y - node.baseRadius,
            node.baseRadius * 2,
            node.baseRadius * 2
          )
        } else {
          ctx.fillStyle = '#1e1b4b'
          ctx.fill()
          ctx.fillStyle = '#f8fafc'
          ctx.font = 'bold 11px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(node.person.name.charAt(0), node.x, node.y)
        }
        ctx.restore()
      })

      // Draw active discovery beam
      if (activeBeam) {
        activeBeam.progress += 0.015
        const { nodeA, nodeB, progress } = activeBeam

        // Glowing gradient line
        const grad = ctx.createLinearGradient(nodeA.x, nodeA.y, nodeB.x, nodeB.y)
        grad.addColorStop(0, '#f43f5e')
        grad.addColorStop(0.5, '#ec4899')
        grad.addColorStop(1, '#38bdf8')

        ctx.save()
        ctx.beginPath()
        ctx.moveTo(nodeA.x, nodeA.y)
        ctx.lineTo(nodeB.x, nodeB.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 2.5
        ctx.shadowColor = '#f43f5e'
        ctx.shadowBlur = 18
        ctx.stroke()

        // Travelling particle along connection
        const px = nodeA.x + (nodeB.x - nodeA.x) * (progress % 1)
        const py = nodeA.y + (nodeB.y - nodeA.y) * (progress % 1)
        ctx.beginPath()
        ctx.arc(px, py, 4, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.shadowColor = '#ffffff'
        ctx.shadowBlur = 12
        ctx.fill()
        ctx.restore()

        if (progress > 2.5) {
          activeBeam = null
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      clearTimeout(beamTimer)
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      canvas.removeEventListener('click', onClick)
    }
  }, [people, hoveredNode, onSelectPerson])

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Floating Hover Glass Dossier */}
      {hoveredNode && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-4 transition-all duration-150"
          style={{ left: tooltipPos.x, top: tooltipPos.y - 12 }}
        >
          <div className="glass-panel p-4 rounded-xl min-w-[240px] max-w-[280px] text-left border border-white/[0.15] shadow-2xl">
            <div className="flex items-center gap-3 pb-2.5 border-b border-white/[0.08]">
              <img
                src={hoveredNode.photo}
                alt={hoveredNode.name}
                className="w-10 h-10 rounded-full object-cover border border-rose-500/50"
                onError={e => { e.target.style.display = 'none' }}
              />
              <div>
                <div className="font-bold text-sm text-white">{hoveredNode.name}</div>
                <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{hoveredNode.headline}</div>
              </div>
            </div>

            <div className="mt-2.5 space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-rose-400">Agent Focus</div>
              <div className="flex flex-wrap gap-1">
                {(hoveredNode.interests || []).slice(0, 3).map((int, i) => (
                  <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                    {int}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400">Click to examine agent</span>
              <span className="text-rose-400 font-bold">READY →</span>
            </div>
          </div>
        </div>
      )}

      {/* Autonomous Discovery Toast */}
      {discoveryAlert && (
        <div className="absolute top-20 right-6 z-40 animate-fade-in pointer-events-none">
          <div className="glass-panel-glow px-4 py-3 rounded-xl border border-rose-500/40 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold">
                Agents Discovered a Potential Match
              </div>
              <div className="text-xs text-white font-medium mt-0.5">
                {discoveryAlert.pA.name} <span className="text-rose-400">×</span> {discoveryAlert.pB.name}
              </div>
            </div>
            <div className="font-mono text-base font-extrabold text-rose-400 ml-2">
              {discoveryAlert.score}%
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
