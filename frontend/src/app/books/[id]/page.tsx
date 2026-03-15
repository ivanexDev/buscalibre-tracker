interface BookPageProps {
  params: {
    id: string
  }
}

export default function BookPage({ params }: BookPageProps) {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Book Details</h1>
      <p className="text-gray-600">Book ID: {params.id}</p>
    </div>
  )
}
