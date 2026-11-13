import Image, { getImageProps } from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import s from "./home.module.css";

/* ============================================================
   The 24 Frames homepage — editorial redesign.
   One warm palette (ivory, ink, oxblood, a touch of gold), two
   typefaces, native scrolling with gentle reveals, and a running
   order that leads with people: the founder, the way we work, the
   weddings, the recognition, and an invitation.
   ============================================================ */

const STEPS = [
  {
    no: "01",
    title: "We meet your people",
    body: "Before any camera comes out, we sit down with you — at the studio or on a call — to learn your families, your rituals and the moments you can't imagine losing.",
    image: "/images/gallery-experience/event-wise-photos-primary.webp",
    alt: "A couple laughing together during a mehendi ceremony",
  },
  {
    no: "02",
    title: "We plan it together",
    body: "Your own relationship manager builds the quotation with you, occasion by occasion and crew by crew — and can help with venues, décor, jewellery and makeup too.",
    image: "/images/gallery-experience/instagram-ready-shots-primary.webp",
    alt: "A bride in a red saree standing before a floral painting",
  },
  {
    no: "03",
    title: "We hand you an heirloom",
    body: "A private online gallery where every guest can find themselves, your films in a screening room of your own, and albums made to be passed down.",
    image: "/images/gallery-experience/heirloom-collection-primary.webp",
    alt: "An open heirloom wedding album with a hand-painted floral cover",
  },
];

const WEDDINGS = [
  {
    slug: "karthik-and-gayathri",
    names: "Karthik & Gayathri",
    place: "Botanical glasshouse · Hyderabad",
    line: "Cascading blush blooms, open verandas and a wedding that never stopped dancing.",
    image: "/images/stories/karthik-and-gayathri/IMG_6330_stories_cover.webp",
    position: "54% 10%",
  },
  {
    slug: "sirish-and-harshitha",
    names: "Sireesh & Harshitha",
    place: "Heritage palace grounds · Hyderabad",
    line: "From quiet Vedic ritual to a confetti-lit night under wisteria ceilings.",
    image: "/images/stories/sirish-and-harshitha/IMG_6353.webp",
    position: "center 22%",
  },
  {
    slug: "hrithika-abhishek",
    names: "Hrithika & Abhishek",
    place: "Celebration estate · Hyderabad",
    line: "Mangalasnanam at dawn, a celestial Sangeet by night — two moods, one family.",
    image: "/images/stories/hrithika-abhishek/IMG_6333.webp",
    position: "center 18%",
  },
  {
    slug: "bellam-srikonda",
    names: "Sai Sreenivas & Kavya",
    place: "Reception · Shamshabad",
    line: "Thousands of guests and the stars of Telugu cinema — and still, the glance only they shared.",
    image: "/images/stories/bellam-srikonda/IMG_6339.webp",
    position: "center 18%",
  },
];

const PRESS = [
  ["The Times of India", "/images/press/times-of-india.png"],
  ["The Hindu", "/images/press/the-hindu.png"],
  ["The Indian Express", "/images/press/indian-express.png"],
  ["Vogue", "/images/press/vogue.png"],
  ["Telangana Today", "/images/press/telangana-today.png"],
  ["ET Excellence", "/images/press/et-excellence.png"],
  ["Nikon", "/images/press/nikon.png"],
  ["WPPI", "/images/press/wppi.png"],
] as const;

const AWARDS = [
  { year: "2025", title: "Excellence in Luxury Wedding Photography", by: "Presented by Dia Mirza · Hyderabad" },
  { year: "2023", title: "Best Photography Service in Hyderabad", by: "Indian Eminent Awards" },
  { year: "Nikon", title: "Official creator, Nikon India", by: "Nikon Creator family" },
];

/* Art direction: a wide, quiet frame on large screens (room for the
   headline), a close portrait on phones. Only one is downloaded. */
function HeroPicture() {
  const common = { alt: "Hrithika and Abhishek on their wedding day", fill: true, priority: true, sizes: "100vw" } as const;
  const wide = getImageProps({ ...common, src: "/images/portfolio/hrithika-abhishek/cover.webp" }).props;
  const tall = getImageProps({ ...common, src: "/images/portfolio/karthik-gayathri/cover.webp" }).props;
  return (
    <picture>
      <source media="(min-width: 761px)" srcSet={wide.srcSet} sizes="100vw" />
      <source media="(max-width: 760px)" srcSet={tall.srcSet} sizes="100vw" />
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img {...wide} className={s.heroImg} />
    </picture>
  );
}

