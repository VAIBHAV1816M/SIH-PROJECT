"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { getCurrentUser } from "@/lib/auth"
import { hardcodedIssues, type Issue } from "@/lib/data"
import { Navbar } from "@/components/navbar"
import { QueryCard } from "@/components/query-card"
import { QueryDetailModal } from "@/components/query-detail-modal"
import { IssueMap } from "@/components/issue-map"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus } from "lucide-react"

export default function QueriesPage() {
  const [user, setUser] = useState<any>(null)
  const [issues, setIssues] = useState<Issue[]>([])
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)

    // Show all issues for managers, only assigned issues for employees
    const userIssues =
      currentUser.role === "Manager"
        ? hardcodedIssues
        : hardcodedIssues.filter((issue) => issue.assignedTo === currentUser.name)

    setIssues(userIssues)
    setFilteredIssues(userIssues)
  }, [router])

  useEffect(() => {
    let filtered = issues

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((issue) => issue.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((issue) => issue.priority === priorityFilter)
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((issue) => issue.category === categoryFilter)
    }

    setFilteredIssues(filtered)
  }, [issues, searchTerm, statusFilter, priorityFilter, categoryFilter])

  const handleViewDetails = (issue: Issue) => {
    setSelectedIssue(issue)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedIssue(null)
  }

  const categories = [...new Set(issues.map((issue) => issue.category))]

  // Build assignee capacities and counts (out of 5) and sort ascending by current count
  const employeesCapacity = 5
  const employeeAssignmentCounts = issues.reduce<Record<string, number>>((acc, issue) => {
    if (issue.assignedTo) acc[issue.assignedTo] = (acc[issue.assignedTo] || 0) + 1
    return acc
  }, {})
  const uniqueEmployees = Array.from(new Set(hardcodedIssues.map((i) => i.assignedTo).filter(Boolean))) as string[]

  // Lightweight directory of recommended assignees per department with roles
  const staffDirectory: Record<string, { name: string; role: string }[]> = {
    "Solid Waste Management Department": [
      { name: "Rohan Kale", role: "SWM Supervisor" },
      { name: "Meera Joshi", role: "Sanitation Lead" },
      { name: "Vikas Patil", role: "Collection In-charge" },
    ],
    "Health & Sanitation Department": [
      { name: "Kavya Nair", role: "Sanitation Inspector" },
      { name: "Anil Sharma", role: "Hygiene Officer" },
    ],
    "Water Works Department": [
      { name: "Mohit Deshmukh", role: "Pipeline Technician" },
      { name: "Priya Kulkarni", role: "Maintenance Engineer" },
    ],
    "Public Works Department (PWD)": [
      { name: "Suresh Pawar", role: "Road Repair Lead" },
      { name: "Neha Bhosale", role: "Civil Engineer" },
    ],
    "Municipal Corporation Electrical Department": [
      { name: "Rahul Gupta", role: "Electrical Supervisor" },
      { name: "Sneha Verma", role: "Streetlight Technician" },
    ],
  }

  const keywordBoostMap: Record<string, string[]> = {
    garbage: ["Solid Waste Management Department"],
    dustbin: ["Solid Waste Management Department"],
    toilet: ["Health & Sanitation Department"],
    sanitize: ["Health & Sanitation Department"],
    leakage: ["Water Works Department"],
    water: ["Water Works Department"],
    pothole: ["Public Works Department (PWD)"],
    road: ["Public Works Department (PWD)"],
    streetlight: ["Municipal Corporation Electrical Department"],
    light: ["Municipal Corporation Electrical Department"],
  }

  const buildRecommended = (issue: Issue) => {
    // Determine target department strictly by keywords if present, otherwise use issue.category
    const text = `${issue.title} ${issue.description}`.toLowerCase()
    let targetDept: string | null = null
    for (const [kw, depts] of Object.entries(keywordBoostMap)) {
      if (text.includes(kw)) {
        targetDept = depts[0]
        break
      }
    }
    if (!targetDept) targetDept = issue.category

    const list = staffDirectory[targetDept] || []
    // Map to display string Name (Role)
    const labeled = list.map((p) => `${p.name} (${p.role})`)
    return [...new Set(labeled)]
  }

  const getEmployeesForAssign = (issue: Issue) => {
    const recommended = buildRecommended(issue)
    const toEntry = (label: string) => ({
      name: label,
      count: employeeAssignmentCounts[label] || 0,
      capacity: employeesCapacity,
    })
    const recommendedEntries = recommended.map(toEntry)
    recommendedEntries.sort((a, b) => a.count - b.count)
    return recommendedEntries
  }

  const handleAssign = (issueId: string, employeeName: string) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, assignedTo: employeeName } : i)),
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-white">
      <Navbar currentPage="queries" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Queries</h1>
              <p className="text-gray-600">
                {user.role === "Manager"
                  ? "Manage all system queries and track their progress."
                  : "View and manage your assigned queries."}
              </p>
            </div>
            {user.role === "Manager" && (
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>New Query</span>
              </Button>
            )}
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-gray-900">{issues.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-red-600">{issues.filter((i) => i.status === "Open").length}</div>
            <div className="text-sm text-gray-600">Open</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-orange-600">
              {issues.filter((i) => i.status === "In Progress").length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-green-600">
              {issues.filter((i) => i.status === "Completed").length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-purple-600">
              {issues.filter((i) => i.priority === "Critical" || i.priority === "High").length}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm border mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search queries by title, description, category, or assignee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Map Section */}
        <div className="mb-8">
          <IssueMap issues={filteredIssues} onIssueClick={handleViewDetails} height="350px" />
        </div>

        {/* Queries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue, index) => (
            <QueryCard
              key={issue.id}
              issue={issue}
              onViewDetails={handleViewDetails}
              delay={0.1 * (index + 3)}
              isManager={user?.role === "Manager"}
              assignOptions={{
                employees: getEmployeesForAssign(issue),
                onAssign: (employeeName) => handleAssign(issue.id, employeeName),
              }}
            />
          ))}
        </div>

        {filteredIssues.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No queries found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your filters to see more results."
                : "No queries available at the moment."}
            </p>
          </motion.div>
        )}
      </div>

      {/* Query Detail Modal */}
      <QueryDetailModal issue={selectedIssue} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}
