import { FOURTH_SHADOW } from "@/lib/site";

export default function SystemRequirements() {
  return (
    <div className="grid gap-px overflow-hidden border border-chalk/10 bg-chalk/10 md:grid-cols-2">
      {FOURTH_SHADOW.requirements.map(({ tier, specs }) => (
        <div key={tier} className="bg-[#0a0908] p-7">
          <h3 className="text-[0.72rem] uppercase tracking-[0.24em] text-chalk/80">
            {tier}
          </h3>
          <dl className="mt-6 space-y-3.5">
            {specs.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 text-[0.82rem]"
              >
                <dt className="text-chalk/35">{label}</dt>
                <dd className="text-chalk/80">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
