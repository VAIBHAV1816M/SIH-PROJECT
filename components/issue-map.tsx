"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Issue } from "@/lib/data"
import { MapPin, Layers, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import * as L from "leaflet"
import "leaflet/dist/leaflet.css"

interface IssueMapProps {
  issues: Issue[]
  onIssueClick?: (issue: Issue) => void
  height?: string
}

export function IssueMap({ issues, onIssueClick, height = "400px" }: IssueMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [mapZoom, setMapZoom] = useState<number>(12)

  const center = useMemo<[number, number]>(() => {
    if (issues && issues.length > 0) return issues[0].coordinates
    return [18.5204, 73.8567]
  }, [issues])

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // Delay init until container has non-zero size to avoid Leaflet _leaflet_pos errors
    const el = mapContainerRef.current
    if (el.clientWidth === 0 || el.clientHeight === 0) {
      const id = setTimeout(() => {
        // will re-run effect because dependencies unchanged but mapRef still null
      }, 50)
      return () => clearTimeout(id)
    }

    const map = L.map(mapContainerRef.current, {
      center,
      zoom: mapZoom,
      zoomControl: false,
      minZoom: 3,
      maxZoom: 19,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map)

    markersLayerRef.current = L.layerGroup().addTo(map)

    map.on("zoomend", () => setMapZoom(map.getZoom()))

    mapRef.current = map

    // Ensure proper sizing after mount
    setTimeout(() => {
      map.invalidateSize()
    }, 0)

    return () => {
      map.remove()
      mapRef.current = null
      markersLayerRef.current = null
    }
  }, [center, mapZoom])

  useEffect(() => {
    const map = mapRef.current
    const layer = markersLayerRef.current
    if (!map || !layer) return

    layer.clearLayers()

    issues.forEach((issue) => {
      const color = issue.status === "Open" ? "#ef4444" : issue.status === "In Progress" ? "#f59e0b" : "#22c55e"
      const marker = L.circleMarker(issue.coordinates, {
        radius: 8,
        color: "#fff",
        weight: 2,
        fillColor: color,
        fillOpacity: 1,
      })
        .addTo(layer)
        .on("click", () => {
          setSelectedIssue(issue)
          onIssueClick?.(issue)
        })

      const [lat, lng] = issue.coordinates
      marker.bindTooltip(`${issue.title} (${lat.toFixed(4)}, ${lng.toFixed(4)})`, { direction: "top" })
    })

    if (issues.length > 0) {
      const bounds = L.latLngBounds(issues.map((i) => i.coordinates as [number, number]))
      map.fitBounds(bounds.pad(0.2))
    } else {
      map.setView(center, mapZoom)
    }
  }, [issues, center, mapZoom, onIssueClick])

  const getStatusStats = () => {
    const stats = {
      Open: issues.filter((i) => i.status === "Open").length,
      "In Progress": issues.filter((i) => i.status === "In Progress").length,
      Completed: issues.filter((i) => i.status === "Completed").length,
    }
    return stats
  }

  const stats = getStatusStats()
  const safeZoomOut = () => {
    const map = mapRef.current
    if (!map) return
    map.invalidateSize()
    try {
      const current = map.getZoom()
      const centerLatLng = map.getCenter()
      map.setView(centerLatLng, Math.max(current - 1, 3))
    } catch {}
  }
  const safeZoomIn = () => {
    const map = mapRef.current
    if (!map) return
    map.invalidateSize()
    try {
      const current = map.getZoom()
      const centerLatLng = map.getCenter()
      map.setView(centerLatLng, Math.min(current + 1, 19))
    } catch {}
  }

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const handle = () => map.invalidateSize()
    window.addEventListener("resize", handle)
    return () => window.removeEventListener("resize", handle)
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Issue Locations</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={safeZoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={safeZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Layers className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{issues.length} issues</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Map Legend */}
          <div className="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
              <span className="text-sm text-gray-700">Open ({stats.Open})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-sm"></div>
              <span className="text-sm text-gray-700">In Progress ({stats["In Progress"]})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
              <span className="text-sm text-gray-700">Completed ({stats.Completed})</span>
            </div>
          </div>

          {/* Map Container */}
          <div className="relative rounded-lg overflow-hidden border border-gray-200 z-0" style={{ height }}>
            <div ref={mapContainerRef} className="w-full h-full" style={{ height }} />

            {/* Selected Issue Info */}
            {selectedIssue && (
              <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg border max-w-xs z-[1]">
                <h4 className="font-semibold text-sm mb-1">{selectedIssue.title}</h4>
                <p className="text-xs text-gray-600 mb-2">{selectedIssue.description.substring(0, 80)}...</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">{selectedIssue.location}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedIssue.status === "Open"
                        ? "bg-red-100 text-red-700"
                        : selectedIssue.status === "In Progress"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {selectedIssue.status}
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-gray-500">
                  Lat: {selectedIssue.coordinates[0].toFixed(6)}, Lng: {selectedIssue.coordinates[1].toFixed(6)}
                </div>
              </div>
            )}
          </div>

          {issues.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No issues to display on map</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
