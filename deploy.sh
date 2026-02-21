#!/bin/bash
# Exemple d'automatisation simple: push to GitHub then deploy on Vercel via CLI (prérequis: vercel cli, git remote set)
echo "Assurez-vous d'avoir configuré VERCEL_TOKEN et variables d'environnement sur Vercel."
git init || true
git add .
git commit -m "Initial commit - Oracle du Fa prototype" || true
echo "Push to your GitHub repo and import on Vercel or run: vercel --prod"
