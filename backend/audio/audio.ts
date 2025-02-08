import { api } from "encore.dev/api";
import busboy from "busboy";
import log from "encore.dev/log";
import fs from "fs";
import path from "path";

export const add = api.raw(
  {
    expose: true,
    method: "POST",
    path: "/add-audio",
    bodyLimit: null,
  },
  async (req, res) => {
    log.info("Uploading file...." + req.headers["content-type"]);
    const bb = busboy({
      headers: req.headers,
      limits: { files: 1 },
    });

    bb.on("file", (_, file, info) => {
      if (!fs.existsSync("uploads")) {
        fs.mkdirSync("uploads");
      }
      const saveLocation = path.join("uploads", info.filename);
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
