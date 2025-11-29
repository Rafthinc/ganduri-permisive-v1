import React, { useEffect, useState } from "react"; // ⬅️ adăugăm useEffect + useState
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "./GameContext";

function App() {
  const { state, dispatch } = useGame();
  const scenario = state.scenarios[state.activeScenarioIndex];

  // 👉 stare pentru fereastra de început
  const [showIntro, setShowIntro] = useState(false);

  // 👉 afișăm modalul doar la prima accesare (folosim localStorage ca să ținem minte)
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem("cbt-nutrition-intro-seen");
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
  }, []);

  function handleCloseIntro() {
    localStorage.setItem("cbt-nutrition-intro-seen", "true");
    setShowIntro(false);
  }

  function handleChooseFood(foodId) {
    dispatch({ type: "CHOOSE_FOOD", payload: { foodId } });
  }

  function handleNext() {
    dispatch({ type: "NEXT_SCENARIO" });
  }

  function handleReset() {
    dispatch({ type: "RESET_GAME" });
  }

  return (
    <div className="app-root">
      {/* fundal restaurant */}
      <div className="background-overlay">
        <img
          src="/images/restaurant-realistic.png"
          alt="Restaurant"
          className="background-image"
        />
        <div className="background-gradient" />
      </div>

      {/* conținut */}
      <div className="app-content">
        {/* HEADER */}
        <header className="app-header">
          <div>
            <h1 className="app-title">
              Gânduri care vindecă · Joc de nutriție CBT
            </h1>
            <p className="app-subtitle">
              Ajută-ți clienții să aleagă variante sănătoase atunci când
              gândurile permisive îi împing spre mâncare nesănătoasă.
            </p>
          </div>

          <div className="header-stats">
            <div className="stat-pill">
              <span>Scor</span>
              <strong>{state.score}</strong>
            </div>
            <div className="stat-pill">
              <span>Runde</span>
              <strong>{state.totalRounds}</strong>
            </div>
          </div>
        </header>

        {/* LAYOUT PRINCIPAL */}
        <main className="layout">
          {/* STÂNGA – client + feedback + descriere aplicație */}
          <section className="client-section">
            <AnimatePresence mode="wait">
              <motion.div
                key={scenario.id}
                className="client-card glass-card"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
              >
                <div className="client-header">
                  <div className="client-avatar-wrapper">
                    <img
                      src={scenario.avatar}
                      alt={scenario.clientName}
                      className="client-avatar"
                    />
                  </div>
                  <div>
                    <h2 className="client-name">{scenario.clientName}</h2>
                    <p className="client-emotion">
                      Trigger (context): {scenario.emotionLabel}
                    </p>
                  </div>
                </div>

                <div className="client-thought">
                  <p className="label">Gând permisiv</p>
                  <p className="thought-text">„{scenario.permissiveThought}”</p>
                </div>

                <p className="client-instruction">
                  Alege un aliment pentru {scenario.clientName}.
                  <br />
                  Poți întări gândul permisiv sau poți oferi o alternativă
                  sănătoasă, însoțită de un gând rațional.
                </p>

                <div className="client-actions">
                  <button onClick={handleNext} className="btn ghost">
                    Următorul client
                  </button>
                  <button onClick={handleReset} className="btn outline">
                    Resetează jocul
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* feedback CBT */}
            <AnimatePresence>
              {state.lastChoice && (
                <motion.div
                  key={state.lastChoice.scenarioId + state.lastChoice.foodId}
                  className={`feedback-card ${
                    state.lastChoice.isCorrect
                      ? "feedback-success"
                      : "feedback-error"
                  }`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3>
                    {state.lastChoice.isCorrect
                      ? "Ai ales o variantă sănătoasă"
                      : "Ai întărit sau nu ai corectat gândul permisiv"}
                  </h3>
                  <p>{state.lastChoice.message}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 🔹 descriere permanentă aplicație */}
            <h2>Bine ai venit!</h2>

            <p>
              Acest joc te ajută să recunoști{" "}
              <strong>gândurile permisive</strong> – acele justificări care apar
              înainte de mâncatul impulsiv: „merit ceva bun”, „e doar una”, „am
              avut o zi grea”.
            </p>

            <p>
              Opțiunile <strong style={{ color: "#ef4444" }}>roșii</strong>{" "}
              întăresc gândul permisiv și duc la alegeri nesănătoase.
            </p>

            <p>
              Opțiunile <strong style={{ color: "#22c55e" }}>verzi</strong> te
              învață să răspunzi gândurilor cu un{" "}
              <strong>raționament sănătos</strong> și o variantă mai bună pentru
              corpul tău.
            </p>

            <p>
              Pe scurt: înveți cum gândurile îți influențează emoțiile și
              alegerile, și cum poți schimba acest proces prin CBT.
            </p>

            <p className="intro-author">
              Creat de Roșu Adrian-Francois – Psihoterapeut CBT, Nutriționist &
              Developer IT.
            </p>
          </section>

          {/* DREAPTA – grid alimente */}
          <section className="foods-section glass-card">
            <div className="foods-header">
              <h2>Alimente disponibile</h2>
              <p>
                Apasă pe un aliment pentru a i-l oferi clientului. Variantele
                sănătoase sunt marcate discret în verde, cele nesănătoase în
                roșu.
              </p>
            </div>

            <div className="foods-grid">
              {state.foods.map((food) => {
                const isHealthyChoice =
                  food.id === scenario.healthyFoodId && food.healthy;
                const isRequestedUnhealthy =
                  food.id === scenario.unhealthyFoodId && !food.healthy;

                return (
                  <motion.button
                    key={food.id}
                    className={`food-card ${
                      isHealthyChoice
                        ? "food-healthy"
                        : isRequestedUnhealthy
                        ? "food-unhealthy"
                        : ""
                    }`}
                    onClick={() => handleChooseFood(food.id)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="food-image-wrapper">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="food-image"
                      />
                    </div>
                    <div className="food-info">
                      <p className="food-name">{food.name}</p>
                      <p className="food-tag">
                        {food.healthy ? "Sănătos" : "Mai puțin sănătos"}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      {/* 🔹 MODAL DE ÎNCEPUT */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="intro-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="intro-modal glass-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h2>Bine ai venit în Jocul de nutriție CBT</h2>

              <p>
                În acest joc vei lucra cu <strong>gânduri permisive</strong> –
                acele justificări rapide care apar înainte de mâncatul impulsiv:
                „merit ceva bun”, „e doar una”, „am avut o zi grea”, „viața e
                scurtă”.
              </p>

              <p>
                Rolul tău este să alegi dacă îi oferi clientului alimentul
                <strong>nesănătos</strong> pe care îl cere (opțiune marcată cu{" "}
                <span style={{ color: "#ef4444" }}>roșu</span>, care întărește
                impulsul) sau o <strong>variantă sănătoasă</strong>
                (opțiune marcată cu{" "}
                <span style={{ color: "#22c55e" }}>verde</span>, care îl ajută
                să-și corecteze gândul permisiv și să-și recapete controlul).
              </p>

              <p>
                <span style={{ color: "#ef4444", fontWeight: "bold" }}>
                  ROȘU
                </span>{" "}
                = întărești gândul permisiv. Îi validezi ideea că „are voie”,
                „nu contează”, „nu e mare lucru”. Pe termen lung, asta duce la
                pierderea controlului, vinovăție și mâncat emoțional.
              </p>

              <p>
                <span style={{ color: "#22c55e", fontWeight: "bold" }}>
                  VERDE
                </span>{" "}
                = îl ajuți să răspundă gândului. Oferești un{" "}
                <strong>gând rațional</strong> și o alternativă sănătoasă care
                îl ajută să se simtă bine fizic și psihic, fără să-și saboteze
                obiectivele.
              </p>

              <p>
                Pe scurt: înveți cum{" "}
                <strong>gândurile influențează alegerile</strong>, cum apare
                <strong>mâncatul emoțional</strong>, și cum poate fi schimbat
                prin CBT. Poți folosi acest joc în autoreflecție, în terapie sau
                în programe educaționale despre relația dintre{" "}
                <strong>gânduri, emoții și comportamente alimentare</strong>.
              </p>

              <p className="intro-author">
                Creat de Roșu Adrian-Francois – Psihoterapeut CBT, Nutriționist
                & Developer IT.
              </p>

              <button className="btn primary" onClick={handleCloseIntro}>
                Înțeleg · Să începem
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
