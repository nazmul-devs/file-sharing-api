import express from "express";
import request from "supertest";
import fileRouter from "../../src/api/file_manager/fileManager.routes";

const app = express();
app.use(express.json());

app.use("/files", fileRouter);

describe("File Manager API Integration Tests", () => {
  let uploadedFilePublicKey = null;
  let uploadedFilePrivateKey = null;

  // create file test
  it("POST /files - upload a file", async () => {
    const res = await request(app)
      .post("/files")
      .attach("file", Buffer.from("test file content"), "testfile.txt")
      .expect(201);

    expect(res.body.data).toHaveProperty("publicKey");
    expect(res.body.data).toHaveProperty("privateKey");

    uploadedFilePublicKey = res.body.data.publicKey;
    uploadedFilePrivateKey = res.body.data.privateKey;
  });

  // get all files test
  it("GET /files - get all files", async () => {
    const res = await request(app).get("/files").expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // get single file test
  it("GET /files/:publicKey - download a file", async () => {
    if (!uploadedFilePublicKey) return;

    const res = await request(app)
      .get(`/files/${uploadedFilePublicKey}`)
      .expect(200);

    expect(res.headers["content-type"]).toBeDefined();

    // Only check content-disposition if present
    if (res.headers["content-disposition"]) {
      expect(res.headers["content-disposition"]).toContain("attachment");
    } else {
      // console.warn(
      //   "⚠️ No content-disposition header found. Response:",
      //   res.body
      // );

      console.log("No content");
    }
  });

  // delete file test
  it("DELETE /files/:privateKey - delete a file", async () => {
    if (!uploadedFilePrivateKey) {
      return;
    }

    const res = await request(app)
      .delete(`/files/${uploadedFilePrivateKey}`)
      .expect(200);

    expect(res.body).toHaveProperty("success", true);
  });
});
