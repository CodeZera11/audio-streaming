"use client"

import Link from 'next/link'
import { audio } from '@/app/lib/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface AudioContainerProps {
  data: audio.AudioList
}

const AudioContainer: React.FC<AudioContainerProps> = ({ data }) => {

  const router = useRouter();

  const deleteAudio = async (id: string) => {
    try {
      const response = await axios.delete(`http://localhost:4000/audio/${id}`)
      console.log(response)
      router.refresh()
    } catch (error) {
      console.error(error)
    }

  }

  return (
    <div className="flex flex-col gap-2">
      {data.audios.map((audio) => (
        <div key={audio.id} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <Link href={`/audio/${audio.id}`} className="">
            {audio.fileName}
          </Link>
          <button
            onClick={() => deleteAudio(audio.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}

export default AudioContainer