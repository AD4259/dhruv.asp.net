
import { GoogleGenAI, Type } from "@google/genai";
import { Project, BuildResult } from "../types";

export class GeminiCompilerService {
  private ai: GoogleGenAI;

  constructor() {
    // Initialize GoogleGenAI with the API key from environment variables as per guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async compileAndRun(project: Project): Promise<BuildResult> {
    // Collect all code from the project
    const sourceCode = Object.values(project.files)
      .filter(f => f.type === 'file')
      .map(f => `--- FILE: ${this.getFilePath(f, project.files)} ---\n${f.content}`)
      .join('\n\n');

    const prompt = `
      You are a high-performance .NET 7 Compiler and Runtime Simulator.
      Given the following C# / ASP.NET project files, "compile" them and provide the output of 'dotnet run'.
      
      If it's a Console App, provide the standard output.
      If it's an ASP.NET app (Web API or MVC), simulate a basic HTML or JSON response as if visiting the root URL.
      
      Project Type: ${project.template}
      
      Files:
      ${sourceCode}
      
      Respond in JSON format.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              success: { type: Type.BOOLEAN },
              output: { type: Type.STRING, description: "Console output or build logs" },
              previewUrlContent: { type: Type.STRING, description: "If web app, the HTML/JSON response content" },
              errors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    line: { type: Type.INTEGER },
                    column: { type: Type.INTEGER },
                    message: { type: Type.STRING },
                    code: { type: Type.STRING },
                    file: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["success", "output"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      
      return {
        success: result.success,
        output: result.output,
        errors: result.errors || [],
        previewUrl: result.previewUrlContent
      };
    } catch (error) {
      console.error("Compiler error:", error);
      return {
        success: false,
        output: "Internal Compiler Error: Could not connect to sandbox runtime.",
        errors: [{ line: 0, column: 0, message: "Sandbox communication failure", code: "IDE001", file: "System" }]
      };
    }
  }

  private getFilePath(file: any, allFiles: any): string {
    let path = file.name;
    let current = file;
    while (current.parentId) {
      current = allFiles[current.parentId];
      if (current) path = `${current.name}/${path}`;
      else break;
    }
    return path;
  }
}
