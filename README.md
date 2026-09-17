# MoneyFlow Clarity

We are continuing development of an existing personal finance application called MoneyFlow.

I want you to implement the new MoneyFlow UI/UX design based on the attached/reference design.

IMPORTANT:

This is primarily a UI/UX implementation task.

Do not redesign the product concept.

Do not invent new financial functionality.

Do not add bank integrations.

Do not add M-Pesa integrations.

Do not add authentication unless already present.

Do not add AI financial advice.

Do not add investment or cryptocurrency features.

MoneyFlow is a manual personal finance application built around helping users consciously manage their salary.

==================================================

PRODUCT PURPOSE

==================================================

MoneyFlow helps users answer:

- How much money came in?

- How much have I spent?

- How much have I saved?

- How much is available?

- How am I doing against my budget?

- How are my savings goals progressing?

Manual transaction entry is intentional.

==================================================

UI/UX DIRECTION

==================================================

Implement the new Figma-generated design faithfully.

The previous UI was too information-dense.

The new design should prioritize:

- strong visual hierarchy

- whitespace

- fewer competing cards

- meaningful charts

- progressive disclosure

- clear primary actions

- calm modern personal-finance aesthetics

- excellent mobile responsiveness

The Dashboard should answer:

"How am I doing financially this month?"

within a few seconds.

==================================================

PAGES

==================================================

Implement the redesigned:

1. Dashboard

2. Budget

3. Expenses

4. Savings

5. Reports

6. Settings

Also implement the relevant responsive/mobile states.

==================================================

DASHBOARD

==================================================

Prioritize:

- selected month

- monthly income

- available money

- spending

- savings

- budget status

The "Available" amount should have strong visual hierarchy.

Avoid showing every metric as a large independent card.

Use a concise MoneyFlow allocation visualization for:

Spent

Saved

Available

Include a restrained spending overview.

Include limited useful insights.

==================================================

EXPENSES

==================================================

The primary purpose is:

"Where did my money go?"

Prioritize:

- total spent

- Add Expense

- transaction list

- category

- date

- amount

Make adding an expense quick and intuitive.

==================================================

BUDGET

==================================================

The primary purpose is:

"What did I plan to do with my money, and how am I doing?"

Clearly distinguish:

Budget

Actual

Remaining

Use compact progress indicators rather than excessive cards.

==================================================

SAVINGS

==================================================

The primary purpose is:

"What am I building toward?"

Prioritize savings goals.

Each goal should communicate:

- goal name

- target amount

- current progress

- remaining amount

- percentage

Make "Add contribution" prominent.

IMPORTANT:

Savings goal current amount should conceptually be derived from savings contributions rather than being treated as an independent source of truth.

==================================================

REPORTS

==================================================

Reports can contain deeper financial analysis.

Appropriate visualizations include:

- spending trends

- income vs expenses

- savings trends

- category spending

- historical comparisons

Do not make the Dashboard carry all of this information.

==================================================

SETTINGS

==================================================

Keep Settings clean and structured.

Include existing concepts such as:

- profile

- currency

- categories

- payment methods

- preferences

Do not add authentication as part of this task.

==================================================

RESPONSIVE DESIGN

==================================================

Desktop and mobile should feel intentionally designed.

Mobile must not simply be a compressed desktop layout.

Prioritize:

- touch-friendly controls

- readable typography

- one-column layouts where appropriate

- simple navigation

- easy expense entry

- clear month navigation

- readable charts

==================================================

ENGINEERING CONSTRAINTS

==================================================

Use the existing project's technology stack where possible.

Do not introduce unnecessary state-management libraries.

Do not rewrite financial calculations unless required to connect the UI.

Do not remove existing functionality.

Keep financial calculations separate from presentation.

Do not hard-code financial totals into the UI.

Use data-driven components.

==================================================

IMPORTANT FOR THE NEXT DEVELOPER

==================================================

This project will later be integrated with an existing MoneyFlow data/persistence layer.

Therefore:

- keep components modular

- avoid putting all state into one component

- keep calculations separate from UI

- avoid direct localStorage calls from components

- do not couple the UI to a particular backend

- use clean props/data interfaces

The existing application already has financial logic and persistence work that should ultimately remain the source of truth.

Your responsibility here is primarily to produce a clean, faithful implementation of the redesigned interface.

==================================================

SUCCESS CRITERIA

==================================================

The result should feel like one cohesive application rather than six independently designed pages.

MoneyFlow should feel:

calm

clear

personal

modern

financially useful

easy to scan

The user should never feel like they are looking at an accounting/admin system.

Do not add unnecessary visual complexity simply to fill space.

Implement the complete first-pass redesign rather than stopping after the Dashboard.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/17583045-3f71-4075-8963-c44332ee8570).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
