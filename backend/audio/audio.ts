import { api } from "encore.dev/api";
import busboy from "busboy";
import log from "encore.dev/log";
import fs from "fs";
import path from "path";
import { drizzle } from "../database";
import { media } from "../schema";

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
