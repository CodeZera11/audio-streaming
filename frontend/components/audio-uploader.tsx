"use client"

import axios from "axios";
import { useEffect, useState } from "react";

const AudioUploader = () => {

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setProgress(0);
      }, 2000)
    }
  }, [progress])

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Uploading file...");
    const form = e.currentTarget as HTMLFormElement;
    const file = form.audioField.files[0];
    const formData = new FormData();

    formData.append("audioField", file);

    const endpoint = "http://localhost:4000/add-audio";

    const response = await axios.post(endpoint, formData, {
      onUploadProgress: (event) => {
        if (event.lengthComputable && event.total) {
          const progress = Math.round((event.loaded / event?.total) * 100);
          setProgress(progress);
        }
      }
    })

    // const response = await fetch(endpoint, {
    //   method: "POST",
    //   body: formData,
    // })

    if (response.status === 200) {
      console.log("File uploaded successfully");
      form.reset();
    }
  }


  return (
    <section className="flex w-full flex-col justify-center items-center">
      <form
        onSubmit={handleUpload}
      >
        <label htmlFor="audioField">Single file upload:</label>
        <input
          type="file"
          name="audioField"
          accept="audio/*"
        />
        <input type="submit" />
      </form>
      <div className="w-full bg-gray-200 h-1 mt-4">
        <div
          className="bg-green-500 h-1"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {progress > 0 && <p>{progress}%</p>}
      {progress === 100 && <p>File uploaded successfully</p>}
    </section>
  );
}

export default AudioUploader