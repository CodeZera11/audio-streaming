import AudioUploader from "@/components/audio-uploader";
import getRequestClient from "./lib/getRequestClient";
import Link from "next/link";


const HomePage = async () => {
  const client = getRequestClient();

  const data = await client.audio.list();

  return (
    <section className="space-y-10">
      <AudioUploader />
      <div className="flex flex-col gap-2 overflow-y-scroll">
        {data.audios.map((audio) => (
          <Link href={`/audio/${audio.id}`} key={audio.id} className="">
            {audio.fileName}
          </Link>
        ))}
      </div>
    </section>
  )
}

export default HomePage;