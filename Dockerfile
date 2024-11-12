FROM node:18-alpine
WORKDIR /app

# Copier uniquement les fichiers de configuration pour installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste des fichiers
COPY . .

# Exposer le port utilisé par Next.js
EXPOSE 3000

# Démarrer le serveur en mode développement pour activer le hot reload
CMD ["npm", "run", "dev"]
