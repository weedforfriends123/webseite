import { Section01_Hero }      from "@/components/sections/Section01_Hero"
import { ScrollBand }          from "@/components/sections/ScrollBand"
import { Section03_UGC }       from "@/components/sections/Section03_UGC"
import { Section04_Features }  from "@/components/sections/Section04_Features"
import { Section05 }           from "@/components/sections/Section05"
import { Section06_Reviews }   from "@/components/sections/Section06_Reviews"

export default function Home() {
  return (
    <>
      <main style={{ background: "#bcc0ca" }}>
        <Section01_Hero />
        <ScrollBand />
        <Section03_UGC />
        <Section04_Features />
        <Section05 />
        <Section06_Reviews />
      </main>
    </>
  )
}
