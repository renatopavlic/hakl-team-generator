import { useRef, useState } from "react";
import { players } from "./const";
import { shuffleArray } from "./helpers";
import "./style.css";

function App() {
  const [teamOne, setTeamOne] = useState([]);
  const [teamTwo, setTeamTwo] = useState([]);
  const [playersList, setPlayersList] = useState(players || []);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  const nameRef = useRef("");
  const tierRef = useRef("");

  const handleCheckboxChange = (player) => (e) => {
    const { checked } = e.target;
    const existingPlayer = selectedPlayers?.find((p) => p.name === player.name);

    if (checked && !existingPlayer) {
      // add player
      setSelectedPlayers((old) => [...old, player]);
    }

    if (!checked && existingPlayer) {
      // delete player
      setSelectedPlayers((old) => old.filter((p) => p.name !== player.name));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrorMsg(null);

    const existingPlayer = playersList.find(
      (player) =>
        player.name.toLowerCase() === nameRef.current.value.toLowerCase()
    );
    if (existingPlayer) {
      setErrorMsg(
        <p style={{ color: "red", textAlign: "center" }}>
          Ovog vec imamo na listi
        </p>
      );
      return;
    }

    setPlayersList((old) => [
      ...old,
      {
        name: nameRef.current.value,
        tier: tierRef.current.value,
        image: "default.png",
      },
    ]);
  };

  const generateTeams = (players) => {
    const teamOne = [];
    const teamTwo = [];

    const groupedByTear = players.reduce((r, a) => {
      r[a.tier] = r[a.tier] || [];
      r[a.tier].push(a);
      return r;
    }, {});

    Object.entries(groupedByTear).forEach(([t, p]) => {
      shuffleArray(p);
    });

    Object.entries(groupedByTear).forEach(([group, playersArr]) => {
      console.log("players arr", playersArr);
      playersArr
        .sort((a, b) => (b.name === "reno") - (a.name === "reno"))
        .forEach((player) => {
          if (!teamOne.length) {
            teamOne.push(player.name);
            return;
          }

          if (!teamTwo.length) {
            teamTwo.push(player.name);
            return;
          }

          if (player.name === "reno") {
            if (teamOne.includes("joho")) {
              teamOne.push(player.name);
              return;
            }

            if (teamTwo.includes("joho")) {
              teamTwo.push(player.name);
              return;
            }
          }

          if (teamOne.length > teamTwo.length) {
            teamTwo.push(player.name);
            return;
          }

          if (teamOne.length <= teamTwo.length) {
            teamOne.push(player.name);
            return;
          }
        });
    });

    setTeamOne(teamOne);
    setTeamTwo(teamTwo);
  };

  return (
    <div className="app">
      <div>
        <h1 className="main-title">Dodaj igrača</h1>
        <form className="form-wrapper" onSubmit={handleSubmit}>
          <input placeholder="Ime" ref={nameRef} required />
          <input
            type="number"
            min="1"
            max="4"
            placeholder="Jakosna skupina"
            ref={tierRef}
            required
          />
          <button className="submit-btn" type="submit">
            Dodaj
          </button>
        </form>
      </div>
      {errorMsg ?? null}
      {/* List section */}
      <div>
        <h1 className="main-title">Tko dolazi</h1>
        <div className="player-list-wrapper">
          {playersList.map((player) => (
            <div
              key={player.name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={require(`./images/${player.image}`)}
                alt="reno"
                style={{
                  aspectRatio: 1,
                  height: 50,
                  maxWidth: 50,
                  objectFit: "cover",
                  borderRadius: "50%",
                  marginBottom: "0.5rem",
                }}
              />
              <div
                className="checkbox-wrapper"
                style={{ background: "white", padding: "0 5px" }}
              >
                <input
                  name={player.name}
                  type="checkbox"
                  onChange={handleCheckboxChange(player)}
                />
                <label>{player.name}</label>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Team Generator Section */}
      <div className="team-generator-wrapper">
        <h1 className="main-title">Team generator</h1>
        <button onClick={() => generateTeams(selectedPlayers)}>
          Generate Teams
        </button>
        <div style={{ display: "flex" }}>
          <div className="teams-wrapper">
            {teamOne.sort().map((player) => (
              <p key={player}>{player}</p>
            ))}
          </div>
          <div className="teams-wrapper">
            {teamTwo.sort().map((player) => (
              <p key={player}>{player}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
