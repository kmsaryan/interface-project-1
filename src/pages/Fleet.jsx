import "../styles/FleetPage.css";

const fleetData = [
  {
    id: 1,
    name: "Excavator X200",
    image: "https://via.placeholder.com/100",
    profileLink: "/fleet/excavator-x200",
  },
  {
    id: 2,
    name: "Loader L500",
    image: "https://via.placeholder.com/100",
    profileLink: "/fleet/loader-l500",
  },
  {
    id: 3,
    name: "Dumper D300",
    image: "https://via.placeholder.com/100",
    profileLink: "/fleet/dumper-d300",
  },
];

export default function FleetPage() {
  return (
    <div className="fleet-container">
      <h1 className="fleet-title">Manage my fleet</h1>
      <div className="fleet-grid">
        {fleetData.map((machine) => (
          <div key={machine.id} className="fleet-card">
            <img src={machine.image} alt={machine.name} className="fleet-image" />
            <div className="fleet-info">
              <h2 className="fleet-name">{machine.name}</h2>
              <a href={machine.profileLink} className="fleet-button">View Profile</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
