/* Conteúdo do Speak Up.
   style: "emoji" = opções são figuras | "text" = opções são palavras em português
   w: en = inglês, pt = português, pron = pronúncia aproximada, e = emoji */
const THEMES = [
  {
    id: "greetings", name: "Cumprimentos", en: "Greetings", emoji: "👋", color: "#FFE4D6", style: "text",
    words: [
      { en: "hello", pt: "olá", pron: "relô", e: "👋" },
      { en: "hi", pt: "oi", pron: "rái", e: "😀" },
      { en: "goodbye", pt: "tchau", pron: "gudbái", e: "🌇" },
      { en: "good morning", pt: "bom dia", pron: "gud mórnin", e: "🌅" },
      { en: "good afternoon", pt: "boa tarde", pron: "gud áfternun", e: "☀️" },
      { en: "good night", pt: "boa noite", pron: "gud náit", e: "🌙" },
      { en: "please", pt: "por favor", pron: "pliz", e: "🙏" },
      { en: "thank you", pt: "obrigado(a)", pron: "thénk iú", e: "💛" },
      { en: "sorry", pt: "desculpa", pron: "sóri", e: "😔" },
      { en: "yes", pt: "sim", pron: "iéss", e: "✅" },
      { en: "no", pt: "não", pron: "nôu", e: "❌" },
      { en: "how are you?", pt: "como vai você?", pron: "háu ár iú", e: "💬" }
    ],
    sentences: [
      { s: "___! My name is Ana.", o: ["Hello", "Goodbye", "Sorry"], a: "Hello", pt: "Olá! Meu nome é Ana." },
      { s: "Good ___, teacher!", o: ["morning", "please", "no"], a: "morning", pt: "Bom dia, professor!" },
      { s: "Thank ___!", o: ["you", "yes", "hi"], a: "you", pt: "Obrigado!" },
      { s: "___, see you tomorrow!", o: ["Goodbye", "Hello", "Please"], a: "Goodbye", pt: "Tchau, até amanhã!" },
      { s: "Can I have water, ___?", o: ["please", "sorry", "goodbye"], a: "please", pt: "Posso tomar água, por favor?" },
      { s: "___, I am late.", o: ["Sorry", "Please", "Hi"], a: "Sorry", pt: "Desculpa, estou atrasado." }
    ]
  },
  {
    id: "numbers", name: "Números", en: "Numbers", emoji: "🔢", color: "#DDEBFF", style: "emoji",
    words: [
      { en: "zero", pt: "zero", pron: "zírou", e: "0️⃣" },
      { en: "one", pt: "um", pron: "uân", e: "1️⃣" },
      { en: "two", pt: "dois", pron: "tu", e: "2️⃣" },
      { en: "three", pt: "três", pron: "thrí", e: "3️⃣" },
      { en: "four", pt: "quatro", pron: "fór", e: "4️⃣" },
      { en: "five", pt: "cinco", pron: "fáiv", e: "5️⃣" },
      { en: "six", pt: "seis", pron: "síks", e: "6️⃣" },
      { en: "seven", pt: "sete", pron: "sévn", e: "7️⃣" },
      { en: "eight", pt: "oito", pron: "êit", e: "8️⃣" },
      { en: "nine", pt: "nove", pron: "náin", e: "9️⃣" },
      { en: "ten", pt: "dez", pron: "tén", e: "🔟" }
    ],
    sentences: [
      { s: "I have ___ eyes.", o: ["two", "ten", "five"], a: "two", pt: "Eu tenho dois olhos." },
      { s: "A week has ___ days.", o: ["seven", "three", "ten"], a: "seven", pt: "Uma semana tem sete dias." },
      { s: "I have ___ fingers on one hand.", o: ["five", "two", "nine"], a: "five", pt: "Eu tenho cinco dedos em uma mão." },
      { s: "___ plus one is two.", o: ["One", "Ten", "Four"], a: "One", pt: "Um mais um é dois." },
      { s: "A triangle has ___ sides.", o: ["three", "six", "eight"], a: "three", pt: "Um triângulo tem três lados." },
      { s: "A dog has ___ legs.", o: ["four", "two", "zero"], a: "four", pt: "Um cachorro tem quatro patas." }
    ]
  },
  {
    id: "colors", name: "Cores", en: "Colors", emoji: "🎨", color: "#FFE0F0", style: "emoji",
    words: [
      { en: "red", pt: "vermelho", pron: "réd", e: "🔴" },
      { en: "blue", pt: "azul", pron: "blu", e: "🔵" },
      { en: "yellow", pt: "amarelo", pron: "iélou", e: "🟡" },
      { en: "green", pt: "verde", pron: "grín", e: "🟢" },
      { en: "orange", pt: "laranja", pron: "órinj", e: "🟠" },
      { en: "purple", pt: "roxo", pron: "pârpl", e: "🟣" },
      { en: "pink", pt: "rosa", pron: "pínk", e: "🩷" },
      { en: "black", pt: "preto", pron: "blék", e: "⚫" },
      { en: "white", pt: "branco", pron: "uáit", e: "⚪" },
      { en: "brown", pt: "marrom", pron: "bráun", e: "🟤" }
    ],
    sentences: [
      { s: "The sky is ___.", o: ["blue", "red", "green"], a: "blue", pt: "O céu é azul." },
      { s: "A banana is ___.", o: ["yellow", "black", "purple"], a: "yellow", pt: "A banana é amarela." },
      { s: "The grass is ___.", o: ["green", "pink", "white"], a: "green", pt: "A grama é verde." },
      { s: "Snow is ___.", o: ["white", "brown", "orange"], a: "white", pt: "A neve é branca." },
      { s: "A strawberry is ___.", o: ["red", "blue", "black"], a: "red", pt: "O morango é vermelho." },
      { s: "Chocolate is ___.", o: ["brown", "yellow", "green"], a: "brown", pt: "O chocolate é marrom." }
    ]
  },
  {
    id: "pronouns", name: "Pronomes e verbo to be", en: "Pronouns and to be", emoji: "🙋", color: "#E6E0FF", style: "text",
    words: [
      { en: "I", pt: "eu", pron: "ái", e: "🙋" },
      { en: "you", pt: "você", pron: "iú", e: "👉" },
      { en: "he", pt: "ele", pron: "rí", e: "👦" },
      { en: "she", pt: "ela", pron: "xí", e: "👧" },
      { en: "it", pt: "ele/ela (coisa)", pron: "ít", e: "📦" },
      { en: "we", pt: "nós", pron: "uí", e: "👫" },
      { en: "they", pt: "eles/elas", pron: "dêi", e: "👥" },
      { en: "am", pt: "sou / estou", pron: "ém", e: "🔵" },
      { en: "is", pt: "é / está", pron: "íz", e: "🟢" },
      { en: "are", pt: "somos / são / está (você)", pron: "ár", e: "🟠" }
    ],
    sentences: [
      { s: "I ___ a student.", o: ["am", "is", "are"], a: "am", pt: "Eu sou estudante." },
      { s: "She ___ my sister.", o: ["is", "am", "are"], a: "is", pt: "Ela é minha irmã." },
      { s: "We ___ friends.", o: ["are", "is", "am"], a: "are", pt: "Nós somos amigos." },
      { s: "They ___ at home.", o: ["are", "am", "is"], a: "are", pt: "Eles estão em casa." },
      { s: "He ___ twelve years old.", o: ["is", "are", "am"], a: "is", pt: "Ele tem doze anos." },
      { s: "You ___ very smart.", o: ["are", "is", "am"], a: "are", pt: "Você é muito inteligente." },
      { s: "___ am happy.", o: ["I", "She", "They"], a: "I", pt: "Eu estou feliz." }
    ]
  },
  {
    id: "family", name: "Família", en: "Family", emoji: "👨‍👩‍👧‍👦", color: "#FFF1C2", style: "text",
    words: [
      { en: "mother", pt: "mãe", pron: "mâdher", e: "👩" },
      { en: "father", pt: "pai", pron: "fádher", e: "👨" },
      { en: "brother", pt: "irmão", pron: "brâdher", e: "👦" },
      { en: "sister", pt: "irmã", pron: "síster", e: "👧" },
      { en: "grandmother", pt: "avó", pron: "grénmâdher", e: "👵" },
      { en: "grandfather", pt: "avô", pron: "grénfádher", e: "👴" },
      { en: "uncle", pt: "tio", pron: "ânkl", e: "🧔" },
      { en: "aunt", pt: "tia", pron: "ént", e: "👩‍🦰" },
      { en: "cousin", pt: "primo(a)", pron: "câzn", e: "🧒" },
      { en: "family", pt: "família", pron: "fémili", e: "👨‍👩‍👧‍👦" }
    ],
    sentences: [
      { s: "My father's sister is my ___.", o: ["aunt", "uncle", "cousin"], a: "aunt", pt: "A irmã do meu pai é minha tia." },
      { s: "My ___ is my mother's mother.", o: ["grandmother", "sister", "aunt"], a: "grandmother", pt: "Minha avó é a mãe da minha mãe." },
      { s: "My mother's brother is my ___.", o: ["uncle", "father", "cousin"], a: "uncle", pt: "O irmão da minha mãe é meu tio." },
      { s: "My sister is a girl. My ___ is a boy.", o: ["brother", "mother", "aunt"], a: "brother", pt: "Minha irmã é menina. Meu irmão é menino." },
      { s: "My aunt's son is my ___.", o: ["cousin", "brother", "father"], a: "cousin", pt: "O filho da minha tia é meu primo." },
      { s: "I love my ___.", o: ["family", "uncle", "cousin"], a: "family", pt: "Eu amo minha família." }
    ]
  },
  {
    id: "house", name: "Casa", en: "House", emoji: "🏠", color: "#D9F5E5", style: "emoji",
    words: [
      { en: "house", pt: "casa", pron: "ráus", e: "🏠" },
      { en: "kitchen", pt: "cozinha", pron: "kítchen", e: "🍳" },
      { en: "bathroom", pt: "banheiro", pron: "béthrum", e: "🚿" },
      { en: "bedroom", pt: "quarto", pron: "bédrum", e: "🛏️" },
      { en: "garden", pt: "jardim", pron: "gárden", e: "🌷" },
      { en: "door", pt: "porta", pron: "dór", e: "🚪" },
      { en: "window", pt: "janela", pron: "uíndou", e: "🪟" },
      { en: "chair", pt: "cadeira", pron: "tchér", e: "🪑" },
      { en: "TV", pt: "televisão", pron: "ti-ví", e: "📺" },
      { en: "lamp", pt: "lâmpada", pron: "lémp", e: "💡" },
      { en: "key", pt: "chave", pron: "kí", e: "🔑" },
      { en: "sofa", pt: "sofá", pron: "sôufa", e: "🛋️" }
    ],
    sentences: [
      { s: "I sleep in the ___.", o: ["bedroom", "kitchen", "garden"], a: "bedroom", pt: "Eu durmo no quarto." },
      { s: "I cook in the ___.", o: ["kitchen", "bathroom", "bedroom"], a: "kitchen", pt: "Eu cozinho na cozinha." },
      { s: "I take a shower in the ___.", o: ["bathroom", "kitchen", "garden"], a: "bathroom", pt: "Eu tomo banho no banheiro." },
      { s: "Open the ___ to go outside.", o: ["door", "lamp", "key"], a: "door", pt: "Abra a porta para sair." },
      { s: "I sit on the ___.", o: ["chair", "window", "key"], a: "chair", pt: "Eu me sento na cadeira." },
      { s: "I watch ___ at night.", o: ["TV", "a key", "a door"], a: "TV", pt: "Eu assisto TV à noite." }
    ]
  },
  {
    id: "food", name: "Comidas e bebidas", en: "Food and drinks", emoji: "🍎", color: "#FFE5CC", style: "emoji",
    words: [
      { en: "apple", pt: "maçã", pron: "épl", e: "🍎" },
      { en: "banana", pt: "banana", pron: "banéna", e: "🍌" },
      { en: "bread", pt: "pão", pron: "bréd", e: "🍞" },
      { en: "milk", pt: "leite", pron: "mílk", e: "🥛" },
      { en: "water", pt: "água", pron: "uóter", e: "💧" },
      { en: "egg", pt: "ovo", pron: "ég", e: "🥚" },
      { en: "cheese", pt: "queijo", pron: "tchíz", e: "🧀" },
      { en: "pizza", pt: "pizza", pron: "pítsa", e: "🍕" },
      { en: "chicken", pt: "frango", pron: "tchíken", e: "🍗" },
      { en: "rice", pt: "arroz", pron: "ráis", e: "🍚" },
      { en: "juice", pt: "suco", pron: "djús", e: "🧃" },
      { en: "cake", pt: "bolo", pron: "quêik", e: "🍰" }
    ],
    sentences: [
      { s: "I drink ___ with my cereal.", o: ["milk", "bread", "egg"], a: "milk", pt: "Eu bebo leite com o cereal." },
      { s: "A chicken lays an ___.", o: ["egg", "apple", "cheese"], a: "egg", pt: "A galinha põe um ovo." },
      { s: "Mice love ___.", o: ["cheese", "juice", "cake"], a: "cheese", pt: "Ratos adoram queijo." },
      { s: "Happy birthday! Here is a ___.", o: ["cake", "water", "rice"], a: "cake", pt: "Feliz aniversário! Aqui está um bolo." },
      { s: "Monkeys love ___.", o: ["bananas", "pizza", "cheese"], a: "bananas", pt: "Macacos adoram bananas." },
      { s: "I eat ___ and beans for lunch.", o: ["rice", "cake", "juice"], a: "rice", pt: "Eu como arroz e feijão no almoço." }
    ]
  },
  {
    id: "animals", name: "Animais", en: "Animals", emoji: "🐶", color: "#E3F6C9", style: "emoji",
    words: [
      { en: "dog", pt: "cachorro", pron: "dóg", e: "🐶" },
      { en: "cat", pt: "gato", pron: "két", e: "🐱" },
      { en: "bird", pt: "pássaro", pron: "bârd", e: "🐦" },
      { en: "fish", pt: "peixe", pron: "físh", e: "🐟" },
      { en: "horse", pt: "cavalo", pron: "hórs", e: "🐴" },
      { en: "cow", pt: "vaca", pron: "cáu", e: "🐮" },
      { en: "rabbit", pt: "coelho", pron: "rébit", e: "🐰" },
      { en: "lion", pt: "leão", pron: "láion", e: "🦁" },
      { en: "monkey", pt: "macaco", pron: "mânki", e: "🐵" },
      { en: "elephant", pt: "elefante", pron: "élefant", e: "🐘" },
      { en: "turtle", pt: "tartaruga", pron: "târtl", e: "🐢" },
      { en: "pig", pt: "porco", pron: "píg", e: "🐷" }
    ],
    sentences: [
      { s: "A ___ says meow.", o: ["cat", "dog", "cow"], a: "cat", pt: "O gato faz miau." },
      { s: "A ___ says woof.", o: ["dog", "cat", "fish"], a: "dog", pt: "O cachorro faz au-au." },
      { s: "A ___ lives in the water.", o: ["fish", "bird", "horse"], a: "fish", pt: "O peixe vive na água." },
      { s: "A ___ gives us milk.", o: ["cow", "pig", "lion"], a: "cow", pt: "A vaca nos dá leite." },
      { s: "The ___ is the king of the jungle.", o: ["lion", "rabbit", "turtle"], a: "lion", pt: "O leão é o rei da selva." },
      { s: "A ___ is slow and has a shell.", o: ["turtle", "rabbit", "monkey"], a: "turtle", pt: "A tartaruga é lenta e tem casco." },
      { s: "An ___ has a very long nose.", o: ["elephant", "pig", "cat"], a: "elephant", pt: "O elefante tem um nariz muito longo." }
    ]
  },
  {
    id: "music", name: "Música", en: "Music", emoji: "🎸", color: "#F3DDFF", style: "text",
    words: [
      { en: "music", pt: "música (em geral)", pron: "miúzik", e: "🎼" },
      { en: "song", pt: "canção", pron: "sóng", e: "🎵" },
      { en: "singer", pt: "cantor(a)", pron: "sínguer", e: "🧑‍🎤" },
      { en: "sing", pt: "cantar", pron: "síng", e: "🎶" },
      { en: "dance", pt: "dançar", pron: "déns", e: "💃" },
      { en: "listen", pt: "ouvir", pron: "lísen", e: "👂" },
      { en: "guitar", pt: "violão / guitarra", pron: "guitár", e: "🎸" },
      { en: "piano", pt: "piano", pron: "piéno", e: "🎹" },
      { en: "drums", pt: "bateria", pron: "drâmz", e: "🥁" },
      { en: "violin", pt: "violino", pron: "vaiolín", e: "🎻" },
      { en: "microphone", pt: "microfone", pron: "máicrofone", e: "🎤" },
      { en: "headphones", pt: "fones de ouvido", pron: "hédfounz", e: "🎧" }
    ],
    sentences: [
      { s: "I ___ to music every day.", o: ["listen", "guitar", "piano"], a: "listen", pt: "Eu ouço música todo dia." },
      { s: "He plays the ___ with two sticks.", o: ["drums", "violin", "piano"], a: "drums", pt: "Ele toca bateria com duas baquetas." },
      { s: "A ___ sings on stage.", o: ["singer", "drums", "song"], a: "singer", pt: "Um cantor canta no palco." },
      { s: "I like this ___! It is beautiful.", o: ["song", "singer", "piano"], a: "song", pt: "Eu gosto desta canção! Ela é linda." },
      { s: "They ___ at the party.", o: ["dance", "guitar", "headphones"], a: "dance", pt: "Eles dançam na festa." },
      { s: "She plays the ___ and it has six strings.", o: ["guitar", "violin", "drums"], a: "guitar", pt: "Ela toca violão e ele tem seis cordas." }
    ]
  },
  {
    id: "travel", name: "Viagem", en: "Travel", emoji: "✈️", color: "#D0F2F7", style: "emoji",
    words: [
      { en: "plane", pt: "avião", pron: "plêin", e: "✈️" },
      { en: "boat", pt: "barco", pron: "bôut", e: "⛵" },
      { en: "train", pt: "trem", pron: "trêin", e: "🚆" },
      { en: "bus", pt: "ônibus", pron: "bâs", e: "🚌" },
      { en: "taxi", pt: "táxi", pron: "téksi", e: "🚕" },
      { en: "passport", pt: "passaporte", pron: "pésport", e: "🛂" },
      { en: "ticket", pt: "passagem / ingresso", pron: "tíket", e: "🎫" },
      { en: "suitcase", pt: "mala", pron: "sutkêis", e: "🧳" },
      { en: "hotel", pt: "hotel", pron: "rôutél", e: "🏨" },
      { en: "map", pt: "mapa", pron: "mép", e: "🗺️" },
      { en: "beach", pt: "praia", pron: "bítch", e: "🏖️" },
      { en: "camera", pt: "câmera", pron: "kémera", e: "📷" }
    ],
    sentences: [
      { s: "I need my ___ to travel to another country.", o: ["passport", "camera", "map"], a: "passport", pt: "Eu preciso do meu passaporte para viajar para outro país." },
      { s: "The ___ flies in the sky.", o: ["plane", "train", "bus"], a: "plane", pt: "O avião voa no céu." },
      { s: "I put my clothes in the ___.", o: ["suitcase", "ticket", "hotel"], a: "suitcase", pt: "Eu coloco minhas roupas na mala." },
      { s: "We sleep at the ___.", o: ["hotel", "beach", "taxi"], a: "hotel", pt: "Nós dormimos no hotel." },
      { s: "Let's go to the ___ and swim.", o: ["beach", "bus", "map"], a: "beach", pt: "Vamos à praia nadar." },
      { s: "I take photos with my ___.", o: ["camera", "map", "ticket"], a: "camera", pt: "Eu tiro fotos com minha câmera." },
      { s: "I use a ___ to find the way.", o: ["map", "ticket", "bus"], a: "map", pt: "Eu uso um mapa para achar o caminho." }
    ]
  }
];
