import { FOURTH_SHADOW } from "@/lib/site";

const AUDIO = ["Interface", "Full audio", "Subtitles"];

export default function GameFacts() {
  return (
    <div className="grid gap-px overflow-hidden border border-chalk/10 bg-chalk/10 lg:grid-cols-3">
      <dl className="space-y-5 bg-[#0a0908] p-7">
        {FOURTH_SHADOW.facts.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[0.6rem] uppercase tracking-[0.26em] text-chalk/35">
              {label}
            </dt>
            <dd className="mt-1.5 text-[0.86rem] text-chalk/85">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="bg-[#0a0908] p-7">
        <p className="text-[0.6rem] uppercase tracking-[0.26em] text-chalk/35">
          Languages
        </p>
        <table className="mt-4 w-full text-left text-[0.82rem] text-chalk/85">
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">Language</span>
              </th>
              {AUDIO.map((a) => (
                <th
                  key={a}
                  scope="col"
                  className="pb-3 text-center text-[0.56rem] font-normal uppercase tracking-[0.14em] text-chalk/35"
                >
                  {a}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FOURTH_SHADOW.languages.map((language) => (
              <tr key={language} className="border-t border-chalk/8">
                <th scope="row" className="py-3 font-normal">
                  {language}
                </th>
                {AUDIO.map((a) => (
                  <td key={a} className="text-center text-blood-lit">
                    <span aria-hidden>✓</span>
                    <span className="sr-only">Supported</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#0a0908] p-7">
        <p className="text-[0.6rem] uppercase tracking-[0.26em] text-chalk/35">
          Tags
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {FOURTH_SHADOW.tags.map((tag) => (
            <li
              key={tag}
              className="border border-chalk/12 px-2.5 py-1.5 text-[0.7rem] text-chalk/65"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
