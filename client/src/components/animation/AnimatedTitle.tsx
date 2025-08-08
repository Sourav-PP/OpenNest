import { motion } from "framer-motion"
import React from "react"

export default function AnimatedTitle({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`text-4xl font-bold text-center ${className}`}
    >
      {children}
    </motion.h1>
  )
}