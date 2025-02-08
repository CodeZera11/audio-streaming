import { api } from "encore.dev/api";
import busboy from "busboy";
import log from "encore.dev/log";
import fs from "fs";
import path from "path";
import { drizzle } from "../database";
import { media } from "../schema";
import { eq } from "drizzle-orm";

interface Audio {
  id: string;
  fileName: string;
  location: string;
  created_at: Date | null;
  updated_at: Date | null;
}

interface AudioList {
  audios: Audio[];
}

export const add = api.raw(
  {
    expose: true,
    method: "POST",
    path: "/add-audio",
    bodyLimit: null,
  },
  async (req, res) => {
    log.info("Uploading file...." + req.headers["content-type"]);

    let saveLocation: string;
    let fileName: string;

    const bb = busboy({
      headers: req.headers,
      limits: { files: 1 },
    });

    bb.on("file", (_, file, info) => {
      if (!fs.existsSync("uploads")) {
        fs.mkdirSync("uploads");
      }
      fileName = info.filename;
      saveLocation = path.join("uploads", info.filename);
      const writeStream = fs.createWriteStream(saveLocation);

      file.pipe(writeStream);

      writeStream.on("finish", () => {
        log.info(`File ${info.filename} uploaded`);
      });

      writeStream.on("error", (err) => {
        console.error(`Error saving file: ${err}`);
      });
    });

    bb.on("finish", async () => {
      bb.emit("close");
      log.info("Busboy processing complete.");
      await drizzle.insert(media).values({
        fileName: fileName,
        location: saveLocation,
      });
      res.writeHead(200, {
        Connection: "close",
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ message: "File uploaded successfully" }));
    });

    bb.on("error", async (err) => {
      res.writeHead(500, { Connection: "close" });
      res.end(`Error: ${(err as Error).message}`);
    });

    req.pipe(bb);
    return;
  }
);

export const list = api<{}, AudioList>(
  {
    method: "GET",
    expose: true,
    path: "/list-audio",
  },
  async () => {
    const data = await drizzle.select().from(media);

    return { audios: data ?? [] };
  }
);

// export const getOne = api<{ id: string }, Audio>(
//   {
//     expose: true,
//     method: "GET",
//     path: "/audio/:id",
//   },
//   async ({ id }) => {
//     const data = await drizzle.select().from(media).where(eq(media.id, id));
//     if (!data) {
//       throw new Error("Audio not found");
//     }

//     return { ...data[0] };
//   }
// );

export const streamAudio = api.raw(
  {
    expose: true,
    method: "GET",
    path: "/audio/:id",
  },
  async (req, res) => {
    const id = "11489834-544c-4ca2-ac5d-e8c875dc2a5b"; // Change this to the ID of the audio you want to stream
    const data = await drizzle.select().from(media).where(eq(media.id, id));

    if (!data) {
      throw new Error("Audio not found");
    }

    const filePath = path.join("uploads", data[0].fileName); // Change filename dynamically if needed

    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "File not found" }));
      return;
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Handle partial content for seeking in audio
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "audio/mpeg",
      });

      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      // Stream full audio if no range is specified
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "audio/mpeg",
      });

      fs.createReadStream(filePath).pipe(res);
    }
  }
);
