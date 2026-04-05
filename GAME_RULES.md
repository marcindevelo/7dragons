# Seven Dragons — Pełne Zasady Gry

> Źródło: SevenDragonRules.pdf (Looney Labs, projekt Andrew Looney, ilustracje Larry Elmore)

---

## Zawartość (72 karty)

| Typ | Ilość | Opis |
|---|---|---|
| Goal cards | 5 | Po jednej na gracza, tajne. Kolory: Red, Gold, Blue, Green, Black |
| Silver Dragon | 1 | Karta startowa, nigdy się nie rusza, zawsze na środku stołu |
| Dragon cards | 51 | Karty smoka, siatka 2×2 paneli — patrz pełna lista poniżej |
| Action cards | 15 | 3 karty × 5 typów akcji |

---

## Dokładna lista kart smoka (51 kart)

Źródło: https://www.looneylabs.com/seven-dragons-card-list

### Aces — 1 kolor, 4 panele (11 kart w talii)
Layout: `[[A,A],[A,A]]`

- **Silver Dragon** (1) — karta startowa, **NIE w talii**, zawsze na środku stołu. Wszystkie 4 panele = silver/all.
- **Rainbow Dragon** (1) — wszystkie 4 panele = rainbow (dziki)
- **Red Dragon** (2) — wszystkie 4 panele = red
- **Gold Dragon** (2) — wszystkie 4 panele = gold
- **Blue Dragon** (2) — wszystkie 4 panele = blue
- **Green Dragon** (2) — wszystkie 4 panele = green
- **Black Dragon** (2) — wszystkie 4 panele = black

### Halves — 2 kolory poziomo (10 kart)
Layout: `[[A,A],[B,B]]` — górna połowa kolor A, dolna połowa kolor B

| id | A | B |
|---|---|---|
| half_black_green | black | green |
| half_black_red | black | red |
| half_blue_black | blue | black |
| half_black_gold | black | gold |
| half_red_green | red | green |
| half_green_blue | green | blue |
| half_red_blue | red | blue |
| half_gold_blue | gold | blue |
| half_gold_green | gold | green |
| half_gold_red | gold | red |

### Banners — 2 kolory pionowo (10 kart)
Layout: `[[A,B],[A,B]]` — lewa kolumna kolor A, prawa kolumna kolor B

| id | A | B |
|---|---|---|
| banner_black_green | black | green |
| banner_green_blue | green | blue |
| banner_blue_black | blue | black |
| banner_red_green | red | green |
| banner_black_red | black | red |
| banner_blue_red | blue | red |
| banner_gold_red | gold | red |
| banner_gold_green | gold | green |
| banner_black_gold | black | gold |
| banner_gold_blue | gold | blue |

### Threeways — half + quarter + quarter (10 kart)
Layout: `[[half,half],[q1,q2]]` — górna połowa = kolor główny, dolne dwa panele = dwa różne kolory

| id | half (×2) | q1 | q2 |
|---|---|---|---|
| three_green_black_red | green | black | red |
| three_green_blue_gold | green | blue | gold |
| three_black_gold_red | black | gold | red |
| three_black_green_blue | black | green | blue |
| three_red_gold_blue | red | gold | blue |
| three_red_black_green | red | black | green |
| three_blue_black_red | blue | black | red |
| three_blue_gold_red | blue | gold | red |
| three_gold_blue_green | gold | blue | green |
| three_gold_red_black | gold | red | black |

### Quads — 4 różne kolory (10 kart)
Layout: `[[c1,c2],[c3,c4]]` — każdy panel inny kolor

| id | c1 | c2 | c3 | c4 |
|---|---|---|---|---|
| quad_blue_red_green_black | blue | red | green | black |
| quad_red_black_blue_green | red | black | blue | green |
| quad_green_red_black_gold | green | red | black | gold |
| quad_black_green_gold_red | black | green | gold | red |
| quad_green_red_gold_blue | green | red | gold | blue |
| quad_gold_green_blue_red | gold | green | blue | red |
| quad_green_gold_blue_black | green | gold | blue | black |
| quad_gold_black_green_blue | gold | black | green | blue |
| quad_gold_blue_red_black | gold | blue | red | black |
| quad_blue_black_gold_red | blue | black | gold | red |

