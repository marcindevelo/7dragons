import type { Translations } from './types';

const en: Translations = {
  // ── Colors & labels ──
  'color.red': 'Red',
  'color.gold': 'Gold',
  'color.blue': 'Blue',
  'color.green': 'Green',
  'color.black': 'Black',
  'color.all': 'All',

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
  'sidebar.drawPile': 'DRAW PILE',
  'sidebar.cardsLeft': 'cards left',
  'sidebar.discard': 'DISCARD',
  'sidebar.empty': 'empty',
  'sidebar.silverQueen': 'SILVER QUEEN',
  'sidebar.currently': 'Currently',
  'sidebar.opponents': 'OPPONENTS',
  'sidebar.cardsGoal': 'cards · Goal: ?',
  'sidebar.yourGoal': 'YOUR GOAL',
  'sidebar.connect7': 'Connect 7 {color} panels',
  'sidebar.help': '? Help',
  'sidebar.leaveGame': '← Leave Game',
  'sidebar.leaveTitle': 'Leave the game?',
  'sidebar.leaveDesc': 'You will be removed from the room and other players will continue without you.',
  'sidebar.leaveDescLocal': 'Your current game will be lost.',
  'sidebar.stay': 'Stay',
  'sidebar.leave': 'Leave',

  // ── Right sidebar ──
  'right.goalsOnTable': 'GOALS ON TABLE',
  'right.you': 'You',
  'right.card': 'card',
  'right.cards': 'cards',
  'right.unusedGoal': 'Unused goal #{n}',
  'right.faceDown': 'face down',

  // ── HUD ──
  'hud.title': '5 Queens',
  'hud.turn': 'Turn:',
  'hud.deckEmpty': 'Deck empty',
  'hud.deck': 'Deck:',
  'hud.silver': 'Silver →',

  // ── Mobile top bar ──
  'mobile.cards': 'cards',
  'mobile.empty': 'empty',

  // ── Turn toast ──
  'turn.yours': 'Your Turn',
  'turn.other': "{name}'s Turn",

  // ── Bonus toast ──
  'bonus.draws': 'Bonus: +{count}!',

  // ── Player left ──
  'playerLeft.gameOver': '{name} left — game over',
  'playerLeft.left': '{name} left the game',

  // ── Invite banner ──
  'invite.text': '{name} invites you to play!',
  'invite.room': 'Room:',
  'invite.join': 'Join',

  // ── Action event toast ──
  'actionEvent.title': 'ACTION PLAYED',
  'actionEvent.ok': 'OK',

  // ── Action confirm ──
  'actionConfirm.silverOff': 'off',
  'actionConfirm.silverForced': 'First action must change Silver Queen color',
  'actionConfirm.cancel': 'Cancel',
  'actionConfirm.play': 'Play {action}',

  // ── Action targeting ──
  'targeting.rotateGoals': 'Rotate Goals',
  'targeting.chooseDirection': 'Goals pass around the ring — choose direction',
  'targeting.left': '← Left',
  'targeting.right': 'Right →',
  'targeting.receive': 'receive: {label}',
  'targeting.tradeHands': 'Trade Hands',
  'targeting.choosePlayerHands': 'Choose a player to swap hands with',
  'targeting.tradeGoals': 'Trade Goals',
  'targeting.choosePlayerGoals': 'Choose who to swap goals with',
  'targeting.clickZone': 'Click a drop zone to place the card',
  'targeting.clickToMove': 'Click a card on the board to move',
  'targeting.clickToZap': 'Click a card on the board to zap it',
  'targeting.nCards': '{count} cards',

  // ── Win overlay ──
  'win.title': '{name} wins!',
  'win.deckExhausted': 'Deck exhausted — {count} connected {color} panels',
  'win.connected': '7 connected {color} panels',
  'win.playAgain': 'Play again',
  'win.lobby': 'Lobby',

  // ── Board ──
  'board.selectCard': 'Select a card to see placements',
  'board.cantZapSilver': 'Cannot zap Silver Queen',

  // ── GamePage overlays ──
  'game.cardConnects': 'This card connects two groups — it cannot be moved. You can rotate it and leave it here.',
  'game.noPositions': 'No possible positions — the card doesn\'t match any neighbor\'s color.',
  'game.rotate': '↻ Rotate',
  'game.leaveHere': 'Leave here',
  'game.waiting': 'Waiting for {name}…',
  'game.thinking': '{name} is thinking…',

  // ── Lobby ──
  'lobby.techStack': '? tech stack',
  'lobby.online': 'online',
  'lobby.signedAs': 'Signed in as',
  'lobby.editProfile': 'Edit profile',
  'lobby.signOut': 'Sign out',
  'lobby.startAI': 'Start AI Game',
  'lobby.createRoom': 'Create Online Room',
  'lobby.joinRoom': 'Join Room',
  'lobby.aiOpponents': 'AI opponents',
  'lobby.back': '← Back',
  'lobby.playingAs': 'Playing as',
  'lobby.roomCode': 'Room code',
  'lobby.connecting': 'Connecting…',
  'lobby.create': 'Create Room',
  'lobby.join': 'Join Room',
  'lobby.shareCode': 'Share this code with other players',
  'lobby.playersInRoom': 'Players in room',
  'lobby.you': '(you)',
  'lobby.inviteSent': 'invite sent',
  'lobby.waiting': 'Waiting for players…',
  'lobby.invitePlayer': 'Invite player',
  'lobby.usernamePlaceholder': 'Username…',
  'lobby.invite': 'Invite',
  'lobby.sent': '✓ Sent',
  'lobby.waitingForHost': 'Waiting for host to start…',
  'lobby.startGame': 'Start Game ({count} players)',
  'lobby.leaveRoom': '← Leave room',
  'lobby.copyCode': 'Copy code',
  'lobby.copied': '✓ Copied',

  // ── Goal card ──
  'goal.label': 'GOAL',

  // ── Silver Dragon card ──
  'silver.title': 'Silver Queen — current color: {color}',

  // ── Help modal ──
  'help.title': '5 Queens — Rules',
  'help.close': 'Got it!',
  'help.goal.title': 'Objective',
  'help.goal.desc': 'Create a contiguous group of 7 panels of your Goal color on the shared board.',
  'help.turn.title': 'Your turn',
  'help.turn.1': 'Draw 1 card from the deck.',
  'help.turn.2': 'Play 1 card from your hand — a Princess or an Action.',
  'help.cards.title': 'Princess Cards',
  'help.cards.desc': 'Each card is a 2×2 grid of panels. To play it:',
  'help.cards.rule1': 'It must share an edge with a card already on the table.',
  'help.cards.rule2': 'At least one pair of adjacent panels must be the same color.',
  'help.cards.rainbow': 'Rainbow matches every color.',
  'help.cards.silver': 'Silver Queen acts as its current color.',
  'help.cards.click': 'Click a card to select it,',
  'help.cards.clickAgain': 'click again to rotate 180°, then click a spot on the board.',
  'help.cards.bonus': 'Multi-connection bonus: 2 different colors → +1 card, 3 → +2, 4 → +3. Rainbow and Silver don\'t count toward the bonus.',
  'help.actions.title': 'Action Cards',
  'help.actions.desc': 'When played, two things happen at once: the action effect + Silver Queen changes color. You may skip one of them.',
  'help.actions.tradeHands': 'Swap your entire hand with any player.',
  'help.actions.tradeGoals': 'Swap your Goal card with another player or an unused one.',
  'help.actions.moveCard': 'Move a card on the board to a new valid spot. You cannot move Silver Queen. All cards must still form one connected group.',
  'help.actions.rotateGoals': 'All players pass their Goal cards to a neighbor in a chosen direction.',
  'help.actions.zapCard': 'Take any card from the board back to your hand. You cannot take Silver Queen.',
  'help.silver.title': 'Silver Queen',
  'help.silver.desc': 'Sits in the center permanently and never moves. Starts as Rainbow (all colors). Changes color to the princess on each Action card played.',
  'help.deckEnd.title': 'Deck runs out',
  'help.deckEnd.desc': 'When the deck is empty, players don\'t draw cards. Play continues until all hands are empty. If no one wins, the player with the largest connected group of their color wins.',

  // ── Tech info modal ──
  'tech.title': 'Tech Stack',
  'tech.close': 'Close',
  'tech.frontend': 'Frontend',
  'tech.engine': 'Game Engine (Pure TypeScript)',
  'tech.multiplayer': 'Multiplayer',
  'tech.gameRules': 'Game Rules',
  'tech.auth': 'Auth & Infrastructure',
  'tech.dataArch': 'Data Architecture',
  'tech.domain': 'domain 5queens.club',

  // ── Tutorial ──
  'tutorial.skip': 'Skip',
  'tutorial.next': 'Next →',
  'tutorial.prev': '← Back',
  'tutorial.done': 'Let\'s go! →',
  'tutorial.gotIt': 'Got it →',

  'tutorial.s1.title': '👑 5 Queens',
  'tutorial.s1.desc': 'A card game for 2–5 players. Each player has a secret goal card — one of 5 princess colors.',
  'tutorial.s1.goalTitle': 'Objective',
  'tutorial.s1.goalDesc': 'Create a contiguous group of 7 panels of your color on the shared board. Any shape — branching allowed.',
  'tutorial.s1.turnTitle': 'Each turn',
  'tutorial.s1.turnStep1': '1.',
  'tutorial.s1.turnStep1Desc': 'Draw a card from the deck',
  'tutorial.s1.turnStep2': '2.',
  'tutorial.s1.turnStep2Desc': 'Play one card from your hand',
  'tutorial.s1.cardsTitle': 'Two types of cards',
  'tutorial.s1.princessCards': 'Princess cards',
  'tutorial.s1.princessDesc': '— place on the board next to matching colors.',
  'tutorial.s1.actionCards': 'Action cards',
  'tutorial.s1.actionDesc': '— special effects (explained later).',

  'tutorial.s2.title': '🃏 Types of princess cards',
  'tutorial.s2.desc': 'Each princess card is a 2×2 grid of panels. Panels can have different colors — here are the four card types:',
  'tutorial.s2.ace': 'Ace',
  'tutorial.s2.aceDesc': '4 panels of one color',
  'tutorial.s2.half': 'Half',
  'tutorial.s2.halfDesc': '2 colors: top / bottom',
  'tutorial.s2.banner': 'Banner',
  'tutorial.s2.bannerDesc': '2 colors: left / right',
  'tutorial.s2.threeway': 'Threeway',
  'tutorial.s2.threewayDesc': '3 colors: 2+1+1',
  'tutorial.s2.quad': 'Quad',
  'tutorial.s2.quadDesc': '4 different colors, one per panel',

  'tutorial.s3.title': '👑 Princess cards',
  'tutorial.s3.desc': 'Each princess card is a 2×2 grid of colored panels. When placing, at least one panel must share an edge with a panel of the same color on an adjacent card.',
  'tutorial.s3.rainbow': 'Rainbow Queen',
  'tutorial.s3.rainbowDesc': 'Wild color — matches every color. Can be placed next to any card and counts as every color when checking for a win.',
  'tutorial.s3.silver': 'Silver Queen (center of board)',
  'tutorial.s3.silverDesc': 'Never moves. Starts as rainbow (all colors). Changes color each time an action card is played.',
  'tutorial.s3.bonusTitle': 'Connection bonus',
  'tutorial.s3.bonusLine1': 'One card connects 2 different colors → draw +1',
  'tutorial.s3.bonusLine2': '3 different colors → +2  |  4 different colors → +3',
  'tutorial.s3.bonusNote': '(Rainbow and Silver don\'t count toward the bonus)',

  'tutorial.s4.title': '⚡ Action cards — Move a Card',
  'tutorial.s4.silverColor': 'Silver Queen takes color: Green',
  'tutorial.s4.what': 'What does it do?',
  'tutorial.s4.desc2': 'Pick a card from the board and move it to a new spot. The card must color-match its new neighbors. You cannot move Silver Queen. After moving, the board must remain connected (no islands).',
  'tutorial.s4.example': 'Your green group is close to 7 panels but lacks a connection. Move a green card from a far corner right into your group — and win.',
  'tutorial.s4.when': 'When you have a card of your color in the wrong place, want to join it to your main group, or break an opponent\'s group by moving a key card.',

  'tutorial.s5.title': '⚡ Action cards — Zap a Card',
  'tutorial.s5.silverColor': 'Silver Queen takes color: Red',
  'tutorial.s5.desc2': 'Take any card from the board into your hand. Your hand is 1 card larger than normal afterward. You cannot take Silver Queen.',
  'tutorial.s5.example': 'An opponent has 6 connected red panels. Take their key card — break the group and gain a card.',
  'tutorial.s5.when': 'When a card on the board blocks your goal or an opponent is close to winning. You can also take your own card to replay it in a better spot.',

  'tutorial.s6.title': '⚡ Action cards — Rotate Goals',
  'tutorial.s6.silverColor': 'Silver Queen takes color: Blue',
  'tutorial.s6.desc2': 'All players simultaneously pass their goal cards to a neighbor — left or right (you choose). Unused goals also rotate.',
  'tutorial.s6.example': 'You see lots of blue panels on the board. Rotate goals to get the blue goal — suddenly you\'re close to winning.',
  'tutorial.s6.when': 'When your current goal is hard to collect or another color dominates the board. Risky — you don\'t know what you\'ll get unless you\'ve been counting.',

  'tutorial.s7.title': '⚡ Action cards — Trade Goals',
  'tutorial.s7.silverColor': 'Silver Queen takes color: Gold',
  'tutorial.s7.desc2': 'Swap your goal card with a chosen player or an unused goal from the pile. Neither side sees what they get — it\'s a blind trade.',
  'tutorial.s7.example': 'The player to your left has 5 connected gold panels. Swap goals with them — now you\'re 2 panels from winning, and they start over.',
  'tutorial.s7.when': 'When another player is close to winning — take their goal. Or when your goal is nearly impossible — trade blind with an unused goal.',

  'tutorial.s8.title': '⚡ Action cards — Trade Hands',
  'tutorial.s8.silverColor': 'Silver Queen takes color: Black',
  'tutorial.s8.desc2': 'Swap your entire hand with a chosen player. Goal cards are not affected — only cards in hand.',
  'tutorial.s8.example': 'You have 5 useless cards, but another player has drawn a lot and has a full hand. Swap — get their good cards, they get your bad ones.',
  'tutorial.s8.when': 'When you have bad cards and want to refresh your hand. Or defensively — a player with many cards has many options, take that advantage away.',

  'tutorial.s9.title': '💡 Action card options',
  'tutorial.s9.desc': 'When playing an action card, two things happen at once: the action effect and Silver Queen\'s color change. You may skip one of them.',
  'tutorial.s9.optionsTitle': 'Three options:',
  'tutorial.s9.both': '✓ Both',
  'tutorial.s9.bothDesc': 'Execute the action and change Silver Queen\'s color (most common choice).',
  'tutorial.s9.actionOnly': '½ Action only',
  'tutorial.s9.actionOnlyDesc': 'Execute the action effect, but Silver doesn\'t change color. Useful when Silver\'s current color benefits you.',
  'tutorial.s9.silverOnly': '½ Silver only',
  'tutorial.s9.silverOnlyDesc': 'Change Silver Queen\'s color, but don\'t execute the action. Card goes to the bottom of the deck.',
  'tutorial.s9.tip': 'When Silver Queen has your goal color — think twice before letting an opponent\'s action change it.',
  'tutorial.s9.exampleLabel': '🎯 Example',
  'tutorial.s9.whenLabel': '💡 When to use?',

  // ── Tutorial spotlight ──
  'spot.board': 'Board',
  'spot.boardDesc': 'This is where you place princess cards. Silver Queen sits in the center and never moves.',
  'spot.goal': 'Your goal',
  'spot.goalDesc': 'This is your secret goal card. You need to connect 7 panels of this color into one contiguous group.',
  'spot.hand': 'Your hand',
  'spot.handDesc': 'These are your cards. Click a card to select it, click again to rotate 180\u00B0, then place it on the board. Action cards are played with a single click.',
  'spot.drawPile': 'Draw pile & discard',
  'spot.drawPileDesc': 'At the start of your turn you draw a card from the pile. Played action cards go to the discard pile.',
  'spot.opponents': 'Opponents',
  'spot.opponentsDesc': 'You can see how many cards other players have, but you cannot see their goals or hands.',
  'spot.turnToast': 'Your turn',
  'spot.turnToastDesc': 'When a message appears at the top of the screen \u2014 it\'s your turn. Draw a card, then play one.',
};

export default en;
