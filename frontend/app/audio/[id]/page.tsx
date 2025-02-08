import axios from "axios"

interface AudioPageProps {
  params: { id: string }
}


const AudioPage = async ({ params }: AudioPageProps) => {
  const id = params.id

  const endpoint = 'http://localhost:4000/audio/' + id

  const res = await axios.get(endpoint)
  if (res.status !== 200) {
    return <div>Failed to fetch audio</div>
  }

  if (!res.data) {
    return <div>Audio not found</div>
  }

  const audio = res.data

  return (
    <div>
      {JSON.stringify(audio.fileName)}
      <audio controls>
        <source src={`http://localhost:4000/audio/${audio.filename}`} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}

export default AudioPage