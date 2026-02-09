# Build stage
FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Build l'application
RUN npm run build

# Exposer le port 3000
EXPOSE 3000

# Démarrer le serveur de preview Vite
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
