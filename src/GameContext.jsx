import React, { createContext, useReducer, useContext } from "react";

/**
 * LISTA DE ALIMENTE
 * 16 în total: 8 sănătoase, 8 nesănătoase.
 * Le folosim atât pentru UI (grid), cât și pentru logica scenariilor.
 */
const foods = [
  // NESĂNĂTOASE
  {
    id: "burger-fries",
    name: "Hamburger cu cartofi prăjiți",
    healthy: false,
    tags: ["very_hungry"],
    image: "/images/burger-fries.png",
  },
  {
    id: "pizza-cheese",
    name: "Pizza cu extra brânză",
    healthy: false,
    tags: ["very_hungry"],
    image: "/images/pizza-cheese.png",
  },
  {
    id: "donut",
    name: "Gogoașă glazurată",
    healthy: false,
    tags: ["sweet"],
    image: "/images/donut.png",
  },
  {
    id: "chips",
    name: "Chipsuri sărate",
    healthy: false,
    tags: ["salty", "snack"],
    image: "/images/chips.png",
  },
  {
    id: "ice-cream",
    name: "Înghețată",
    healthy: false,
    tags: ["sweet"],
    image: "/images/ice-cream.png",
  },
  {
    id: "shawarma",
    name: "Shaorma mare",
    healthy: false,
    tags: ["very_hungry", "fast_food"],
    image: "/images/shawarma.png",
  },
  {
    id: "chocolate-cake",
    name: "Tort de ciocolată",
    healthy: false,
    tags: ["sweet"],
    image: "/images/chocolate-cake.png",
  },
  {
    id: "kebab",
    name: "Kebab gras",
    healthy: false,
    tags: ["very_hungry", "fast_food"],
    image: "/images/kebab.png",
  },

  // SĂNĂTOASE
  {
    id: "wrap-chicken",
    name: "Wrap cu pui și salată",
    healthy: true,
    tags: ["very_hungry"],
    image: "/images/wrap-chicken.png",
  },
  {
    id: "salmon-veggies",
    name: "Somon cu legume",
    healthy: true,
    tags: ["very_hungry"],
    image: "/images/salmon-veggies.png",
  },
  {
    id: "salad-egg-avocado",
    name: "Salată cu ou și avocado",
    healthy: true,
    tags: ["very_hungry", "fresh"],
    image: "/images/salad-egg-avocado.png",
  },
  {
    id: "almonds-apple",
    name: "Migdale + un măr",
    healthy: true,
    tags: ["snack"],
    image: "/images/almonds-apple.png",
  },
  {
    id: "yogurt-fruit",
    name: "Iaurt grecesc cu fructe",
    healthy: true,
    tags: ["sweet"],
    image: "/images/yogurt-fruit.png",
  },
  {
    id: "veggie-soup",
    name: "Supă cremă de legume",
    healthy: true,
    tags: ["fresh"],
    image: "/images/veggie-soup.png",
  },
  {
    id: "rice-veggies-chicken",
    name: "Orez cu legume și pui",
    healthy: true,
    tags: ["very_hungry"],
    image: "/images/rice-veggies-chicken.png",
  },
  {
    id: "colorful-salad",
    name: "Salată colorată cu dressing de iaurt",
    healthy: true,
    tags: ["fresh"],
    image: "/images/colorful-salad.png",
  },
];

/**
 * SCENARII CBT
 * Fiecare scenariu: un client, un gând permisiv, un aliment nesănătos asociat,
 * o alternativă sănătoasă și un mesaj rațional (CBT).
 */
