"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReactNode } from "react"

interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
  delay?: number
}

export function ChartCard({ title, description, children, delay = 0 }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
          {description && <CardDescription className="text-sm text-gray-600">{description}</CardDescription>}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[300px] w-full">{children}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
