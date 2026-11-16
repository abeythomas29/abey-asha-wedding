// All invitation text lives here. Edit this file to change names, times or venues.
window.WEDDING_DATA = {
  couple: {
    groomShort: 'Abey',
    brideShort: 'Asha',
    groom: 'Dr. Abey Thomas',
    bride: 'Ms. Asha Singh',
    groomParents: 'S/o Mrs. Ammini Thomas & Mr. Thomas David',
    brideParents: 'D/o Mrs. Roshni & Mr. Bhajan Singh',
    heroNote: 'With the blessings of our families'
  },
  scripture: {
    text: 'Many are the plans in a person’s heart, but it is the Lord’s purpose that prevails.',
    reference: 'Proverbs 19:21'
  },
  wedding: {
    dateLabel: '11 · 01 · 2027',
    longDate: 'Monday, 11 January 2027',
    invitationLead: 'With the blessings of our families, we request the honour of your presence at the wedding of our son',
    solemnized: 'which will be solemnized on'
  },
  // Our story. Photos live in assets/. Change the words freely; `focus` is the point each photo gently zooms towards inside its arch.
  story: {
    kicker: 'Our story',
    heading: 'From a hello to forever',
    lead: 'Our paths crossed, and nothing was quite the same again. A hello became a habit, the habit became home, and somewhere along the way we began to dream of this day.',
    moments: [
      {
        src: './assets/story-beginning.webp',
        alt: 'Abey and Asha sitting side by side in front of leafy plants, smiling',
        label: 'The beginning',
        title: 'Where it began',
        text: 'One hello that changed everything.',
        focus: '50% 25%'
      },
      {
        src: './assets/story-adventure.webp',
        alt: 'Abey and Asha taking a selfie beneath a minaret and a cluster of red heart balloons',
        label: 'Along the way',
        title: 'Little adventures',
        text: 'New cities, old lanes and a hand to hold.',
        focus: '50% 40%'
      },
      {
        src: './assets/story-laughter.webp',
        alt: 'Abey and Asha leaning around a palm tree on the beach, laughing',
        label: 'Side by side',
        title: 'So much laughter',
        text: 'Every day a little lighter, together.',
        focus: '50% 50%'
      }
    ],
    finale: {
      src: './assets/story-forever.webp',
      alt: 'Abey and Asha seated on lamplit steps, his arms around her, both smiling',
      label: 'And now',
      title: 'Our dream is coming true',
      text: 'Every prayer, every mile and every laugh was leading us here. Finally, we get to call it forever.',
      focus: '50% 30%'
    }
  },
  // Times are India Standard Time (+05:30).
  events: [
    {
      id: 'ceremony',
      title: 'Holy Matrimony',
      time: '3:00 PM onwards',
      shortTime: '3:00 PM',
      startISO: '2027-01-11T15:00:00+05:30',
      endISO: '2027-01-11T17:00:00+05:30',
      venue: 'St. Peter’s Mar Thoma Church',
      address: 'Bhopal, Madhya Pradesh',
      mapsQuery: 'St. Peter\'s Mar Thoma Church, Bhopal'
    },
    {
      id: 'reception',
      title: 'Reception',
      time: '6:00 PM onwards',
      shortTime: '6:00 PM',
      startISO: '2027-01-11T18:00:00+05:30',
      endISO: '2027-01-11T22:00:00+05:30',
      venue: 'Natraj Hall',
      address: 'Gautam Nagar, Sector A, Habib Ganj, Bhopal, Madhya Pradesh 462023',
      mapsQuery: 'Natraj Hall, Gautam Nagar, Sector A, Habib Ganj, Bhopal, Madhya Pradesh 462023'
    }
  ],
  // Paste the Google Apps Script web app URL (ends in /exec) to save replies to the sheet.
  rsvp: {
    sheetUrl: 'https://script.google.com/macros/s/AKfycbxa_H9RhPqZAp7SUw23tR6sh6cVaCCoU_-B2fNqE5t962G5G0MJCIW6GhxSWX4ApV0y/exec',
    heading: 'Kindly let us know',
    note: 'Your presence would make our day even more special. Please tell us if you can join us.'
  },
  media: {
    // Optional: put an mp3 in assets/ and set its path, e.g. './assets/music.mp3'.
    music: ''
  }
};
