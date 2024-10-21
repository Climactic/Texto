import { Elysia } from "elysia";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { readMdxFilesFromDir, parseMdxContent, renderContent } from "./utils";
import { MDX_DIR } from "./constants";

const router = new Elysia({
  prefix: "/api",
});

router.get("/posts", async () => {
  try {
    const categories = await readdir(MDX_DIR);
    const posts = await Promise.all(
      categories.map(async (category) => {
        const categoryPath = path.join(MDX_DIR, category);
        const mdxFiles = await readMdxFilesFromDir(categoryPath);
        return { category, posts: mdxFiles };
      })
    );
    return posts;
  } catch (error) {
    console.error(error);
    throw new Error("Error retrieving posts");
  }
});

router.get("/posts/:category/:slug", async ({ params: { category, slug } }) => {
  const filePath = path.join(MDX_DIR, category, `${slug}.mdx`);

  try {
    await stat(filePath);

    const fileContent = await readFile(filePath, "utf-8");
    const { metadata, body } = parseMdxContent(fileContent);
    const content = await renderContent(body);

    return {
      metadata,
      content,
    };
  } catch (error: any) {
    console.error(`Error reading file: ${filePath}`, error);
    if (error.code === "ENOENT") {
      return new Response("File not found", { status: 404 });
    }
    throw new Error("Error processing file");
  }
});

export default router;
