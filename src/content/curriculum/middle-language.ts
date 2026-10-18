import { ch, subject, unit } from "./helpers";

/** English and Hindi for Classes 6–8, organised by skill rather than by textbook chapter. */
export const middleEnglish = (grade: number) =>
  subject("english", "English", ["Poorvi (NCERT)", "Grammar & Writing"], [
    unit("Grammar", [
      ch("Nouns and Pronouns", ["Kinds of nouns", "Personal, reflexive and relative pronouns"]),
      ch("Verbs and Tenses", grade >= 8 ? ["Perfect and continuous tenses", "Active and passive voice"] : ["Simple, continuous and perfect tenses", "Regular and irregular verbs"]),
      ch("Adjectives and Adverbs", ["Degrees of comparison", "Kinds of adverbs"]),
      ch("Prepositions, Conjunctions and Articles", ["Using a, an, the", "Joining sentences"]),
      ch(grade >= 7 ? "Reported Speech" : "Sentences and Punctuation", grade >= 7 ? ["Changing direct to indirect speech"] : ["Kinds of sentences", "Capital letters and punctuation"]),
    ]),
    unit("Writing", [
      ch("Paragraph Writing", ["Topic sentence", "Supporting details"]),
      ch("Letter Writing", ["Informal letters", grade >= 7 ? "Formal letters" : "Writing to a friend"]),
      ch("Notice and Message Writing", ["Format and word limit"]),
      ch("Story Writing", ["Beginning, middle, end"]),
    ]),
    unit("Reading", [
      ch("Reading Comprehension", ["Finding the main idea", "Inference questions"]),
      ch("Poetry Appreciation", ["Rhyme, rhythm and imagery"]),
    ]),
  ]);

export const middleHindi = () =>
  subject("hindi", "Hindi", ["मल्हार (NCERT)", "व्याकरण"], [
    unit("व्याकरण", [
      ch("वर्ण और वर्तनी", ["स्वर और व्यंजन", "शुद्ध वर्तनी"], "varn-aur-vartani"),
      ch("संज्ञा, सर्वनाम और विशेषण", ["भेद और उदाहरण"], "sangya-sarvanam-visheshan"),
      ch("क्रिया और काल", ["सकर्मक और अकर्मक", "भूत, वर्तमान, भविष्य"], "kriya-aur-kaal"),
      ch("लिंग और वचन", ["लिंग परिवर्तन", "वचन परिवर्तन"], "ling-aur-vachan"),
      ch("पर्यायवाची, विलोम और मुहावरे", ["शब्द भंडार"], "paryayvachi-vilom-muhavare"),
    ]),
    unit("लेखन", [
      ch("अनुच्छेद लेखन", ["विषय पर अनुच्छेद"], "anuchchhed-lekhan"),
      ch("पत्र लेखन", ["अनौपचारिक और औपचारिक पत्र"], "patra-lekhan"),
      ch("अपठित गद्यांश", ["पढ़कर उत्तर देना"], "apathit-gadyansh"),
    ]),
  ]);
