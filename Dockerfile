FROM node:18-alpine

WORKDIR /app

# Copier uniquement les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste des fichiers dans le conteneur
COPY . .

# Exposer le port de l'application
EXPOSE 3000

# Démarrer l'application en mode développement
CMD ["npm", "run", "dev"]