export default function HomeEditorial() {
  return (
    <div className={s.home}>
      {/* ── Hero: one photograph, one line ── */}
      <section id="hero" className={s.hero} aria-label="24 Frames">
        <HeroPicture />
        <div className={s.heroShade} aria-hidden="true" />
        <div className={s.heroCopy}>
          <p className={s.heroKicker}>Wedding photography &amp; films · Hyderabad</p>
          <h1 className={s.heroTitle}>
            Kept for the generations <em>after you.</em>
          </h1>
          <div className={s.heroCtas}>
            <Link href="/inquire" className={s.btnLight}>
              Begin your story
            </Link>
            <a href="#weddings" className={s.linkLight}>
              See the weddings
            </a>
          </div>
        </div>
      </section>

      {/* ── The founder ── */}
      <section id="artist" className={s.founder} data-header-theme="light" aria-labelledby="founder-title">
        <Reveal className={s.founderPhoto}>
          <Image
            src="/images/founder-portrait.webp"
            alt="Phani Gogireddy, founder of 24 Frames"
            width={1080}
            height={1080}
            sizes="(max-width: 900px) 100vw, 42vw"
          />
          <span className={s.photoNote} aria-hidden="true">
            since 2016
          </span>
        </Reveal>
        <Reveal className={s.founderText} delay={120}>
          <p className={s.kicker}>Meet the artist</p>
          <h2 id="founder-title" className={s.h2}>
            Hello, I&apos;m <em>Phani.</em>
          </h2>
          <p className={s.lead}>
            I started 24 Frames in 2016 in a small room with two computers and one belief: a wedding is the first
            chapter of a family&apos;s legacy.
          </p>
          <p className={s.body}>
            More than a thousand weddings later, across India and abroad, that belief still decides every frame. We are
            a bigger team now, working from a 6,000 sq. ft. studio in Hyderabad — but we still get to know your families,
            your rituals and the way you two move through a room, so that on the day it doesn&apos;t feel like being
            photographed. It feels like being among friends.
          </p>
          <p className={s.signature}>Phani Gogireddy</p>
          <p className={s.signRole}>Founder, 24 Frames</p>
          <Link href="/artist" className={s.textLink}>
            The full story
          </Link>
        </Reveal>
      </section>

      <section className={s.facts} data-header-theme="light" aria-label="24 Frames in numbers">
        <dl>
          <div><dt>2016</dt><dd>Founded in Hyderabad</dd></div>
          <div><dt>1,000+</dt><dd>Weddings filmed</dd></div>
          <div><dt>6,000 sq ft</dt><dd>Studio &amp; editing suites</dd></div>
          <div><dt>India &amp; abroad</dt><dd>Wherever you celebrate</dd></div>
        </dl>
      </section>

      {/* ── How we work ── */}
      <section id="experience" className={s.experience} data-header-theme="light" aria-labelledby="exp-title">
        <Reveal className={s.sectionHead}>
          <p className={s.kicker}>The 24 Frames experience</p>
          <h2 id="exp-title" className={s.h2}>
            Calm on the day, <em>because the work starts months before.</em>
          </h2>
        </Reveal>
        <ol className={s.steps}>
          {STEPS.map((step, i) => (
            <Reveal as="li" key={step.no} className={s.step} delay={i * 110}>
              <div className={s.stepImg}>
                <Image src={step.image} alt={step.alt} fill sizes="(max-width: 900px) 100vw, 30vw" />
              </div>
              <span className={s.stepNo}>{step.no}</span>
              <h3 className={s.h3}>{step.title}</h3>
              <p className={s.body}>{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ── Signature weddings ── */}
      <section id="weddings" className={s.weddings} data-header-theme="light" aria-labelledby="wed-title">
        {/* Older links point at /#vows. */}
        <span id="vows" className={s.anchor} aria-hidden="true" />
        <Reveal className={s.sectionHead}>
          <p className={s.kicker}>Signature weddings</p>
          <h2 id="wed-title" className={s.h2}>
            Four weddings, <em>four entirely different stories.</em>
          </h2>
        </Reveal>
        <div className={s.wedGrid}>
          {WEDDINGS.map((w, i) => (
            <Reveal as="article" key={w.slug} className={s.wed} delay={(i % 2) * 110}>
              <Link href={`/stories/${w.slug}`} className={s.wedLink}>
                <span className={s.wedImg}>
                  <Image
                    src={w.image}
                    alt={`${w.names} on their wedding day`}
                    fill
                    sizes="(max-width: 900px) 100vw, 45vw"
                    style={{ objectPosition: w.position }}
                  />
                </span>
                <span className={s.wedPlace}>{w.place}</span>
                <span className={s.wedNames}>{w.names}</span>
                <span className={s.wedLine}>{w.line}</span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className={s.center}>
          <Link href="/stories" className={s.btnDark}>
            All wedding stories
          </Link>
        </div>
      </section>

      {/* ── Recognition ── */}
      <section className={s.press} data-header-theme="light" aria-labelledby="press-title">
        <Reveal className={s.sectionHead}>
          <p className={s.kicker} id="press-title">As seen in &amp; recognised by</p>
        </Reveal>
        <ul className={s.logos}>
          {PRESS.map(([name, src]) => (
            <li key={name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={name} loading="lazy" decoding="async" />
            </li>
          ))}
        </ul>
        <ul className={s.awards}>
          {AWARDS.map((a) => (
            <Reveal as="li" key={a.title} className={s.award}>
              <span className={s.awardYear}>{a.year}</span>
              <span className={s.awardTitle}>{a.title}</span>
              <span className={s.awardBy}>{a.by}</span>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ── Beyond weddings ── */}
      <section id="collection" className={s.beyond} data-header-theme="light" aria-label="Beyond weddings">
        <p>
          Beyond weddings, we photograph celebrities, fashion and landmark events.{" "}
          <Link href="/collection" className={s.textLink}>
            The collection
          </Link>
        </p>
      </section>

      {/* ── Invitation ── */}
      <section id="inquire" className={s.invite} data-header-theme="dark" aria-labelledby="invite-title">
        <div className={s.inviteImg} aria-hidden="true">
          <Image src="/images/portfolio/karthik-falaknama/cover.webp" alt="" fill sizes="100vw" />
        </div>
        <Reveal className={s.inviteCopy}>
          <p className={s.kickerLight}>Your wedding</p>
          <h2 id="invite-title" className={s.inviteTitle}>
            Tell us about <em>the two of you.</em>
          </h2>
          <p className={s.inviteBody}>
            Share your dates and a little about your celebration. We&apos;ll reply personally to talk through ideas,
            availability and how we work.
          </p>
          <Link href="/inquire" className={s.btnLight}>
            Begin your enquiry
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
