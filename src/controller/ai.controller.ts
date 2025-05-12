import fetch from "node-fetch";
import { Request, Response } from "express";
import axios from "axios";
import readline from "readline";
import { Server } from "socket.io";

type OpenAIResponse = {
  choices: {
    message: {
      content: string;
    };
  }[];
};

export const improveText = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a grammar and style assistant." },
          {
            role: "user",
            content: "Improve the writing of this:\n\n" + content,
          },
        ],
      }),
    });

    const data = (await response.json()) as OpenAIResponse;
    res.json({ suggestion: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Failed to improve text", details: error });
  }
};

export const improveTest2Socket = (io: Server) => {
  io.on("connection", (socket) => {
    socket.on("improve-text", async ({ content }) => {
      if (!content) {
        socket.emit("improved-error", { error: "Missing blog content" });
        return;
      }

      try {
        const ollamaResponse = await axios({
          method: "post",
          url: "http://localhost:11434/api/generate",
          data: {
            model: "mistral",
            prompt: `Improve the following blog content and keep it concise (do not increase length by more than 100 words):\n\n${content}`,
            stream: true,
          },
          responseType: "stream",
        });

        const rl = readline.createInterface({
          input: ollamaResponse.data,
          crlfDelay: Infinity,
        });

        rl.on("line", (line) => {
          try {
            const parsed = JSON.parse(line);
            if (parsed?.response) {
              socket.emit("improved-chunk", parsed.response); // Send chunks to the client
            }
          } catch (e) {
            console.error("Invalid JSON line:", line);
          }
        });

        rl.on("close", () => {
          socket.emit("improved-end"); // Notify client that streaming is complete
        });
      } catch (err) {
        console.error(err);
        socket.emit("improved-error", {
          error: "Failed to stream response from Ollama",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

export const disconnectAll = async (req: Request, res: Response) => {
  try {
    const io: Server = req.app.get("io");
    if (!io) {
      res.status(500).json({ error: "Socket.IO server not initialized" });
      return;
    }
    io.disconnectSockets();
    res.json({ message: "All sockets disconnected" });
  } catch (error) {
    console.error("Error disconnecting sockets:", error);
    res
      .status(500)
      .json({ error: "Failed to disconnect sockets", details: error });
  }
};
