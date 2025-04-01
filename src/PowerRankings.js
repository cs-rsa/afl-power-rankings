import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./PowerRankings.css";

const powerRankingsByWeek = {
  1: [
    { name: "Geelong Cats", logo: "/logos/geelong.png", value: 99 },
    { name: "Hawthorn Hawks", logo: "/logos/hawthorn.png", value: 96 },
    { name: "GWS Giants", logo: "/logos/giants.png", value: 95 },
    { name: "Brisbane Lions", logo: "/logos/brisbane.png", value: 90 },
    { name: "Melbourne Demons", logo: "/logos/melbourne.png", value: 80 },
    { name: "Adelaide Crows", logo: "/logos/adelaide.png", value: 80 },
    { name: "Gold Coast Suns", logo: "/logos/goldcoast.png", value: 80 },
    { name: "Collingwood Magpies", logo: "/logos/collingwood.png", value: 81 },
    { name: "Sydney Swans", logo: "/logos/sydney.png", value: 80 },
    { name: "Fremantle Dockers", logo: "/logos/fremantle.png", value: 70 },
    { name: "Port Adelaide Power", logo: "/logos/portadelaide.png", value: 73 },
    { name: "Western Bulldogs", logo: "/logos/bulldogs.png", value: 53 },
    { name: "Carlton Blues", logo: "/logos/carlton.png", value: 49 },
    { name: "Essendon Bombers", logo: "/logos/essendon.png", value: 49 },
    { name: "North Melbourne Kangaroos", logo: "/logos/northmelbourne.png", value: 33 },
    { name: "Richmond Tigers", logo: "/logos/richmond.png", value: 20 },
    { name: "St Kilda Saints", logo: "/logos/stkilda.png", value: 16 },
    { name: "West Coast Eagles", logo: "/logos/westcoast.png", value: 5 }
  ],
  2: [
    { name: "Adelaide Crows", logo: "/logos/adelaide.png", value: 88 },
    { name: "Brisbane Lions", logo: "/logos/brisbane.png", value: 86 },
    { name: "Carlton Blues", logo: "/logos/carlton.png", value: 65 },
    { name: "Collingwood Magpies", logo: "/logos/collingwood.png", value: 87 },
    { name: "Essendon Bombers", logo: "/logos/essendon.png", value: 48 },
    { name: "Fremantle Dockers", logo: "/logos/fremantle.png", value: 70 },
    { name: "Geelong Cats", logo: "/logos/geelong.png", value: 90 },
    { name: "Gold Coast Suns", logo: "/logos/goldcoast.png", value: 80 },
    { name: "GWS Giants", logo: "/logos/giants.png", value: 92 },
    { name: "Hawthorn Hawks", logo: "/logos/hawthorn.png", value: 99 },
    { name: "Melbourne Demons", logo: "/logos/melbourne.png", value: 55 },
    { name: "North Melbourne Kangaroos", logo: "/logos/northmelbourne.png", value: 50 },
    { name: "Port Adelaide Power", logo: "/logos/portadelaide.png", value: 75 },
    { name: "Richmond Tigers", logo: "/logos/richmond.png", value: 15 },
    { name: "St Kilda Saints", logo: "/logos/stkilda.png", value: 52 },
    { name: "Sydney Swans", logo: "/logos/sydney.png", value: 80 },
    { name: "West Coast Eagles", logo: "/logos/westcoast.png", value: 20 },
    { name: "Western Bulldogs", logo: "/logos/bulldogs.png", value: 73 }
  ],
  3: [
    { name: "Adelaide Crows", logo: "/logos/adelaide.png", value: 80 },
    { name: "Brisbane Lions", logo: "/logos/brisbane.png", value: 94 },
    { name: "Carlton Blues", logo: "/logos/carlton.png", value: 65 },
    { name: "Collingwood Magpies", logo: "/logos/collingwood.png", value: 87 },
    { name: "Essendon Bombers", logo: "/logos/essendon.png", value: 62 },
    { name: "Fremantle Dockers", logo: "/logos/fremantle.png", value: 70 },
    { name: "Geelong Cats", logo: "/logos/geelong.png", value: 90 },
    { name: "Gold Coast Suns", logo: "/logos/goldcoast.png", value: 88 },
    { name: "GWS Giants", logo: "/logos/giants.png", value: 91 },
    { name: "Hawthorn Hawks", logo: "/logos/hawthorn.png", value: 100 },
    { name: "Melbourne Demons", logo: "/logos/melbourne.png", value: 55 },
    { name: "North Melbourne Kangaroos", logo: "/logos/northmelbourne.png", value: 50 },
    { name: "Port Adelaide Power", logo: "/logos/portadelaide.png", value: 61 },
    { name: "Richmond Tigers", logo: "/logos/richmond.png", value: 15 },
    { name: "St Kilda Saints", logo: "/logos/stkilda.png", value: 60 },
    { name: "Sydney Swans", logo: "/logos/sydney.png", value: 80 },
    { name: "West Coast Eagles", logo: "/logos/westcoast.png", value: 20 },
    { name: "Western Bulldogs", logo: "/logos/bulldogs.png", value: 73 }
  ]
};

