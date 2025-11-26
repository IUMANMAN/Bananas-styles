export default function MasonryGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 p-4">
      {children}
    </div>
  )
}
