import { useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <h1>Airline Club Plus</h1>
      <p>Improves the Airline-Club.com game experience.</p>
      <p>
        Source: <a href="https://github.com/brentwilson/airline-club-plus">Airline Club Plus</a>
      </p>
      <footer>Created by Brent Wilson</footer>{" "}
    </div>
  )
}

export default IndexPopup
