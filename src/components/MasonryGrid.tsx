export default function MasonryGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-10 space-y-10 p-4">
      {children}
    </div>
  )
}
