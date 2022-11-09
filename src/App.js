import { useRef, useState } from "react";
import { players } from "./const";
import { shuffleArray } from "./helpers";
import "./style.css";

function App() {
  const [teamOne, setTeamOne] = useState([]);
  const [teamTwo, setTeamTwo] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  const nameRef = useRef("");
  const tierRef = useRef("");

  const handleCheckboxChange = (player) => (e) => {
    const { checked } = e.target;
    const existingPlayer = selectedPlayers?.find((p) => p.name === player.name);

    if (checked && !existingPlayer) {
      setSelectedPlayers((old) => [...old, player]);
    }

    if (!checked && existingPlayer) {
      setSelectedPlayers((old) => old.filter((p) => p.name !== player.name));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrorMsg(null);

    const existingPlayer = players.find(
      (player) =>
        player.name.toLowerCase() === nameRef.current.value.toLowerCase()
    );
    if (existingPlayer) {
      setErrorMsg("ovog vec imamo na list");
      return;
    }

    players.push({ name: nameRef.current.value, tier: tierRef.current.value });
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
      playersArr.forEach((player) => {
        if (!teamOne.length) {
          teamOne.push(player.name);
          return;
        }

        if (!teamTwo.length) {
          teamTwo.push(player.name);
          return;
        }

        if (teamOne.length >= teamTwo.length) {
          teamTwo.push(player.name);
          return;
        }

        if (teamOne.length < teamTwo.length) {
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
      {errorMsg ?? null}
      <div>
        <h1 className="main-title">Tko dolazi</h1>
        <div className="player-list-wrapper">
          {players.map((player) => (
            <div key={player.name} className="checkbox-wrapper">
              <input
                name={player.name}
                type="checkbox"
                onChange={handleCheckboxChange(player)}
              />
              <label>{player.name}</label>
            </div>
          ))}
        </div>
      </div>
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
