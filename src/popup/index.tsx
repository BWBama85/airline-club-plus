import { useState } from "react"
import { FaGithub } from "react-icons/fa"
import packageJson from "../../package.json"

import "./style.css"

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <div className="flex h-full min-w-[48rem] flex-wrap">
      <div className="navbar bg-neutral text-neutral-content">
        <div className="flex-1">
          <a className="btn-ghost btn text-xl normal-case">Airline Club Plus - v{packageJson.version}</a>
        </div>
        <div className="flex-none">
          <a
            className="btn-ghost btn text-2xl"
            title="Airline Club Plus GitHub"
            href="https://github.com/BWBama85/airline-club-plus">
            <FaGithub />
          </a>
        </div>
      </div>
      <div className="divider"></div>
      <section className="p-4 text-base">
        <p>
          This extension was built to enhance the Airline Club experience. It is not affiliated with Airline Club. The
          code is freely available and contributors are welcome. Please see the links below for more information or
          click the GitHub icon above to view the source code.
        </p>
      </section>
      <footer className="footer items-center bg-neutral p-4 text-neutral-content">
        <div className="grid-flow-col items-center">
          <p>
            {" "}
            Licensed under{" "}
            <a
              className="link"
              href="https://github.com/BWBama85/airline-club-plus/blob/main/LICENSE"
              title="Airline Club Plus license"
              target="_blank">
              GPLv3
            </a>
          </p>
        </div>
        <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <a
            title="About Brent Wilson"
            target="_blank"
            href="https://thewilsonnet.com/about"
            className="link-hover link">
            About Me
          </a>
          <a title="Email me" target="_blank" href="https://thewilsonnet.com/contact" className="link-hover link">
            Contact
          </a>
          <a
            title="Contribute to the project"
            target="_blank"
            href="https://github.com/BWBama85/airline-club-plus/blob/main/CONTRIBUTING.md"
            className="link-hover link">
            Contribute
          </a>
          <a
            title="Report a bug"
            target="_blank"
            href="https://github.com/BWBama85/airline-club-plus/issues"
            className="link-hover link">
            Bugs
          </a>
          <a className="link-hover link" href="https://www.plasmo.com/" title="Plasmo" target="_blank">
            Built with Plasmo
          </a>
        </div>
      </footer>
    </div>
  )
}

export default IndexPopup