---

## Smoki (7 kolorów)

| Smok | Zachowanie |
|---|---|
| Red | Zwykły kolor |
| Gold | Zwykły kolor |
| Blue | Zwykły kolor |
| Green | Zwykły kolor |
| Black | Zwykły kolor (w zasadach PDF zwany "Purple", ale w projekcie używamy "Black") |
| **Rainbow Dragon** | Dziki kolor — jest WSZYSTKIMI kolorami jednocześnie w każdej chwili. Można go zagrać w każdym miejscu. |
| **Silver Dragon** | Karta startowa. Na początku działa jak Rainbow (wszystkie kolory). Zmienia kolor za każdym razem gdy zagrana jest karta Akcji — przyjmuje kolor smoka przedstawionego na aktualnej górnej karcie stosu odrzuconych. |

---

## Przygotowanie

1. Wymieszaj 5 kart Goal i rozdaj po jednej każdemu graczowi (tajne).
2. Postaw Silver Dragon w centrum stołu — **nigdy się nie rusza**.
3. Wymieszaj talię główną (51 Dragon + 15 Action) i rozdaj każdemu graczowi **3 karty**.
4. Najstarszy gracz zaczyna.

---

## Przebieg tury

Każdy gracz w swojej turze robi **obydwie** czynności w kolejności:

1. **Dobierz 1 kartę** z wierzchołka talii.
2. **Zagraj 1 kartę** z ręki:
   - **Dragon card** → połóż na stole zgodnie z zasadami połączeń.
   - **Action card** → wykonaj akcję, następnie odłóż kartę twarzą w górę na stos odrzuconych.

---

## Zasady połączeń (Dragon card placement)

Karta smoka musi być tak ułożona, żeby **co najmniej jeden panel** znajdował się obok panelu **z tym samym smokiem** na sąsiedniej karcie.

- Dwie karty są sąsiadujące gdy **dzielą krawędź** (nie tylko narożnik — przekątna nie liczy się!).
- Karty muszą być wyrównane z siatką (prostopadłe, nie przekrzywione).
- Karta może sąsiadować z wieloma kartami jednocześnie — wystarczy jedno poprawne połączenie kolorów.
- Rainbow Dragon = dziki kolor, łączy się z każdym kolorem.
- Silver Dragon liczy się jako jego aktualny kolor przy walidacji połączeń.

### Niedozwolone ustawienia
- Karty po przekątnej (bez wspólnej krawędzi) — **nie połączone**.
- Karty prostopadle do siebie — **niedozwolone**.
- Karty przekrzywione lub niezgrane z siatką — **niedozwolone**.

---

## Bonus za wielokrotne połączenie

Gdy jedna zagrywka tworzy połączenia z **różnymi kolorami jednocześnie**:

| Nowe różne kolory połączone | Dobrane dodatkowe karty |
|---|---|
| 2 kolory | +1 karta |
| 3 kolory | +2 karty |
| 4 kolory | +3 karty |

**Wykluczenia z bonusu:**
- Połączenia z Rainbow Dragon **nie liczą się** do bonusu.
- Połączenia z Silver Dragon gdy jest "dziki" (all-colors) **nie liczą się**.
- Połączenie tego samego koloru na wielu krawędziach (multi-side) **nie liczy się** — liczy się każdy unikalny kolor.

---

## Akcje (Action cards)

Po zagraniu karty Akcji dzieją się **dwie rzeczy jednocześnie**:
1. Efekt akcji.
2. Silver Dragon zmienia kolor na kolor smoka z tej karty Akcji.

Gracz **może pominąć jedno** z tych dwóch:
- Można odłożyć kartę na dno talii (Silver nie zmienia koloru) i zrezygnować z efektu.
- Można wykonać akcję, ale odłożyć kartę na stos odrzuconych bez zmiany koloru Silver.
- Zwykle jednak robi się obydwie rzeczy.

