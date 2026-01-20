
import React from 'react';
import { FileCode, Folder, Globe, Terminal, Layout } from 'lucide-react';
import { Theme } from './types';

export const TEMPLATES = {
  console: {
    name: 'Console Application',
    description: 'A project for creating a command-line application that can run on .NET Core.',
    icon: <Terminal className="w-8 h-8 text-blue-400" />,
    files: {
      'root': { id: 'root', name: 'MyConsoleApp', type: 'folder', parentId: null, children: ['prog', 'csproj'], isOpen: true },
      'prog': { id: 'prog', name: 'Program.cs', type: 'file', parentId: 'root', content: `using System;

namespace MyConsoleApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
            Console.WriteLine("Current Time: " + DateTime.Now);
        }
    }
}` },
      'csproj': { id: 'csproj', name: 'MyConsoleApp.csproj', type: 'file', parentId: 'root', content: `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net7.0</TargetFramework>
  </PropertyGroup>
</Project>` }
    }
  },
  webapi: {
    name: 'ASP.NET Core Web API',
    description: 'A project template for creating an ASP.NET Core RESTful HTTP service.',
    icon: <Globe className="w-8 h-8 text-green-400" />,
    files: {
      'root': { id: 'root', name: 'MyWebApi', type: 'folder', parentId: null, children: ['prog', 'controller-dir'], isOpen: true },
      'prog': { id: 'prog', name: 'Program.cs', type: 'file', parentId: 'root', content: `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

var app = builder.Build();
app.MapControllers();
app.Run();` },
      'controller-dir': { id: 'controller-dir', name: 'Controllers', type: 'folder', parentId: 'root', children: ['ctrl'], isOpen: true },
      'ctrl': { id: 'ctrl', name: 'WeatherController.cs', type: 'file', parentId: 'controller-dir', content: `using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class WeatherController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { Message = "Hello from Gemini .NET Sandbox!", Temp = 25 });
}` }
    }
  },
  mvc: {
    name: 'ASP.NET Core MVC',
    description: 'A project template for creating an ASP.NET Core application with Views and Controllers.',
    icon: <Layout className="w-8 h-8 text-purple-400" />,
    files: {
      'root': { id: 'root', name: 'MyMvcApp', type: 'folder', parentId: null, children: ['prog', 'controllers', 'views'], isOpen: true },
      'prog': { id: 'prog', name: 'Program.cs', type: 'file', parentId: 'root', content: `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();

var app = builder.Build();
app.UseStaticFiles();
app.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}/{id?}");
app.Run();` },
      'controllers': { id: 'controllers', name: 'Controllers', type: 'folder', parentId: 'root', children: ['homectrl'], isOpen: true },
      'homectrl': { id: 'homectrl', name: 'HomeController.cs', type: 'file', parentId: 'controllers', content: `using Microsoft.AspNetCore.Mvc;

public class HomeController : Controller
{
    public IActionResult Index() => View();
}` },
      'views': { id: 'views', name: 'Views', type: 'folder', parentId: 'root', children: ['homeviewdir'], isOpen: true },
      'homeviewdir': { id: 'homeviewdir', name: 'Home', type: 'folder', parentId: 'views', children: ['indexview'], isOpen: true },
      'indexview': { id: 'indexview', name: 'Index.cshtml', type: 'file', parentId: 'homeviewdir', content: `@{ ViewData["Title"] = "Home Page"; }
<div class="text-center">
    <h1 class="display-4">Welcome to .NET Web IDE</h1>
    <p>Learn about <a href="https://docs.microsoft.com/aspnet/core">building Web apps with ASP.NET Core</a>.</p>
</div>` }
    }
  }
};

export const THEMES: Record<string, Theme> = {
  vscode_dark: {
    id: 'vscode_dark',
    name: 'Visual Studio Dark',
    colors: {
      activityBarBg: '#333333',
      sidebarBg: '#252526',
      editorBg: '#1e1e1e',
      terminalBg: '#1e1e1e',
      topBarBg: '#323233',
      statusBarBg: '#007acc',
      textMain: '#d4d4d4',
      textMuted: '#858585',
      border: '#2b2b2b',
      accent: '#0e639c',
      monacoTheme: 'vs-dark'
    }
  },
  dracula: {
    id: 'dracula',
    name: 'Dracula',
    colors: {
      activityBarBg: '#282a36',
      sidebarBg: '#21222c',
      editorBg: '#282a36',
      terminalBg: '#282a36',
      topBarBg: '#191a21',
      statusBarBg: '#6272a4',
      textMain: '#f8f8f2',
      textMuted: '#6272a4',
      border: '#44475a',
      accent: '#bd93f9',
      monacoTheme: 'vs-dark'
    }
  },
  monokai: {
    id: 'monokai',
    name: 'Monokai',
    colors: {
      activityBarBg: '#272822',
      sidebarBg: '#1e1f1c',
      editorBg: '#272822',
      terminalBg: '#272822',
      topBarBg: '#1e1f1c',
      statusBarBg: '#a6e22e',
      textMain: '#f8f8f2',
      textMuted: '#75715e',
      border: '#3e3d32',
      accent: '#f92672',
      monacoTheme: 'vs-dark'
    }
  },
  one_dark: {
    id: 'one_dark',
    name: 'One Dark Pro',
    colors: {
      activityBarBg: '#21252b',
      sidebarBg: '#21252b',
      editorBg: '#282c34',
      terminalBg: '#282c34',
      topBarBg: '#21252b',
      statusBarBg: '#21252b',
      textMain: '#abb2bf',
      textMuted: '#5c6370',
      border: '#181a1f',
      accent: '#61afef',
      monacoTheme: 'vs-dark'
    }
  },
  github_light: {
    id: 'github_light',
    name: 'GitHub Light',
    colors: {
      activityBarBg: '#f6f8fa',
      sidebarBg: '#f6f8fa',
      editorBg: '#ffffff',
      terminalBg: '#f6f8fa',
      topBarBg: '#ffffff',
      statusBarBg: '#24292f',
      textMain: '#24292f',
      textMuted: '#57606a',
      border: '#d0d7de',
      accent: '#0969da',
      monacoTheme: 'light'
    }
  }
};
