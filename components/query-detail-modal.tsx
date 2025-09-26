"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Issue } from "@/lib/data"
import { Calendar, MapPin, User, AlertCircle, FileText, ImageIcon, Video, Volume2 } from "lucide-react"

interface QueryDetailModalProps {
  issue: Issue | null
  isOpen: boolean
  onClose: () => void
}

export function QueryDetailModal({ issue, isOpen, onClose }: QueryDetailModalProps) {
  if (!issue) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800 border-red-200"
      case "In Progress":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "text-red-600 bg-red-50"
      case "High":
        return "text-orange-600 bg-orange-50"
      case "Medium":
        return "text-yellow-600 bg-yellow-50"
      case "Low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono text-gray-500">{issue.id}</span>
                <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-900">{issue.title}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium text-gray-900">{issue.category}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    issue.priority === "Critical"
                      ? "bg-red-500"
                      : issue.priority === "High"
                        ? "bg-orange-500"
                        : issue.priority === "Medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                  }`}
                />
                <div>
                  <p className="text-sm text-gray-600">Priority</p>
                  <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Assigned To</p>
                  <p className="font-medium text-gray-900">{issue.assignedTo}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Submitted By</p>
                  <p className="font-medium text-gray-900">{issue.submittedBy}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Reported On</p>
                  <p className="font-medium text-gray-900">
                    {new Date(issue.reportedOn).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">{issue.location}</p>
                  <p className="text-sm text-gray-500">
                    Coordinates: {issue.coordinates[0]}, {issue.coordinates[1]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{issue.description}</p>
            </div>
          </div>

          {/* Image */}
          {issue.image && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Image</h3>
              <div className="overflow-hidden rounded-lg border">
                <Image
                  src={issue.image}
                  alt={issue.title}
                  width={1200}
                  height={675}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* Media Attachments */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Image Placeholder */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
              >
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Sample Image</p>
                  <p className="text-xs text-gray-500">Click to view</p>
                </div>
              </motion.div>

              {/* Video Placeholder */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
              >
                <div className="text-center">
                  <Video className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Sample Video</p>
                  <p className="text-xs text-gray-500">Click to play</p>
                </div>
              </motion.div>

              {/* Audio Placeholder */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
              >
                <div className="text-center">
                  <Volume2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Audio Note</p>
                  <p className="text-xs text-gray-500">Click to play</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button>Update Status</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
