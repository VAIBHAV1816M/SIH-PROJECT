"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Issue } from "@/lib/data"
import { Calendar, MapPin, User, AlertCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface QueryCardProps {
  issue: Issue
  onViewDetails: (issue: Issue) => void
  delay?: number
  isManager?: boolean
  assignOptions?: {
    employees: { name: string; count: number; capacity: number }[]
    onAssign: (employeeName: string) => void
  }
}

export function QueryCard({ issue, onViewDetails, delay = 0, isManager = false, assignOptions }: QueryCardProps) {
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
        return "bg-red-500"
      case "High":
        return "bg-orange-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-mono text-gray-500">{issue.id}</span>
              <div className={`w-2 h-2 rounded-full ${getPriorityColor(issue.priority)}`} />
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
              {issue.assignedTo && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">Assigned</Badge>
              )}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
            {issue.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{issue.description}</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {issue.image && (
              <div className="overflow-hidden rounded-md border">
                <Image
                  src={issue.image}
                  alt={issue.title}
                  width={800}
                  height={450}
                  className="w-full h-44 object-cover"
                />
              </div>
            )}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{issue.category}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-medium">{issue.priority}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{issue.assignedTo}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(issue.reportedOn).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{issue.location}</span>
            </div>

            <div className="flex gap-2 mt-4">
              {isManager && issue.status === "Open" && !issue.assignedTo && assignOptions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default" className="flex-1">Assign</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {assignOptions.employees.map((emp) => (
                      <DropdownMenuItem
                        key={emp.name}
                        onClick={() => assignOptions.onAssign(emp.name)}
                        disabled={emp.count >= emp.capacity}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span className="truncate">{emp.name}</span>
                          <span className={`text-xs ${emp.count >= emp.capacity ? "text-red-600" : "text-gray-600"}`}>
                            {emp.count}/{emp.capacity}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button onClick={() => onViewDetails(issue)} className="flex-1" variant="outline">
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
