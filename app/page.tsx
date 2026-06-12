import { Navbar }              from "@/components/Navbar"
import { Section01_Hero }      from "@/components/sections/Section01_Hero"
import { ScrollBand }          from "@/components/sections/ScrollBand"
import { Section03_UGC }       from "@/components/sections/Section03_UGC"
import { Section04_Features }  from "@/components/sections/Section04_Features"

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#bcc0ca" }}>
        <Section01_Hero />
        <ScrollBand />
        <Section03_UGC />
        <Section04_Features />
      </main>
    </>
  )
}
