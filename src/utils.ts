import type { Server } from "bun";
import { readdir, readFile, stat } from "fs/promises";
import path from "path";
import { load } from "js-yaml";
import type { MdxMetadata } from "./types";

export const cloudflareGenerator = (req: Request, server: Server | null) =>
  req.headers.get("CF-Connecting-IP") ?? server?.requestIP(req)?.address ?? "";

export const readMdxFilesFromDir = async (
  dir: string
): Promise<Array<{ title: string; slug: string }>> => {
  const files = await readdir(dir);
  const mdxFiles = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dir, file);
      const stats = await stat(filePath);

      if (stats.isDirectory()) {
        return readMdxFilesFromDir(filePath);
      }

      if (file.endsWith(".mdx")) {
        const mdxContent = await readFile(filePath, "utf-8");
        const { metadata } = parseMdxContent(mdxContent);
        return metadata;
      }

      return null;
    })
  );

  return mdxFiles
    .flat()
    .filter((file): file is { title: string; slug: string } => file !== null);
};

export const parseMdxContent = (content: string) => {
  const [, frontmatter, markdown] = content.split("---");
  const metadata = load(frontmatter.trim()) as MdxMetadata;

  return { metadata, markdown: markdown.trim() };
};
