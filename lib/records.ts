// My record collection, exported from Discogs.
// To update: re-export the collection CSV and edit this list (year = original release year).

export interface VinylRecord {
  artist: string
  title: string
  /** Original release year */
  year: number
  format: string
  /** Date added to the collection (YYYY-MM-DD) */
  added: string
  /** Colored pressings only */
  vinyl?: string
  vinylHex?: string
}

export const records: VinylRecord[] = [
  { artist: "A$AP Rocky", title: "Testing", year: 2018, format: "2xLP", added: '2026-04-11' },
  { artist: "Billy Joel", title: "The Stranger", year: 1977, format: "LP", added: '2026-11-07' },
  { artist: "Brent Faiyaz", title: "Wasteland", year: 2022, format: "2xLP", added: '2026-06-14' },
  { artist: "Coldplay", title: "Parachutes", year: 2000, format: "LP", added: '2026-05-21', vinyl: 'clear', vinylHex: '#cfd8d6' },
  { artist: "Daniel Caesar", title: "Never Enough", year: 2023, format: "2xLP", added: '2026-04-11', vinyl: 'orange', vinylHex: '#e8792b' },
  { artist: "Daniel Caesar", title: "Son Of Spergy", year: 2025, format: "2xLP", added: '2026-01-07', vinyl: 'white', vinylHex: '#ece8df' },
  { artist: "Don Toliver", title: "Love Sick", year: 2023, format: "2xLP", added: '2026-07-19' },
  { artist: "Drake", title: "Views", year: 2016, format: "2xLP", added: '2026-08-02' },
  { artist: "Frank Ocean", title: "Blond", year: 2016, format: "2xLP", added: '2026-05-21', vinyl: 'olive green', vinylHex: '#6f7442' },
  { artist: "Hannah Montana", title: "Hannah Montana 3", year: 2009, format: "LP", added: '2026-04-01', vinyl: 'blue with pink splatter', vinylHex: '#3f7fd6' },
  { artist: "Jhené Aiko", title: "Sail Out", year: 2013, format: "EP", added: '2026-11-07' },
  { artist: "Justin Bieber", title: "Justice", year: 2021, format: "2xLP", added: '2026-06-14', vinyl: 'gray', vinylHex: '#8e9197' },
  { artist: "Justin Bieber", title: "Swag", year: 2025, format: "2xLP", added: '2026-09-08', vinyl: 'light salmon', vinylHex: '#f6a68d' },
  { artist: "Kanye West", title: "ye", year: 2018, format: "LP", added: '2026-10-09' },
  { artist: "Mac DeMarco", title: "Another One", year: 2015, format: "LP", added: '2026-08-02' },
  { artist: "Mac Miller", title: "The Divine Feminine", year: 2016, format: "3xLP", added: '2026-10-07', vinyl: 'blue', vinylHex: '#7db3e8' },
  { artist: "Mk.gee", title: "Two Star & The Dream Police", year: 2024, format: "LP", added: '2026-10-24', vinyl: 'black marble', vinylHex: '#3a3a40' },
  { artist: "Mt. Joy", title: "Rearrange Us", year: 2020, format: "LP", added: '2026-01-05', vinyl: 'sea foam', vinylHex: '#9fdcc0' },
  { artist: "One Direction", title: "Four", year: 2014, format: "2xLP", added: '2026-07-19' },
  { artist: "The Police", title: "Zenyatta Mondatta", year: 1980, format: "LP", added: '2026-06-14' },
  { artist: "The Police", title: "Every Breath You Take (The Singles)", year: 1986, format: "LP", added: '2026-06-28' },
  { artist: "Red Hot Chili Peppers", title: "Californication", year: 1999, format: "2xLP", added: '2026-05-21' },
  { artist: "Sienna Spiro", title: "Visitor", year: 2026, format: "LP", added: '2026-07-25', vinyl: 'blue', vinylHex: '#3f7fd6' },
  { artist: "Tame Impala", title: "Currents", year: 2015, format: "2xLP", added: '2026-01-11' },
  { artist: "Tyler, The Creator", title: "NPR Music Tiny Desk Concert", year: 2025, format: "12\"", added: '2026-11-07', vinyl: 'green', vinylHex: '#3f9a57' },
  { artist: "U2", title: "The Joshua Tree", year: 1987, format: "2xLP", added: '2026-10-09' },
  { artist: "The Weeknd", title: "Beauty Behind The Madness", year: 2015, format: "2xLP", added: '2026-06-07' },
  { artist: "The Weeknd", title: "Starboy", year: 2016, format: "2xLP", added: '2026-08-02', vinyl: 'red', vinylHex: '#c8322b' },
  { artist: "Zach Bryan", title: "Zach Bryan", year: 2023, format: "2xLP", added: '2026-07-19' },
]
