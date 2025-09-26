"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { User } from "@/lib/auth"
import { getCurrentUser } from "@/lib/auth"
import { stats, chartData, hardcodedIssues } from "@/lib/data"
import { Navbar } from "@/components/navbar"
import { StatsCard } from "@/components/stats-card"
import { ChartCard } from "@/components/chart-card"
import { IssueMap } from "@/components/issue-map"
import { AlertTriangle, CheckCircle, Clock, Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function ManagerDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const [chartModal, setChartModal] = useState<{ open: boolean; title: string; dataKey: string }>(
    { open: false, title: "", dataKey: "" },
  )

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    if (currentUser.role !== "Manager") {
      router.push("/employee-dashboard")
      return
    }
    setUser(currentUser)
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-white">
      <Navbar currentPage="dashboard" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manager Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}. Here's your system overview.</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Issues"
            value={stats.totalIssues}
            icon={AlertTriangle}
            trend={{ value: 12, isPositive: false }}
            delay={0.1}
            onClick={() => setChartModal({ open: true, title: "Total Issues Trend", dataKey: "issues" })}
          />
          <StatsCard
            title="Open Issues"
            value={stats.openIssues}
            icon={CheckCircle}
            trend={{ value: 8, isPositive: true }}
            delay={0.2}
            onClick={() => setChartModal({ open: true, title: "Open Issues Trend", dataKey: "open" })}
          />
          <StatsCard
            title="Avg Resolution Time"
            value={`${stats.avgResolutionTime} days`}
            icon={Clock}
            trend={{ value: 15, isPositive: true }}
            delay={0.3}
            onClick={() => setChartModal({ open: true, title: "Resolution Trend", dataKey: "resolved" })}
          />
          <StatsCard
            title="Employee Count"
            value={stats.employeeCount}
            icon={Users}
            trend={{ value: 5, isPositive: true }}
            delay={0.4}
            onClick={() => setChartModal({ open: true, title: "Employee Trend", dataKey: "employees" })}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Reporting Trends */}
          <ChartCard title="Reporting Trends" description="Monthly issue reporting patterns" delay={0.5}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.reportingTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="issues"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Resolution Trends */}
          <ChartCard title="Resolution Trends" description="Monthly issue resolution patterns" delay={0.6}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.resolutionTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Issues Resolved */}
          <ChartCard title="Monthly Issues Status" description="Current status distribution" delay={0.7}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.monthlyResolved}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.monthlyResolved.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Issue Priorities (Trend)" description="Priority level distribution as trend" delay={0.8}>
          <ChartContainer
            className="h-full w-full"
            config={{
              count: { label: "Issues", color: "hsl(var(--chart-1))" },
            }}
          >
            <BarChart data={chartData.issuePriorities} margin={{ left: 16, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="priority" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[5, 5, 0, 0]} // Optional: Adds rounded corners to the top of the bars
              />
            </BarChart>
          </ChartContainer>
        </ChartCard>

          {/* Departmental Response Times */}
          <ChartCard title="Dept Response Times" description="Average response time by department" delay={0.9}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.departmentalResponse}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="department" stroke="#666" fontSize={10} angle={-45} textAnchor="end" height={60} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value) => [`${value} days`, "Avg Response Time"]}
                />
                <Bar dataKey="avgTime" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Map Section */}
        <div className="mb-8">
          <IssueMap issues={hardcodedIssues} height="400px" />
        </div>

        {/* Trend Modal */}
        <Dialog open={chartModal.open} onOpenChange={() => setChartModal((s) => ({ ...s, open: false }))}>
          <DialogContent className="max-w-5xl w-[90vw]">
            <DialogHeader>
              <DialogTitle>{chartModal.title}</DialogTitle>
            </DialogHeader>
            <ChartContainer
              className="h-[420px] w-full aspect-auto"
              config={{ count: { label: "Count", color: "#3b82f6" } }}
            >
              <LineChart
                data={
                  chartModal.dataKey === "resolved"
                    ? chartData.resolutionTrends
                    : chartModal.dataKey === "open"
                      ? chartData.openIssuesTrends
                      : chartModal.dataKey === "employees"
                        ? chartData.employeeTrends
                        : chartData.reportingTrends
                }
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey={
                    chartModal.dataKey === "resolved"
                      ? "resolved"
                      : chartModal.dataKey === "open"
                        ? "open"
                        : chartModal.dataKey === "employees"
                          ? "employees"
                          : "issues"
                  }
                  stroke="#3b82f6"
                  strokeWidth={5}
                  strokeLinecap="round"
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ChartContainer>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
