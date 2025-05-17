//Footer.jsx

import React from "react";
import "../styles/Footer.css";
import "../styles/global.css";

const team = [
  {
    name: "Helena Moyen",
    email: "helenamoyen@gmail.com",
    github: "https://github.com/hmoyen",
    linkedin: "", // Placeholder
  },
  {
    name: "Leo Valente",
    email: "leotvalente@gmail.com",
    github: "https://github.com/ohnizoel",
    linkedin: "",
  },
  {
    name: "Murilo Monteiro",
    email: "murilomonteiro@usp.br",
    github: "https://github.com/Muri-git-usp",
    linkedin: "",
  },
  {
    name: "Madhav Sai Aryan Kothareddy",
    email: "maky23@student.bth.se",
    github: "https://github.com/kmsaryan/",
    linkedin: "",
  },
  {
    name: "Ahmed Mahfooz Ali Khan",
    email: "ahmedmahfooz2me@gmail.com",
    github: "https://github.com/MAHFOOZ-16",
    linkedin: "",
  },
  {
    name: "Maja Svensson",
    email: "svenssonmaja@hotmail.com",
    github: "https://github.com/bananpankaka",
    linkedin: "",
  },
];

const col1 = team.slice(0, 3);
const col2 = team.slice(3);

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-team-columns">
        <ul className="footer-team-list">
          {col1.map((member) => (
            <li key={member.email} className="footer-team-member">
              <span className="footer-team-name">{member.name}</span>
              <span className="footer-team-sep">|</span>
              <a
                href={`mailto:${member.email}`}
                className="footer-team-email"
                title={member.email}
              >
                E-mail
              </a>
              <span className="footer-team-sep">|</span>
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-team-github"
              >
                GitHub
              </a>
              <span className="footer-team-sep">|</span>
              <span className="linkedin-placeholder">LinkedIn</span>
            </li>
          ))}
        </ul>
        <ul className="footer-team-list">
          {col2.map((member) => (
            <li key={member.email} className="footer-team-member">
              <span className="footer-team-name">{member.name}</span>
              <span className="footer-team-sep">|</span>
              <a
                href={`mailto:${member.email}`}
                className="footer-team-email"
                title={member.email}
              >
                E-mail
              </a>
              <span className="footer-team-sep">|</span>
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-team-github"
              >
                GitHub
              </a>
              <span className="footer-team-sep">|</span>
              <span className="linkedin-placeholder">LinkedIn</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="footer-bottom">
        <p className="footer-text">
          {new Date().getFullYear()} Team USP X BTH
        </p>
      </div>
    </footer>
  );
}