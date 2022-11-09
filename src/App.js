import { useState } from "react";
import { players } from "./const";
import { shuffleArray } from "./helpers";

function App() {
  const [teamOne, setTeamOne] = useState([]);
  const [teamTwo, setTeamTwo] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);

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
    <div className="App">
      <h2>Tko dolazi</h2>
      {players.map((player) => (
        <div key={player.name}>
          <label>{player.name}</label>
          <input
            name={player.name}
            type="checkbox"
            onChange={handleCheckboxChange(player)}
          />
        </div>
      ))}
      <h1>Team generator</h1>
      <button onClick={() => generateTeams(selectedPlayers)}>
        Generate Teams
      </button>
      <div
        style={{ display: "flex", width: 500, justifyContent: "space-between" }}
      >
        <div>
          {teamOne.sort().map((player) => (
            <p key={player}>{player}</p>
          ))}
        </div>
        <div>
          {teamTwo.sort().map((player) => (
            <p key={player}>{player}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
