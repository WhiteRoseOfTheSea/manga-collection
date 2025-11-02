# 🚀 Quick Start - Deploy Firebase in 3 Passi

## 1️⃣ Ottieni la Service Account Key

```powershell
# Vai su Firebase Console
start https://console.firebase.google.com/

# Vai su: Project Settings → Service Accounts → Generate new private key
# Scarica il file JSON
```

## 2️⃣ Aggiungi i Secrets su GitHub

Vai su: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

**Secret 1:** `FIREBASE_SERVICE_ACCOUNT`
- Incolla TUTTO il contenuto del file JSON scaricato

**Secret 2:** `FIREBASE_PROJECT_ID`
- Inserisci il tuo Project ID (es. `manga-collection-12345`)

## 3️⃣ Push su GitHub

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/manga-collection.git
git push -u origin main
```

## ✅ Fatto!

Il sito si deploya automaticamente e sarà disponibile su:
```
https://TUO-PROJECT-ID.web.app
```

**Da ora in poi:** Ogni `git push` deploya automaticamente! 🎉

---

Leggi `DEPLOY_FIREBASE.md` per dettagli completi.