### 5 typów akcji (3 karty każdego typu)

| Akcja | Efekt |
|---|---|
| **Trade Hands** | Zamień całą rękę z dowolnym graczem (nie zmieniasz kart Goal). |
| **Trade Goals** | Zamień kartę Goal z dowolnym graczem. Możesz też wymienić z nieużywaną kartą Goal (patrz: Nieużywane Cele). |
| **Move a Card** | Weź kartę z planszy i połóż ją w nowym, poprawnym miejscu. Nie możesz ruszyć Silver Dragon. |
| **Rotate Goals** | Wszyscy gracze podają swoje karty Goal sąsiadowi w wybranym kierunku (w/pod prąd). |
| **Zap a Card** | Weź kartę z planszy do ręki. Nie możesz zabrać Silver Dragon. Po zabraniu ręka jest o 1 większa. |

---

## Warunek wygranej

Wygrywa pierwszy gracz, który stworzy **spójną grupę 7 paneli** swojego koloru Goal.

- Panele muszą być **w jednej ciągłej grupie** (można podróżować od każdego panelu do każdego innego przez sąsiednie panele tego koloru).
- Kształt dowolny — nie musi być linią, może się rozgałęziać.
- Rainbow Dragon liczy się jako **każdy kolor** podczas sprawdzania wygranej.
- Silver Dragon liczy się jako **jego aktualny kolor** podczas sprawdzania wygranej.
- Wygrana następuje **natychmiast** gdy warunek jest spełniony — nawet jeśli to nie jest twoja tura.

---

## Nieużywane cele (2–4 graczy)

Gdy gra się 2–4 graczy, niektóre karty Goal nie są rozdane. Te karty:
- Leżą twarzą w dół w rzędzie między talią a stosem odrzuconych (jakby były trzymane przez wyobrażonych graczy).
- **Nie wolno na nie patrzeć** podczas gry.
- Uczestniczą w rotacji Rotate Goals (przechodzą przez "wyobrażonych graczy").
- Można z nimi handlować przez Trade Goals (jeśli chcesz konkretną nieużywaną kartę Goal).

---

## Koniec talii

Gdy talia się wyczerpie:
- Gracze **nie dobierają** kart na początku tury.
- Gra trwa dopóki ktoś ma karty na ręce.
- Jeśli nikt nie wygrał gdy wszystkie karty zostały zagrane, **wygrywa gracz z największą liczbą połączonych paneli swojego koloru** (closest to 7).

---

## Ważne zasady szczegółowe (FAQ)

| Pytanie | Odpowiedź |
|---|---|
| Po Zap a Card mam dodatkową kartę w ręce? | Tak. |
| Move a Card może zostawić kartę w tym samym miejscu, ale obrócić ją? | Tak. |
| Move a Card może stworzyć odłączoną wyspę? | Nie — po ruchu wszystkie karty muszą pozostać w jednej spójnej grupie. |
| Kto wygrywa gdy dwie osoby dostają 7 jednocześnie? | Gracz, którego tura spowodowała wygraną. |
| Dobierasz przed czy po zagraniu karty? | **Przed** (draw → play). |
| Można przeglądać stos odrzuconych? | Tak, ale nie wolno zmieniać kolejności. |
| Czy Zap/Move mają ograniczenia własnościowe? | Nie — można zabrać dowolną kartę (własną lub cudzą). |

---

## Wersje dla dzieci

### Dragon Connections (3–4 lata)
- Tylko karty Dragon (bez Akcji, bez kart Goal, Silver Dragon wmieszany w talię).
- Ćwiczenie dopasowywania kolorów — brak mechaniki wygranej.

### Basic Dragons (5–6 lat)
- Karty Goal + karty Dragon. Brak kart Akcji.
- Gracze poniżej 7 lat wygrywają gdy połączą tyle paneli ile mają lat.

### Single-Action Dragons (6+)
- Pełna gra, ale tylko jeden typ Akcji w talii (zwykle Trade Goals).
- Stopniowo dodawaj kolejne typy Akcji.
- Silver Dragon dodaj na końcu.
