interface HighlightedTextProps {
  text: string
  keywords: string[]
}

export default function HighlightedText({ text, keywords }: HighlightedTextProps) {
  if (!keywords || keywords.length === 0) {
    return <>{text}</>
  }

  // Create a regex pattern that matches any of the keywords (case-insensitive)
  const pattern = keywords
    .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // Escape special regex chars
    .join('|')
  
  const regex = new RegExp(`(${pattern})`, 'gi')
  
  // Split text by keywords while preserving the keywords
  const parts = text.split(regex)
  
  return (
    <>
      {parts.map((part, index) => {
        const isKeyword = keywords.some(
          k => k.toLowerCase() === part.toLowerCase()
        )
        
        if (isKeyword) {
          return (
            <span
              key={index}
              className="bg-yellow-200 px-1 py-0.5 rounded font-medium"
            >
              {part}
            </span>
          )
        }
        
        return <span key={index}>{part}</span>
      })}
    </>
  )
}
