/* ============================================================
   The crew, told event by event.
   ------------------------------------------------------------
   The same seven people work every occasion, but they do a
   different job at a Haldi than at a Reception. Each entry is
   written for one discipline at one kind of event:
     · headline — their role at this occasion, in one line
     · story    — why the couple wants them there
     · moment   — the single frame they are waiting for
   `default` covers custom occasions; {event} is replaced by the
   occasion's name.
   ============================================================ */

export interface CrewStory {
  headline: string;
  story: string;
  moment: string;
}

type EventKey =
  | "engagement"
  | "haldi"
  | "mehendi"
  | "sangeet"
  | "cocktail"
  | "wedding"
  | "reception"
  | "pre-wedding"
  | "post-wedding"
  | "default";

/** Short, cinematic line used on the occasion picker and the casting header. */
export const OCCASION_LINES: Record<EventKey, string> = {
  engagement: "Two families, one ring, the first official yes.",
  haldi: "Turmeric, laughter and the first blush of gold.",
  mehendi: "Henna, songs and slow afternoons that run late.",
  sangeet: "The night both families take the stage.",
  cocktail: "Low light, sharp tailoring, the friends' night.",
  wedding: "The muhurtham. The day everything was for.",
  reception: "The first walk in, as a married couple.",
  "pre-wedding": "Just the two of you, before the crowds arrive.",
  "post-wedding": "The quiet rituals once the music fades.",
  default: "An occasion that belongs only to you.",
};

