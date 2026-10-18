import type { GradeDef } from "@/lib/types";
import { ch, subject, unit } from "./helpers";
import { middleEnglish, middleHindi } from "./middle-language";

export const class6: GradeDef = {
  grade: 6,
  stage: "Middle",
  structure: "chapters",
  subjects: [
    subject("maths", "Mathematics", ["Ganita Prakash"], [
      unit("Ganita Prakash", [
        ch("Patterns in Mathematics", ["Number sequences", "Visualising sequences", "Shape patterns"]),
        ch("Lines and Angles", ["Points, lines, rays", "Measuring and types of angles"]),
        ch("Number Play", ["Numbers that tell us things", "Supercells", "Palindromes", "Kaprekar's magic number"]),
        ch("Data Handling and Presentation", ["Tally marks", "Pictographs", "Bar graphs"]),
        ch("Prime Time", ["Factors and multiples", "Prime numbers", "Divisibility rules"]),
        ch("Perimeter and Area", ["Perimeter of rectangles and squares", "Area by counting squares"]),
        ch("Fractions", ["Fractional units", "Equivalent fractions", "Adding and subtracting fractions"]),
        ch("Playing with Constructions", ["Circles with a compass", "Constructing rectangles and squares"]),
        ch("Symmetry", ["Line of symmetry", "Rotational symmetry"]),
        ch("The Other Side of Zero", ["Negative numbers", "Number line", "Adding and subtracting integers"]),
      ]),
    ]),
    subject("science", "Science", ["Curiosity"], [
      unit("Curiosity", [
        ch("The Wonderful World of Science", ["Asking questions", "The scientific method"]),
        ch("Diversity in the Living World", ["Grouping plants and animals", "Habitats"]),
        ch("Mindful Eating: A Path to a Healthy Body", ["Food groups", "Balanced diet", "Testing for nutrients"]),
        ch("Exploring Magnets", ["Magnetic and non-magnetic materials", "Poles of a magnet", "Compass"]),
        ch("Measurement of Length and Motion", ["Standard units", "Measuring length", "Types of motion"]),
        ch("Materials Around Us", ["Properties of materials", "Grouping materials"]),
        ch("Temperature and its Measurement", ["Thermometers", "Celsius scale"]),
        ch("A Journey through States of Water", ["Solid, liquid, gas", "Evaporation and condensation"]),
        ch("Methods of Separation in Everyday Life", ["Handpicking, sieving, filtration", "Evaporation"]),
        ch("Living Creatures: Exploring their Characteristics", ["Features of living things", "Life cycles"]),
        ch("Nature's Treasures", ["Air, water, soil", "Renewable and non-renewable resources"]),
        ch("Beyond Earth", ["Stars and constellations", "The solar system"]),
      ]),
    ]),
    subject("social-science", "Social Science", ["Exploring Society: India and Beyond"], [
      unit("India and the World: Land and the People", [
        ch("Locating Places on the Earth", ["Maps and globes", "Latitudes and longitudes"]),
        ch("Oceans and Continents", ["Major oceans", "Continents"]),
        ch("Landforms and Life", ["Mountains, plateaus, plains", "Life in different landforms"]),
      ]),
      unit("Tapestry of the Past", [
        ch("Timeline and Sources of History", ["BCE and CE", "Sources of history"]),
        ch("India, That Is Bharat", ["Names of our land"]),
        ch("The Beginnings of Indian Civilisation", ["Harappan cities"]),
      ]),
      unit("Our Cultural Heritage and Knowledge Traditions", [
        ch("India's Cultural Roots", ["Vedas, Buddhism, Jainism"]),
        ch("Unity in Diversity, or 'Many in the One'", ["Festivals, food, clothing"]),
      ]),
      unit("Governance and Democracy", [
        ch("Family and Community", ["Roles in a family", "Community"]),
        ch("Grassroots Democracy – Governance", ["What is governance"]),
        ch("Local Government in Rural Areas", ["Gram Sabha and Panchayat"]),
        ch("Local Government in Urban Areas", ["Municipal corporation"]),
      ]),
      unit("Economic Life Around Us", [
        ch("The Value of Work", ["Economic and non-economic activities"]),
        ch("Economic Activities Around Us", ["Primary, secondary, tertiary sectors"]),
      ]),
    ]),
    middleEnglish(6),
    middleHindi(),
  ],
};