const scenarios = [
  {
    id: 1,
    clientName: "Andrei",
    avatar: "/images/Andrei.png",
    emotionLabel: "Oboseală, nevoie de recompensă",
    permissiveThought:
      "Vreau un hamburger cu cartofi prăjiți fiindcă am avut o zi grea azi și am nevoie să mă relaxez!",
    unhealthyFoodId: "burger-fries",
    healthyFoodId: "wrap-chicken",
    rationalMessage:
      "Faptul că ai avut o zi grea nu înseamnă că trebuie să-ți fie greu și pentru stomac. Poți să te relaxezi alegând ceva mai ușor pentru corpul tău.",
  },
  {
    id: 2,
    clientName: "Maria",
    avatar: "/images/Maria.png",
    emotionLabel: "Epuizare, dorință de confort",
    permissiveThought:
      "Vreau pizza cu extra brânză, viața e scurtă, trebuie să mă bucur de ea!",
    unhealthyFoodId: "pizza-cheese",
    healthyFoodId: "salmon-veggies",
    rationalMessage:
      "Viața e scurtă, tocmai de aceea are sens să ai grijă de corpul tău. Plăcerea de acum nu merită disconfortul de mai târziu.",
  },
  {
    id: 3,
    clientName: "Vlad",
    avatar: "/images/Vlad.png",
    emotionLabel: "Plictiseală, poftă de ceva dulce",
    permissiveThought:
      "Vreau o gogoașă glazurată, e doar una, ce rău poate să facă?",
    unhealthyFoodId: "donut",
    healthyFoodId: "yogurt-fruit",
    rationalMessage:
      "Gândul «e doar una» e o capcană. De obicei nu rămâne doar una. Poți să-ți satisfaci pofta și cu o variantă mai blândă cu organismul tău.",
  },
  {
    id: 4,
    clientName: "Ioana",
    avatar: "/images/Ioana.png",
    emotionLabel: "Agitație, nevoie de liniștire",
    permissiveThought:
      "Vreau chipsuri, simt că dacă ronțăi ceva crocant mă mai liniștesc.",
    unhealthyFoodId: "chips",
    healthyFoodId: "almonds-apple",
    rationalMessage:
      "Chipsurile îți ocupă mintea câteva minute, dar corpul tău rămâne agitat. Un snack mai sănătos îți poate aduce și sațietate, și mai puțină vinovăție.",
  },
  {
    id: 5,
    clientName: "Radu",
    avatar: "/images/Radu.png",
    emotionLabel: "Stres, căutare de confort",
    permissiveThought:
      "Vreau înghețată, mă ajută să uit de stres și să mă simt mai bine.",
    unhealthyFoodId: "ice-cream",
    healthyFoodId: "veggie-soup",
    rationalMessage:
      "Înghețata amorțește puțin emoțiile, dar nu rezolvă stresul. O masă ușoară îți susține corpul să facă față mai bine zilei de mâine.",
  },
  {
    id: 6,
    clientName: "Elena",
    avatar: "/images/Elena.png",
    emotionLabel: "Perfecționism, compensare",
    permissiveThought:
      "Vreau o shaorma mare, oricum am mâncat mai puțin zilele trecute, merit acum.",
    unhealthyFoodId: "shawarma",
    healthyFoodId: "rice-veggies-chicken",
    rationalMessage:
      "Restricțiile urmate de excese te țin blocat în același cerc. Poți alege acum o variantă sățioasă, fără să-ți pedepsești corpul.",
  },
  {
    id: 7,
    clientName: "Mihai",
    avatar: "/images/Mihai.png",
    emotionLabel: "Poftă intensă, frică de a rata plăcerea",
    permissiveThought:
      "Vreau tort de ciocolată, dacă nu mănânc acum o să rămân cu pofta.",
    unhealthyFoodId: "chocolate-cake",
    healthyFoodId: "salad-egg-avocado",
    rationalMessage:
      "Pofta nu e o urgență medicală. Poți să o recunoști, să o lași să treacă și să alegi ceva care îți susține obiectivele, nu le sabotează.",
  },
  {
    id: 8,
    clientName: "Sophia",
    avatar: "/images/Sophia.png",
    emotionLabel: "Relaxare de weekend, «amânare» a grijii de sine",
    permissiveThought:
      "Vreau un kebab gras, e weekend, nu are rost să mă stresez cu mâncatul sănătos.",
    unhealthyFoodId: "kebab",
    healthyFoodId: "colorful-salad",
    rationalMessage:
      "Weekendul e o șansă bună să te refaci, nu să-ți fie mai greu luni. Îți poți oferi relaxare și prin alegeri care te ajută pe termen lung.",
  },
];

/**
 * STAREA INIȚIALĂ A JOCULUI
 */
const initialState = {
  foods,
  scenarios,
  activeScenarioIndex: 0,
  score: 0,
  totalRounds: 0,
  lastChoice: null, // { scenarioId, foodId, isCorrect, isHealthy, message }
};

/**
 * REDUCER – gestionează alegerile și progresul
 */
function gameReducer(state, action) {
  switch (action.type) {
    case "CHOOSE_FOOD": {
      const { foodId } = action.payload;
      const scenario = state.scenarios[state.activeScenarioIndex];
      const chosenFood = state.foods.find((f) => f.id === foodId);

      if (!chosenFood) return state;

      const isCorrect = foodId === scenario.healthyFoodId;
      const isHealthy = chosenFood.healthy;

      let message;
      if (isCorrect) {
        message = scenario.rationalMessage;
      } else if (!isHealthy && foodId === scenario.unhealthyFoodId) {
        // a ales exact alimentul cerut, nesănătos
        message =
          "Ai întărit gândul permisiv. Pe moment pare că te liniștești, dar pe termen lung acest tip de alegere îți sabotează obiectivele.";
      } else {
        // a ales alt aliment greșit (nu e perechea sănătoasă pentru scenariul curent)
        message =
          "Această alegere nu răspunde neapărat nevoii din acest scenariu. Încearcă să cauți o variantă sănătoasă care să se potrivească cu pofta și contextul.";
      }

      return {
        ...state,
        score: state.score + (isCorrect ? 1 : 0),
        totalRounds: state.totalRounds + 1,
        lastChoice: {
          scenarioId: scenario.id,
          foodId,
          isCorrect,
          isHealthy,
          message,
        },
      };
    }

    case "NEXT_SCENARIO": {
      const nextIndex =
        (state.activeScenarioIndex + 1) % state.scenarios.length;
      return {
        ...state,
        activeScenarioIndex: nextIndex,
        lastChoice: null,
      };
    }

    case "RESET_GAME": {
      return {
        ...initialState,
      };
    }

    default:
      return state;
  }
}

/**
 * CONTEXT + HOOK PERSONALIZAT
 */
const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame trebuie folosit în interiorul GameProvider");
  }
  return ctx;
}
