/* Instagram album edits for each story, shown as an editorial album on the story page. */

export interface AlbumFrame { src: string; webp: string; w: number; h: number }
export interface StoryAlbum { kicker: string; title: string; intro: string; film: string | null; frames: AlbumFrame[] }

export const STORY_ALBUMS: Record<string, StoryAlbum> = {
  "bellam-srikonda": {
    kicker: "The Album",
    title: "A reception, in its quietest light",
    intro: "Between the applause and the chandeliers, the frames we kept closest — the ones that read like pages from a family album rather than a red carpet.",
    film: "/images/stories/bellam-srikonda/album/album-film.mp4",
    frames: [
      { src: "/images/stories/bellam-srikonda/album/album-01.jpg", webp: "/images/stories/bellam-srikonda/album/album-01.webp", w: 1500, h: 2000 },
      { src: "/images/stories/bellam-srikonda/album/album-02.jpg", webp: "/images/stories/bellam-srikonda/album/album-02.webp", w: 1500, h: 2000 },
      { src: "/images/stories/bellam-srikonda/album/album-03.jpg", webp: "/images/stories/bellam-srikonda/album/album-03.webp", w: 1500, h: 2000 },
      { src: "/images/stories/bellam-srikonda/album/album-04.jpg", webp: "/images/stories/bellam-srikonda/album/album-04.webp", w: 1500, h: 2000 },
      { src: "/images/stories/bellam-srikonda/album/album-05.jpg", webp: "/images/stories/bellam-srikonda/album/album-05.webp", w: 1500, h: 2000 },
      { src: "/images/stories/bellam-srikonda/album/album-06.jpg", webp: "/images/stories/bellam-srikonda/album/album-06.webp", w: 1500, h: 2000 },
      { src: "/images/stories/bellam-srikonda/album/album-07.jpg", webp: "/images/stories/bellam-srikonda/album/album-07.webp", w: 1500, h: 2000 },
      { src: "/images/stories/bellam-srikonda/album/album-08.jpg", webp: "/images/stories/bellam-srikonda/album/album-08.webp", w: 1500, h: 2000 },
      { src: "/images/stories/bellam-srikonda/album/album-09.jpg", webp: "/images/stories/bellam-srikonda/album/album-09.webp", w: 1500, h: 2000 },
      { src: "/images/stories/bellam-srikonda/album/album-10.jpg", webp: "/images/stories/bellam-srikonda/album/album-10.webp", w: 1500, h: 2000 },
      { src: "/images/stories/bellam-srikonda/album/album-11.jpg", webp: "/images/stories/bellam-srikonda/album/album-11.webp", w: 1500, h: 2000 },
      { src: "/images/stories/bellam-srikonda/album/album-12.jpg", webp: "/images/stories/bellam-srikonda/album/album-12.webp", w: 1500, h: 2000 },
    ],
  },
  "sirish-and-harshitha": {
    kicker: "The Album",
    title: "Sireesh & Harshitha, page by page",
    intro: "An unhurried sequence of their celebration — laughter, ritual and the small looks that only the two of them noticed.",
    film: null,
    frames: [
      { src: "/images/stories/sirish-and-harshitha/album/album-01.jpg", webp: "/images/stories/sirish-and-harshitha/album/album-01.webp", w: 1170, h: 1560 },
      { src: "/images/stories/sirish-and-harshitha/album/album-02.jpg", webp: "/images/stories/sirish-and-harshitha/album/album-02.webp", w: 1170, h: 1560 },
      { src: "/images/stories/sirish-and-harshitha/album/album-03.jpg", webp: "/images/stories/sirish-and-harshitha/album/album-03.webp", w: 1170, h: 1560 },
      { src: "/images/stories/sirish-and-harshitha/album/album-04.jpg", webp: "/images/stories/sirish-and-harshitha/album/album-04.webp", w: 1170, h: 1560 },
      { src: "/images/stories/sirish-and-harshitha/album/album-05.jpg", webp: "/images/stories/sirish-and-harshitha/album/album-05.webp", w: 1170, h: 1560 },
      { src: "/images/stories/sirish-and-harshitha/album/album-06.jpg", webp: "/images/stories/sirish-and-harshitha/album/album-06.webp", w: 1170, h: 1560 },
      { src: "/images/stories/sirish-and-harshitha/album/album-07.jpg", webp: "/images/stories/sirish-and-harshitha/album/album-07.webp", w: 1170, h: 1560 },
      { src: "/images/stories/sirish-and-harshitha/album/album-08.jpg", webp: "/images/stories/sirish-and-harshitha/album/album-08.webp", w: 1170, h: 1560 },
      { src: "/images/stories/sirish-and-harshitha/album/album-09.jpg", webp: "/images/stories/sirish-and-harshitha/album/album-09.webp", w: 1170, h: 1560 },
      { src: "/images/stories/sirish-and-harshitha/album/album-10.jpg", webp: "/images/stories/sirish-and-harshitha/album/album-10.webp", w: 1170, h: 1560 },
      { src: "/images/stories/sirish-and-harshitha/album/album-11.jpg", webp: "/images/stories/sirish-and-harshitha/album/album-11.webp", w: 1170, h: 1560 },
      { src: "/images/stories/sirish-and-harshitha/album/album-12.jpg", webp: "/images/stories/sirish-and-harshitha/album/album-12.webp", w: 1170, h: 1560 },
      { src: "/images/stories/sirish-and-harshitha/album/album-13.jpg", webp: "/images/stories/sirish-and-harshitha/album/album-13.webp", w: 1170, h: 1560 },
      { src: "/images/stories/sirish-and-harshitha/album/album-14.jpg", webp: "/images/stories/sirish-and-harshitha/album/album-14.webp", w: 1170, h: 1560 },
      { src: "/images/stories/sirish-and-harshitha/album/album-15.jpg", webp: "/images/stories/sirish-and-harshitha/album/album-15.webp", w: 1170, h: 1560 },
      { src: "/images/stories/sirish-and-harshitha/album/album-16.jpg", webp: "/images/stories/sirish-and-harshitha/album/album-16.webp", w: 1170, h: 1560 },
    ],
  },
  "karthik-and-gayathri": {
    kicker: "The Album",
    title: "Karthik & Gayathri, as they remember it",
    intro: "Turned like the pages of an heirloom book — rich colour, honest moments and the grace of a family coming together.",
    film: null,
    frames: [
      { src: "/images/stories/karthik-and-gayathri/album/album-01.jpg", webp: "/images/stories/karthik-and-gayathri/album/album-01.webp", w: 1500, h: 2000 },
      { src: "/images/stories/karthik-and-gayathri/album/album-02.jpg", webp: "/images/stories/karthik-and-gayathri/album/album-02.webp", w: 1500, h: 2000 },
      { src: "/images/stories/karthik-and-gayathri/album/album-03.jpg", webp: "/images/stories/karthik-and-gayathri/album/album-03.webp", w: 1500, h: 2000 },
      { src: "/images/stories/karthik-and-gayathri/album/album-04.jpg", webp: "/images/stories/karthik-and-gayathri/album/album-04.webp", w: 1500, h: 2000 },
      { src: "/images/stories/karthik-and-gayathri/album/album-05.jpg", webp: "/images/stories/karthik-and-gayathri/album/album-05.webp", w: 1500, h: 2000 },
      { src: "/images/stories/karthik-and-gayathri/album/album-06.jpg", webp: "/images/stories/karthik-and-gayathri/album/album-06.webp", w: 1500, h: 2000 },
      { src: "/images/stories/karthik-and-gayathri/album/album-07.jpg", webp: "/images/stories/karthik-and-gayathri/album/album-07.webp", w: 1500, h: 2000 },
      { src: "/images/stories/karthik-and-gayathri/album/album-08.jpg", webp: "/images/stories/karthik-and-gayathri/album/album-08.webp", w: 1500, h: 2000 },
      { src: "/images/stories/karthik-and-gayathri/album/album-09.jpg", webp: "/images/stories/karthik-and-gayathri/album/album-09.webp", w: 1500, h: 2000 },
      { src: "/images/stories/karthik-and-gayathri/album/album-10.jpg", webp: "/images/stories/karthik-and-gayathri/album/album-10.webp", w: 1500, h: 2000 },
      { src: "/images/stories/karthik-and-gayathri/album/album-11.jpg", webp: "/images/stories/karthik-and-gayathri/album/album-11.webp", w: 1500, h: 2000 },
      { src: "/images/stories/karthik-and-gayathri/album/album-12.jpg", webp: "/images/stories/karthik-and-gayathri/album/album-12.webp", w: 1500, h: 2000 },
      { src: "/images/stories/karthik-and-gayathri/album/album-13.jpg", webp: "/images/stories/karthik-and-gayathri/album/album-13.webp", w: 1500, h: 2000 },
      { src: "/images/stories/karthik-and-gayathri/album/album-14.jpg", webp: "/images/stories/karthik-and-gayathri/album/album-14.webp", w: 1500, h: 2000 },
      { src: "/images/stories/karthik-and-gayathri/album/album-15.jpg", webp: "/images/stories/karthik-and-gayathri/album/album-15.webp", w: 1500, h: 2000 },
      { src: "/images/stories/karthik-and-gayathri/album/album-16.jpg", webp: "/images/stories/karthik-and-gayathri/album/album-16.webp", w: 1500, h: 2000 },
      { src: "/images/stories/karthik-and-gayathri/album/album-17.jpg", webp: "/images/stories/karthik-and-gayathri/album/album-17.webp", w: 1500, h: 2000 },
      { src: "/images/stories/karthik-and-gayathri/album/album-18.jpg", webp: "/images/stories/karthik-and-gayathri/album/album-18.webp", w: 1500, h: 2000 },
    ],
  },
};

// Route aliases share the same album.
STORY_ALBUMS["bellamkonda-kavya"] = STORY_ALBUMS["bellam-srikonda"];
STORY_ALBUMS["bellamkonda-kavya-reception"] = STORY_ALBUMS["bellam-srikonda"];
STORY_ALBUMS["sireesh-harshitha"] = STORY_ALBUMS["sirish-and-harshitha"];
STORY_ALBUMS["karthik-gayathri"] = STORY_ALBUMS["karthik-and-gayathri"];