export const class7: GradeDef = {
  grade: 7,
  stage: "Middle",
  structure: "chapters",
  subjects: [
    subject("maths", "Mathematics", ["Ganita Prakash"], [
      unit("Ganita Prakash", [
        ch("Large Numbers Around Us", ["Lakhs and crores", "Estimating large numbers"]),
        ch("Arithmetic Expressions", ["Order of operations", "Brackets", "Comparing expressions"]),
        ch("A Peek Beyond the Point", ["Decimals", "Place value of decimals", "Operations on decimals"]),
        ch("Expressions using Letter-Numbers", ["Variables", "Simplifying expressions"]),
        ch("Parallel and Intersecting Lines", ["Pairs of angles", "Transversals"]),
        ch("Number Play", ["Parity", "Magic squares", "Patterns"]),
        ch("A Tale of Three Intersecting Lines", ["Triangles", "Constructing triangles", "Angle sum"]),
        ch("Working with Fractions", ["Multiplying and dividing fractions"]),
      ]),
    ]),
    subject("science", "Science", ["Curiosity"], [
      unit("Curiosity", [
        ch("The Ever-Evolving World of Science", ["How science grows"]),
        ch("Exploring Substances: Acidic, Basic and Neutral", ["Indicators", "Neutralisation"]),
        ch("Electricity: Circuits and their Components", ["Cells and bulbs", "Switches", "Conductors and insulators"]),
        ch("The World of Metals and Non-metals", ["Properties", "Uses"]),
        ch("Changes Around Us: Physical and Chemical", ["Physical changes", "Chemical changes", "Rusting"]),
        ch("Adolescence: A Stage of Growth and Change", ["Changes at puberty", "Health and hygiene"]),
        ch("Heat Transfer in Nature", ["Conduction, convection, radiation"]),
        ch("Measurement of Time and Motion", ["Simple pendulum", "Speed"]),
        ch("Life Processes in Animals", ["Digestion", "Respiration"]),
        ch("Life Processes in Plants", ["Photosynthesis", "Transport in plants"]),
        ch("Light: Shadows and Reflections", ["Shadows", "Plane mirrors"]),
        ch("Earth, Moon, and the Sun", ["Rotation and revolution", "Phases of the moon", "Eclipses"]),
      ]),
    ]),
    subject("social-science", "Social Science", ["Exploring Society: India and Beyond"], [
      unit("Geography", [
        ch("Geographical Diversity of India", ["Physical divisions of India"]),
        ch("Understanding the Weather", ["Elements of weather", "Measuring weather"]),
        ch("Climates of India", ["Monsoon", "Climate regions"]),
      ]),
      unit("History", [
        ch("New Beginnings: Cities and States", ["Mahajanapadas"]),
        ch("The Rise of Empires", ["Mauryan Empire"]),
        ch("The Age of Reorganisation", ["Post-Mauryan kingdoms"]),
        ch("The Gupta Era: An Age of Tireless Creativity", ["Science, art and literature"]),
        ch("How the Land Becomes Sacred", ["Sacred geography of India"]),
      ]),
      unit("Governance and economics", [
        ch("From the Rulers to the Ruled: Types of Governments", ["Monarchy and democracy"]),
        ch("The Constitution of India — An Introduction", ["Preamble", "Key features"]),
        ch("From Barter to Money", ["Evolution of money"]),
        ch("Understanding Markets", ["Buyers and sellers", "Types of markets"]),
      ]),
    ]),
    middleEnglish(7),
    middleHindi(),
  ],
};

export const class8: GradeDef = {
  grade: 8,
  stage: "Middle",
  structure: "chapters",
  subjects: [
    subject("maths", "Mathematics", ["Ganita Prakash"], [
      unit("Ganita Prakash", [
        ch("A Square and A Cube", ["The locker puzzle", "Perfect squares", "Square roots", "Cubes and cube roots"]),
        ch("Power Play", ["Exponents", "Laws of exponents", "Scientific notation"]),
        ch("A Story of Numbers", ["Number systems through history", "Place value"]),
        ch("Quadrilaterals", ["Parallelograms, rhombuses, rectangles", "Diagonals", "Angle sum"]),
        ch("Number Play", ["Divisibility puzzles", "Digit sums"]),
        ch("We Distribute, Yet Things Multiply", ["Distributive property", "Algebraic identities"]),
        ch("Proportional Reasoning – 1", ["Ratios", "Rates", "Scaling"]),
      ]),
    ]),
    subject("science", "Science", ["Curiosity"], [
      unit("Curiosity", [
        ch("Exploring the Investigative World of Science", ["Scientific inquiry"]),
        ch("The Invisible Living World: Beyond Our Naked Eye", ["Microorganisms", "Useful and harmful microbes"]),
        ch("Health: The Ultimate Treasure", ["Infections", "Immunity and vaccines"]),
        ch("Electricity: Magnetic and Heating Effects", ["Electromagnets", "Heating effect"]),
        ch("Exploring Forces", ["Contact and non-contact forces", "Friction", "Gravity"]),
        ch("Pressure, Winds, Storms, and Cyclones", ["Air pressure", "Cyclones"]),
        ch("Particulate Nature of Matter", ["Particles and their motion", "States of matter", "Diffusion"]),
        ch("Nature of Matter: Elements, Compounds, and Mixtures", ["Pure substances", "Mixtures"]),
        ch("The Amazing World of Solutes, Solvents, and Solutions", ["Solubility", "Saturated solutions"]),
        ch("Light: Mirrors and Lenses", ["Curved mirrors", "Lenses"]),
        ch("Keeping Time with the Skies", ["Calendars", "Moon and seasons"]),
        ch("How Nature Works in Harmony", ["Ecosystems", "Interdependence"]),
        ch("Our Home: Earth, a Unique Life Sustaining Planet", ["Conditions for life"]),
      ]),
    ]),
    subject("social-science", "Social Science", ["Exploring Society: India and Beyond"], [
      unit("Exploring Society", [
        ch("Natural Resources and Their Use", ["Types of resources", "Conservation"]),
        ch("Reshaping India's Political Map", ["Delhi Sultanate", "Mughals"]),
        ch("The Rise of the Marathas", ["Shivaji", "Maratha administration", "Maratha expansion"]),
        ch("The Colonial Era in India", ["East India Company", "Impact of colonial rule"]),
        ch("Universal Franchise and India's Electoral System", ["Right to vote", "Election Commission"]),
        ch("The Parliamentary System: Legislature and Executive", ["Lok Sabha and Rajya Sabha", "How laws are made"]),
        ch("Factors of Production", ["Land, labour, capital, entrepreneurship"]),
      ]),
    ]),
    middleEnglish(8),
    middleHindi(),
  ],
};
