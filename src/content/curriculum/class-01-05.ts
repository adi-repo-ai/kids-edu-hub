import type { GradeDef } from "@/lib/types";
import { ch, subject, unit } from "./helpers";

/*
 * Classes 1–5 are organised by syllabus topic (what children learn at each stage)
 * rather than by the chapter names of the new NCERT books.
 */

const foundEnglish = (grade: 1 | 2) =>
  subject("english", "English", ["Mridang (NCERT)"], [
    unit("Listening & speaking", [ch("Rhymes and Songs", ["Recite and act out rhymes"]), ch("Talking About Me", ["Name, family, likes"])]),
    unit("Reading", [
      ch("Letters and Sounds", grade === 1 ? ["A to Z", "Phonics: letter sounds"] : ["Blends: bl, cr, st", "Long and short vowels"]),
      ch("Sight Words", ["Common words to read at a glance"]),
      ch("Reading Short Stories", ["Picture reading", "Answering simple questions"]),
    ]),
    unit("Writing & words", [
      ch("Writing Words and Sentences", grade === 1 ? ["Tracing letters", "Writing simple words"] : ["Capital letters and full stops", "Simple sentences"]),
      ch("Naming and Doing Words", ["Nouns", "Action words"]),
      ch("Opposites and Rhyming Words", ["big–small", "cat–hat"]),
    ]),
  ]);

const foundHindi = () =>
  subject("hindi", "Hindi", ["सारंगी (NCERT)"], [
    unit("पढ़ना और लिखना", [
      ch("स्वर", ["अ से अः"], "swar"),
      ch("व्यंजन", ["क से ज्ञ"], "vyanjan"),
      ch("मात्राएँ", ["आ, इ, ई, उ, ऊ, ए, ऐ, ओ, औ की मात्राएँ"], "matrayen"),
      ch("शब्द और वाक्य", ["दो और तीन अक्षर वाले शब्द", "छोटे वाक्य"], "shabd-aur-vakya"),
    ]),
    unit("कविता और कहानी", [ch("बाल कविताएँ", ["गाना और समझना"], "bal-kavitayen"), ch("चित्र कहानियाँ", ["चित्र देखकर बताना"], "chitra-kahaniyan")]),
  ]);

export const class1: GradeDef = {
  grade: 1,
  stage: "Foundational",
  structure: "topics",
  subjects: [
    subject("maths", "Mathematics", ["Joyful Mathematics (NCERT)"], [
      unit("Numbers", [
        ch("Counting 1 to 20", ["Counting objects", "Writing numerals"]),
        ch("Numbers up to 99", ["Tens and ones", "Number names"]),
        ch("More, Less and Same", ["Comparing groups", "Before, after, between"]),
        ch("Zero", ["The meaning of nothing"]),
      ]),
      unit("Adding and taking away", [
        ch("Addition up to 20", ["Putting together", "Number line jumps"]),
        ch("Subtraction up to 20", ["Taking away", "How many more?"]),
      ]),
      unit("Shapes, measures and money", [
        ch("Shapes Around Us", ["Circle, square, triangle", "Rolling and sliding objects"]),
        ch("Patterns", ["Shape and colour patterns"]),
        ch("Long and Short, Heavy and Light", ["Comparing length and weight"]),
        ch("Days of the Week", ["Today, yesterday, tomorrow"]),
        ch("Money", ["Coins and notes"]),
      ]),
    ]),
    foundEnglish(1),
    foundHindi(),
  ],
};

export const class2: GradeDef = {
  grade: 2,
  stage: "Foundational",
  structure: "topics",
  subjects: [
    subject("maths", "Mathematics", ["Joyful Mathematics (NCERT)"], [
      unit("Numbers", [
        ch("Numbers up to 100", ["Place value: tens and ones", "Odd and even"]),
        ch("Skip Counting", ["Counting in 2s, 5s and 10s"]),
      ]),
      unit("Operations", [
        ch("Addition with Carrying", ["Two-digit addition"]),
        ch("Subtraction with Borrowing", ["Two-digit subtraction"]),
        ch("Introduction to Multiplication", ["Repeated addition", "Tables of 2, 3, 4, 5"]),
        ch("Sharing Equally", ["Early idea of division"]),
      ]),
      unit("Shapes, measures and data", [
        ch("2D and 3D Shapes", ["Faces, edges, corners"]),
        ch("Length, Weight and Capacity", ["Non-standard and standard units"]),
        ch("Time", ["Reading the clock", "Months of the year"]),
        ch("Money", ["Adding money", "Making change"]),
        ch("Data Handling", ["Tally marks", "Picture graphs"]),
      ]),
    ]),
    foundEnglish(2),
    foundHindi(),
  ],
};

