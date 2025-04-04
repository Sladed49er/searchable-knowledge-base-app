import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { loadQAStuffChain } from "langchain/chains";

export async function POST(req: NextRequest) {
  const { question } = await req.json();

  const vendorsPath = path.join(process.cwd(), "data/vendors");
  const filenames = await fs.readdir(vendorsPath);

  const docs = [];
  for (const filename of filenames) {
    if (filename.endsWith(".md")) {
      const content = await fs.readFile(path.join(vendorsPath, filename), "utf-8");
      docs.push({ pageContent: content, metadata: { source: filename } });
    }
  }

  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
  const splitDocs = await splitter.splitDocuments(docs);

  const embeddings = new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY });
  const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);

  const relevantDocs = await vectorStore.similaritySearch(question, 4);

  const llm = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const chain = loadQAStuffChain(llm);
  const response = await chain.run({ input_documents: relevantDocs, question });

  return NextResponse.json({ answer: response });
}
