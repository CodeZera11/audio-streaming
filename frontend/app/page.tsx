"use client"

const HomePage = () => {



  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Uploading file...");
    const form = e.currentTarget as HTMLFormElement;
    const file = form.audioField.files[0];

    const formData = new FormData();

    formData.append("audioField", file);

    const endpoint = "http://localhost:4000/add-audio";

    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    })

    if (response.ok) {
      console.log("File uploaded successfully");
      // reset the form
      form.reset();
      alert("File uploaded successfully");
    }
  }

  return (
    <section className="flex w-full flex-col justify-center items-center">
      <form
        // method="POST"
        // encType="multipart/form-data"
        onSubmit={handleUpload}
      >
        <label htmlFor="audioField">Single file upload:</label>
        <input
          type="file"
          name="audioField"
          // acceept oinlyu audio files
          accept="audio/*"
        />
        <input type="submit" />
      </form>
    </section>
  );
}

export default HomePage;