export const STORIES: Record<string, Partial<Record<EventKey, CrewStory>>> = {
  "traditional-photographer": {
    engagement: {
      headline: "The keeper of the first exchange.",
      story:
        "Engagements move fast — rings, garlands and elders' blessings in under an hour. They hold the sequence, light every family group properly and make sure no uncle is missing from the frame.",
      moment: "Both families shoulder to shoulder, the rings just on.",
    },
    haldi: {
      headline: "Every hand that touches the turmeric.",
      story:
        "At a Haldi, everyone wants their turn — grandmothers, cousins, the neighbour who flew in. They work the line patiently so each blessing is recorded, and keep the colour true when the yellow gets everywhere.",
      moment: "Your grandmother's hand on your cheek, turmeric still wet.",
    },
    mehendi: {
      headline: "The record of a long, slow afternoon.",
      story:
        "Mehendi stretches for hours. They make sure the family photographs happen before the henna dries and the crowd thins, and they light the finished designs so the detail survives in print.",
      moment: "The finished hands, held up in the afternoon light.",
    },
    sangeet: {
      headline: "Who was there, and who danced.",
      story:
        "Sangeet nights are dark, loud and crowded. They bring the lighting to make formal portraits possible in a ballroom and quietly gather each family branch before the performances begin.",
      moment: "The whole family, lined up minutes before their dance.",
    },
    cocktail: {
      headline: "The guest list, beautifully lit.",
      story:
        "Cocktail nights are about people. They set a lit portrait corner and move through the room so every friend, colleague and partner leaves with a proper photograph of the evening.",
      moment: "Your closest friends, glasses raised, in one clean frame.",
    },
    wedding: {
      headline: "The ritual, in its correct order.",
      story:
        "They stand beside the priest from the first sankalpam to the last akshintalu. Every ritual is documented in sequence, and every generation is gathered for the formal portraits families keep for a lifetime.",
      moment: "The thali, the moment it is tied.",
    },
    reception: {
      headline: "Every guest who came to bless you.",
      story:
        "Receptions are a line of hundreds, each with a gift and a handshake. They run the stage with discipline, move groups on and off smoothly, and make sure every single guest is in the album.",
      moment: "The first group on stage, and the last one at midnight.",
    },
    "pre-wedding": {
      headline: "The classic portrait of you two.",
      story:
        "Before the candid storytelling, there is the portrait your parents will frame. They compose and light it properly — posture, outfits and the location at its best.",
      moment: "One composed portrait that sits on the mantel for years.",
    },
    "post-wedding": {
      headline: "The rituals most albums forget.",
      story:
        "Vratham, Satyanarayana pooja, the welcome into a new home — small rooms and quiet ceremonies. They record each step with care, without intruding on what is private.",
      moment: "The first lamp lit in your new home.",
    },
    default: {
      headline: "The faithful record of {event}.",
      story:
        "Whatever shape {event} takes, someone has to make sure it is properly documented — the people, the order of things, the family together. That is their whole job.",
      moment: "Everyone who mattered at {event}, in one frame.",
    },
  },

  "traditional-videographer": {
    engagement: {
      headline: "The ceremony, start to finish.",
      story:
        "Speeches, the ring exchange, the blessings — recorded in full, with clean audio. Years later you will want the whole thing, not just the highlights.",
      moment: "Your father's voice as he announces the match.",
    },
    haldi: {
      headline: "Every blessing, with sound.",
      story:
        "The songs the elders sing at a Haldi are rarely written down. They record them in full alongside the ritual, so the voices are kept as well as the faces.",
      moment: "The folk song your aunts have sung at every family Haldi.",
    },
    mehendi: {
      headline: "The songs, the teasing, the hours.",
      story:
        "Mehendi is hours of music and conversation. They keep the camera rolling on what the highlights miss — the dholki, the jokes, the long stories told while the henna dries.",
      moment: "The dholki circle in full swing.",
    },
    sangeet: {
      headline: "Every performance, uncut.",
      story:
        "Your family rehearsed for weeks. They cover each performance in full from a steady, stage-facing angle, so every dance can be watched again exactly as it happened.",
      moment: "Your parents' surprise performance, start to end.",
    },
    cocktail: {
      headline: "The toasts, word for word.",
      story:
        "Cocktail nights are speeches and toasts. They record each one with proper audio — the stories your friends tell are worth keeping.",
      moment: "Your best friend's toast, every embarrassing word.",
    },
    wedding: {
      headline: "The full muhurtham, recorded in full.",
      story:
        "The highlight film tells the feeling; this tells the truth. Every mantra and every ritual is covered continuously from the mandapam, so the complete ceremony is preserved for your family archive.",
      moment: "The entire muhurtham, without a single cut.",
    },
    reception: {
      headline: "The stage, from first guest to last.",
      story:
        "They cover the entrance, the speeches and the long line of guests, so the complete reception film carries everyone who came.",
      moment: "Your grand entrance, from the first step.",
    },
    "pre-wedding": {
      headline: "Behind the scenes of your shoot.",
      story:
        "The laughter between takes is often better than the take. They record the day as it really was — the travel, the outfit changes, the in-between moments.",
      moment: "The two of you laughing at a take that went wrong.",
    },
    "post-wedding": {
      headline: "The quiet ceremonies, kept whole.",
      story:
        "Post-wedding rituals are intimate and unhurried. They capture them steadily and respectfully, with clean sound, so nothing has to be staged twice.",
      moment: "The first ritual you perform together as a married couple.",
    },
    default: {
      headline: "{event}, recorded from start to finish.",
      story:
        "A complete, continuous record of {event} — the words, the music, the people — so you can watch the whole occasion again.",
      moment: "The part of {event} you would never want to lose.",
    },
  },

  "candid-photographer": {
    engagement: {
      headline: "The nerves and the glances.",
      story:
        "While everyone faces the stage, they watch the edges — the shy look between you two, your mother wiping her eyes. Engagements are full of feeling people forget to pose for.",
      moment: "The look you give each other just before the rings.",
    },
    haldi: {
      headline: "Chaos, colour and pure joy.",
      story:
        "Haldi is the most fun you will have all wedding. They move fast and close, catching the splashes, the ambushes and the laughter in full colour.",
      moment: "The cousin who gets you from behind with a fistful of turmeric.",
    },
    mehendi: {
      headline: "The intimacy of the afternoon.",
      story:
        "Close-up and unhurried — the patterns forming, hidden initials in the henna, grandmothers watching. They catch the softness of an afternoon among the women of the family.",
      moment: "Your partner's name, hidden in the henna.",
    },
    sangeet: {
      headline: "The night, as it felt.",
      story:
        "Not the dance — the faces watching it. They read the room and wait for the reaction shots, the laughter and the moment your grandfather gets pulled onto the floor.",
      moment: "Your grandfather, dancing for the first time in years.",
    },
    cocktail: {
      headline: "Effortless, editorial, after dark.",
      story:
        "Cocktail nights look best in fashion-editorial light. They shoot it like a magazine spread — tailoring, candlelight, and friends who have no idea they are being photographed.",
      moment: "The two of you, alone for a second in a crowded room.",
    },
    wedding: {
      headline: "The emotion inside the ritual.",
      story:
        "While the traditional photographer records the ritual, they find what it meant — the tear during the kanyadaanam, the squeeze of a hand, the look across the jeelakarra bellam.",
      moment: "Your father's face as he gives your hand away.",
    },
    reception: {
      headline: "The party behind the stage.",
      story:
        "Receptions have two stories: the stage, and everything else. They roam the room for laughter, reunions and the dance floor late in the night.",
      moment: "The dance floor, the moment the DJ plays your song.",
    },
    "pre-wedding": {
      headline: "Your story, told like a film still.",
      story:
        "The shoot is theirs to direct — location, light and gentle prompts that make you forget the camera. These become the photographs on your invitations and your walls.",
      moment: "Golden hour, and the two of you with nowhere else to be.",
    },
    "post-wedding": {
      headline: "The first days as a married couple.",
      story:
        "The ring-finding game, the first meal together, a new family's welcome. Small, playful moments they photograph with a light touch.",
      moment: "Who found the ring first.",
    },
    default: {
      headline: "The feeling of {event}.",
      story:
        "They step back from the formalities and photograph what {event} actually felt like — the glances, the laughter and the moments nobody planned.",
      moment: "The unguarded moment of {event} you didn't know they caught.",
    },
  },

  "candid-videographer": {
    engagement: {
      headline: "A short film of the first promise.",
      story:
        "They film the engagement as a story — the build-up, the nerves, the exchange and the celebration — then cut it into a few minutes you will rewatch for years.",
      moment: "The slow-motion moment the ring slides on.",
    },
    haldi: {
      headline: "Turmeric in slow motion.",
      story:
        "Haldi was made for slow motion — colour flying, water splashing, everyone laughing. They film it for movement and joy, then cut it to music.",
      moment: "The bucket of water nobody saw coming.",
    },
    mehendi: {
      headline: "Music, colour and close-ups.",
      story:
        "Macro shots of henna forming, the dholki, the dancing that breaks out mid-afternoon. They turn a long afternoon into a warm, musical short film.",
      moment: "The henna cone tracing the final line.",
    },
    sangeet: {
      headline: "A music video of your night.",
      story:
        "Fast, rhythmic and full of energy. They film the performances and the crowd for movement, and cut the night like a music video your friends will share.",
      moment: "The final song, when everyone floods the floor.",
    },
    cocktail: {
      headline: "Moody, stylish, after-hours.",
      story:
        "A cocktail night deserves a film with atmosphere. They shoot in low light for texture — glasses, laughter, music — and cut it with a cinematic grade.",
      moment: "The light catching the glass during the toast.",
    },
    wedding: {
      headline: "The day, felt in a few minutes.",
      story:
        "They follow emotion, not the schedule — the getting ready, the walk to the mandapam, the vows, the tears. It becomes the wedding film you share with everyone you love.",
      moment: "The first look, before the world sees you.",
    },
    reception: {
      headline: "The entrance and the after-party.",
      story:
        "They film your entrance as an event, then stay for the dance floor. The reception becomes a short, celebratory film that closes your wedding story.",
      moment: "Your entrance, as the lights drop and the music hits.",
    },
    "pre-wedding": {
      headline: "A love story you star in.",
      story:
        "Scripted lightly, shot cinematically. They plan the story with you and film it like a short romance — the film that plays on the screen at your reception.",
      moment: "The final scene, walking away together into the light.",
    },
    "post-wedding": {
      headline: "The epilogue.",
      story:
        "A gentle closing chapter — the new home, the games, the first days together. They film it softly and keep it short.",
      moment: "The two of you, finally just alone.",
    },
    default: {
      headline: "{event}, as a short film.",
      story:
        "They follow the feeling of {event} rather than the schedule, and cut it into a short, music-led film you can share with everyone.",
      moment: "The scene from {event} everyone asks to watch again.",
    },
  },

  "aerial-drone": {
    engagement: {
      headline: "The scale of the gathering.",
      story:
        "From above, an engagement becomes a picture of two families coming together. They open the film with the venue and the crowd in a single sweeping shot.",
      moment: "The venue from the sky as guests arrive.",
    },
    haldi: {
      headline: "The courtyard, from the sky.",
      story:
        "Haldis often happen in courtyards, lawns and family homes. A slow aerial pass shows the colour, the crowd and the place your family gathered.",
      moment: "A circle of yellow around you, seen from above.",
    },
    mehendi: {
      headline: "The decor in its full glory.",
      story:
        "Someone spent weeks on that decor. They capture it the way the designer imagined — from above, in full symmetry, before the guests fill it.",
      moment: "The full setting, perfectly symmetrical, before anyone sits.",
    },
    sangeet: {
      headline: "The venue alive at night.",
      story:
        "Where the venue allows, they capture the lights and the scale of the night from outside — the establishing shot your film opens with.",
      moment: "The venue glowing against the night sky.",
    },
    cocktail: {
      headline: "The establishing shot.",
      story:
        "A rooftop, a pool, a garden — they show where the night happened and how beautiful it looked, in a few seconds of footage.",
      moment: "The venue lights coming on at dusk.",
    },
    wedding: {
      headline: "The grandeur of the day.",
      story:
        "The baraat moving through the streets, the mandapam surrounded by family, the venue at its finest. They show the size of what you created, within permitted airspace.",
      moment: "The baraat, seen from the sky.",
    },
    reception: {
      headline: "Your arrival, from above.",
      story:
        "An aerial opening sets the scale of the evening — the venue, the lights and the arriving guests — before the film cuts to your entrance.",
      moment: "The car arriving at the venue, lit up below.",
    },
    "pre-wedding": {
      headline: "Two people and a landscape.",
      story:
        "Hills, coastlines and old forts were made for drones. They frame the two of you as small figures in a vast place — the shots that make a pre-wedding film cinematic.",
      moment: "You two on a cliff edge, the landscape all around.",
    },
    "post-wedding": {
      headline: "Home, from a new angle.",
      story:
        "Where suitable, a short aerial of the family home or temple gives the closing chapter a sense of place.",
      moment: "The family home, from above.",
    },
    default: {
      headline: "{event}, seen from above.",
      story:
        "A sense of place and scale for {event} — the venue, the gathering and the setting, captured where airspace and safety allow.",
      moment: "{event} from a perspective nobody else had.",
    },
  },

  "creative-cinematography": {
    engagement: {
      headline: "The first chapter of your film.",
      story:
        "Directed, graded and scored — the engagement as the opening chapter of a film about your marriage. Cinema cameras, composed light and a story told on purpose.",
      moment: "A single, held close-up as you say yes.",
    },
    haldi: {
      headline: "Colour as a story.",
      story:
        "In cinema, Haldi is pure colour and texture. They direct the light and the movement, building a sequence that feels like a scene from a feature film.",
      moment: "Backlit turmeric falling in the afternoon sun.",
    },
    mehendi: {
      headline: "Texture, detail, slowness.",
      story:
        "They treat Mehendi like a period-film scene — slow camera moves, shallow focus and handcrafted detail — a sequence that slows your film down to breathe.",
      moment: "A slow push-in on the henna as the last line is drawn.",
    },
    sangeet: {
      headline: "The night, choreographed for camera.",
      story:
        "With planned camera positions and cinema lighting, the performances become sequences that feel staged for the screen, even when they are not.",
      moment: "A single unbroken shot through the family's dance.",
    },
    cocktail: {
      headline: "The night as a feature film.",
      story:
        "Anamorphic glass, practical light and a deliberate grade. They make your friends' night look like a scene from a film with a budget.",
      moment: "A slow-motion cheers, lit like cinema.",
    },
    wedding: {
      headline: "The heart of the film.",
      story:
        "This is the centrepiece — a directed, cinema-grade film of your wedding with sound design, colour grading and a story built around your vows and your families.",
      moment: "The first look, framed like a film still.",
    },
    reception: {
      headline: "The finale.",
      story:
        "The reception closes your film. They direct the entrance and the portraits of the night so the last chapter feels as grand as the first.",
      moment: "The closing shot of the film.",
    },
    "pre-wedding": {
      headline: "A short film, directed.",
      story:
        "Concept, locations, wardrobe and a shot list developed with you. They direct your pre-wedding like a short film — the most cinematic thing we make.",
      moment: "The poster frame of your film.",
    },
    "post-wedding": {
      headline: "A quiet, tender closing scene.",
      story:
        "For couples who want their film to breathe at the end — a few directed, beautifully lit moments in the days after the wedding.",
      moment: "The final frame before the credits.",
    },
    default: {
      headline: "{event}, given a cinema treatment.",
      story:
        "Directed, lit and graded like cinema — {event} becomes a chapter of a film that is authored, not simply recorded.",
      moment: "The frame from {event} that looks like a film poster.",
    },
  },

  "web-live-stream": {
    engagement: {
      headline: "Family overseas, front row.",
      story:
        "Not everyone can fly in for an engagement. A clean, multi-camera stream lets relatives abroad watch the rings exchanged as it happens.",
      moment: "Your relatives in another time zone, watching live.",
    },
    haldi: {
      headline: "For everyone who couldn't come.",
      story:
        "A simple, stable stream so grandparents and family abroad can see the Haldi as it happens.",
      moment: "Your grandmother overseas, watching you laugh.",
    },
    mehendi: {
      headline: "A window into the afternoon.",
      story: "A relaxed stream for family who would have loved to be there for the music and the henna.",
      moment: "Family joining the songs from home.",
    },
    sangeet: {
      headline: "The performances, live.",
      story:
        "Your family rehearsed for weeks. Relatives who couldn't travel can watch every performance live, with clean stage audio.",
      moment: "Overseas family cheering in the comments.",
    },
    cocktail: {
      headline: "Friends who couldn't make it.",
      story: "Speeches and toasts streamed for the friends who couldn't fly in.",
      moment: "A toast that reaches across the world.",
    },
    wedding: {
      headline: "No one misses the muhurtham.",
      story:
        "A multi-camera live broadcast of the muhurtham, with stable connectivity and clean audio, so every relative who couldn't travel can bless you at the exact moment it happens.",
      moment: "The muhurtham, seen live from three continents.",
    },
    reception: {
      headline: "The celebration, shared.",
      story: "The entrance and the speeches streamed for family and friends watching from afar.",
      moment: "Your entrance, live for everyone who couldn't come.",
    },
    "pre-wedding": {
      headline: "Rarely needed here.",
      story: "Pre-wedding shoots are private by nature. A stream is only worth it if you are hosting an event around it.",
      moment: "—",
    },
    "post-wedding": {
      headline: "For the family abroad.",
      story: "A quiet stream of the post-wedding rituals for elders and relatives who could not travel.",
      moment: "Grandparents watching the pooja from home.",
    },
    default: {
      headline: "{event}, live to everyone you love.",
      story: "A clean, stable broadcast of {event} for family and friends who could not be there in person.",
      moment: "Everyone who couldn't come, watching {event} live.",
    },
  },
};