const PowerRankings = () => {
  const svgRef = useRef();
  const latestWeek = Math.max(...Object.keys(powerRankingsByWeek).map(Number));
  const [week, setWeek] = useState(latestWeek);
  const [playing, setPlaying] = useState(false);
  const nodesRef = useRef([]);

  useEffect(() => {
    const rawData = powerRankingsByWeek[week];
    const rankedTeams = rawData
      .slice()
      .sort((a, b) => b.value - a.value)
      .map((team, index) => ({ ...team, rank: index + 1 }));

    const svg = d3.select(svgRef.current);
    const width = 400;
    const height = 800;
    const radius = 25;
    const duration = 50;

    svg.attr("viewBox", [0, 0, width, height]);

    // Create <g> layers once
    if (svg.select("#lines").empty()) {
      svg.append("g").attr("id", "lines");
      svg.append("g").attr("id", "bubbles");
    }

    const linesLayer = svg.select("#lines");
    const bubbleLayer = svg.select("#bubbles");

    const yScale = d3.scaleLinear().domain([0, 100]).range([height - 50, 50]);
    const rankScale = d3.scaleLinear().domain([1, rankedTeams.length]).range([20, 280]);

    // Merge existing node data if available
    const nodes = rankedTeams.map((team) => {
      const existing = nodesRef.current.find((n) => n.name === team.name);
      return {
        ...team,
        x: existing?.x ?? 50,
        y: existing?.y ?? rankScale(team.rank),
        r: radius
      };
    });
    nodesRef.current = nodes;

    const lines = linesLayer.selectAll(".connector-line").data(nodes, d => d.name);
    const teamGroups = bubbleLayer.selectAll(".team-group").data(nodes, d => d.name);
    const numberBoxes = svg.selectAll(".rank-box").data(nodes, d => d.name);

    // ENTER lines
    lines.enter()
      .append("path")
      .attr("class", "connector-line")
      .attr("stroke", "#888")
      .attr("stroke-opacity", 0.4)
      .attr("fill", "none")
      .attr("stroke-width", 1.5);

    // ENTER bubbles
    const groupsEnter = teamGroups.enter()
      .append("g")
      .attr("class", "team-group")
      .attr("transform", d => `translate(${d.x - radius}, ${d.y - radius})`);

    groupsEnter.append("circle")
      .attr("r", radius)
      .attr("cx", radius)
      .attr("cy", radius)
      .attr("fill", "#ddd")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5);

    groupsEnter.append("image")
      .attr("xlink:href", d => d.logo)
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", radius * 2)
      .attr("width", radius * 2)
      .style("clip-path", "circle(50%)");

    // Hover event
    groupsEnter
      .on("mouseover", function () {
        d3.select(this).select("circle")
          .transition().duration(200)
          .attr("r", radius + 6)
          .attr("stroke-width", 3);
      })
      .on("mouseout", function () {
        d3.select(this).select("circle")
          .transition().duration(200)
          .attr("r", radius)
          .attr("stroke-width", 1.5);
      });

    // ENTER number boxes
    const boxEnter = numberBoxes.enter()
      .append("g")
      .attr("class", "rank-box")
      .attr("transform", d => `translate(${20}, ${rankScale(d.rank)})`);

    boxEnter.append("rect")
      .attr("width", 30)
      .attr("height", 12)
      .attr("fill", "#eee")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5);

    boxEnter.append("text")
      .attr("x", 15)
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "9px")
      .attr("fill", "black")
      .text(d => d.rank);

    // Simulation (does not reset origin)
    const simulation = d3.forceSimulation(nodes)
      .alphaDecay(0.05)
      .velocityDecay(0.1)
      .force("x", d3.forceX(width / 2).strength(0.03))
      .force("y", d3.forceY(d => yScale(d.value)).strength(0.3))
      .force("collide", d3.forceCollide(radius + 0.3).strength(1))
      .on("tick", () => {
        bubbleLayer.selectAll(".team-group")
          .data(nodes, d => d.name)
          .transition()
          .duration(duration)
          .attr("transform", d => `translate(${d.x - radius}, ${d.y - radius})`);

        linesLayer.selectAll(".connector-line")
          .data(nodes, d => d.name)
          .transition()
          .duration(duration)
          .attr("d", d =>
            `M50,${rankScale(d.rank) + 6} Q100,${(rankScale(d.rank) + d.y) / 2} ${d.x - radius + 2},${d.y}`
          );
      });
  }, [week]);

  useEffect(() => {
    if (!playing) return;
    const totalWeeks = Object.keys(powerRankingsByWeek).length;

    const interval = setInterval(() => {
      setWeek((prev) => {
        const next = prev + 1;
        if (next > totalWeeks) {
          clearInterval(interval);
          setPlaying(false);
          return prev;
        }
        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [playing]);

  return (
    <div className="power-rankings-container">
      <h2 className="widget-title">Cooper's AFL 2025 Power Rankings</h2>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: "10px" }}>
          Select Week:
          <select value={week} onChange={(e) => setWeek(parseInt(e.target.value))}>
            {Object.keys(powerRankingsByWeek).map((w) => (
              <option key={w} value={w}>Week {w}</option>
            ))}
          </select>
        </label>
        <button
          onClick={() => {
            setWeek(1);
            setPlaying(true);
          }}
          disabled={playing}
        >
          {playing ? "Playing..." : "Play All Weeks"}
        </button>
      </div>
      <svg ref={svgRef} width={400} height={800}></svg>
    </div>
  );
};

export default PowerRankings;
