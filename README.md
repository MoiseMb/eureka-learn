# 🚀 Eureka Learn

<div align="center">
  
  ![Eureka Learn Banner](https://via.placeholder.com/1200x300/0A0E1A/3B82F6?text=Eureka+Learn)
  
  <h3 align="center">Documentation complète des technologies de pointe propulsant l'avenir de l'apprentissage</h3>
  
  <p align="center">
    <a href="#technologies-principales">Technologies</a> •
    <a href="#interface--style">Interface</a> •
    <a href="#gestion-détat">État</a> •
    <a href="#installation">Installation</a> •
    <a href="#démarrage-rapide">Démarrage</a>
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-14.2.3-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  </p>
</div>

<br />

<div align="center">
  <img src="https://via.placeholder.com/800x450/0A0E1A/3B82F6?text=Eureka+Learn+Demo" alt="Eureka Learn Demo" />
  <p align="center"><i>Interface de documentation interactive avec animations fluides</i></p>
</div>

## ✨ Caractéristiques

- 🌐 **Interface réactive** - Expérience utilisateur optimisée sur tous les appareils
- 🎨 **Animations élégantes** - Transitions fluides et effets visuels modernes
- 🔍 **Navigation intuitive** - Accès rapide à toutes les sections de documentation
- 🌙 **Thème sombre** - Design élégant avec gradient et fond sombre
- ⚡ **Performances optimisées** - Chargement rapide et rendu efficace

## 🔧 Stack Technologique

### <a name="technologies-principales"></a>🚀 Technologies Principales

> _L'architecture fondamentale qui propulse Eureka Learn vers l'excellence_

<div align="center">
  <table>
    <tr>
      <td align="center" width="96">
        <img src="https://assets.vercel.com/image/upload/v1662130559/nextjs/favicon.png" width="48" height="48" alt="Next.js" />
        <br>Next.js
        <br><small>v14.2.3</small>
      </td>
      <td align="center" width="96">
        <img src="https://reactjs.org/favicon.ico" width="48" height="48" alt="React" />
        <br>React
        <br><small>v18</small>
      </td>
      <td align="center" width="96">
        <img src="https://www.typescriptlang.org/favicon-32x32.png" width="48" height="48" alt="TypeScript" />
        <br>TypeScript
        <br><small>v5.8.2</small>
      </td>
      <td align="center" width="96">
        <img src="https://nestjs.com/favicon.ico" width="48" height="48" alt="NestJS" />
        <br>NestJS
        <br><small>API</small>
      </td>
      <td align="center" width="96">
        <img src="https://www.prisma.io/favicon-32x32.png" width="48" height="48" alt="Prisma" />
        <br>Prisma
      </td>
      <td align="center" width="96">
        <img src="https://www.postgresql.org/favicon.ico" width="48" height="48" alt="PostgreSQL" />
        <br>PostgreSQL
      </td>
    </tr>
  </table>
</div>

### <a name="interface--style"></a>🎨 Interface & Style

> _Des outils modernes pour créer une expérience utilisateur exceptionnelle_

<div align="center">
  <table>
    <tr>
      <td align="center" width="96">
        <img src="https://tailwindcss.com/favicons/favicon-32x32.png" width="48" height="48" alt="TailwindCSS" />
        <br>TailwindCSS
        <br><small>v3.4.1</small>
      </td>
      <td align="center" width="96">
        <img src="https://www.radix-ui.com/favicon.ico" width="48" height="48" alt="Radix UI" />
        <br>Radix UI
      </td>
      <td align="center" width="96">
        <img src="https://ui.shadcn.com/favicon.ico" width="48" height="48" alt="Shadcn/ui" />
        <br>Shadcn/ui
      </td>
    </tr>
  </table>
</div>

### <a name="gestion-détat"></a>📦 Gestion d'État

> _Solutions robustes pour la gestion des données et des états_

<div align="center">
  <table>
    <tr>
      <td align="center" width="96">
        <img src="https://raw.githubusercontent.com/pmndrs/zustand/main/bear.jpg" width="48" height="48" alt="Zustand" />
        <br>Zustand
      </td>
      <td align="center" width="96">
        <img src="https://tanstack.com/favicon.ico" width="48" height="48" alt="TanStack Query" />
        <br>TanStack Query
      </td>
    </tr>
  </table>
</div>

## 🛠️ Animations & Effets Visuels

<details>
<summary>📋 Liste détaillée des animations</summary>
<br>

| Animation             | Description                                             | Implémentation                                       |
| --------------------- | ------------------------------------------------------- | ---------------------------------------------------- |
| `Écran de chargement` | Animation de rebond de la fusée avec texte progressif   | `animate-bounce`                                     |
| `Titre dégradé`       | Texte avec dégradé animé du bleu au violet puis au rose | `bg-gradient-to-r, animate-gradient`                 |
| `Apparition en fondu` | Apparition progressive des cartes de technologies       | `fadeIn` animation avec délai selon l'index          |
| `Hover des cartes`    | Effet de surbrillance au survol des cartes de tech      | `group-hover` avec transitions de couleur et bordure |
| `Lueur des cartes`    | Lueur de dégradé autour des cartes au survol            | `group-hover:opacity-10` sur un élément avec dégradé |
| `Navigation active`   | Indication visuelle de la section active                | Couleur de fond et de texte avec transition          |

</details>

### 🎬 Exemple d'animation CSS

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 8s ease infinite;
}
```

### 🖌️ Style du fond avec motif grille

```css
.bg-grid-pattern {
  background-image: linear-gradient(
      to right,
      rgba(55, 65, 81, 0.1) 1px,
      transparent 1px
    ), linear-gradient(to bottom, rgba(55, 65, 81, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

## <a name="installation"></a>📥 Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-utilisateur/eureka-learn.git

# Accéder au répertoire
cd eureka-learn

# Installer les dépendances
npm install
# ou avec yarn
yarn install
```

## <a name="démarrage-rapide"></a>🚀 Démarrage rapide

```bash
# Mode développement
npm run dev
# ou
yarn dev

# Construction pour production
npm run build
# ou
yarn build

# Démarrer en mode production
npm run start
# ou
yarn start
```

## 🌐 Accès à l'application

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir l'application.

## 📄 Structure du Projet

```
eureka-learn/
├── components/        # Composants React réutilisables
├── pages/             # Pages Next.js
├── public/            # Ressources statiques
├── styles/            # Feuilles de style CSS/Tailwind
├── lib/               # Utilitaires et hooks personnalisés
├── types/             # Définitions de types TypeScript
└── [...configuration] # Fichiers de configuration divers
```

## 🤝 Contribuer

Les contributions sont les bienvenues! N'hésitez pas à ouvrir une issue ou soumettre une pull request.

## 📝 Licence

[MIT](https://choosealicense.com/licenses/mit/)