export function storyFor(serviceId: string, eventType: string, eventName: string): CrewStory | null {
  const byEvent = STORIES[serviceId];
  if (!byEvent) return null;
  const s = byEvent[eventType as EventKey] ?? byEvent.default;
  if (!s) return null;
  const name = eventName.trim() || "your occasion";
  const fill = (t: string) => t.replaceAll("{event}", name);
  return { headline: fill(s.headline), story: fill(s.story), moment: fill(s.moment) };
}

export function occasionLine(eventType: string): string {
  return OCCASION_LINES[eventType as EventKey] ?? OCCASION_LINES.default;
}

/** A photograph for each kind of occasion (from the studio's own work). */
const OCCASION_IMAGES: Record<EventKey, string> = {
  engagement: "/images/portfolio/karthik-gayathri/cover.jpg",
  haldi: "/images/stories/hrithika-abhishek/IMG_6337.jpg",
  mehendi: "/images/disciplines/fashion/IMG_6279.jpg",
  sangeet: "/images/stories/sirish-and-harshitha/IMG_6349.jpg",
  cocktail: "/images/stories/bellam-srikonda/IMG_6344.jpg",
  wedding: "/images/disciplines/weddings/IMG_6275.jpg",
  reception: "/images/portfolio/bellamkonda-kavya-reception/cover.jpg",
  "pre-wedding": "/images/stories/sirish-and-harshitha/IMG_6347.jpg",
  "post-wedding": "/images/portfolio/hrithika-abhishek/cover.jpg",
  default: "/images/stories/sirish-and-harshitha/IMG_6346.jpg",
};

export function occasionImage(eventType: string): string {
  return OCCASION_IMAGES[eventType as EventKey] ?? OCCASION_IMAGES.default;
}
