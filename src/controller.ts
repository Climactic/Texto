import { Elysia } from "elysia";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { readMdxFilesFromDir, parseMdxContent } from "./utils";
import { MDX_DIR } from "./constants";

const router = new Elysia();

router.get("/api/posts", async () => {
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

router.get(
  "/api/posts/:category/:slug",
  async ({ params: { category, slug } }) => {
    const filePath = path.join(MDX_DIR, category, `${slug}.mdx`);

    try {
      await stat(filePath);
      const mdxContent = await readFile(filePath, "utf-8");
      const { metadata, markdown } = parseMdxContent(mdxContent);

      return {
        metadata,
        content: markdown,
      };
    } catch (error: any) {
      console.error(`Error reading file: ${filePath}`, error);
      if (error.code === "ENOENT") {
        return new Response("MDX file not found", { status: 404 });
      }
      throw new Error("Error processing MDX file");
    }
  }
);

export default router;
