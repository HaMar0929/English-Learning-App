export type WordVisualType = "emoji" | "color";

export type WordItem = {
  id: string;
  category: string;
  categoryZh: string;
  word: string;
  chinese: string;
  phonetic: string;
  example: string;
  exampleCn: string;
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

type WordDetails = Pick<WordItem, "phonetic" | "example" | "exampleCn">;

const wordDetails: Record<string, WordDetails> = {
  "animals-cat": { phonetic: "/kæt/", example: "The cat is sleeping.", exampleCn: "这只猫正在睡觉。" },
  "animals-dog": { phonetic: "/dɔːɡ/", example: "The dog can run fast.", exampleCn: "这只狗跑得很快。" },
  "animals-bird": { phonetic: "/bɜːrd/", example: "A bird is in the tree.", exampleCn: "树上有一只鸟。" },
  "animals-fish": { phonetic: "/fɪʃ/", example: "The fish swims in the water.", exampleCn: "这条鱼在水里游。" },
  "animals-rabbit": { phonetic: "/ˈræbɪt/", example: "The rabbit has long ears.", exampleCn: "这只兔子有长耳朵。" },
  "animals-duck": { phonetic: "/dʌk/", example: "The duck is by the pond.", exampleCn: "这只鸭子在池塘边。" },
  "animals-pig": { phonetic: "/pɪɡ/", example: "The pig is pink.", exampleCn: "这只猪是粉色的。" },
  "animals-cow": { phonetic: "/kaʊ/", example: "The cow eats grass.", exampleCn: "这头奶牛吃草。" },
  "animals-horse": { phonetic: "/hɔːrs/", example: "The horse runs across the field.", exampleCn: "这匹马跑过田野。" },
  "animals-monkey": { phonetic: "/ˈmʌŋki/", example: "The monkey likes bananas.", exampleCn: "这只猴子喜欢香蕉。" },
  "fruits-apple": { phonetic: "/ˈæpəl/", example: "I eat an apple every day.", exampleCn: "我每天吃一个苹果。" },
  "fruits-banana": { phonetic: "/bəˈnænə/", example: "This banana is yellow.", exampleCn: "这根香蕉是黄色的。" },
  "fruits-orange": { phonetic: "/ˈɔːrɪndʒ/", example: "She peels an orange.", exampleCn: "她剥了一个橙子。" },
  "fruits-grape": { phonetic: "/ɡreɪp/", example: "This grape is sweet.", exampleCn: "这颗葡萄很甜。" },
  "fruits-pear": { phonetic: "/per/", example: "The pear is green.", exampleCn: "这个梨是绿色的。" },
  "fruits-peach": { phonetic: "/piːtʃ/", example: "The peach is soft and sweet.", exampleCn: "这个桃子又软又甜。" },
  "fruits-watermelon": { phonetic: "/ˈwɔːtərmelən/", example: "We share a watermelon.", exampleCn: "我们分享一个西瓜。" },
  "fruits-strawberry": { phonetic: "/ˈstrɔːberi/", example: "The strawberry is red.", exampleCn: "这颗草莓是红色的。" },
  "fruits-lemon": { phonetic: "/ˈlemən/", example: "The lemon tastes sour.", exampleCn: "这个柠檬尝起来很酸。" },
  "fruits-mango": { phonetic: "/ˈmæŋɡoʊ/", example: "This mango is very juicy.", exampleCn: "这个芒果汁水很多。" },
  "colors-red": { phonetic: "/red/", example: "Her bag is red.", exampleCn: "她的包是红色的。" },
  "colors-blue": { phonetic: "/bluː/", example: "The sky is blue.", exampleCn: "天空是蓝色的。" },
  "colors-yellow": { phonetic: "/ˈjeloʊ/", example: "The flower is yellow.", exampleCn: "这朵花是黄色的。" },
  "colors-green": { phonetic: "/ɡriːn/", example: "The leaves are green.", exampleCn: "树叶是绿色的。" },
  "colors-white": { phonetic: "/waɪt/", example: "The snow is white.", exampleCn: "雪是白色的。" },
  "colors-black": { phonetic: "/blæk/", example: "He has a black hat.", exampleCn: "他有一顶黑色的帽子。" },
  "colors-pink": { phonetic: "/pɪŋk/", example: "She wears a pink dress.", exampleCn: "她穿着一条粉色连衣裙。" },
  "colors-purple": { phonetic: "/ˈpɜːrpəl/", example: "These grapes are purple.", exampleCn: "这些葡萄是紫色的。" },
  "colors-orange": { phonetic: "/ˈɔːrɪndʒ/", example: "The ball is orange.", exampleCn: "这个球是橙色的。" },
  "colors-brown": { phonetic: "/braʊn/", example: "The table is brown.", exampleCn: "这张桌子是棕色的。" },
  "family-mom": { phonetic: "/mɑːm/", example: "My mom makes breakfast.", exampleCn: "我妈妈做早餐。" },
  "family-dad": { phonetic: "/dæd/", example: "My dad reads a book.", exampleCn: "我爸爸在读书。" },
  "family-mother": { phonetic: "/ˈmʌðər/", example: "My mother is kind.", exampleCn: "我的母亲很亲切。" },
  "family-father": { phonetic: "/ˈfɑːðər/", example: "My father drives to work.", exampleCn: "我的父亲开车去上班。" },
  "family-sister": { phonetic: "/ˈsɪstər/", example: "My sister likes music.", exampleCn: "我的姐妹喜欢音乐。" },
  "family-brother": { phonetic: "/ˈbrʌðər/", example: "My brother plays football.", exampleCn: "我的兄弟踢足球。" },
  "family-grandma": { phonetic: "/ˈɡrænmɑː/", example: "My grandma tells a story.", exampleCn: "我的奶奶讲故事。" },
  "family-grandpa": { phonetic: "/ˈɡrænpɑː/", example: "My grandpa takes a walk.", exampleCn: "我的爷爷在散步。" },
  "family-baby": { phonetic: "/ˈbeɪbi/", example: "The baby is smiling.", exampleCn: "这个宝宝正在微笑。" },
  "family-family": { phonetic: "/ˈfæməli/", example: "My family eats dinner together.", exampleCn: "我们一家人一起吃晚饭。" },
  "things-book": { phonetic: "/bʊk/", example: "This book is interesting.", exampleCn: "这本书很有趣。" },
  "things-pen": { phonetic: "/pen/", example: "I write with a pen.", exampleCn: "我用钢笔写字。" },
  "things-pencil": { phonetic: "/ˈpensəl/", example: "The pencil is on the desk.", exampleCn: "铅笔在书桌上。" },
  "things-bag": { phonetic: "/bæɡ/", example: "My bag is very heavy.", exampleCn: "我的书包很重。" },
  "things-table": { phonetic: "/ˈteɪbəl/", example: "Dinner is on the table.", exampleCn: "晚餐在桌子上。" },
  "things-chair": { phonetic: "/tʃer/", example: "Please sit on the chair.", exampleCn: "请坐在椅子上。" },
  "things-cup": { phonetic: "/kʌp/", example: "The cup is full of water.", exampleCn: "杯子里装满了水。" },
  "things-door": { phonetic: "/dɔːr/", example: "Please close the door.", exampleCn: "请把门关上。" },
  "things-bed": { phonetic: "/bed/", example: "The bed is soft.", exampleCn: "这张床很柔软。" },
  "things-ball": { phonetic: "/bɔːl/", example: "The children kick the ball.", exampleCn: "孩子们踢球。" },
  "body-head": { phonetic: "/hed/", example: "Put the hat on your head.", exampleCn: "把帽子戴在头上。" },
  "body-eye": { phonetic: "/aɪ/", example: "She has something in her eye.", exampleCn: "她眼睛里进了东西。" },
  "body-ear": { phonetic: "/ɪr/", example: "He whispers in my ear.", exampleCn: "他在我耳边低语。" },
  "body-nose": { phonetic: "/noʊz/", example: "Touch your nose.", exampleCn: "摸摸你的鼻子。" },
  "body-mouth": { phonetic: "/maʊθ/", example: "Open your mouth, please.", exampleCn: "请张开嘴巴。" },
  "body-hand": { phonetic: "/hænd/", example: "Raise your hand.", exampleCn: "举起你的手。" },
  "body-arm": { phonetic: "/ɑːrm/", example: "She carries the bag on her arm.", exampleCn: "她把包挎在手臂上。" },
  "body-leg": { phonetic: "/leɡ/", example: "My left leg is tired.", exampleCn: "我的左腿累了。" },
  "body-foot": { phonetic: "/fʊt/", example: "He hurt his foot.", exampleCn: "他弄伤了脚。" },
  "body-hair": { phonetic: "/her/", example: "Her hair is long.", exampleCn: "她的头发很长。" },
  "numbers-one": { phonetic: "/wʌn/", example: "I have one apple.", exampleCn: "我有一个苹果。" },
  "numbers-two": { phonetic: "/tuː/", example: "There are two cats.", exampleCn: "这里有两只猫。" },
  "numbers-three": { phonetic: "/θriː/", example: "She has three books.", exampleCn: "她有三本书。" },
  "numbers-four": { phonetic: "/fɔːr/", example: "The table has four legs.", exampleCn: "这张桌子有四条腿。" },
  "numbers-five": { phonetic: "/faɪv/", example: "We need five cups.", exampleCn: "我们需要五个杯子。" },
  "numbers-six": { phonetic: "/sɪks/", example: "Six birds are in the tree.", exampleCn: "树上有六只鸟。" },
  "numbers-seven": { phonetic: "/ˈsevən/", example: "There are seven days in a week.", exampleCn: "一周有七天。" },
  "numbers-eight": { phonetic: "/eɪt/", example: "The class starts at eight.", exampleCn: "课程八点开始。" },
  "numbers-nine": { phonetic: "/naɪn/", example: "He has nine pencils.", exampleCn: "他有九支铅笔。" },
  "numbers-ten": { phonetic: "/ten/", example: "I can count to ten.", exampleCn: "我能数到十。" },
  "food-rice": { phonetic: "/raɪs/", example: "We eat rice for dinner.", exampleCn: "我们晚餐吃米饭。" },
  "food-bread": { phonetic: "/bred/", example: "I have bread for breakfast.", exampleCn: "我早餐吃面包。" },
  "food-egg": { phonetic: "/eɡ/", example: "She cooks an egg.", exampleCn: "她煮了一个鸡蛋。" },
  "food-milk": { phonetic: "/mɪlk/", example: "The child drinks milk.", exampleCn: "这个孩子喝牛奶。" },
  "food-water": { phonetic: "/ˈwɔːtər/", example: "Please drink some water.", exampleCn: "请喝一些水。" },
  "food-cake": { phonetic: "/keɪk/", example: "This cake tastes delicious.", exampleCn: "这个蛋糕很好吃。" },
  "food-candy": { phonetic: "/ˈkændi/", example: "The candy is sweet.", exampleCn: "这颗糖果很甜。" },
  "food-juice": { phonetic: "/dʒuːs/", example: "He drinks orange juice.", exampleCn: "他喝橙汁。" },
  "food-chicken": { phonetic: "/ˈtʃɪkɪn/", example: "We have chicken for lunch.", exampleCn: "我们午餐吃鸡肉。" },
  "food-noodles": { phonetic: "/ˈnuːdəlz/", example: "These noodles are hot.", exampleCn: "这些面条很烫。" },
  "vehicles-car": { phonetic: "/kɑːr/", example: "The car is in the garage.", exampleCn: "汽车在车库里。" },
  "vehicles-bus": { phonetic: "/bʌs/", example: "I take the bus to school.", exampleCn: "我乘公交车上学。" },
  "vehicles-train": { phonetic: "/treɪn/", example: "The train arrives at noon.", exampleCn: "火车中午到达。" },
  "vehicles-bike": { phonetic: "/baɪk/", example: "She rides her bike to the park.", exampleCn: "她骑自行车去公园。" },
  "vehicles-plane": { phonetic: "/pleɪn/", example: "The plane is in the sky.", exampleCn: "飞机在天空中。" },
  "vehicles-boat": { phonetic: "/boʊt/", example: "The boat sails on the lake.", exampleCn: "小船在湖上航行。" },
  "vehicles-taxi": { phonetic: "/ˈtæksi/", example: "We call a taxi.", exampleCn: "我们叫了一辆出租车。" },
  "vehicles-truck": { phonetic: "/trʌk/", example: "The truck carries boxes.", exampleCn: "卡车运送箱子。" },
  "vehicles-subway": { phonetic: "/ˈsʌbweɪ/", example: "The subway is fast.", exampleCn: "地铁很快。" },
  "vehicles-ship": { phonetic: "/ʃɪp/", example: "The ship crosses the sea.", exampleCn: "轮船驶过大海。" },
  "clothes-shirt": { phonetic: "/ʃɜːrt/", example: "He wears a white shirt.", exampleCn: "他穿着一件白衬衫。" },
  "clothes-T-shirt": { phonetic: "/ˈtiː ʃɜːrt/", example: "This T-shirt is comfortable.", exampleCn: "这件T恤很舒服。" },
  "clothes-pants": { phonetic: "/pænts/", example: "These pants are too long.", exampleCn: "这条裤子太长了。" },
  "clothes-dress": { phonetic: "/dres/", example: "Her dress is beautiful.", exampleCn: "她的连衣裙很漂亮。" },
  "clothes-shoes": { phonetic: "/ʃuːz/", example: "My shoes are under the bed.", exampleCn: "我的鞋在床下面。" },
  "clothes-socks": { phonetic: "/sɑːks/", example: "He wears warm socks.", exampleCn: "他穿着暖和的袜子。" },
  "clothes-hat": { phonetic: "/hæt/", example: "The hat keeps the sun away.", exampleCn: "这顶帽子可以遮阳。" },
  "clothes-coat": { phonetic: "/koʊt/", example: "Put on your coat.", exampleCn: "穿上你的外套。" },
  "clothes-skirt": { phonetic: "/skɜːrt/", example: "She buys a blue skirt.", exampleCn: "她买了一条蓝色裙子。" },
  "clothes-shorts": { phonetic: "/ʃɔːrts/", example: "I wear shorts in summer.", exampleCn: "我夏天穿短裤。" },
  "actions-run": { phonetic: "/rʌn/", example: "I run in the park every morning.", exampleCn: "我每天早上在公园跑步。" },
  "actions-walk": { phonetic: "/wɔːk/", example: "We walk to school together.", exampleCn: "我们一起步行去学校。" },
  "actions-jump": { phonetic: "/dʒʌmp/", example: "The children jump with joy.", exampleCn: "孩子们高兴地跳起来。" },
  "actions-eat": { phonetic: "/iːt/", example: "We eat lunch at noon.", exampleCn: "我们中午吃午饭。" },
  "actions-drink": { phonetic: "/drɪŋk/", example: "I drink water after exercise.", exampleCn: "我运动后喝水。" },
  "actions-sleep": { phonetic: "/sliːp/", example: "Babies sleep a lot.", exampleCn: "宝宝睡得很多。" },
  "actions-sit": { phonetic: "/sɪt/", example: "Please sit beside me.", exampleCn: "请坐在我旁边。" },
  "actions-stand": { phonetic: "/stænd/", example: "We stand in a line.", exampleCn: "我们排队站着。" },
  "actions-read": { phonetic: "/riːd/", example: "I read a story before bed.", exampleCn: "我睡前读一个故事。" },
  "actions-write": { phonetic: "/raɪt/", example: "Please write your name here.", exampleCn: "请在这里写下你的名字。" },
  "feelings-happy": { phonetic: "/ˈhæpi/", example: "I feel happy today.", exampleCn: "我今天感到开心。" },
  "feelings-sad": { phonetic: "/sæd/", example: "She feels sad about the news.", exampleCn: "她听到这个消息感到难过。" },
  "feelings-angry": { phonetic: "/ˈæŋɡri/", example: "He is angry about the mistake.", exampleCn: "他因为这个错误而生气。" },
  "feelings-tired": { phonetic: "/ˈtaɪərd/", example: "I am tired after work.", exampleCn: "我下班后很累。" },
  "feelings-hungry": { phonetic: "/ˈhʌŋɡri/", example: "The children are hungry.", exampleCn: "孩子们饿了。" },
  "feelings-thirsty": { phonetic: "/ˈθɜːrsti/", example: "I am thirsty after running.", exampleCn: "我跑步后口渴了。" },
  "feelings-scared": { phonetic: "/skerd/", example: "The child is scared of the dark.", exampleCn: "这个孩子怕黑。" },
  "feelings-excited": { phonetic: "/ɪkˈsaɪtɪd/", example: "We are excited about the trip.", exampleCn: "我们对这次旅行感到兴奋。" },
  "feelings-sleepy": { phonetic: "/ˈsliːpi/", example: "The baby looks sleepy.", exampleCn: "这个宝宝看起来很困。" },
  "feelings-good": { phonetic: "/ɡʊd/", example: "I feel good this morning.", exampleCn: "我今天早上感觉很好。" },
};

function makeCategory(
  category: Omit<WordCategory, "words">,
  words: WordSeed[],
): WordCategory {
  return {
    ...category,
    words: words.map((item) => {
      const id = `${category.id}-${item.word}`;
      const details = wordDetails[id];

      if (!details) throw new Error(`Missing learning details for ${id}`);

      return {
        id,
        category: category.name,
        categoryZh: category.nameZh,
        word: item.word,
        chinese: item.chinese,
        ...details,
        image: item.image ?? null,
        emoji: item.emoji,
        type: item.type ?? "emoji",
        color: item.color,
      };
    }),
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
      { word: "cat", chinese: "猫", emoji: "🐱", image: "images/words/animals/cat.webp" },
      { word: "dog", chinese: "狗", emoji: "🐶", image: "images/words/animals/dog.webp" },
      { word: "bird", chinese: "鸟", emoji: "🐦", image: "images/words/animals/bird.webp" },
      { word: "fish", chinese: "鱼", emoji: "🐟", image: "images/words/animals/fish.webp" },
      { word: "rabbit", chinese: "兔子", emoji: "🐰", image: "images/words/animals/rabbit.webp" },
      { word: "duck", chinese: "鸭子", emoji: "🦆", image: "images/words/animals/duck.webp" },
      { word: "pig", chinese: "猪", emoji: "🐷", image: "images/words/animals/pig.webp" },
      { word: "cow", chinese: "奶牛", emoji: "🐮", image: "images/words/animals/cow.webp" },
      { word: "horse", chinese: "马", emoji: "🐴", image: "images/words/animals/horse.webp" },
      { word: "monkey", chinese: "猴子", emoji: "🐵", image: "images/words/animals/monkey.webp" },
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
      { word: "apple", chinese: "苹果", emoji: "🍎", image: "images/words/fruits/apple.webp" },
      { word: "banana", chinese: "香蕉", emoji: "🍌", image: "images/words/fruits/banana.webp" },
      { word: "orange", chinese: "橙子", emoji: "🍊", image: "images/words/fruits/orange.webp" },
      { word: "grape", chinese: "葡萄", emoji: "🍇", image: "images/words/fruits/grape.webp" },
      { word: "pear", chinese: "梨", emoji: "🍐", image: "images/words/fruits/pear.webp" },
      { word: "peach", chinese: "桃子", emoji: "🍑", image: "images/words/fruits/peach.webp" },
      { word: "watermelon", chinese: "西瓜", emoji: "🍉", image: "images/words/fruits/watermelon.webp" },
      { word: "strawberry", chinese: "草莓", emoji: "🍓", image: "images/words/fruits/strawberry.webp" },
      { word: "lemon", chinese: "柠檬", emoji: "🍋", image: "images/words/fruits/lemon.webp" },
      { word: "mango", chinese: "芒果", emoji: "🥭", image: "images/words/fruits/mango.webp" },
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
      { word: "mom", chinese: "妈妈", emoji: "👩", image: "images/words/family/mom.webp" },
      { word: "dad", chinese: "爸爸", emoji: "👨", image: "images/words/family/dad.webp" },
      { word: "mother", chinese: "母亲", emoji: "👩", image: "images/words/family/mother.webp" },
      { word: "father", chinese: "父亲", emoji: "👨", image: "images/words/family/father.webp" },
      { word: "sister", chinese: "姐姐 / 妹妹", emoji: "👧", image: "images/words/family/sister.webp" },
      { word: "brother", chinese: "哥哥 / 弟弟", emoji: "👦", image: "images/words/family/brother.webp" },
      { word: "grandma", chinese: "奶奶 / 外婆", emoji: "👵", image: "images/words/family/grandma.webp" },
      { word: "grandpa", chinese: "爷爷 / 外公", emoji: "👴", image: "images/words/family/grandpa.webp" },
      { word: "baby", chinese: "宝宝", emoji: "👶", image: "images/words/family/baby.webp" },
      { word: "family", chinese: "家庭", emoji: "👨‍👩‍👧‍👦", image: "images/words/family/family.webp" },
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
  makeCategory(
    {
      id: "numbers",
      name: "Numbers",
      nameZh: "数字",
      emoji: "🔢",
      color: "#4f7ed8",
    },
    [
      { word: "one", chinese: "一", emoji: "1️⃣" },
      { word: "two", chinese: "二", emoji: "2️⃣" },
      { word: "three", chinese: "三", emoji: "3️⃣" },
      { word: "four", chinese: "四", emoji: "4️⃣" },
      { word: "five", chinese: "五", emoji: "5️⃣" },
      { word: "six", chinese: "六", emoji: "6️⃣" },
      { word: "seven", chinese: "七", emoji: "7️⃣" },
      { word: "eight", chinese: "八", emoji: "8️⃣" },
      { word: "nine", chinese: "九", emoji: "9️⃣" },
      { word: "ten", chinese: "十", emoji: "🔟" },
    ],
  ),
  makeCategory(
    {
      id: "food",
      name: "Food",
      nameZh: "食物",
      emoji: "🍽️",
      color: "#e58a3c",
    },
    [
      { word: "rice", chinese: "米饭", emoji: "🍚", image: "images/words/food/rice.webp" },
      { word: "bread", chinese: "面包", emoji: "🍞", image: "images/words/food/bread.webp" },
      { word: "egg", chinese: "鸡蛋", emoji: "🥚", image: "images/words/food/egg.webp" },
      { word: "milk", chinese: "牛奶", emoji: "🥛", image: "images/words/food/milk.webp" },
      { word: "water", chinese: "水", emoji: "💧", image: "images/words/food/water.webp" },
      { word: "cake", chinese: "蛋糕", emoji: "🍰", image: "images/words/food/cake.webp" },
      { word: "candy", chinese: "糖果", emoji: "🍬", image: "images/words/food/candy.webp" },
      { word: "juice", chinese: "果汁", emoji: "🧃", image: "images/words/food/juice.webp" },
      { word: "chicken", chinese: "鸡肉", emoji: "🍗", image: "images/words/food/chicken.webp" },
      { word: "noodles", chinese: "面条", emoji: "🍜", image: "images/words/food/noodles.webp" },
    ],
  ),
  makeCategory(
    {
      id: "vehicles",
      name: "Vehicles",
      nameZh: "交通工具",
      emoji: "🚗",
      color: "#4089a8",
    },
    [
      { word: "car", chinese: "汽车", emoji: "🚗", image: "images/words/vehicles/car.webp" },
      { word: "bus", chinese: "公交车", emoji: "🚌", image: "images/words/vehicles/bus.webp" },
      { word: "train", chinese: "火车", emoji: "🚆", image: "images/words/vehicles/train.webp" },
      { word: "bike", chinese: "自行车", emoji: "🚲", image: "images/words/vehicles/bike.webp" },
      { word: "plane", chinese: "飞机", emoji: "✈️", image: "images/words/vehicles/plane.webp" },
      { word: "boat", chinese: "小船", emoji: "🚣", image: "images/words/vehicles/boat.webp" },
      { word: "taxi", chinese: "出租车", emoji: "🚕", image: "images/words/vehicles/taxi.webp" },
      { word: "truck", chinese: "卡车", emoji: "🚚", image: "images/words/vehicles/truck.webp" },
      { word: "subway", chinese: "地铁", emoji: "🚇", image: "images/words/vehicles/subway.webp" },
      { word: "ship", chinese: "轮船", emoji: "🚢", image: "images/words/vehicles/ship.webp" },
    ],
  ),
  makeCategory(
    {
      id: "clothes",
      name: "Clothes",
      nameZh: "衣服",
      emoji: "👕",
      color: "#8c62c4",
    },
    [
      { word: "shirt", chinese: "衬衫", emoji: "👔", image: "images/words/clothes/shirt.webp" },
      { word: "T-shirt", chinese: "T恤", emoji: "👕", image: "images/words/clothes/t-shirt.webp" },
      { word: "pants", chinese: "裤子", emoji: "👖", image: "images/words/clothes/pants.webp" },
      { word: "dress", chinese: "连衣裙", emoji: "👗", image: "images/words/clothes/dress.webp" },
      { word: "shoes", chinese: "鞋", emoji: "👟", image: "images/words/clothes/shoes.webp" },
      { word: "socks", chinese: "袜子", emoji: "🧦", image: "images/words/clothes/socks.webp" },
      { word: "hat", chinese: "帽子", emoji: "🧢", image: "images/words/clothes/hat.webp" },
      { word: "coat", chinese: "外套", emoji: "🧥", image: "images/words/clothes/coat.webp" },
      { word: "skirt", chinese: "裙子", emoji: "👗", image: "images/words/clothes/skirt.webp" },
      { word: "shorts", chinese: "短裤", emoji: "🩳", image: "images/words/clothes/shorts.webp" },
    ],
  ),
  makeCategory(
    {
      id: "actions",
      name: "Actions",
      nameZh: "动作",
      emoji: "🏃",
      color: "#32a46f",
    },
    [
      { word: "run", chinese: "跑", emoji: "🏃", image: "images/words/actions/run.webp" },
      { word: "walk", chinese: "走", emoji: "🚶", image: "images/words/actions/walk.webp" },
      { word: "jump", chinese: "跳", emoji: "🤸", image: "images/words/actions/jump.webp" },
      { word: "eat", chinese: "吃", emoji: "😋", image: "images/words/actions/eat.webp" },
      { word: "drink", chinese: "喝", emoji: "🥤", image: "images/words/actions/drink.webp" },
      { word: "sleep", chinese: "睡觉", emoji: "🛌", image: "images/words/actions/sleep.webp" },
      { word: "sit", chinese: "坐", emoji: "🪑", image: "images/words/actions/sit.webp" },
      { word: "stand", chinese: "站", emoji: "🧍", image: "images/words/actions/stand.webp" },
      { word: "read", chinese: "阅读", emoji: "📖", image: "images/words/actions/read.webp" },
      { word: "write", chinese: "写", emoji: "✍️", image: "images/words/actions/write.webp" },
    ],
  ),
  makeCategory(
    {
      id: "feelings",
      name: "Feelings",
      nameZh: "感受",
      emoji: "😊",
      color: "#e16e89",
    },
    [
      { word: "happy", chinese: "开心", emoji: "😊" },
      { word: "sad", chinese: "难过", emoji: "😢" },
      { word: "angry", chinese: "生气", emoji: "😠" },
      { word: "tired", chinese: "累", emoji: "😫" },
      { word: "hungry", chinese: "饿", emoji: "😋" },
      { word: "thirsty", chinese: "渴", emoji: "🥵" },
      { word: "scared", chinese: "害怕", emoji: "😨" },
      { word: "excited", chinese: "兴奋", emoji: "🤩" },
      { word: "sleepy", chinese: "困", emoji: "😴" },
      { word: "good", chinese: "很好", emoji: "🙂" },
    ],
  ),
];

export const allWords = wordCategories.flatMap((category) => category.words);
