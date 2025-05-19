import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/MachineProfile.css";
import { useDropzone } from "react-dropzone";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dn8rj0auz/image/upload";
const UPLOAD_PRESET = "sugar-2025";

export default function MachineProfilePage() {
  const { machineId } = useParams();
  const [machine, setMachine] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetch(`${backendUrl}/api/machines/get/${machineId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setMachine(data);
          console.log("Machine:", data);
        } else {
          setError("Machine not found.");
        }
      })
      .catch((err) => {
        setError("Error fetching machine: " + err.message);
        console.error(err);
      });

    fetch(`${backendUrl}/api/tickets/machine/${machineId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTickets(data.tickets);
          console.log("Tickets:", data.tickets);
        } else {
          console.error("Failed to fetch tickets");
        }
      })
      .catch((err) => {
        console.error("Error fetching tickets:", err);
      });
  }, [machineId, backendUrl]);

  const handleDrop = (acceptedFiles) => {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);
    formData.append("upload_preset", UPLOAD_PRESET);

    fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setImageUrl(data.secure_url);
        fetch(`${backendUrl}/api/machines/update_url/${machineId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: data.secure_url }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Machine URL updated:", data);
          })
          .catch((error) => console.error("Error updating machine URL:", error));
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: "image/*",
    maxFiles: 1,
  });

  if (error) return <p>{error}</p>;
  if (!machine) return <p>Loading...</p>;

  return (
    <div className="machine-profile">
      <div className="profile-header">
        <div className="profile-image-container" {...getRootProps()}>
          <input {...getInputProps()} />
          <img
            src={imageUrl || machine.url || "https://via.placeholder.com/100"}
            alt={machine.model}
            className="profile-image"
          />
        </div>
        <div className="machine-details">
          <h1>{machine.machine_model} Profile</h1>
          <p><strong>Serial Number:</strong> {machine.machine_number}</p>
        </div>
      </div>
      <h2>Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets found for this machine.</p>
      ) : (
        <div className="tickets-list">
          {tickets.map((ticket) => (
            <div
              key={ticket.ticket_id}
              className={`ticket-card ${ticket.resolved ? "resolved" : ""}`}
              onClick={() => setExpandedTicket(expandedTicket === ticket.ticket_id ? null : ticket.ticket_id)}
            >
              <h3>{ticket.title}</h3>
              <p>Status: {ticket.resolved ? "✅ Resolved" : "❌ Open"}</p>
              <p className="ticket-date">Created At: {new Date(ticket.created_at).toLocaleString()}</p>
              {expandedTicket === ticket.ticket_id && (
                <p className="ticket-description">{ticket.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
