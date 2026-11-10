// Couleurs des cartes de l'emploi du temps et des événements.
// Le jour : fond pastel et couleur d'accent. La nuit (src/assets/nuit.css) : fond sombre teinté
// et accent adouci, pour ne pas éblouir.
// Les couleurs passent par des variables CSS (classes carte-… dans main.css et nuit.css).
export const COULEURS_CARTES = [
  { fond: '#D4E5FF', accent: '#002D72', fondNuit: '#1e2c47', accentNuit: '#a3bff2' },
  { fond: '#FFECC5', accent: '#F1B434', fondNuit: '#2c2819', accentNuit: '#e9c675' },
  { fond: '#E5DDFF', accent: '#7E5EEE', fondNuit: '#272446', accentNuit: '#bcaef5' },
  { fond: '#FFBABE', accent: '#EF6079', fondNuit: '#32222c', accentNuit: '#f09cab' },
  { fond: '#D0EDF2', accent: '#00778B', fondNuit: '#163039', accentNuit: '#7ccad8' },
]

export const couleurCarteAuHasard = () => COULEURS_CARTES[Math.floor(Math.random() * COULEURS_CARTES.length)]

// À poser sur l'élément racine de la carte (et sur un menu affiché hors de la carte)
export const variablesCarte = (couleur) => ({
  '--carte-fond': couleur.fond,
  '--carte-accent': couleur.accent,
  '--carte-fond-nuit': couleur.fondNuit,
  '--carte-accent-nuit': couleur.accentNuit,
})