const prepEvs = (grade: 3 | 4 | 5) =>
  subject("evs", "The World Around Us (EVS)", ["Our Wondrous World (NCERT)"], [
    unit("Family and friends", [
      ch("Family and Relationships", ["Family tree", "Changes in families"]),
      ch("Animals Around Us", grade >= 4 ? ["Animal senses", "Animal homes and migration"] : ["Pets and wild animals", "What animals eat"]),
      ch("Plants Around Us", grade >= 4 ? ["Seeds and dispersal", "Plants that give us food"] : ["Parts of a plant", "Leaves of different shapes"]),
    ]),
    unit("Food, water and shelter", [
      ch("Food We Eat", ["Food from plants and animals", "Cooking and food habits"]),
      ch("Water", grade === 5 ? ["Water cycle", "Saving water"] : ["Sources of water", "Clean water"]),
      ch("Homes and Shelter", ["Types of houses", "Materials used"]),
    ]),
    unit("Travel, work and our earth", [
      ch("Travel and Transport", ["Means of transport", "Maps and directions"]),
      ch("Things We Make and Do", ["Work people do", "Crafts"]),
      ch("Our Earth and Sky", grade === 5 ? ["Sun, moon and stars", "Weather and seasons"] : ["Day and night", "Weather"]),
      ch("Health and Safety", ["Hygiene", "Road safety"]),
    ]),
  ]);

const prepEnglish = (grade: 3 | 4 | 5) =>
  subject("english", "English", ["Santoor (NCERT)"], [
    unit("Reading", [
      ch("Reading Stories and Poems", ["Read aloud with expression", "Answer questions"]),
      ch("Reading for Meaning", ["Main idea", "New words from context"]),
    ]),
    unit("Grammar", [
      ch("Nouns and Pronouns", ["Common and proper nouns", "Singular and plural"]),
      ch("Verbs and Tenses", grade >= 4 ? ["Past, present and future"] : ["Action words", "Present tense"]),
      ch("Adjectives", ["Describing words"]),
      ch("Punctuation", ["Full stop, comma, question mark"]),
    ]),
    unit("Writing", [
      ch("Sentence and Paragraph Writing", ["Joining ideas"]),
      ch(grade === 5 ? "Letter and Diary Writing" : "Picture Composition", grade === 5 ? ["Informal letter", "Diary entry"] : ["Describing a picture"]),
    ]),
  ]);

const prepHindi = () =>
  subject("hindi", "Hindi", ["वीणा (NCERT)"], [
    unit("पढ़ना", [ch("कहानी और कविता पढ़ना", ["भाव के साथ पढ़ना"], "kahani-kavita"), ch("अपठित अनुच्छेद", ["प्रश्नों के उत्तर"], "apathit")]),
    unit("व्याकरण", [
      ch("संज्ञा और सर्वनाम", ["नाम वाले शब्द"], "sangya-sarvanam"),
      ch("लिंग और वचन", ["एक और अनेक"], "ling-vachan"),
      ch("विलोम और पर्यायवाची", ["उल्टे अर्थ वाले शब्द"], "vilom-paryayvachi"),
    ]),
    unit("लेखन", [ch("अनुच्छेद और पत्र", ["छोटा अनुच्छेद", "पत्र"], "anuchchhed-patra")]),
  ]);

const prepMaths = (grade: 3 | 4 | 5) =>
  subject("maths", "Mathematics", ["Maths Mela (NCERT)"], [
    unit("Numbers", [
      ch(grade === 3 ? "Numbers up to 999" : grade === 4 ? "Numbers up to 9,999" : "Numbers up to 1,00,000", ["Place value", "Comparing and ordering", "Rounding off"]),
      ch("Patterns", ["Number patterns", "Shape patterns"]),
    ]),
    unit("Operations", [
      ch("Addition and Subtraction", ["With regrouping", "Word problems"]),
      ch("Multiplication", grade === 3 ? ["Tables up to 10", "Multiplying by 1-digit numbers"] : ["Multiplying by 2- and 3-digit numbers"]),
      ch("Division", grade === 3 ? ["Equal sharing and grouping"] : ["Long division", "Remainders"]),
      ch("Fractions", grade === 5 ? ["Equivalent fractions", "Adding like fractions", "Decimals"] : ["Half, quarter, three-quarters"]),
    ]),
    unit("Geometry, measurement and data", [
      ch("Shapes and Designs", grade === 5 ? ["Angles", "Nets of 3D shapes"] : ["Lines and shapes", "Tangrams"]),
      ch("Measurement", ["Length, weight and capacity", "Conversion of units"]),
      ch("Perimeter and Area", ["Perimeter by adding sides", "Area by counting squares"]),
      ch("Time and Calendar", ["Clock time", "Calendar"]),
      ch("Money", ["Bills and budgets"]),
      ch("Data Handling", ["Tables", "Bar graphs"]),
    ]),
  ]);

export const class3: GradeDef = { grade: 3, stage: "Preparatory", structure: "topics", subjects: [prepMaths(3), prepEvs(3), prepEnglish(3), prepHindi()] };
export const class4: GradeDef = { grade: 4, stage: "Preparatory", structure: "topics", subjects: [prepMaths(4), prepEvs(4), prepEnglish(4), prepHindi()] };
export const class5: GradeDef = { grade: 5, stage: "Preparatory", structure: "topics", subjects: [prepMaths(5), prepEvs(5), prepEnglish(5), prepHindi()] };
