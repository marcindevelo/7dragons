# 5 Queens — Kontekst projektu dla Claude

## Projekt

Webowa implementacja gry karcianej **5 Queens** (bazowanej na mechanice Seven Dragons, Looney Labs).

- Pełne zasady gry: @GAME_RULES.md
- Plan techniczny i architektura: @PROJECT_PLAN.md

## Stack

| Warstwa | Wybór |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + Framer Motion |
| State | Zustand |
| Game engine | Pure TypeScript (zero UI deps) |
| Real-time | PartyKit lub Socket.io |
| Backend | Node.js + Express (lub Next.js API routes) |
| Session | Redis |
| DB | PostgreSQL |
| Testy | Vitest + React Testing Library |

## Najważniejsze zasady techniczne

- **Silnik gry działa po obu stronach** (klient + serwer) — ten sam kod TypeScript.
- **Atomic unit = panel**, nie karta. Siatka paneli to 2× rozdzielczość siatki kart.
- **Połączenie** = wspólna krawędź paneli (nie narożnik). Tylko `dx+dy=1`.
- **Win check** = BFS flood-fill od każdego panelu koloru Goal (Rainbow + Silver-jako-kolor jako wildcard).
- **Silver Dragon** nigdy się nie rusza z centrum. Zmienia kolor po każdej zagranej Akcji.

## Figma

Plik projektowy: `ljX9l7rlHeLZECDAf321la` (team: Develocraft)

## Konwencje

- Język kodu: angielski
- Komentarze i komunikacja: polski
- Kolory smoków jako union type: `'red' | 'gold' | 'blue' | 'green' | 'black'`
- Rainbow = `'rainbow'`, Silver tracking = `DragonColor | 'all'`
