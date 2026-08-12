export type WordVisualType = "emoji" | "color";

export type WordItem = {
  id: string;
  category: string;
  categoryZh: string;
  word: string;
  chinese: string;
  image: string | null;
  emoji: string;
  type: WordVisualType;
  color?: string;
};

export type WordCategory = {
  id: string;
  name: string;
  nameZh: string;
  emoji: string;
  color: string;
  words: WordItem[];
};

type WordSeed = Pick<WordItem, "word" | "chinese" | "emoji"> &
  Partial<Pick<WordItem, "type" | "color" | "image">>;

function makeCategory(
  category: Omit<WordCategory, "words">,
  words: WordSeed[],
): WordCategory {
  return {
    ...category,
    words: words.map((item) => ({
      id: `${category.id}-${item.word}`,
      category: category.name,
      categoryZh: category.nameZh,
      word: item.word,
      chinese: item.chinese,
      image: item.image ?? null,
      emoji: item.emoji,
      type: item.type ?? "emoji",
      color: item.color,
    })),
  };
}

export const wordCategories: WordCategory[] = [
  makeCategory(
    {
      id: "animals",
      name: "Animals",
      nameZh: "动物",
      emoji: "🐾",
      color: "#f28b66",
    },
    [
      { word: "cat", chinese: "猫", emoji: "🐱" },
      { word: "dog", chinese: "狗", emoji: "🐶" },
      { word: "bird", chinese: "鸟", emoji: "🐦" },
      { word: "fish", chinese: "鱼", emoji: "🐟" },
      { word: "rabbit", chinese: "兔子", emoji: "🐰" },
      { word: "duck", chinese: "鸭子", emoji: "🦆" },
      { word: "pig", chinese: "猪", emoji: "🐷" },
      { word: "cow", chinese: "奶牛", emoji: "🐮" },
      { word: "horse", chinese: "马", emoji: "🐴" },
      { word: "monkey", chinese: "猴子", emoji: "🐵" },
    ],
  ),
  makeCategory(
    {
      id: "fruits",
      name: "Fruits",
      nameZh: "水果",
      emoji: "🍎",
      color: "#ef6a70",
    },
    [
      { word: "apple", chinese: "苹果", emoji: "🍎" },
      { word: "banana", chinese: "香蕉", emoji: "🍌" },
      { word: "orange", chinese: "橙子", emoji: "🍊" },
      { word: "grape", chinese: "葡萄", emoji: "🍇" },
      { word: "pear", chinese: "梨", emoji: "🍐" },
      { word: "peach", chinese: "桃子", emoji: "🍑" },
      { word: "watermelon", chinese: "西瓜", emoji: "🍉" },
      { word: "strawberry", chinese: "草莓", emoji: "🍓" },
      { word: "lemon", chinese: "柠檬", emoji: "🍋" },
      { word: "mango", chinese: "芒果", emoji: "🥭" },
    ],
  ),
  makeCategory(
    {
      id: "colors",
      name: "Colors",
      nameZh: "颜色",
      emoji: "🎨",
      color: "#7569d8",
    },
    [
      { word: "red", chinese: "红色", emoji: "", type: "color", color: "#e53935" },
      { word: "blue", chinese: "蓝色", emoji: "", type: "color", color: "#2675d8" },
      { word: "yellow", chinese: "黄色", emoji: "", type: "color", color: "#f4ca22" },
      { word: "green", chinese: "绿色", emoji: "", type: "color", color: "#35a853" },
      { word: "white", chinese: "白色", emoji: "", type: "color", color: "#ffffff" },
      { word: "black", chinese: "黑色", emoji: "", type: "color", color: "#242424" },
      { word: "pink", chinese: "粉色", emoji: "", type: "color", color: "#f38db6" },
      { word: "purple", chinese: "紫色", emoji: "", type: "color", color: "#8d4ab8" },
      { word: "orange", chinese: "橙色", emoji: "", type: "color", color: "#f58b24" },
      { word: "brown", chinese: "棕色", emoji: "", type: "color", color: "#8a5a3b" },
    ],
  ),
  makeCategory(
    {
      id: "family",
      name: "Family",
      nameZh: "家庭",
      emoji: "🏠",
      color: "#db6e9e",
    },
    [
      { word: "mom", chinese: "妈妈", emoji: "👩" },
      { word: "dad", chinese: "爸爸", emoji: "👨" },
      { word: "mother", chinese: "母亲", emoji: "👩" },
      { word: "father", chinese: "父亲", emoji: "👨" },
      { word: "sister", chinese: "姐姐 / 妹妹", emoji: "👧" },
      { word: "brother", chinese: "哥哥 / 弟弟", emoji: "👦" },
      { word: "grandma", chinese: "奶奶 / 外婆", emoji: "👵" },
      { word: "grandpa", chinese: "爷爷 / 外公", emoji: "👴" },
      { word: "baby", chinese: "宝宝", emoji: "👶" },
      { word: "family", chinese: "家庭", emoji: "👨‍👩‍👧‍👦" },
    ],
  ),
  makeCategory(
    {
      id: "things",
      name: "Things",
      nameZh: "身边物品",
      emoji: "🎒",
      color: "#4794bd",
    },
    [
      { word: "book", chinese: "书", emoji: "📕" },
      { word: "pen", chinese: "钢笔", emoji: "🖊️" },
      { word: "pencil", chinese: "铅笔", emoji: "✏️" },
      { word: "bag", chinese: "书包", emoji: "🎒" },
      { word: "table", chinese: "桌子", emoji: "🪵" },
      { word: "chair", chinese: "椅子", emoji: "🪑" },
      { word: "cup", chinese: "杯子", emoji: "🥤" },
      { word: "door", chinese: "门", emoji: "🚪" },
      { word: "bed", chinese: "床", emoji: "🛏️" },
      { word: "ball", chinese: "球", emoji: "⚽" },
    ],
  ),
  makeCategory(
    {
      id: "body",
      name: "Body",
      nameZh: "身体",
      emoji: "🙋",
      color: "#42a67c",
    },
    [
      { word: "head", chinese: "头", emoji: "🙂" },
      { word: "eye", chinese: "眼睛", emoji: "👁️" },
      { word: "ear", chinese: "耳朵", emoji: "👂" },
      { word: "nose", chinese: "鼻子", emoji: "👃" },
      { word: "mouth", chinese: "嘴巴", emoji: "👄" },
      { word: "hand", chinese: "手", emoji: "✋" },
      { word: "arm", chinese: "手臂", emoji: "💪" },
      { word: "leg", chinese: "腿", emoji: "🦵" },
      { word: "foot", chinese: "脚", emoji: "🦶" },
      { word: "hair", chinese: "头发", emoji: "💇" },
    ],
  ),
];

export const allWords = wordCategories.flatMap((category) => category.words);
