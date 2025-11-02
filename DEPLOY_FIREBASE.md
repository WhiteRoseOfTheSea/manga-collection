# 🔥 Deploy Automatico Firebase Hosting

## 📋 Setup Iniziale (5 minuti)

### 1️⃣ Configura Firebase Hosting (se non l'hai già fatto)

```powershell
# Installa Firebase CLI
npm install -g firebase-tools

# Login a Firebase
firebase login

# Inizializza hosting (se non l'hai già fatto)
firebase init hosting
```

**Risposte durante init:**
- **Project**: Seleziona il tuo progetto Firebase
- **Public directory**: `dist` (importante!)
- **Single-page app**: `Yes`
- **GitHub integration**: `No` (lo facciamo manuale)

---

### 2️⃣ Ottieni la Service Account Key

1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Seleziona il tuo progetto
3. ⚙️ **Project Settings** → **Service Accounts**
4. Clicca **Generate new private key**
5. Scarica il file JSON (NON condividerlo mai!)

---

### 3️⃣ Crea Repository GitHub

```powershell
# Inizializza git (se non l'hai già fatto)
git init
git add .
git commit -m "Initial commit"

# Crea il repository su GitHub e collegalo
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/manga-collection.git
git push -u origin main
```

---

### 4️⃣ Aggiungi Secrets su GitHub

1. Vai su **Settings** del repository → **Secrets and variables** → **Actions**
2. Clicca **New repository secret** e aggiungi:

**`FIREBASE_SERVICE_ACCOUNT`**
```json
Incolla TUTTO il contenuto del file JSON scaricato al passo 2
(tutto, dalle prime { alle ultime })
```

**`FIREBASE_PROJECT_ID`**
```
il-tuo-project-id
```

Puoi trovare il Project ID in `firebase.json` o nella Firebase Console.

---

## ✨ Come Funziona

Ogni volta che fai `git push` sul branch `main`:
1. ✅ GitHub installa le dipendenze
2. ✅ Fa il build con Vite
3. ✅ Deploya automaticamente su Firebase Hosting
4. ✅ Il sito è live in 2-3 minuti!

---

## 🎯 Workflow Quotidiano

```powershell
# Fai le tue modifiche

# Commit
git add .
git commit -m "Descrizione modifiche"

# Push (deploy automatico!)
git push
```

**Il sito si aggiorna da solo!** 🎉

---

## 🌐 URL del Sito

Il tuo sito sarà disponibile su:
```
https://TUO-PROJECT-ID.web.app
```

oppure

```
https://TUO-PROJECT-ID.firebaseapp.com
```

---

## 🔧 Deploy Manuale (Opzionale)

Se vuoi deployare manualmente:

```powershell
npm run build
firebase deploy --only hosting
```

---

## 📊 Monitora il Deploy

1. Vai su **Actions** nel repository GitHub
2. Vedrai lo stato del deploy in tempo reale
3. Controlla i log in caso di errori

Oppure vai su Firebase Console → **Hosting** per vedere le versioni deployate.

---

## ⚠️ Note Importanti

- **Service Account**: Mantieni il JSON segreto! È come una password.
- **Branch**: Assicurati di pushare su `main` (o cambia nel workflow)
- **Build folder**: DEVE essere `dist` in `firebase.json`
- **firebase.json**: Controlla che sia configurato correttamente
- **Deploy time**: Primo deploy 3-5 minuti, successivi 1-2 minuti

---

## 🎨 Dominio Personalizzato

1. Vai su Firebase Console → **Hosting**
2. Clicca **Add custom domain**
3. Segui le istruzioni per configurare DNS
4. Firebase gestisce automaticamente SSL

---

## 🔥 Comandi Utili

```powershell
# Test locale prima del deploy
npm run dev

# Build di test
npm run build
npm run preview

# Deploy manuale
firebase deploy

# Vedi versioni precedenti
firebase hosting:channel:list
```

---

## ❓ Risoluzione Problemi

**Deploy fallisce?**
- Controlla che `FIREBASE_SERVICE_ACCOUNT` sia configurato correttamente
- Verifica che il Project ID sia corretto
- Controlla i log nella tab Actions di GitHub

**Sito non si aggiorna?**
- Cache del browser: premi Ctrl+F5
- Attendi 2-3 minuti per propagazione CDN
- Controlla la versione in Firebase Console

**Build fallisce?**
- Verifica che `npm run build` funzioni in locale
- Controlla errori nella tab Actions
