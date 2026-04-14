import type { Translations } from './types';

const pl: Translations = {
  // ── Colors & labels ──
  'color.red': 'Czerwony',
  'color.gold': 'Złoty',
  'color.blue': 'Niebieski',
  'color.green': 'Zielony',
  'color.black': 'Czarny',
  'color.all': 'Wszystkie',

  // ── Actions ──
  'action.trade-hands': 'Trade\nHands',
  'action.trade-goals': 'Trade\nGoals',
  'action.rotate-goals': 'Rotate\nGoals',
  'action.move-card': 'Move\nCard',
  'action.zap-card': 'Zap\nCard',
  'action.trade-hands.full': 'Trade Hands',
  'action.trade-goals.full': 'Trade Goals',
  'action.rotate-goals.full': 'Rotate Goals',
  'action.move-card.full': 'Move a Card',
  'action.zap-card.full': 'Zap a Card',

  // ── Sidebar ──
  'sidebar.drawPile': 'TALIA',
  'sidebar.cardsLeft': 'kart',
  'sidebar.discard': 'ODRZUCONE',
  'sidebar.empty': 'pusto',
  'sidebar.silverQueen': 'SILVER QUEEN',
  'sidebar.currently': 'Obecnie',
  'sidebar.opponents': 'PRZECIWNICY',
  'sidebar.cardsGoal': 'kart · Cel: ?',
  'sidebar.yourGoal': 'TWÓJ CEL',
  'sidebar.connect7': 'Połącz 7 paneli: {color}',
  'sidebar.help': '? Pomoc',
  'sidebar.leaveGame': '← Wyjdź z gry',
  'sidebar.leaveTitle': 'Wyjść z gry?',
  'sidebar.leaveDesc': 'Zostaniesz usunięty z pokoju, a inni gracze będą kontynuować bez Ciebie.',
  'sidebar.leaveDescLocal': 'Twoja obecna gra zostanie utracona.',
  'sidebar.stay': 'Zostań',
  'sidebar.leave': 'Wyjdź',

  // ── Right sidebar ──
  'right.goalsOnTable': 'CELE NA STOLE',
  'right.you': 'Ty',
  'right.card': 'karta',
  'right.cards': 'kart',
  'right.unusedGoal': 'Niewykorzystany cel #{n}',
  'right.faceDown': 'zakryty',

  // ── HUD ──
  'hud.title': '5 Queens',
  'hud.turn': 'Tura:',
  'hud.deckEmpty': 'Talia pusta',
  'hud.deck': 'Talia:',
  'hud.silver': 'Silver →',

  // ── Mobile top bar ──
  'mobile.cards': 'kart',
  'mobile.empty': 'pusto',

  // ── Turn toast ──
  'turn.yours': 'Twoja tura',
  'turn.other': 'Tura: {name}',

  // ── Bonus toast ──
  'bonus.draws': 'Bonus: +{count}!',

  // ── Player left ──
  'playerLeft.gameOver': '{name} wyszedł — koniec gry',
  'playerLeft.left': '{name} opuścił grę',

  // ── Invite banner ──
  'invite.text': '{name} zaprasza Cię do gry!',
  'invite.room': 'Pokój:',
  'invite.join': 'Dołącz',

  // ── Action event toast ──
  'actionEvent.title': 'ZAGRANO AKCJĘ',
  'actionEvent.ok': 'OK',

  // ── Action confirm ──
  'actionConfirm.silverOff': 'off',
  'actionConfirm.silverForced': 'Pierwsza akcja musi zmienić kolor Silver Queen',
  'actionConfirm.cancel': 'Anuluj',
  'actionConfirm.play': 'Zagraj {action}',

  // ── Action targeting ──
  'targeting.rotateGoals': 'Rotate Goals',
  'targeting.chooseDirection': 'Cele krążą po ringu — wybierz kierunek',
  'targeting.left': '← Lewo',
  'targeting.right': 'Prawo →',
  'targeting.receive': 'otrzymasz: {label}',
  'targeting.tradeHands': 'Trade Hands',
  'targeting.choosePlayerHands': 'Wybierz gracza do wymiany rąk',
  'targeting.tradeGoals': 'Trade Goals',
  'targeting.choosePlayerGoals': 'Wybierz z kim wymienić cel',
  'targeting.clickZone': 'Kliknij miejsce na planszy, aby położyć kartę',
  'targeting.clickToMove': 'Kliknij kartę na planszy, aby ją przenieść',
  'targeting.clickToZap': 'Kliknij kartę na planszy, aby ją zabrać',
  'targeting.nCards': '{count} kart',

  // ── Win overlay ──
  'win.title': '{name} wygrywa!',
  'win.deckExhausted': 'Talia wyczerpana — {count} połączonych paneli ({color})',
  'win.connected': '7 połączonych paneli ({color})',
  'win.playAgain': 'Graj ponownie',
  'win.lobby': 'Lobby',

  // ── Board ──
  'board.selectCard': 'Wybierz kartę, aby zobaczyć możliwe pozycje',
  'board.cantZapSilver': 'Nie można zabrać Silver Queen',

  // ── GamePage overlays ──
  'game.cardConnects': 'Ta karta łączy dwie grupy — nie można jej przesunąć. Możesz ją obrócić i pozostawić tutaj.',
  'game.noPositions': 'Brak możliwych pozycji — karta nie pasuje kolorowo do żadnego sąsiada.',
  'game.rotate': '↻ Obróć',
  'game.leaveHere': 'Pozostaw tutaj',
  'game.waiting': 'Czekam na {name}…',
  'game.thinking': '{name} myśli…',

  // ── Lobby ──
  'lobby.techStack': '? stack technologiczny',
  'lobby.online': 'online',
  'lobby.signedAs': 'Zalogowany jako',
  'lobby.editProfile': 'Edytuj profil',
  'lobby.signOut': 'Wyloguj',
  'lobby.startAI': 'Gra z AI',
  'lobby.createRoom': 'Stwórz pokój online',
  'lobby.joinRoom': 'Dołącz do pokoju',
  'lobby.aiOpponents': 'Przeciwnicy AI',
  'lobby.back': '← Wróć',
  'lobby.playingAs': 'Grasz jako',
  'lobby.roomCode': 'Kod pokoju',
  'lobby.connecting': 'Łączenie…',
  'lobby.create': 'Stwórz pokój',
  'lobby.join': 'Dołącz',
  'lobby.shareCode': 'Podaj ten kod innym graczom',
  'lobby.playersInRoom': 'Gracze w pokoju',
  'lobby.you': '(ty)',
  'lobby.inviteSent': 'zaproszenie wysłane',
  'lobby.waiting': 'Czekam na graczy…',
  'lobby.invitePlayer': 'Zaproś gracza',
  'lobby.usernamePlaceholder': 'Nazwa użytkownika…',
  'lobby.invite': 'Zaproś',
  'lobby.sent': '✓ Wysłano',
  'lobby.waitingForHost': 'Czekam na rozpoczęcie przez hosta…',
  'lobby.startGame': 'Rozpocznij grę ({count} graczy)',
  'lobby.leaveRoom': '← Opuść pokój',
  'lobby.copyCode': 'Kopiuj kod',
  'lobby.copied': '✓ Skopiowano',

  // ── Goal card ──
  'goal.label': 'CEL',

  // ── Silver Dragon card ──
  'silver.title': 'Silver Queen — aktualny kolor: {color}',

  // ── Help modal ──
  'help.title': '5 Queens — Zasady',
  'help.close': 'Rozumiem!',
  'help.goal.title': 'Cel gry',
  'help.goal.desc': 'Stwórz spójną grupę 7 paneli swojego koloru Goal na wspólnej planszy.',
  'help.turn.title': 'Tura gracza',
  'help.turn.1': 'Dobierz 1 kartę z talii.',
  'help.turn.2': 'Zagraj 1 kartę z ręki — Księżniczkę lub Akcję.',
  'help.cards.title': 'Karty Księżniczek',
  'help.cards.desc': 'Każda karta to siatka 2×2 paneli. Aby ją zagrać:',
  'help.cards.rule1': 'Musi przylegać krawędzią do karty już na stole.',
  'help.cards.rule2': 'Co najmniej jedna para sąsiadujących paneli musi być tego samego koloru.',
  'help.cards.rainbow': 'Rainbow pasuje do każdego koloru.',
  'help.cards.silver': 'Silver Queen działa jako swój aktualny kolor.',
  'help.cards.click': 'Kliknij kartę żeby wybrać,',
  'help.cards.clickAgain': 'kliknij ponownie żeby obrócić o 180°, potem kliknij miejsce na planszy.',
  'help.cards.bonus': 'Bonus za wielokrotne połączenie: 2 różne kolory → +1 karta, 3 → +2, 4 → +3. Rainbow i Silver nie liczą się do bonusu.',
  'help.actions.title': 'Karty Akcji',
  'help.actions.desc': 'Po zagraniu dzieją się dwie rzeczy jednocześnie: efekt akcji + Silver Queen zmienia kolor. Możesz pominąć jedno z nich.',
  'help.actions.tradeHands': 'Zamień całą rękę z dowolnym graczem.',
  'help.actions.tradeGoals': 'Zamień kartę Celu z innym graczem lub nieużywaną kartą.',
  'help.actions.moveCard': 'Przenieś kartę z planszy w nowe, poprawne miejsce. Nie możesz ruszyć Silver Queen. Wszystkie karty muszą nadal tworzyć jedną spójną grupę.',
  'help.actions.rotateGoals': 'Wszyscy gracze przekazują karty Celu sąsiadowi w wybranym kierunku.',
  'help.actions.zapCard': 'Weź dowolną kartę z planszy z powrotem do ręki. Nie możesz zabrać Silver Queen.',
  'help.silver.title': 'Silver Queen',
  'help.silver.desc': 'Stoi na środku na stałe i nigdy się nie rusza. Na początku działa jak Rainbow (wszystkie kolory). Po każdej zagranej Akcji zmienia kolor na kolor księżniczki z tej karty.',
  'help.deckEnd.title': 'Koniec talii',
  'help.deckEnd.desc': 'Gdy talia się wyczerpie, gracze nie dobierają kart. Gra trwa, dopóki ktoś ma karty. Jeśli nikt nie wygrał — wygrywa gracz z największą spójną grupą paneli swojego koloru.',

  // ── Tech info modal ──
  'tech.title': 'Stack technologiczny',
  'tech.close': 'Zamknij',
  'tech.frontend': 'Frontend',
  'tech.engine': 'Silnik gry (Pure TypeScript)',
  'tech.multiplayer': 'Multiplayer',
  'tech.gameRules': 'Reguły gry',
  'tech.auth': 'Autoryzacja i infrastruktura',
  'tech.dataArch': 'Architektura danych',
  'tech.domain': 'domena 5queens.club',

  // ── Tutorial ──
  'tutorial.skip': 'Pomiń',
  'tutorial.next': 'Dalej →',
  'tutorial.prev': '← Wstecz',
  'tutorial.done': 'Zaczynamy! →',
  'tutorial.gotIt': 'Rozumiem →',

  'tutorial.s1.title': '👑 5 Queens',
  'tutorial.s1.desc': 'Gra karciana dla 2–5 graczy. Każdy gracz ma tajną kartę celu — jeden z 5 kolorów księżniczki.',
  'tutorial.s1.goalTitle': 'Cel gry',
  'tutorial.s1.goalDesc': 'Stwórz ciągłą grupę 7 paneli swojego koloru na wspólnej planszy. Kształt dowolny — może się rozgałęziać.',
  'tutorial.s1.turnTitle': 'Każda tura',
  'tutorial.s1.turnStep1': '1.',
  'tutorial.s1.turnStep1Desc': 'Dobierz kartę z talii',
  'tutorial.s1.turnStep2': '2.',
  'tutorial.s1.turnStep2Desc': 'Zagraj jedną kartę z ręki',
  'tutorial.s1.cardsTitle': 'Dwa typy kart',
  'tutorial.s1.princessCards': 'Karty księżniczek',
  'tutorial.s1.princessDesc': '— kładziesz na planszy obok pasujących kolorów.',
  'tutorial.s1.actionCards': 'Karty akcji',
  'tutorial.s1.actionDesc': '— specjalne efekty (opisane dalej).',

  'tutorial.s2.title': '🃏 Rodzaje kart księżniczek',
  'tutorial.s2.desc': 'Każda karta księżniczki to siatka 2×2 paneli. Panele mogą mieć różne kolory — oto cztery typy kart:',
  'tutorial.s2.ace': 'Ace',
  'tutorial.s2.aceDesc': '4 panele jednego koloru',
  'tutorial.s2.half': 'Half',
  'tutorial.s2.halfDesc': '2 kolory: góra / dół',
  'tutorial.s2.banner': 'Banner',
  'tutorial.s2.bannerDesc': '2 kolory: lewo / prawo',
  'tutorial.s2.threeway': 'Threeway',
  'tutorial.s2.threewayDesc': '3 kolory: 2+1+1',
  'tutorial.s2.quad': 'Quad',
  'tutorial.s2.quadDesc': '4 różne kolory, jeden na panel',

  'tutorial.s3.title': '👑 Karty księżniczek',
  'tutorial.s3.desc': 'Każda karta księżniczki to siatka 2×2 kolorowych paneli. Przy kładzeniu na planszę co najmniej jeden panel musi sąsiadować krawędzią z panelem tego samego koloru na sąsiedniej karcie.',
  'tutorial.s3.rainbow': 'Rainbow Queen',
  'tutorial.s3.rainbowDesc': 'Tęczowy kolor — pasuje do każdego koloru. Można go położyć obok dowolnej karty i liczy się jako każdy kolor przy sprawdzaniu wygranej.',
  'tutorial.s3.silver': 'Silver Queen (środek planszy)',
  'tutorial.s3.silverDesc': 'Nigdy się nie rusza. Na początku jest tęczowy (wszystkie kolory). Zmienia kolor za każdym razem gdy zagrana zostanie karta akcji.',
  'tutorial.s3.bonusTitle': 'Bonus za połączenie',
  'tutorial.s3.bonusLine1': 'Jedna karta łączy 2 różne kolory → dobierz +1',
  'tutorial.s3.bonusLine2': '3 różne kolory → +2  |  4 różne kolory → +3',
  'tutorial.s3.bonusNote': '(Rainbow i Silver nie liczą się do bonusu)',

  'tutorial.s4.title': '⚡ Karty akcji — Move a Card',
  'tutorial.s4.silverColor': 'Silver Queen przyjmuje kolor: Zielony',
  'tutorial.s4.what': 'Co robi?',
  'tutorial.s4.desc2': 'Wybierasz kartę z planszy i przenosisz ją w nowe miejsce. Karta musi pasować kolorowo do nowych sąsiadów. Nie możesz ruszyć Silver Queen. Po przeniesieniu plansza musi pozostać spójna (bez rozłączonych wysp).',
  'tutorial.s4.example': 'Twoja grupa zielonych jest bliska 7 paneli, ale brakuje połączenia. Przenosisz zieloną kartę z odległego rogu planszy prosto do swojej grupy — i wygrywasz.',
  'tutorial.s4.when': 'Gdy masz kartę swojego koloru w złym miejscu, chcesz dołączyć ją do głównej grupy albo rozbić grupę przeciwnika przesuwając kluczową kartę.',

  'tutorial.s5.title': '⚡ Karty akcji — Zap a Card',
  'tutorial.s5.silverColor': 'Silver Queen przyjmuje kolor: Czerwony',
  'tutorial.s5.desc2': 'Zabierasz dowolną kartę z planszy do swojej ręki. Twoja ręka jest po tym o 1 większa niż normalnie. Nie możesz zabrać Silver Queen.',
  'tutorial.s5.example': 'Przeciwnik ma 6 połączonych czerwonych paneli. Zabierasz jego kluczową kartę — rozbijasz grupę i zyskujesz kartę do ręki.',
  'tutorial.s5.when': 'Gdy karta na planszy blokuje Twój cel lub przeciwnik jest bliski wygranej. Możesz też zabrać własną kartę, żeby zagrać ją w lepszym miejscu.',

  'tutorial.s6.title': '⚡ Karty akcji — Rotate Goals',
  'tutorial.s6.silverColor': 'Silver Queen przyjmuje kolor: Niebieski',
  'tutorial.s6.desc2': 'Wszyscy gracze jednocześnie podają swoje karty celu sąsiadowi — w lewo albo w prawo (Ty wybierasz kierunek). Nieużywane cele też uczestniczą w rotacji.',
  'tutorial.s6.example': 'Widzisz, że na planszy jest dużo niebieskich paneli. Obracasz cele tak, żeby dostać niebieski cel — i nagle jesteś blisko wygranej.',
  'tutorial.s6.when': 'Gdy obecny cel jest trudny do zebrania lub inny kolor dominuje na planszy. Ryzykowne — nie wiesz co dostaniesz, chyba że liczyłeś karty.',

  'tutorial.s7.title': '⚡ Karty akcji — Trade Goals',
  'tutorial.s7.silverColor': 'Silver Queen przyjmuje kolor: Złoty',
  'tutorial.s7.desc2': 'Zamieniasz swoją kartę celu z wybranym graczem lub z nieużywanym celem leżącym na stosie. Obie strony nie widzą co dostają — to wymiana w ciemno.',
  'tutorial.s7.example': 'Gracz po lewej ma 5 złotych paneli połączonych. Zamieniasz z nim cel — teraz to Ty jesteś 2 panele od wygranej, a on musi zaczynać od nowa.',
  'tutorial.s7.when': 'Gdy inny gracz jest bliski wygranej — przejmij jego cel. Albo gdy Twój cel jest prawie niemożliwy — wymień go na ślepo z nieużywanym celem.',

  'tutorial.s8.title': '⚡ Karty akcji — Trade Hands',
  'tutorial.s8.silverColor': 'Silver Queen przyjmuje kolor: Czarny',
  'tutorial.s8.desc2': 'Zamieniasz całą rękę kart z wybranym graczem. Karty celu nie ulegają zmianie — tylko karty w ręce.',
  'tutorial.s8.example': 'Masz 5 bezużytecznych kart, a widzisz że jeden gracz dobiera dużo i ma pełną rękę. Zamieniasz z nim — dostajesz jego dobre karty, on dostaje Twoje słabe.',
  'tutorial.s8.when': 'Gdy masz złe karty i chcesz odświeżyć rękę. Albo defensywnie — gracz z dużą ręką ma dużo opcji, zabierz mu przewagę.',

  'tutorial.s9.title': '💡 Opcja przy kartach akcji',
  'tutorial.s9.desc': 'Zagrywając kartę akcji dzieją się dwie rzeczy jednocześnie: efekt akcji i zmiana koloru Silver Queen. Możesz pominąć jedną z nich.',
  'tutorial.s9.optionsTitle': 'Trzy opcje do wyboru:',
  'tutorial.s9.both': '✓ Oba',
  'tutorial.s9.bothDesc': 'Wykonaj akcję i zmień kolor Silver Queen (najczęstszy wybór).',
  'tutorial.s9.actionOnly': '½ Tylko akcja',
  'tutorial.s9.actionOnlyDesc': 'Wykonaj efekt akcji, ale Silver nie zmienia koloru. Przydatne gdy obecny kolor Silver\'a jest dla Ciebie korzystny.',
  'tutorial.s9.silverOnly': '½ Tylko Silver',
  'tutorial.s9.silverOnlyDesc': 'Zmień kolor Silver Queen, ale nie wykonuj akcji. Karta wraca na dół talii.',
  'tutorial.s9.tip': 'Gdy Silver Queen ma kolor Twojego celu — zastanów się zanim pozwolisz go zmienić przez akcję przeciwnika.',
  'tutorial.s9.exampleLabel': '🎯 Przykład',
  'tutorial.s9.whenLabel': '💡 Kiedy używać?',

  // ── Tutorial spotlight ──
  'spot.board': 'Plansza',
  'spot.boardDesc': 'Tu układasz karty księżniczek. Silver Queen stoi na środku i nigdy się nie rusza.',
  'spot.goal': 'Twój cel',
  'spot.goalDesc': 'To jest Twoja tajna karta celu. Musisz połączyć 7 paneli tego koloru w jedną ciągłą grupę.',
  'spot.hand': 'Twoja ręka',
  'spot.handDesc': 'Tu są Twoje karty. Kliknij kartę żeby ją wybrać, kliknij drugi raz żeby obrócić o 180°, a potem połóż ją na planszy. Karty akcji zagrywasz jednym kliknięciem.',
  'spot.drawPile': 'Talia i stos odrzuconych',
  'spot.drawPileDesc': 'Na początku tury dobierasz kartę z talii. Zagrane karty akcji lądują na stosie odrzuconych.',
  'spot.opponents': 'Przeciwnicy',
  'spot.opponentsDesc': 'Widzisz ile kart mają inni gracze, ale nie widzisz ich celów ani rąk.',
  'spot.turnToast': 'Twoja tura',
  'spot.turnToastDesc': 'Gdy pojawi się komunikat na górze ekranu — Twoja tura. Dobierz kartę, a potem zagraj jedną.',
};

export default pl;
