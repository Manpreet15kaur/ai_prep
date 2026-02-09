import { Upload, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

interface UploadZoneProps {
  file: File | null
  onFileSelect: (file: File) => void
}

export default function UploadZone({ file, onFileSelect }: UploadZoneProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0])
    }
  }

  return (
    <div>
      <label className="block">
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="border-2 border-dashed border-pink/30 rounded-xl p-12 text-center cursor-pointer hover:border-coral transition-all hover:bg-peach/10">
          <Upload className="mx-auto mb-4 text-coral" size={48} />
          <p className="font-medium mb-2">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-500">PDF or DOCX (Max 5MB)</p>
        </div>
      </label>

      {file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-peach/20 rounded-xl flex items-center gap-3"
        >
          <FileText className="text-coral" size={24} />
          <div className="flex-1">
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
