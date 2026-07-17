(function () {
  const common = {
    india: [
      "India's capital is New Delhi and its currency is the Indian Rupee.",
      "The national flag is the Tiranga; the Ashoka Chakra has 24 spokes.",
      "The national animal is the Bengal tiger and the national bird is the Indian peacock.",
      "India is a union of 28 states and 8 Union Territories."
    ],
    rajasthan: [
      "Rajasthan's capital is Jaipur, also called the Pink City.",
      "Rajasthan is India's largest state by area.",
      "The Thar Desert and Aravalli Range are major physical features.",
      "Ghoomar, Kalbelia, Gangaur and Pushkar Fair are important cultural traditions."
    ],
    world: [
      "Earth has seven continents and five oceans.",
      "Asia is the largest continent and the Pacific is the largest ocean.",
      "The United Nations was founded in 1945; its headquarters is in New York.",
      "Maps use directions, symbols, scale, latitude and longitude to show places."
    ],
    science: [
      "The basic unit of life is the cell; the human body has organ systems.",
      "Plants make food by photosynthesis using sunlight, water and carbon dioxide.",
      "Force can change motion; energy exists in forms such as heat, light and electricity.",
      "ISRO is India's space agency; satellites support communication, weather and navigation."
    ],
    sports: [
      "The Olympic Games are held every four years.",
      "A cricket team has 11 players; hockey and football also use 11 players per side.",
      "Major Indian honours include Bharat Ratna, Padma awards and Arjuna Award.",
      "Sportsmanship means fairness, discipline, teamwork and respect."
    ],
    computer: [
      "Hardware is the physical part of a computer; software is a set of instructions.",
      "CPU processes instructions, RAM stores working data and storage keeps files.",
      "The internet connects networks; a web browser opens websites.",
      "Never share passwords or OTPs, and verify links before opening them."
    ],
    polity: [
      "The Constitution of India came into effect on 26 January 1950.",
      "The Preamble begins with 'We, the People of India'.",
      "Parliament consists of the President, Lok Sabha and Rajya Sabha.",
      "Fundamental Rights protect liberty and equality; Fundamental Duties guide citizens."
    ],
    current: [
      "Read one reliable national and one Rajasthan news summary each week.",
      "Record the event, place, date, people involved and why it matters.",
      "Separate verified facts from opinions and forwarded social-media claims.",
      "Revise important days, appointments, awards, sports and science events monthly."
    ],
    career: [
      "Choose subjects by interest, aptitude and long-term learning goals.",
      "Scholarships may be merit-based, need-based or category-specific.",
      "Communication, digital literacy, problem-solving and teamwork are core skills.",
      "Use only official portals for exams, scholarships and career information."
    ]
  };

  const sets = {
    6: [
      ["India Basics", "National symbols, states, capitals and important landmarks.", common.india],
      ["Rajasthan Basics", "Districts, rivers, forts, fairs and folk culture.", common.rajasthan],
      ["World Around Us", "Continents, oceans, countries and famous places.", common.world],
      ["Science in Daily Life", "Human body, plants, animals, inventions and space basics.", common.science],
      ["Sports and Awards", "Major games, trophies, Indian players and national awards.", common.sports],
      ["Computer Basics", "Hardware, software, internet safety and keyboard shortcuts.", common.computer],
      ["Current Awareness", "Important school-level national and international events.", common.current]
    ],
    7: [
      ["India and Constitution", "National identity, Parliament, President, Prime Minister and citizens.", [...common.india, ...common.polity]],
      ["Rajasthan Heritage", "Rulers, forts, folk arts, wildlife and geography.", common.rajasthan],
      ["World Geography", "Countries, capitals, currencies, mountains and rivers.", common.world],
      ["Science and Technology", "Discoveries, scientists, space missions and environment.", common.science],
      ["Sports", "Rules, tournaments, famous players and sports awards.", common.sports],
      ["Computer Awareness", "Operating systems, office tools, cyber safety and the web.", common.computer],
      ["Current Awareness", "Major recent events explained for school learners.", common.current]
    ],
    8: [
      ["Indian Polity Basics", "Constitution, rights, duties, elections and institutions.", common.polity],
      ["Indian and Rajasthan History", "Key periods, leaders, movements and heritage.", [...common.india, ...common.rajasthan]],
      ["Geography", "India and world maps, resources, climate and environment.", common.world],
      ["General Science", "Physics, chemistry, biology and everyday applications.", common.science],
      ["Technology", "Computers, internet, AI basics, satellites and inventions.", common.computer],
      ["Sports and Awards", "National/international events, honours and achievements.", common.sports],
      ["Current Awareness", "Important recent events with basic context.", common.current]
    ],
    9: [
      ["Indian Constitution", "Preamble, rights, duties, Parliament and judiciary.", common.polity],
      ["History and Culture", "Indian movements, monuments, literature and Rajasthan heritage.", [...common.india, ...common.rajasthan]],
      ["Geography and Economy", "Resources, agriculture, industries, population and maps.", common.world],
      ["Science and Space", "Core discoveries, ISRO missions, health and environment.", common.science],
      ["Digital Awareness", "Computers, networks, cyber safety, AI and responsible media use.", common.computer],
      ["Sports, Awards and Books", "Major competitions, honours, authors and personalities.", common.sports],
      ["Current Affairs Basics", "Important national and international developments.", common.current]
    ],
    10: [
      ["Indian Polity", "Constitution, federalism, Parliament, judiciary and elections.", common.polity],
      ["India and Rajasthan", "History, geography, culture, economy and major schemes.", [...common.india, ...common.rajasthan]],
      ["World Awareness", "Countries, organisations, geography and global institutions.", common.world],
      ["Science and Technology", "Health, environment, space, computers and emerging technology.", [...common.science, ...common.computer]],
      ["Sports and Honours", "Major events, awards, books and notable personalities.", common.sports],
      ["Current Affairs", "Board-appropriate national and international awareness.", common.current],
      ["Career Awareness", "Competitive exams, scholarships, skills and digital safety.", common.career]
    ]
  };

  Object.keys(sets).forEach((className) => {
    window.NOTES_DATA[className].subjects["General Knowledge"] = sets[className];
  });
}());
