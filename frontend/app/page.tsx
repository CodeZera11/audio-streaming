import AudioUploader from "@/components/audio-uploader";
import getRequestClient from "./lib/getRequestClient";
import Link from "next/link";
import AudioContainer from "@/components/audio-container";


const HomePage = async () => {
  const client = getRequestClient();

  const data = await client.audio.list();

  return (
    <section className="space-y-10">
      <AudioUploader />
      <AudioContainer data={data} />
      {/* <div className="flex flex-col gap-2">
        {data.audios.map((audio) => (
          <div key={audio.id} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <Link href={`/audio/${audio.id}`} className="">
              {audio.fileName}
            </Link>
            <button>
              Delete
            </button>
          </div>
        ))}
      </div> */}
    </section>
  )
}

export default HomePage;