import type React from "react"

interface LoaderProps {
  isLoading: boolean
}

export const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <img src="../assets/images/s-r.png" alt="Logo" className="w-16 h-16 mx-auto mb-4" />
          <div className="absolute -inset-4 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Sr. Robot</h2>
        <p className="text-gray-600 dark:text-gray-300 animate-pulse">Cargando experiencia tecnológica...</p>
        <div className="mt-4 w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
