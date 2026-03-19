// words.js
// Each entry has: category, word, hint (for the impostor)

const WORD_PACKS = [
  {
    category: "Animals",
    word: "Elephant",
    hint: "A very large grey animal"
  },
  {
    category: "Animals",
    word: "Kangaroo",
    hint: "It jumps and carries babies"
  },
  {
    category: "Food",
    word: "Pizza",
    hint: "Often round and cheesy"
  },
  {
    category: "Food",
    word: "Sushi",
    hint: "Served cold and rolled"
  },
  {
    category: "Places",
    word: "Beach",
    hint: "Lots of sand and water"
  },
  {
    category: "Places",
    word: "Library",
    hint: "Very quiet, lots of shelves"
  },
  {
    category: "Objects",
    word: "Backpack",
    hint: "You carry it on your shoulders"
  },
  {
    category: "Objects",
    word: "Umbrella",
    hint: "Useful when it rains"
  },
  {
    category: "Jobs",
    word: "Doctor",
    hint: "Helps people feel better"
  },
  {
    category: "Jobs",
    word: "Chef",
    hint: "Works with knives and heat"
  }
];

// Export for use in your game
export default WORD_PACKS;
